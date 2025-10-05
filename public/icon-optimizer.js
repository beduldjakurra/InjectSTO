/**
 * Icon Performance Optimizer
 * Ensures icon changes don't impact PWA performance
 */

class IconOptimizer {
  constructor() {
    this.iconCache = new Map();
    this.preloadQueue = [];
    this.isOptimizing = false;
  }

  /**
   * Preload icons with priority
   */
  async preloadIcons() {
    if (this.isOptimizing) return;
    this.isOptimizing = true;

    const iconUrls = [
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png'
    ];

    console.log('📱 Starting icon optimization...');

    try {
      // Create optimized loading promises
      const loadPromises = iconUrls.map(url => this.loadIconOptimized(url));
      
      // Load icons with Promise.allSettled to prevent blocking
      const results = await Promise.allSettled(loadPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`✅ Icon loaded: ${iconUrls[index]}`);
        } else {
          console.warn(`⚠️ Icon load failed: ${iconUrls[index]}`, result.reason);
        }
      });

      console.log('🎉 Icon optimization completed');
    } catch (error) {
      console.error('❌ Icon optimization failed:', error);
    } finally {
      this.isOptimizing = false;
    }
  }

  /**
   * Load single icon with optimization
   */
  async loadIconOptimized(url) {
    return new Promise((resolve, reject) => {
      // Check if already cached
      if (this.iconCache.has(url)) {
        resolve(this.iconCache.get(url));
        return;
      }

      // Create optimized image loading
      const img = new Image();
      
      // Set loading attributes for performance
      img.loading = 'eager'; // Prioritize critical icons
      img.decoding = 'async'; // Non-blocking decode
      
      // Performance timing
      const startTime = performance.now();
      
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        console.log(`📱 Icon loaded in ${loadTime.toFixed(2)}ms: ${url}`);
        
        // Cache the successful load
        this.iconCache.set(url, {
          url,
          loaded: true,
          loadTime,
          timestamp: Date.now()
        });
        
        resolve(img);
      };

      img.onerror = (error) => {
        console.error(`❌ Icon load error: ${url}`, error);
        
        // Cache the failure to prevent retry loops
        this.iconCache.set(url, {
          url,
          loaded: false,
          error: true,
          timestamp: Date.now()
        });
        
        reject(new Error(`Failed to load icon: ${url}`));
      };

      // Add timeout protection
      const timeout = setTimeout(() => {
        console.warn(`⏰ Icon load timeout: ${url}`);
        reject(new Error(`Timeout loading icon: ${url}`));
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        img.onload();
      };

      // Start loading
      img.src = url;
    });
  }

  /**
   * Validate icon performance
   */
  validateIconPerformance() {
    const report = {
      totalIcons: this.iconCache.size,
      loadedIcons: 0,
      failedIcons: 0,
      averageLoadTime: 0,
      recommendations: []
    };

    let totalLoadTime = 0;
    let loadedCount = 0;

    this.iconCache.forEach((cache, url) => {
      if (cache.loaded) {
        report.loadedIcons++;
        totalLoadTime += cache.loadTime || 0;
        loadedCount++;
      } else if (cache.error) {
        report.failedIcons++;
      }
    });

    report.averageLoadTime = loadedCount > 0 ? totalLoadTime / loadedCount : 0;

    // Generate recommendations
    if (report.averageLoadTime > 100) {
      report.recommendations.push('Consider optimizing icon file sizes');
    }
    if (report.failedIcons > 0) {
      report.recommendations.push('Check failed icon URLs and provide fallbacks');
    }
    if (report.loadedIcons === 0) {
      report.recommendations.push('Icons may not be loading properly');
    }

    return report;
  }

  /**
   * Clear icon cache (useful for updates)
   */
  clearIconCache() {
    this.iconCache.clear();
    console.log('🗑️ Icon cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.iconCache.size,
      entries: Array.from(this.iconCache.entries())
    };
  }
}

// Global icon optimizer instance
window.IconOptimizer = new IconOptimizer();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.IconOptimizer.preloadIcons();
  });
} else {
  // DOM already loaded
  window.IconOptimizer.preloadIcons();
}

// Monitor performance
if ('performance' in window && 'observe' in PerformanceObserver.prototype) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes('/icons/')) {
        console.log(`📊 Icon performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
      }
    });
  });

  try {
    observer.observe({ entryTypes: ['resource'] });
  } catch (error) {
    console.warn('Performance observer not supported:', error);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IconOptimizer;
}