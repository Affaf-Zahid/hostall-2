// HOSTALL Enhanced Google Maps Integration
// Using Google Maps MCP with advanced features

class EnhancedMapsManager {
  constructor() {
    this.map = null;
    this.markers = [];
    this.directionsService = null;
    this.directionsRenderer = null;
    this.geocoder = null;
    this.places = null;
    this.currentInfoWindow = null;
    this.userLocation = null;
    this.API_KEY = 'AIzaSyDUDTg2qpuIh3Yf0b80T0aViBmP2Dv1x7s';
  }

  // Initialize enhanced maps
  async init() {
    try {
      // Load Google Maps API
      await this.loadGoogleMapsAPI();
      console.log('🗺️ Enhanced Google Maps initialized');
      
      // Initialize map services
      this.initializeServices();
      
      // Setup enhanced features
      this.setupEnhancedFeatures();
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Maps:', error);
      return false;
    }
  }

  // Load Google Maps API dynamically
  loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&libraries=places,geometry,directions&v=weekly`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps API'));
      
      document.head.appendChild(script);
    });
  }

  // Initialize map services
  initializeServices() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: true,
      suppressMarkers: false
    });
    this.geocoder = new google.maps.Geocoder();
    this.places = new google.maps.places.PlacesService(document.createElement('div'));
  }

  // Setup enhanced features
  setupEnhancedFeatures() {
    // Get user's current location
    this.getCurrentLocation();
    
    // Setup search functionality
    this.setupPlacesSearch();
    
    // Setup directions functionality
    this.setupDirections();
  }

  // Get user's current location
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('📍 User location acquired');
        },
        (error) => {
          console.warn('⚠️ Could not get user location:', error.message);
          // Default to Lahore, Pakistan
          this.userLocation = { lat: 31.5204, lng: 74.3587 };
        }
      );
    } else {
      console.warn('⚠️ Geolocation not supported');
      this.userLocation = { lat: 31.5204, lng: 74.3587 };
    }
  }

  // Initialize map for hostel
  async initializeHostelMap(mapElementId, hostelLocation) {
    try {
      const mapElement = document.getElementById(mapElementId);
      if (!mapElement) {
        console.error('❌ Map element not found:', mapElementId);
        return null;
      }

      // Geocode hostel location if it's an address
      let coordinates;
      if (typeof hostelLocation === 'string') {
        coordinates = await this.geocodeAddress(hostelLocation);
      } else {
        coordinates = hostelLocation;
      }

      if (!coordinates) {
        console.error('❌ Could not determine hostel location');
        return null;
      }

      // Create map
      this.map = new google.maps.Map(mapElement, {
        center: coordinates,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: this.getMapStyles(),
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true
      });

      // Add hostel marker
      const hostelMarker = new google.maps.Marker({
        position: coordinates,
        map: this.map,
        title: 'Hostel Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <path fill="#e11d48" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        },
        animation: google.maps.Animation.DROP
      });

      this.markers.push(hostelMarker);

      // Add click listener for hostel info
      hostelMarker.addListener('click', () => {
        this.showHostelInfo(hostelMarker, coordinates);
      });

      // Add nearby places
      await this.addNearbyPlaces(coordinates);

      // Add directions renderer
      this.directionsRenderer.setMap(this.map);

      // Add user location if available
      if (this.userLocation) {
        this.addUserLocationMarker();
      }

      return this.map;
    } catch (error) {
      console.error('❌ Failed to initialize hostel map:', error);
      return null;
    }
  }

  // Geocode address to coordinates
  async geocodeAddress(address) {
    return new Promise((resolve) => {
      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.error('❌ Geocoding failed:', status);
          resolve(null);
        }
      });
    });
  }

  // Add nearby places
  async addNearbyPlaces(center) {
    const request = {
      location: center,
      radius: 1000, // 1km radius
      types: ['school', 'university', 'hospital', 'shopping_mall', 'restaurant', 'bus_station']
    };

    this.places.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const importantPlaces = results.slice(0, 10); // Limit to 10 places
        
        importantPlaces.forEach((place, index) => {
          setTimeout(() => {
            this.addPlaceMarker(place);
          }, index * 100); // Stagger marker placement
        });
      }
    });
  }

  // Add place marker
  addPlaceMarker(place) {
    const placeType = place.types[0];
    const icon = this.getPlaceIcon(placeType);

    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map: this.map,
      title: place.name,
      icon: {
        url: icon,
        scaledSize: new google.maps.Size(24, 24),
        anchor: new google.maps.Point(12, 24)
      }
    });

    marker.addListener('click', () => {
      this.showPlaceInfo(marker, place);
    });

    this.markers.push(marker);
  }

  // Get place icon based on type
  getPlaceIcon(type) {
    const icons = {
      school: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#059669" d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
      `),
      university: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#7c3aed" d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
      `),
      hospital: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#dc2626" d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h1V4H4v2zm0 5h5v2h2v-2h1V9H4v2zm0 5h5v2h2v-2h1v-2H4v2z"/>
        </svg>
      `),
      restaurant: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#f59e0b" d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
        </svg>
      `),
      shopping_mall: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#8b5cf6" d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      `),
      bus_station: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#0369a1" d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
        </svg>
      `)
    };

    return icons[type] || icons.restaurant;
  }

  // Show hostel info window
  showHostelInfo(marker, coordinates) {
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }

    const content = `
      <div class="map-info-window">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">🏠 Hostel Location</h3>
        <div class="info-actions">
          <button onclick="window.enhancedMaps.getDirections()" class="info-btn">
            <i class="hgi-stroke hgi-navigation-04"></i> Get Directions
          </button>
          <button onclick="window.enhancedMaps.showNearbyPlaces()" class="info-btn">
            <i class="hgi-stroke hgi-location-01"></i> Nearby Places
          </button>
          <button onclick="window.enhancedMaps.shareLocation(${coordinates.lat}, ${coordinates.lng})" class="info-btn">
            <i class="hgi-stroke hgi-share-location-01"></i> Share Location
          </button>
        </div>
      </div>
    `;

    this.currentInfoWindow = new google.maps.InfoWindow({
      content: content
    });

    this.currentInfoWindow.open(this.map, marker);
  }

  // Show place info window
  showPlaceInfo(marker, place) {
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }

    const rating = place.rating ? `⭐ ${place.rating}` : '';
    const content = `
      <div class="map-info-window">
        <h4 style="margin: 0 0 5px 0; color: #1f2937;">${place.name}</h4>
        <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 0.875rem;">${place.vicinity}</p>
        ${rating ? `<p style="margin: 0 0 10px 0; color: #f59e0b;">${rating}</p>` : ''}
        <button onclick="window.enhancedMaps.getDirectionsToPlace('${place.place_id}')" class="info-btn">
          <i class="hgi-stroke hgi-navigation-04"></i> Directions
        </button>
      </div>
    `;

    this.currentInfoWindow = new google.maps.InfoWindow({
      content: content
    });

    this.currentInfoWindow.open(this.map, marker);
  }

  // Get directions to hostel
  getDirections() {
    if (!this.userLocation) {
      alert('Please enable location services to get directions.');
      return;
    }

    const request = {
      origin: this.userLocation,
      destination: this.markers[0].getPosition(),
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        this.showDirectionsPanel(result);
      } else {
        console.error('❌ Directions request failed:', status);
        alert('Could not get directions. Please try again.');
      }
    });
  }

  // Get directions to specific place
  getDirectionsToPlace(placeId) {
    if (!this.userLocation) {
      alert('Please enable location services to get directions.');
      return;
    }

    const request = {
      origin: this.userLocation,
      destination: { placeId: placeId },
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        this.showDirectionsPanel(result);
      } else {
        console.error('❌ Directions request failed:', status);
        alert('Could not get directions. Please try again.');
      }
    });
  }

  // Show directions panel
  showDirectionsPanel(result) {
    const route = result.routes[0];
    const leg = route.legs[0];
    
    const panel = document.createElement('div');
    panel.className = 'directions-panel';
    panel.innerHTML = `
      <div class="directions-header">
        <h3><i class="hgi-stroke hgi-navigation-04"></i> Directions</h3>
        <button onclick="this.parentElement.parentElement.remove()" class="close-btn">×</button>
      </div>
      <div class="directions-summary">
        <p><strong>Distance:</strong> ${leg.distance.text}</p>
        <p><strong>Duration:</strong> ${leg.duration.text}</p>
      </div>
      <div class="directions-steps">
        ${leg.steps.map((step, index) => `
          <div class="direction-step">
            <span class="step-number">${index + 1}</span>
            <div class="step-instructions">${step.instructions}</div>
          </div>
        `).join('')}
      </div>
    `;

    // Add styles
    if (!document.getElementById('directions-styles')) {
      const styles = document.createElement('style');
      styles.id = 'directions-styles';
      styles.textContent = `
        .directions-panel {
          position: fixed;
          right: 20px;
          top: 20px;
          width: 300px;
          max-height: 70vh;
          overflow-y: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
        }
        .directions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        .directions-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 1.125rem;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
        }
        .directions-summary {
          padding: 16px;
          background: #f9fafb;
        }
        .directions-summary p {
          margin: 4px 0;
          color: #374151;
        }
        .directions-steps {
          padding: 16px;
        }
        .direction-step {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }
        .step-number {
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .step-instructions {
          color: #374151;
          font-size: 0.875rem;
          line-height: 1.4;
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(panel);
  }

  // Show nearby places toggle
  showNearbyPlaces() {
    const nearbyMarkers = this.markers.slice(1); // Exclude hostel marker
    const isVisible = nearbyMarkers[0]?.getVisible();
    
    nearbyMarkers.forEach(marker => {
      marker.setVisible(!isVisible);
    });

    if (!isVisible) {
      alert('Nearby places are now visible on the map!');
    } else {
      alert('Nearby places are now hidden.');
    }
  }

  // Share location
  shareLocation(lat, lng) {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Hostel Location',
        text: 'Check out this hostel location!',
        url: googleMapsUrl
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(googleMapsUrl).then(() => {
        alert('Location link copied to clipboard!');
      }).catch(() => {
        prompt('Copy this link to share the location:', googleMapsUrl);
      });
    }
  }

  // Add user location marker
  addUserLocationMarker() {
    const userMarker = new google.maps.Marker({
      position: this.userLocation,
      map: this.map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24),
        anchor: new google.maps.Point(12, 12)
      }
    });

    this.markers.push(userMarker);
  }

  // Setup places search
  setupPlacesSearch() {
    // Enhanced search functionality can be added here
  }

  // Setup directions
  setupDirections() {
    // Enhanced directions functionality can be added here
  }

  // Get custom map styles
  getMapStyles() {
    return [
      {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text',
        stylers: [{ visibility: 'off' }]
      }
    ];
  }

  // Clear all markers
  clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  // Add info window styles
  addInfoWindowStyles() {
    if (!document.getElementById('map-info-styles')) {
      const styles = document.createElement('style');
      styles.id = 'map-info-styles';
      styles.textContent = `
        .map-info-window {
          max-width: 250px;
        }
        .info-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .info-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.2s;
        }
        .info-btn:hover {
          background: #2563eb;
        }
        .info-btn i {
          font-size: 1rem;
        }
      `;
      document.head.appendChild(styles);
    }
  }
}

// Global enhanced maps instance
window.enhancedMaps = new EnhancedMapsManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedMaps.addInfoWindowStyles();
});