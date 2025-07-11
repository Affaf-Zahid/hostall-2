// HOSTALL Main Application
// Handles initialization, navigation, and core functionality

// Load hostels from Supabase
async function loadHostelsFromSupabase() {
  try {
    console.log('📊 Loading hostels from Supabase...');
    
    // Show loading state
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const emptyState = document.getElementById('empty-state');
    
    if (loadingState) loadingState.classList.remove('hidden');
    if (errorState) errorState.classList.add('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    
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
    
    // Hide loading state
    if (loadingState) loadingState.classList.add('hidden');
    
    // Render hostels
    renderHostelCards(hostels || []);
    
  } catch (error) {
    console.error('❌ Error loading hostels:', error);
    
    // Hide loading state and show error
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    
    if (loadingState) loadingState.classList.add('hidden');
    if (errorState) errorState.classList.remove('hidden');
  }
}

// Render hostel cards
function renderHostelCards(hostels) {
  const hostelGrid = document.getElementById('public-list');
  const emptyState = document.getElementById('empty-state');
  
  if (!hostelGrid) return;

  if (hostels.length === 0) {
    hostelGrid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  hostelGrid.innerHTML = '';

  hostels.forEach(hostel => {
    const card = createHostelCard(hostel);
    hostelGrid.appendChild(card);
  });

  console.log(`✅ Rendered ${hostels.length} hostel cards`);
}

// Create individual hostel card
function createHostelCard(hostel) {
  const card = document.createElement('div');
  card.className = 'hostel-card bg-white rounded-lg shadow-sm overflow-hidden';

  const genderClass = (hostel.gender?.toLowerCase() || 'any').replace(' ', '');
  const imageUrl = hostel.img || getPlaceholderImage(hostel);

  card.innerHTML = `
    <div class="relative overflow-hidden">
      <img src="${imageUrl}" 
           class="hostel-image w-full h-48 object-cover" 
           alt="${hostel.name}"
           onerror="this.src='https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'">
      <div class="gender-badge ${genderClass}">${hostel.gender || 'Any'}</div>
    </div>
    
    <div class="p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-2">${hostel.name || 'Unnamed Hostel'}</h3>
      
      <div class="flex items-center text-gray-600 mb-3">
        <i class="hgi-stroke hgi-location-01 mr-2"></i>
        <span class="text-sm">${getShortLocation(hostel.location)}</span>
      </div>
      
      ${hostel.phone ? `
        <div class="flex items-center text-gray-600 mb-4">
          <i class="hgi-stroke hgi-call mr-2"></i>
          <span class="text-sm">${hostel.phone}</span>
        </div>
      ` : ''}
      
      <button class="view-details-btn" onclick="showHostelDetails(${JSON.stringify(hostel).replace(/"/g, '"')})">
        <i class="hgi-stroke hgi-eye mr-2"></i>
        View Details
      </button>
    </div>
  `;

  return card;
}

// Show hostel details modal
function showHostelDetails(hostel) {
  const facilities = hostel.facilities ? 
    (Array.isArray(hostel.facilities) ? hostel.facilities.join(', ') : hostel.facilities) : 
    'Not specified';

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">${hostel.name}</h2>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
          <i class="hgi-stroke hgi-cancel-01 text-xl"></i>
        </button>
      </div>
      
      <div class="p-6">
        ${hostel.img ? `
          <img src="${hostel.img}" alt="${hostel.name}" class="w-full h-64 object-cover rounded-lg mb-6">
        ` : ''}
        
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-3 flex items-center">
              <i class="hgi-stroke hgi-information-circle mr-2 text-blue-600"></i>
              Basic Information
            </h3>
            <div class="space-y-2 text-sm">
              <p><strong>Gender:</strong> ${hostel.gender || 'Any'}</p>
              <p><strong>Location:</strong> ${hostel.location || 'Not specified'}</p>
              <p><strong>Phone:</strong> ${hostel.phone || 'Not provided'}</p>
              <p><strong>WhatsApp:</strong> ${hostel.whatsapp || hostel.phone || 'Not provided'}</p>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-3 flex items-center">
              <i class="hgi-stroke hgi-tick-double mr-2 text-green-600"></i>
              Facilities
            </h3>
            <p class="text-sm text-gray-600">${facilities}</p>
          </div>
        </div>
        
        ${hostel.details ? `
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-3 flex items-center">
              <i class="hgi-stroke hgi-file-02 mr-2 text-purple-600"></i>
              Additional Details
            </h3>
            <p class="text-sm text-gray-600">${hostel.details}</p>
          </div>
        ` : ''}
        
        <div class="mt-8 flex flex-wrap gap-3">
          ${hostel.phone ? `
            <a href="tel:${hostel.phone}" 
               class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <i class="hgi-stroke hgi-call mr-2"></i>
              Call Now
            </a>
          ` : ''}
          
          ${hostel.whatsapp || hostel.phone ? `
            <a href="https://wa.me/${(hostel.whatsapp || hostel.phone).replace(/[^\d]/g, '')}?text=Hi, I found your hostel on HOSTALL and I'm interested in learning more." 
               target="_blank"
               class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <i class="hgi-stroke hgi-whatsapp mr-2"></i>
              WhatsApp
            </a>
          ` : ''}
          
          ${hostel.location ? `
            <button onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(hostel.location)}', '_blank')"
                    class="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <i class="hgi-stroke hgi-location-01 mr-2"></i>
              View on Map
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);
}

// Helper functions
function getPlaceholderImage(hostel) {
  return `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop`;
}

function getShortLocation(location) {
  if (!location) return 'Location not specified';
  return location.split(',')[0] || location;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase
  if (window.initializeSupabase && window.initializeSupabase()) {
    // Load hostels from Supabase
    loadHostelsFromSupabase();
  } else {
    console.error('❌ Failed to initialize Supabase');
    const errorState = document.getElementById('error-state');
    const loadingState = document.getElementById('loading-state');
    if (loadingState) loadingState.classList.add('hidden');
    if (errorState) errorState.classList.remove('hidden');
  }
  
  // Setup mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Setup smooth scrolling
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
  
  // Setup filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter hostels (you can implement filtering logic here if needed)
      console.log('Filter selected:', button.dataset.filter);
    });
  });
});

// Global function for backward compatibility
window.loadHostels = loadHostelsFromSupabase;