// HOSTALL Main Application
// Handles initialization, navigation, and core functionality

// Load hostels from Supabase
async function loadHostelsFromSupabase() {
  try {
    console.log('📊 Loading hostels from Supabase...');
    
    // Get Supabase client
    const client = window.getSupabaseClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    const { data: hostels, error } = await client
      .from('hostels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    console.log(`✅ Loaded ${hostels?.length || 0} hostels from database`);
    
    // Use the existing hostel manager to render
    if (window.hostelManager) {
      window.hostelManager.hostels = hostels || [];
      window.hostelManager.renderHostelCards();
    }
    
  } catch (error) {
    console.error('❌ Error loading hostels:', error);
    
    // Show error in the existing error handling system
    const hostelGrid = document.getElementById('public-list');
    if (hostelGrid) {
      hostelGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; background: #f9fafb; border-radius: 10px; margin: 1rem;">
          <h3 style="color: #dc2626; margin-bottom: 1rem;">⚠️ Unable to Load Hostels</h3>
          <p style="color: #6b7280; margin-bottom: 1rem;">There was an error connecting to the database.</p>
          <button onclick="loadHostelsFromSupabase()" style="background: #8B5CF6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
            🔄 Try Again
          </button>
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 HOSTALL App initializing...');
  
  // Initialize Supabase first
  if (window.initializeSupabase && window.initializeSupabase()) {
    console.log('✅ Supabase initialized');
    
    // Initialize hostel manager
    if (window.hostelManager) {
      window.hostelManager.init().then(() => {
        // Load hostels from Supabase instead of the manager's default load
        loadHostelsFromSupabase();
      });
    } else {
      // Fallback: load hostels directly
      loadHostelsFromSupabase();
    }
  } else {
    console.error('❌ Failed to initialize Supabase');
  }
  
  // Setup mobile menu (if exists)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Setup smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Setup filter buttons (if they exist)
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Apply filter using existing hostel manager
      const filter = button.dataset.filter;
      if (window.hostelManager) {
        window.hostelManager.filters.gender = filter === 'all' ? 'all' : filter;
        window.hostelManager.renderHostelCards();
      }
    });
  });
});

// Global function for backward compatibility
window.loadHostels = loadHostelsFromSupabase;
window.loadHostelsFromSupabase = loadHostelsFromSupabase;