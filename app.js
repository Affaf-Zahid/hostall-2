// HOSTALL Main Application
// Handles initialization, navigation, and core functionality

class HostallApp {
  constructor() {
    this.supabaseClient = null;
    this.hostels = [];
    this.currentFilter = 'all';
    this.initialized = false;
  }

  async init() {
    try {
      console.log('🚀 Initializing HOSTALL application...');
      
      // Initialize Supabase
      await this.initializeSupabase();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Load hostels
      await this.loadHostels();
      
      // Setup navigation
      this.setupNavigation();
      
      // Setup filters
      this.setupFilters();
      
      this.initialized = true;
      console.log('✅ HOSTALL application initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize HOSTALL application:', error);
      this.showError('Failed to initialize application. Please refresh the page.');
    }
  }

  async initializeSupabase() {
    try {
      if (typeof supabase === 'undefined') {
        throw new Error('Supabase library not loaded');
      }

      if (!CONFIG?.supabase?.url || !CONFIG?.supabase?.key) {
        throw new Error('Supabase configuration missing');
      }

      this.supabaseClient = supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.key);
      
      // Test connection
      const { data, error } = await this.supabaseClient
        .from('hostels')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        throw error;
      }
      
      console.log('✅ Supabase connected successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Supabase initialization failed:', error);
      throw error;
    }
  }

  async loadHostels() {
    try {
      console.log('📊 Loading hostels from Supabase...');
      
      // Show loading state
      this.showLoadingState();
      
      if (!this.supabaseClient) {
        throw new Error('Supabase client not initialized');
      }

      const { data: hostels, error } = await this.supabaseClient
        .from('hostels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      this.hostels = hostels || [];
      console.log(`✅ Loaded ${this.hostels.length} hostels from database`);
      
      // Hide loading state and render hostels
      this.hideLoadingState();
      this.renderHostels();
      
    } catch (error) {
      console.error('❌ Error loading hostels:', error);
      this.hideLoadingState();
      this.showErrorState();
    }
  }

  renderHostels() {
    const hostelGrid = document.getElementById('public-list');
    const emptyState = document.getElementById('empty-state');
    
    if (!hostelGrid) return;

    const filteredHostels = this.getFilteredHostels();

    if (filteredHostels.length === 0) {
      hostelGrid.innerHTML = '';
      emptyState?.classList.remove('hidden');
      return;
    }

    emptyState?.classList.add('hidden');
    hostelGrid.innerHTML = '';

    filteredHostels.forEach(hostel => {
      const card = this.createHostelCard(hostel);
      hostelGrid.appendChild(card);
    });

    console.log(`✅ Rendered ${filteredHostels.length} hostel cards`);
  }

  createHostelCard(hostel) {
    const card = document.createElement('div');
    card.className = 'hostel-card bg-white rounded-lg shadow-sm overflow-hidden';

    const genderClass = (hostel.gender?.toLowerCase() || 'any').replace(' ', '');
    const imageUrl = hostel.img || this.getPlaceholderImage(hostel);

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
          <span class="text-sm">${this.getShortLocation(hostel.location)}</span>
        </div>
        
        ${hostel.phone ? `
          <div class="flex items-center text-gray-600 mb-4">
            <i class="hgi-stroke hgi-call mr-2"></i>
            <span class="text-sm">${hostel.phone}</span>
          </div>
        ` : ''}
        
        <div class="flex gap-2 mb-4">
          ${this.renderFacilities(hostel.facilities)}
        </div>
        
        <button class="view-details-btn" onclick="hostallApp.showHostelDetails(${JSON.stringify(hostel).replace(/"/g, '&quot;')})">
          <i class="hgi-stroke hgi-eye mr-2"></i>
          View Details
        </button>
      </div>
    `;

    return card;
  }

  renderFacilities(facilities) {
    if (!facilities) return '';
    
    const facilityList = Array.isArray(facilities) ? facilities : 
                        typeof facilities === 'string' ? facilities.split(',') : [];
    
    const facilityIcons = {
      wifi: 'hgi-wifi-01',
      ac: 'hgi-air-conditioning-01',
      security: 'hgi-security',
      laundry: 'hgi-washing-machine-01',
      parking: 'hgi-car-01',
      kitchen: 'hgi-chef-hat',
      gym: 'hgi-dumbbell-01',
      study: 'hgi-book-01'
    };
    
    return facilityList.slice(0, 3).map(facility => {
      const cleanFacility = facility.trim().toLowerCase();
      const icon = facilityIcons[cleanFacility] || 'hgi-tick-01';
      return `
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          <i class="hgi-stroke ${icon} mr-1"></i>
          ${facility.trim()}
        </span>
      `;
    }).join('');
  }

  showHostelDetails(hostel) {
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

  getFilteredHostels() {
    if (this.currentFilter === 'all') {
      return this.hostels;
    }
    
    return this.hostels.filter(hostel => 
      hostel.gender === this.currentFilter
    );
  }

  getPlaceholderImage(hostel) {
    const genderColor = hostel.gender === 'Female' ? 'ec4899' : 
                       hostel.gender === 'Male' ? '3b82f6' : '6b7280';
    return `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop`;
  }

  getShortLocation(location) {
    if (!location) return 'Location not specified';
    return location.split(',')[0] || location;
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Smooth scrolling for navigation links
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
  }

  setupNavigation() {
    // Update active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update current filter and re-render
        this.currentFilter = button.dataset.filter;
        this.renderHostels();
      });
    });
  }

  showLoadingState() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const emptyState = document.getElementById('empty-state');
    
    loadingState?.classList.remove('hidden');
    errorState?.classList.add('hidden');
    emptyState?.classList.add('hidden');
  }

  hideLoadingState() {
    const loadingState = document.getElementById('loading-state');
    loadingState?.classList.add('hidden');
  }

  showErrorState() {
    const errorState = document.getElementById('error-state');
    const emptyState = document.getElementById('empty-state');
    
    errorState?.classList.remove('hidden');
    emptyState?.classList.add('hidden');
  }

  showError(message) {
    console.error('Application Error:', message);
    
    // You could show a toast notification here
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
      <div class="flex items-center">
        <i class="hgi-stroke hgi-alert-triangle mr-2"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
          <i class="hgi-stroke hgi-cancel-01"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  }

  // Public method to reload hostels
  async reloadHostels() {
    await this.loadHostels();
  }
}

// Global instance
const hostallApp = new HostallApp();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  hostallApp.init();
});

// Global function for backward compatibility
window.loadHostels = () => hostallApp.reloadHostels();