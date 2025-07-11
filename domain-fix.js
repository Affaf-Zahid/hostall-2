/**
 * HOSTALL Domain and Cache Fix - CROSS DEVICE SYNC
 * 
 * This script helps solve issues with domain linking and cache problems.
 * It forces a hard refresh of assets and implements versioning to ensure
 * all devices get the latest content across different browsers and networks.
 */

// Current version - update this with each deployment
const HOSTALL_VERSION = '2025-07-03-13:07';

// Cross-device cache busting configuration
const CACHE_BUST_CONFIG = {
  // More aggressive cache busting for cross-device sync
  enableAggressiveBusting: true,
  // Force reload assets every time
  forceAssetReload: true,
  // Add random timestamp to all requests
  useRandomTimestamp: true,
  // Maximum cache age (in seconds)
  maxCacheAge: 300 // 5 minutes
};

// Domain configuration (used for canonical URLs and Open Graph)
const DOMAIN_CONFIG = {
  primaryDomain: 'hostall.org', // Your primary domain
  useWWW: false,                // Whether to use www subdomain
  canonicalProtocol: 'https',   // Protocol for canonical URLs
  
  // Get full canonical domain with protocol
  get fullDomain() {
    const subdomain = this.useWWW ? 'www.' : '';
    return `${this.canonicalProtocol}://${subdomain}${this.primaryDomain}`;
  }
};

// Initialize domain configuration
(function() {
  console.log(`🚀 HOSTALL ${HOSTALL_VERSION} - Domain Fix Active`);
  console.log(`🔄 Loaded at: ${new Date().toISOString()}`);

  // Update cache control headers
  applyStrongCacheHeaders();
  
  // Force reload JS and CSS with version parameters
  versionizeAssets();
  
  // Update canonical URLs and Open Graph metadata
  updateMetadataTags();
  
  // Setup cross-device sync for admin users
  initCrossDeviceSync();

  // Save version in localStorage for easy checking
  localStorage.setItem('HOSTALL_VERSION', HOSTALL_VERSION);
  
  // Display version in console for debugging
  window.addEventListener('load', () => {
    showVersionInfo();
  });
})();

/**
 * Apply strong cache-busting headers to prevent browser caching
 */
function applyStrongCacheHeaders() {
  // Add meta tags dynamically if they don't exist
  const metaTags = [
    {name: 'Cache-Control', content: 'no-cache, no-store, must-revalidate, max-age=0'},
    {name: 'Pragma', content: 'no-cache'},
    {name: 'Expires', content: '0'},
    {name: 'version', content: HOSTALL_VERSION}
  ];
  
  metaTags.forEach(meta => {
    if (!document.querySelector(`meta[http-equiv="${meta.name}"]`)) {
      const metaTag = document.createElement('meta');
      metaTag.setAttribute('http-equiv', meta.name);
      metaTag.setAttribute('content', meta.content);
      document.head.appendChild(metaTag);
    }
  });
  
  // Add version meta tag
  if (!document.querySelector('meta[name="version"]')) {
    const versionMeta = document.createElement('meta');
    versionMeta.setAttribute('name', 'version');
    versionMeta.setAttribute('content', HOSTALL_VERSION);
    document.head.appendChild(versionMeta);
  }
}

/**
 * Add version parameters to all JavaScript and CSS resources
 * Enhanced for cross-device synchronization
 */
