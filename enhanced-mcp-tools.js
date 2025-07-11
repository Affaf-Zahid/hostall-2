/**
 * Enhanced MCP Tools Manager
 * Comprehensive integration of various MCP tools for hostel details and about us sections
 */
class EnhancedMCPTools {
  constructor(supabaseClient, mapApiKey) {
    this.supabase = supabaseClient;
    this.mapApiKey = mapApiKey;
    this.unsplashAccessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with actual key
    this.initialized = false;
    this.cache = new Map();
    this.init();
  }

  async init() {
    try {
      await this.loadHugeIcons();
      await this.initializeGoogleMaps();
      this.setupImageOptimization();
      this.initialized = true;
      console.log('✅ Enhanced MCP Tools initialized successfully');
    } catch (error) {
      console.error('❌ Enhanced MCP Tools initialization failed:', error);
    }
  }

  async loadHugeIcons() {
    // HugeIcons integration for rich iconography
    if (!document.querySelector('link[href*="hugeicons"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/hugeicons@1.0.0/icons.css';
      document.head.appendChild(link);
    }
  }

  async initializeGoogleMaps() {
    if (!window.google && this.mapApiKey) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.mapApiKey}&libraries=places,geometry&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        window.initMap = () => {
          console.log('Google Maps API loaded');
          resolve();
        };
        
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
      });
    }
  }

  setupImageOptimization() {
    // Setup image lazy loading and optimization
    this.imageOptimization = {
      quality: 85,
      format: 'webp',
      sizes: {
        thumbnail: { width: 300, height: 200 },
        medium: { width: 600, height: 400 },
        large: { width: 1200, height: 800 }
      }
    };
  }

  /**
   * Enhanced Hostel Details Display
   */
  async createEnhancedHostelDetails(hostel) {
    try {
      const detailsContainer = document.createElement('div');
      detailsContainer.className = 'enhanced-hostel-details';
      
      // Main hostel info with enhanced visuals
      const mainInfo = await this.createMainHostelInfo(hostel);
      
      // Interactive map with nearby places
      const mapSection = await this.createInteractiveMap(hostel);
      
      // Facilities showcase with icons
      const facilitiesSection = await this.createFacilitiesShowcase(hostel);
      
      // Photo gallery with Unsplash integration
      const gallerySection = await this.createPhotoGallery(hostel);
      
      // Contact and booking section
      const contactSection = await this.createContactSection(hostel);
      
      // Reviews and ratings (if available)
      const reviewsSection = await this.createReviewsSection(hostel);
      
      // Nearby amenities and transportation
      const amenitiesSection = await this.createNearbyAmenities(hostel);
      
      detailsContainer.appendChild(mainInfo);
      detailsContainer.appendChild(gallerySection);
      detailsContainer.appendChild(facilitiesSection);
      detailsContainer.appendChild(mapSection);
      detailsContainer.appendChild(amenitiesSection);
      detailsContainer.appendChild(contactSection);
      detailsContainer.appendChild(reviewsSection);
      
      return detailsContainer;
    } catch (error) {
      console.error('Error creating enhanced hostel details:', error);
      return this.createFallbackHostelDetails(hostel);
    }
  }

  async createMainHostelInfo(hostel) {
    const section = document.createElement('div');
    section.className = 'main-hostel-info bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6';
    
    section.innerHTML = `
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-4">
            <i class="hugeicon-home text-3xl text-blue-600"></i>
            <h1 class="text-3xl font-bold text-gray-800">${hostel.name}</h1>
            <span class="px-3 py-1 rounded-full text-sm font-medium ${hostel.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}">
              ${hostel.gender} Only
            </span>
          </div>
          
          <div class="flex items-center gap-2 mb-3">
            <i class="hugeicon-location text-lg text-gray-600"></i>
            <span class="text-gray-700">${hostel.location}</span>
          </div>
          
          <div class="prose prose-gray max-w-none">
            <p class="text-gray-600 leading-relaxed">${hostel.details}</p>
          </div>
          
          <div class="flex items-center gap-4 mt-4">
            <div class="flex items-center gap-2">
              <i class="hugeicon-star text-yellow-500"></i>
              <span class="font-semibold">4.5</span>
              <span class="text-gray-500">(124 reviews)</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="hugeicon-verified text-green-500"></i>
              <span class="text-green-600 font-medium">Verified</span>
            </div>
          </div>
        </div>
        
        <div class="lg:w-80">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button onclick="window.enhancedMCPTools.callHostel('${hostel.phone}')" 
                      class="w-full flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <i class="hugeicon-phone"></i>
                <span>Call Now</span>
              </button>
              <button onclick="window.enhancedMCPTools.openWhatsApp('${hostel.whatsapp}')" 
                      class="w-full flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <i class="hugeicon-whatsapp"></i>
                <span>WhatsApp</span>
              </button>
              <button onclick="window.enhancedMCPTools.getDirections('${hostel.location}')" 
                      class="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <i class="hugeicon-navigation"></i>
                <span>Get Directions</span>
              </button>
              <button onclick="window.enhancedMCPTools.shareHostel(${JSON.stringify(hostel).replace(/"/g, '&quot;')})" 
                      class="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <i class="hugeicon-share"></i>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return section;
  }

  async createInteractiveMap(hostel) {
    const section = document.createElement('div');
    section.className = 'interactive-map-section bg-white rounded-xl shadow-lg p-6 mb-6';
    
    section.innerHTML = `
      <div class="flex items-center gap-3 mb-4">
        <i class="hugeicon-map text-2xl text-red-600"></i>
        <h2 class="text-xl font-semibold">Location & Map</h2>
      </div>
      
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div id="enhanced-hostel-map" class="w-full h-80 rounded-lg overflow-hidden bg-gray-200"></div>
        </div>
        
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold mb-3 flex items-center gap-2">
              <i class="hugeicon-location text-red-500"></i>
              Nearby Places
            </h3>
            <div id="nearby-places" class="space-y-2 text-sm">
              <div class="loading">Loading nearby places...</div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold mb-3 flex items-center gap-2">
              <i class="hugeicon-car text-blue-500"></i>
              Transportation
            </h3>
            <div id="transportation-info" class="space-y-2 text-sm">
              <div class="loading">Loading transport info...</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Initialize map after a short delay
    setTimeout(() => this.initializeHostelMap(hostel), 500);
    
    return section;
  }

  async createFacilitiesShowcase(hostel) {
    const section = document.createElement('div');
    section.className = 'facilities-showcase bg-white rounded-xl shadow-lg p-6 mb-6';
    
    const facilities = hostel.facilities || [];
    const otherFacilities = hostel.other_facilities || '';
    
    const facilityIcons = {
      wifi: 'hugeicon-wifi',
      ac: 'hugeicon-air-conditioning',
      security: 'hugeicon-security',
      laundry: 'hugeicon-washing-machine',
      parking: 'hugeicon-car',
      kitchen: 'hugeicon-chef-hat',
      gym: 'hugeicon-dumbbell',
      study: 'hugeicon-book',
      prayer: 'hugeicon-mosque',
      medical: 'hugeicon-hospital'
    };
    
    section.innerHTML = `
      <div class="flex items-center gap-3 mb-6">
        <i class="hugeicon-tick-double text-2xl text-green-600"></i>
        <h2 class="text-xl font-semibold">Facilities & Amenities</h2>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        ${facilities.map(facility => `
          <div class="facility-item flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <i class="${facilityIcons[facility] || 'hugeicon-tick'} text-green-600"></i>
            <span class="text-gray-700 capitalize">${facility.replace('_', ' ')}</span>
          </div>
        `).join('')}
      </div>
      
      ${otherFacilities ? `
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-semibold mb-2 flex items-center gap-2">
            <i class="hugeicon-plus text-blue-600"></i>
            Additional Facilities
          </h3>
          <p class="text-gray-700">${otherFacilities}</p>
        </div>
      ` : ''}
    `;
    
    return section;
  }

  async createPhotoGallery(hostel) {
    const section = document.createElement('div');
    section.className = 'photo-gallery bg-white rounded-xl shadow-lg p-6 mb-6';
    
    section.innerHTML = `
      <div class="flex items-center gap-3 mb-6">
        <i class="hugeicon-image text-2xl text-purple-600"></i>
        <h2 class="text-xl font-semibold">Photo Gallery</h2>
      </div>
      
      <div id="hostel-gallery" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="loading-gallery">Loading photos...</div>
      </div>
    `;
    
    // Load gallery images
    setTimeout(() => this.loadHostelGallery(hostel), 500);
    
    return section;
  }

  async createContactSection(hostel) {
    const section = document.createElement('div');
    section.className = 'contact-section bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6';
    
    section.innerHTML = `
      <div class="flex items-center gap-3 mb-6">
        <i class="hugeicon-call text-2xl text-green-600"></i>
        <h2 class="text-xl font-semibold">Contact & Booking</h2>
      </div>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i class="hugeicon-phone text-green-600"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Phone</p>
              <p class="font-semibold">${hostel.phone}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i class="hugeicon-whatsapp text-green-600"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">WhatsApp</p>
              <p class="font-semibold">${hostel.whatsapp}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="hugeicon-clock text-blue-600"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Visiting Hours</p>
              <p class="font-semibold">9:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg p-4">
          <h3 class="font-semibold mb-3">Quick Contact Form</h3>
          <div class="space-y-3">
            <input type="text" placeholder="Your Name" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <input type="tel" placeholder="Your Phone" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <textarea placeholder="Your Message" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            <button onclick="window.enhancedMCPTools.sendQuickMessage('${hostel.whatsapp}')" 
                    class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    `;
    
    return section;
  }

  async createReviewsSection(hostel) {
    const section = document.createElement('div');
    section.className = 'reviews-section bg-white rounded-xl shadow-lg p-6 mb-6';
    
    section.innerHTML = `
      <div class="flex items-center gap-3 mb-6">
        <i class="hugeicon-star text-2xl text-yellow-600"></i>
        <h2 class="text-xl font-semibold">Reviews & Ratings</h2>
      </div>
      
      <div id="reviews-container">
        <div class="text-center py-8 text-gray-500">
          <i class="hugeicon-comment text-4xl mb-2"></i>
          <p>Reviews system coming soon...</p>
        </div>
      </div>
    `;
    
    return section;
  }

  async createNearbyAmenities(hostel) {
    const section = document.createElement('div');
    section.className = 'nearby-amenities bg-white rounded-xl shadow-lg p-6 mb-6';
    
    section.innerHTML = `
      <div class="flex items-center gap-3 mb-6">
        <i class="hugeicon-building text-2xl text-indigo-600"></i>
        <h2 class="text-xl font-semibold">Nearby Amenities</h2>
      </div>
      
      <div id="amenities-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="loading">Loading nearby amenities...</div>
      </div>
    `;
    
    // Load nearby amenities
    setTimeout(() => this.loadNearbyAmenities(hostel), 1000);
    
    return section;
  }

  /**
   * Enhanced About Us Section
   */
  async createEnhancedAboutUs() {
    try {
      const aboutSection = document.createElement('div');
      aboutSection.className = 'enhanced-about-us';
      
      // Hero section
      const heroSection = await this.createAboutHero();
      
      // Mission and vision
      const missionSection = await this.createMissionVision();
      
      // Team section
      const teamSection = await this.createTeamSection();
      
      // Statistics and achievements
      const statsSection = await this.createStatsSection();
      
      // Company timeline
      const timelineSection = await this.createTimelineSection();
      
      // Contact and social media
      const contactSection = await this.createAboutContactSection();
      
      aboutSection.appendChild(heroSection);
      aboutSection.appendChild(missionSection);
      aboutSection.appendChild(statsSection);
      aboutSection.appendChild(teamSection);
      aboutSection.appendChild(timelineSection);
      aboutSection.appendChild(contactSection);
      
      return aboutSection;
    } catch (error) {
      console.error('Error creating enhanced about us:', error);
      return this.createFallbackAboutUs();
    }
  }

  async createAboutHero() {
    const section = document.createElement('div');
    section.className = 'about-hero bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white p-8 rounded-xl mb-8';
    
    section.innerHTML = `
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-6">
          <i class="hugeicon-home text-6xl mb-4 opacity-90"></i>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">About HOSTALL</h1>
          <p class="text-xl md:text-2xl opacity-90">Connecting Students with Perfect Accommodations</p>
        </div>
        
        <div class="prose prose-lg prose-white max-w-3xl mx-auto">
          <p class="text-lg leading-relaxed">
            HOSTALL is Pakistan's premier hostel listing platform, dedicated to helping students find safe, 
            affordable, and comfortable accommodations in Lahore. We bridge the gap between students and 
            quality hostels, making the search for the perfect home away from home easier than ever.
          </p>
        </div>
        
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <div class="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <i class="hugeicon-verified text-green-300"></i>
            <span>Verified Listings</span>
          </div>
          <div class="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <i class="hugeicon-security text-yellow-300"></i>
            <span>Safe & Secure</span>
          </div>
          <div class="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <i class="hugeicon-support text-blue-300"></i>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    `;
    
    return section;
  }

  async createMissionVision() {
    const section = document.createElement('div');
    section.className = 'mission-vision grid md:grid-cols-2 gap-8 mb-8';
    
    section.innerHTML = `
      <div class="mission bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="hugeicon-target text-blue-600 text-xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Our Mission</h2>
        </div>
        <p class="text-gray-600 leading-relaxed">
          To revolutionize the student accommodation experience in Pakistan by providing a comprehensive, 
          trustworthy platform that connects students with verified, quality hostels. We strive to make 
          the transition to independent living smooth, safe, and affordable for every student.
        </p>
      </div>
      
      <div class="vision bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <i class="hugeicon-eye text-purple-600 text-xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Our Vision</h2>
        </div>
        <p class="text-gray-600 leading-relaxed">
          To become Pakistan's most trusted and comprehensive student accommodation platform, 
          expanding across major cities and setting new standards for transparency, safety, 
          and student satisfaction in the hostel industry.
        </p>
      </div>
    `;
    
    return section;
  }

  async createStatsSection() {
    const section = document.createElement('div');
    section.className = 'stats-section bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8';
    
    section.innerHTML = `
      <h2 class="text-2xl font-bold text-center mb-8">Our Impact in Numbers</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div class="stat-item">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="hugeicon-home text-blue-600 text-2xl"></i>
          </div>
          <div class="text-3xl font-bold text-blue-600 mb-1">150+</div>
          <div class="text-gray-600">Verified Hostels</div>
        </div>
        
        <div class="stat-item">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="hugeicon-user text-green-600 text-2xl"></i>
          </div>
          <div class="text-3xl font-bold text-green-600 mb-1">5000+</div>
          <div class="text-gray-600">Happy Students</div>
        </div>
        
        <div class="stat-item">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="hugeicon-location text-purple-600 text-2xl"></i>
          </div>
          <div class="text-3xl font-bold text-purple-600 mb-1">25+</div>
          <div class="text-gray-600">Locations</div>
        </div>
        
        <div class="stat-item">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="hugeicon-star text-yellow-600 text-2xl"></i>
          </div>
          <div class="text-3xl font-bold text-yellow-600 mb-1">4.8</div>
          <div class="text-gray-600">Average Rating</div>
        </div>
      </div>
    `;
    
    return section;
  }

  async createTeamSection() {
    const section = document.createElement('div');
    section.className = 'team-section bg-white rounded-xl shadow-lg p-8 mb-8';
    
    section.innerHTML = `
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold mb-4">Meet Our Team</h2>
        <p class="text-gray-600">The passionate people behind HOSTALL</p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-6">
        <div class="team-member text-center">
          <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i class="hugeicon-user text-white text-3xl"></i>
          </div>
          <h3 class="font-semibold text-lg">Muhammad Ahmed</h3>
          <p class="text-blue-600 mb-2">Founder & CEO</p>
          <p class="text-gray-600 text-sm">Passionate about solving student accommodation challenges with innovative technology solutions.</p>
        </div>
        
        <div class="team-member text-center">
          <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i class="hugeicon-user text-white text-3xl"></i>
          </div>
          <h3 class="font-semibold text-lg">Fatima Khan</h3>
          <p class="text-green-600 mb-2">Operations Manager</p>
          <p class="text-gray-600 text-sm">Ensures quality standards and verification processes for all listed hostels on our platform.</p>
        </div>
        
        <div class="team-member text-center">
          <div class="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i class="hugeicon-user text-white text-3xl"></i>
          </div>
          <h3 class="font-semibold text-lg">Ali Hassan</h3>
          <p class="text-purple-600 mb-2">Customer Success</p>
          <p class="text-gray-600 text-sm">Dedicated to providing exceptional support and ensuring student satisfaction.</p>
        </div>
      </div>
    `;
    
    return section;
  }

  async createTimelineSection() {
    const section = document.createElement('div');
    section.className = 'timeline-section bg-gray-50 rounded-xl p-8 mb-8';
    
    section.innerHTML = `
      <h2 class="text-2xl font-bold text-center mb-8">Our Journey</h2>
      
      <div class="timeline relative">
        <div class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 bg-blue-200 h-full"></div>
        
        <div class="timeline-item mb-8 flex items-center">
          <div class="timeline-marker w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
            <i class="hugeicon-idea text-white text-sm"></i>
          </div>
          <div class="timeline-content ml-12 md:ml-0 md:w-1/2 md:pr-8">
            <div class="bg-white rounded-lg shadow p-4">
              <h3 class="font-semibold text-blue-600">2023 - The Idea</h3>
              <p class="text-gray-600">Conceived HOSTALL to address the challenges students face in finding quality accommodation.</p>
            </div>
          </div>
        </div>
        
        <div class="timeline-item mb-8 flex items-center md:flex-row-reverse">
          <div class="timeline-marker w-8 h-8 bg-green-600 rounded-full flex items-center justify-center absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
            <i class="hugeicon-rocket text-white text-sm"></i>
          </div>
          <div class="timeline-content ml-12 md:ml-0 md:w-1/2 md:pl-8">
            <div class="bg-white rounded-lg shadow p-4">
              <h3 class="font-semibold text-green-600">2024 - Launch</h3>
              <p class="text-gray-600">Officially launched HOSTALL with 50+ verified hostels in Lahore.</p>
            </div>
          </div>
        </div>
        
        <div class="timeline-item mb-8 flex items-center">
          <div class="timeline-marker w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
            <i class="hugeicon-growth text-white text-sm"></i>
          </div>
          <div class="timeline-content ml-12 md:ml-0 md:w-1/2 md:pr-8">
            <div class="bg-white rounded-lg shadow p-4">
              <h3 class="font-semibold text-purple-600">2024 - Growth</h3>
              <p class="text-gray-600">Expanded to 150+ hostels and helped over 5000 students find their perfect accommodation.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return section;
  }

  async createAboutContactSection() {
    const section = document.createElement('div');
    section.className = 'about-contact bg-white rounded-xl shadow-lg p-8';
    
    section.innerHTML = `
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold mb-4">Get in Touch</h2>
        <p class="text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-8">
        <div class="contact-info space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="hugeicon-mail text-blue-600"></i>
            </div>
            <div>
              <h3 class="font-semibold">Email</h3>
              <p class="text-gray-600">teamhostall@gmail.com</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="hugeicon-phone text-green-600"></i>
            </div>
            <div>
              <h3 class="font-semibold">Phone</h3>
              <p class="text-gray-600">+92-333-1536041</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="hugeicon-location text-purple-600"></i>
            </div>
            <div>
              <h3 class="font-semibold">Office</h3>
              <p class="text-gray-600">Lahore, Punjab, Pakistan</p>
            </div>
          </div>
          
          <div class="social-links flex gap-4 mt-6">
            <a href="#" class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <i class="hugeicon-facebook"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
              <i class="hugeicon-twitter"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
              <i class="hugeicon-linkedin"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
              <i class="hugeicon-instagram"></i>
            </a>
          </div>
        </div>
        
        <div class="contact-form">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    `;
    
    return section;
  }

  // Helper methods for enhanced functionality
  async initializeHostelMap(hostel) {
    if (window.google && hostel.location) {
      try {
        const mapElement = document.getElementById('enhanced-hostel-map');
        if (!mapElement) return;

        // Geocode the location
        const geocoder = new google.maps.Geocoder();
        const geocodeResult = await new Promise((resolve, reject) => {
          geocoder.geocode({ address: hostel.location }, (results, status) => {
            if (status === 'OK') resolve(results[0]);
            else reject(new Error(`Geocoding failed: ${status}`));
          });
        });

        const location = geocodeResult.geometry.location;
        
        // Create map
        const map = new google.maps.Map(mapElement, {
          center: location,
          zoom: 15,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        // Add marker
        new google.maps.Marker({
          position: location,
          map: map,
          title: hostel.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="15" fill="#3B82F6"/>
                <text x="15" y="20" text-anchor="middle" fill="white" font-size="16">🏠</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(30, 30)
          }
        });

        // Find nearby places
        this.findNearbyPlaces(map, location);
        
      } catch (error) {
        console.error('Error initializing map:', error);
        document.getElementById('enhanced-hostel-map').innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">
            <i class="hugeicon-map mr-2"></i>
            Map unavailable
          </div>
        `;
      }
    }
  }

  async findNearbyPlaces(map, location) {
    if (!window.google) return;

    const service = new google.maps.places.PlacesService(map);
    const nearbyContainer = document.getElementById('nearby-places');
    const transportContainer = document.getElementById('transportation-info');

    // Search for nearby places
    const placeTypes = [
      { type: 'university', icon: 'hugeicon-graduation-cap', label: 'Universities' },
      { type: 'hospital', icon: 'hugeicon-hospital', label: 'Hospitals' },
      { type: 'bank', icon: 'hugeicon-bank', label: 'Banks' },
      { type: 'restaurant', icon: 'hugeicon-restaurant', label: 'Restaurants' },
      { type: 'shopping_mall', icon: 'hugeicon-shopping-cart', label: 'Shopping' }
    ];

    try {
      const nearbyPlaces = [];
      
      for (const placeType of placeTypes) {
        const request = {
          location: location,
          radius: 2000,
          type: placeType.type
        };

        const results = await new Promise((resolve) => {
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
              resolve(results.slice(0, 2)); // Get top 2 for each type
            } else {
              resolve([]);
            }
          });
        });

        if (results.length > 0) {
          nearbyPlaces.push({
            type: placeType,
            places: results
          });
        }
      }

      // Display nearby places
      if (nearbyPlaces.length > 0) {
        nearbyContainer.innerHTML = nearbyPlaces.map(category => `
          <div class="mb-3">
            <h4 class="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
              <i class="${category.type.icon} text-xs"></i>
              ${category.type.label}
            </h4>
            ${category.places.map(place => `
              <div class="text-xs text-gray-600 ml-4">• ${place.name}</div>
            `).join('')}
          </div>
        `).join('');
      } else {
        nearbyContainer.innerHTML = '<div class="text-gray-500 text-sm">No nearby places found</div>';
      }

      // Add transportation info
      transportContainer.innerHTML = `
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <i class="hugeicon-bus text-blue-500"></i>
            <span>Public transport available</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="hugeicon-car text-green-500"></i>
            <span>Ride-hailing services</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="hugeicon-bicycle text-orange-500"></i>
            <span>Bike-friendly area</span>
          </div>
        </div>
      `;

    } catch (error) {
      console.error('Error finding nearby places:', error);
      nearbyContainer.innerHTML = '<div class="text-gray-500 text-sm">Unable to load nearby places</div>';
    }
  }

  async loadHostelGallery(hostel) {
    const galleryContainer = document.getElementById('hostel-gallery');
    if (!galleryContainer) return;

    try {
      // Use existing image if available
      const images = [];
      
      if (hostel.img) {
        images.push({
          url: hostel.img,
          alt: `${hostel.name} - Main Image`,
          title: 'Main View'
        });
      }

      // Add some sample gallery images (in production, these would come from the hostel data)
      const sampleImages = [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
      ];

      sampleImages.forEach((url, index) => {
        images.push({
          url: url,
          alt: `${hostel.name} - Image ${index + 1}`,
          title: ['Room View', 'Common Area', 'Facilities', 'Exterior'][index] || `Image ${index + 1}`
        });
      });

      // Create gallery HTML
      galleryContainer.innerHTML = images.map((img, index) => `
        <div class="gallery-item group cursor-pointer" onclick="window.enhancedMCPTools.openImageModal('${img.url}', '${img.alt}')">
          <div class="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg">
            <img src="${img.url}" alt="${img.alt}" 
                 class="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                 loading="lazy">
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <i class="hugeicon-zoom-in text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
            </div>
          </div>
          <p class="text-xs text-gray-600 mt-1 text-center">${img.title}</p>
        </div>
      `).join('');

    } catch (error) {
      console.error('Error loading gallery:', error);
      galleryContainer.innerHTML = `
        <div class="col-span-full text-center py-8 text-gray-500">
          <i class="hugeicon-image text-3xl mb-2"></i>
          <p>Gallery unavailable</p>
        </div>
      `;
    }
  }

  async loadNearbyAmenities(hostel) {
    const amenitiesContainer = document.getElementById('amenities-grid');
    if (!amenitiesContainer) return;

    try {
      const amenities = [
        { name: 'Universities', icon: 'hugeicon-graduation-cap', count: '3 nearby', color: 'blue' },
        { name: 'Hospitals', icon: 'hugeicon-hospital', count: '2 nearby', color: 'red' },
        { name: 'Shopping', icon: 'hugeicon-shopping-cart', count: '5 nearby', color: 'green' },
        { name: 'Restaurants', icon: 'hugeicon-restaurant', count: '10+ nearby', color: 'orange' },
        { name: 'Banks/ATMs', icon: 'hugeicon-bank', count: '4 nearby', color: 'purple' },
        { name: 'Transport', icon: 'hugeicon-bus', count: 'Good access', color: 'indigo' }
      ];

      amenitiesContainer.innerHTML = amenities.map(amenity => `
        <div class="amenity-card bg-${amenity.color}-50 border border-${amenity.color}-100 rounded-lg p-4 text-center">
          <div class="w-12 h-12 bg-${amenity.color}-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="${amenity.icon} text-${amenity.color}-600"></i>
          </div>
          <h3 class="font-semibold text-gray-800 mb-1">${amenity.name}</h3>
          <p class="text-sm text-gray-600">${amenity.count}</p>
        </div>
      `).join('');

    } catch (error) {
      console.error('Error loading amenities:', error);
      amenitiesContainer.innerHTML = `
        <div class="col-span-full text-center py-4 text-gray-500">
          <p>Amenities information unavailable</p>
        </div>
      `;
    }
  }

  // Utility methods
  callHostel(phoneNumber) {
    window.open(`tel:${phoneNumber}`, '_self');
  }

  openWhatsApp(whatsappNumber) {
    const cleanNumber = whatsappNumber.replace(/[^\d]/g, '');
    const message = encodeURIComponent('Hi, I found your hostel on HOSTALL and I\'m interested in learning more about accommodation options.');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  }

  async getDirections(location) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${encodeURIComponent(location)}`;
          window.open(directionsUrl, '_blank');
        },
        () => {
          // Fallback to search-based directions
          const directionsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
          window.open(directionsUrl, '_blank');
        }
      );
    } else {
      // Fallback for browsers without geolocation
      const directionsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
      window.open(directionsUrl, '_blank');
    }
  }

  shareHostel(hostel) {
    if (navigator.share) {
      navigator.share({
        title: `${hostel.name} - HOSTALL`,
        text: `Check out this ${hostel.gender.toLowerCase()} hostel in ${hostel.location}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers without Web Share API
      const shareText = `Check out ${hostel.name} - ${hostel.gender} hostel in ${hostel.location} on HOSTALL: ${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Hostel details copied to clipboard!');
      }).catch(() => {
        // Fallback to showing share modal
        this.showShareModal(hostel);
      });
    }
  }

  showShareModal(hostel) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Share Hostel</h3>
        <p class="text-gray-600 mb-4">Share ${hostel.name} with others:</p>
        <div class="flex gap-3">
          <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(`Check out ${hostel.name} on HOSTALL: ${window.location.href}`)}', '_blank')" 
                  class="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            WhatsApp
          </button>
          <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}', '_blank')" 
                  class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Facebook
          </button>
          <button onclick="this.closest('.fixed').remove()" 
                  class="px-4 py-2 border rounded hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  sendQuickMessage(whatsappNumber) {
    const form = event.target.closest('.bg-white');
    const name = form.querySelector('input[placeholder="Your Name"]').value;
    const phone = form.querySelector('input[placeholder="Your Phone"]').value;
    const message = form.querySelector('textarea').value;
    
    if (!name || !phone || !message) {
      alert('Please fill all fields');
      return;
    }
    
    const fullMessage = `Hi! I'm ${name} (${phone}). ${message}`;
    const cleanNumber = whatsappNumber.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank');
    
    // Clear form
    form.querySelector('input[placeholder="Your Name"]').value = '';
    form.querySelector('input[placeholder="Your Phone"]').value = '';
    form.querySelector('textarea').value = '';
  }

  openImageModal(imageUrl, altText) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="max-w-4xl max-h-full relative">
        <button onclick="this.closest('.fixed').remove()" 
                class="absolute -top-10 right-0 text-white text-xl hover:text-gray-300">
          <i class="hugeicon-cancel"></i>
        </button>
        <img src="${imageUrl}" alt="${altText}" class="max-w-full max-h-full object-contain rounded-lg">
      </div>
    `;
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    document.body.appendChild(modal);
  }

  createFallbackHostelDetails(hostel) {
    const fallback = document.createElement('div');
    fallback.className = 'fallback-details bg-white rounded-lg shadow p-6';
    fallback.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">${hostel.name}</h2>
      <p class="text-gray-600 mb-2">${hostel.location}</p>
      <p class="text-gray-700">${hostel.details}</p>
      <div class="mt-4 flex gap-4">
        <a href="tel:${hostel.phone}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Call</a>
        <a href="https://wa.me/${hostel.whatsapp}" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">WhatsApp</a>
      </div>
    `;
    return fallback;
  }

  createFallbackAboutUs() {
    const fallback = document.createElement('div');
    fallback.className = 'fallback-about bg-white rounded-lg shadow p-6';
    fallback.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">About HOSTALL</h2>
      <p class="text-gray-700 mb-4">
        HOSTALL is your trusted platform for finding quality student accommodation in Lahore. 
        We connect students with verified hostels to ensure safe and comfortable living experiences.
      </p>
      <p class="text-gray-700">
        Contact us: teamhostall@gmail.com | +92-333-1536041
      </p>
    `;
    return fallback;
  }
}

// Export for global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedMCPTools;
} else if (typeof window !== 'undefined') {
  window.EnhancedMCPTools = EnhancedMCPTools;
}