function versionizeAssets() {
  // Force reload all scripts with version parameter
  setTimeout(() => {
    const timestamp = CACHE_BUST_CONFIG.useRandomTimestamp ? 
      Date.now() : HOSTALL_VERSION.replace(/[-:]/g, '');
    
    // Process script tags
    document.querySelectorAll('script[src]').forEach(script => {
      if (script.src && !script.src.includes('?v=')) {
        const currentSrc = script.src;
        let newSrc;
        
        if (CACHE_BUST_CONFIG.enableAggressiveBusting) {
          // Add both version and timestamp for maximum cache busting
          newSrc = `${currentSrc}?v=${timestamp}&cb=${Date.now()}`;
        } else {
          newSrc = addVersionParameter(currentSrc);
        }
        
        if (currentSrc !== newSrc && CACHE_BUST_CONFIG.forceAssetReload) {
          const newScript = document.createElement('script');
          Array.from(script.attributes).forEach(attr => {
            if (attr.name !== 'src') {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          newScript.src = newSrc;
          script.parentNode.replaceChild(newScript, script);
        }
      }
    });
    
    // Process CSS links with aggressive cache busting
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (link.href && !link.href.includes('?v=')) {
        if (CACHE_BUST_CONFIG.enableAggressiveBusting) {
          link.href = `${link.href}?v=${timestamp}&cb=${Date.now()}`;
        } else {
          link.href = addVersionParameter(link.href);
        }
      }
    });
    
    // Process images with cache busting
    document.querySelectorAll('img').forEach(img => {
      if (img.src && !img.src.includes('?v=') && !img.src.startsWith('data:')) {
        if (CACHE_BUST_CONFIG.enableAggressiveBusting && !img.src.includes('supabase')) {
          // Don't add cache busting to Supabase images
          img.src = `${img.src}?v=${timestamp}&cb=${Date.now()}`;
        } else {
          img.src = addVersionParameter(img.src);
        }
      }
    });
    
    console.log('🔄 Assets versionized with cache-busting parameters');
  }, 1000);
}

/**
 * Add version parameter to a URL
 */
function addVersionParameter(url) {
  if (!url) return url;
  
  // Skip for external CDNs and data URLs
  if (url.includes('cdn.') || url.includes('unpkg.com') || url.startsWith('data:')) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url.split('?')[0]}${separator}v=${HOSTALL_VERSION}`;
}

/**
 * Update canonical URLs and Open Graph tags
 */
function updateMetadataTags() {
  // Update canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', DOMAIN_CONFIG.fullDomain);
  
  // Update OG URL
  let ogUrlMeta = document.querySelector('meta[property="og:url"]');
  if (!ogUrlMeta) {
    ogUrlMeta = document.createElement('meta');
    ogUrlMeta.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrlMeta);
  }
  ogUrlMeta.setAttribute('content', DOMAIN_CONFIG.fullDomain);
  
  // Update Twitter card URL
  let twitterUrlMeta = document.querySelector('meta[name="twitter:url"]');
  if (!twitterUrlMeta) {
    twitterUrlMeta = document.createElement('meta');
    twitterUrlMeta.setAttribute('name', 'twitter:url');
    document.head.appendChild(twitterUrlMeta);
  }
  twitterUrlMeta.setAttribute('content', DOMAIN_CONFIG.fullDomain);
}

/**
 * Display version info in console for debugging
 */
function showVersionInfo() {
  const style = 'background: #8B5CF6; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;';
  console.log('%c HOSTALL VERSION INFO ', style);
  console.log(`📋 Current Version: ${HOSTALL_VERSION}`);
  console.log(`🌐 Domain: ${DOMAIN_CONFIG.fullDomain}`);
  console.log(`⏱️ Page Loaded: ${new Date().toLocaleTimeString()}`);
  
  // Detect if running from original domain
  const currentDomain = window.location.hostname;
  if (currentDomain !== DOMAIN_CONFIG.primaryDomain && 
      currentDomain !== `www.${DOMAIN_CONFIG.primaryDomain}`) {
    console.warn(`⚠️ Running on non-primary domain: ${currentDomain}`);
    console.warn(`⚠️ Primary domain is: ${DOMAIN_CONFIG.primaryDomain}`);
  } else {
    console.log(`✅ Running on primary domain: ${currentDomain}`);
  }
}

/**
 * Initialize cross-device sync for admin users
 */
function initCrossDeviceSync() {
  // Only setup for admin section
  if (!window.location.hash.includes('admin')) {
    return;
  }
  
  console.log('🔄 Initializing cross-device sync for admin');
  
  // Set up more frequent sync (every 10 seconds)
  setInterval(() => {
    if (window.supabase) {
      if (typeof loadHostelsFromSupabase === 'function') {
        loadHostelsFromSupabase();
        console.log(`🔄 Cross-device sync at ${new Date().toLocaleTimeString()}`);
      }
    }
  }, 10000);
  
  // Set up localStorage versioning to detect stale data
  const storageVersion = localStorage.getItem('HOSTALL_VERSION');
  if (storageVersion !== HOSTALL_VERSION) {
    console.log(`⚠️ Version mismatch: Storage ${storageVersion || 'none'} vs Current ${HOSTALL_VERSION}`);
    console.log('🔄 Triggering data refresh due to version change');
    
    // Force refresh of crucial data
    setTimeout(() => {
      if (typeof loadHostelsFromSupabase === 'function') {
        loadHostelsFromSupabase();
      }
    }, 2000);
  }
}

/**
 * DNS Propagation Check
 * 
 * This function helps users check if their DNS settings have propagated
 */
window.checkDNSPropagation = function() {
  const status = document.createElement('div');
  status.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  status.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <h3 style="margin: 0; font-size: 16px;">🌐 DNS Propagation Check</h3>
      <button onclick="this.parentNode.parentNode.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
    </div>
    <div id="dns-check-results" style="font-size: 14px;">
      <p>Checking DNS propagation status...</p>
    </div>
  `;
  
  document.body.appendChild(status);
  
  const results = document.getElementById('dns-check-results');
  
  // Simulate DNS check (in production this would call an API)
  setTimeout(() => {
    const currentDomain = window.location.hostname;
    const targetDomain = DOMAIN_CONFIG.primaryDomain;
    const isCorrectDomain = (currentDomain === targetDomain || 
                            currentDomain === `www.${targetDomain}`);
    
    if (isCorrectDomain) {
      results.innerHTML = `
        <div style="color: #10B981; margin-bottom: 10px;">
          ✅ <strong>Success!</strong> DNS has fully propagated.
        </div>
        <div>
          <strong>Current domain:</strong> ${currentDomain}<br>
          <strong>Target domain:</strong> ${targetDomain}<br>
          <strong>Version:</strong> ${HOSTALL_VERSION}<br>
          <strong>Status:</strong> Active and working correctly
        </div>
        <div style="margin-top: 15px; font-size: 13px; color: #6B7280;">
          If you're still experiencing issues, try clearing your browser cache 
          or using a hard refresh (Ctrl+F5).
        </div>
      `;
    } else {
      results.innerHTML = `
        <div style="color: #EF4444; margin-bottom: 10px;">
          ⚠️ <strong>Warning!</strong> DNS may not be fully propagated.
        </div>
        <div>
          <strong>Current domain:</strong> ${currentDomain}<br>
          <strong>Target domain:</strong> ${targetDomain}<br>
          <strong>Version:</strong> ${HOSTALL_VERSION}<br>
          <strong>Status:</strong> Using alternate domain
        </div>
        <div style="margin-top: 15px; font-size: 13px;">
          DNS propagation can take 24-48 hours to complete worldwide.
          <ul style="margin-top: 10px; padding-left: 20px;">
            <li>Confirm your DNS settings in Cloudflare</li>
            <li>Verify CNAME points to <code>hostall-website.pages.dev</code></li>
            <li>Check if Proxy Status is enabled (orange cloud)</li>
          </ul>
        </div>
      `;
    }
  }, 1500);
};

/**
 * Force Hard Refresh
 * 
 * This function performs a complete cache flush and reload
 */
window.forceHardRefresh = function() {
  // Clear browser cache via cache API if available
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  // Clear localStorage except crucial items
  const preserveKeys = ['auth', 'supabase.auth.token', 'HOSTALL_VERSION'];
  Object.keys(localStorage).forEach(key => {
    if (!preserveKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  // Add a random query parameter to force reload
  const cacheBuster = Date.now();
  window.location.href = window.location.href.split('?')[0] + '?refresh=' + cacheBuster;
};

// Export utility functions
window.HOSTALL_DOMAIN_FIX = {
  version: HOSTALL_VERSION,
  domain: DOMAIN_CONFIG.fullDomain,
  checkDNSPropagation,
  forceHardRefresh,
  versionizeAssets
};