/**
 * Icon Performance Monitor
 * Real-time monitoring of icon performance impact
 */

class IconPerformanceMonitor {
  constructor() {
    this.metrics = {
      iconLoadTimes: [],
      cacheHitRate: 0,
      totalRequests: 0,
      cacheHits: 0,
      startTime: performance.now()
    };
    
    this.init();
  }

  init() {
    this.setupPerformanceObserver();
    this.setupCacheMonitoring();
    this.setupNetworkMonitoring();
    this.createDashboard();
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes('/icons/')) {
            this.recordIconLoad(entry);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['resource', 'navigation'] });
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    }
  }

  setupCacheMonitoring() {
    // Monitor service worker cache events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_HIT') {
          this.recordCacheHit(event.data.url);
        }
      });
    }
  }

  setupNetworkMonitoring() {
    // Monitor network quality
    if ('connection' in navigator) {
      const connection = navigator.connection;
      this.networkQuality = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };

      connection.addEventListener('change', () => {
        this.networkQuality = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        };
        this.updateDashboard();
      });
    }
  }

  recordIconLoad(entry) {
    const iconMetric = {
      url: entry.name,
      loadTime: entry.duration,
      transferSize: entry.transferSize || 0,
      timestamp: entry.startTime,
      fromCache: entry.transferSize === 0
    };

    this.metrics.iconLoadTimes.push(iconMetric);
    this.metrics.totalRequests++;

    if (iconMetric.fromCache) {
      this.metrics.cacheHits++;
    }

    this.updateCacheHitRate();
    this.updateDashboard();

    console.log('📊 Icon Load Metric:', iconMetric);
  }

  recordCacheHit(url) {
    if (url.includes('/icons/')) {
      this.metrics.cacheHits++;
      this.metrics.totalRequests++;
      this.updateCacheHitRate();
    }
  }

  updateCacheHitRate() {
    this.metrics.cacheHitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.cacheHits / this.metrics.totalRequests * 100).toFixed(2)
      : 0;
  }

  getAverageLoadTime() {
    if (this.metrics.iconLoadTimes.length === 0) return 0;
    
    const totalTime = this.metrics.iconLoadTimes.reduce((sum, metric) => sum + metric.loadTime, 0);
    return (totalTime / this.metrics.iconLoadTimes.length).toFixed(2);
  }

  createDashboard() {
    if (document.getElementById('icon-performance-dashboard')) return;

    const dashboard = document.createElement('div');
    dashboard.id = 'icon-performance-dashboard';
    dashboard.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      min-width: 250px;
      max-width: 300px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    dashboard.innerHTML = `
      <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
        <strong>📱 Icon Performance</strong>
        <button id="toggle-dashboard" style="background: none; border: none; color: white; cursor: pointer;">📊</button>
      </div>
      <div id="dashboard-content">
        <div>Load Time: <span id="avg-load-time">0ms</span></div>
        <div>Cache Hit Rate: <span id="cache-hit-rate">0%</span></div>
        <div>Total Requests: <span id="total-requests">0</span></div>
        <div>Network: <span id="network-quality">Unknown</span></div>
        <div style="margin-top: 10px;">
          <div>📱 Icon Status:</div>
          <div id="icon-status" style="margin-left: 10px; font-size: 10px;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(dashboard);

    // Toggle functionality
    const toggleBtn = dashboard.querySelector('#toggle-dashboard');
    let isExpanded = false;

    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      dashboard.style.transform = isExpanded ? 'translateX(0)' : 'translateX(calc(100% - 40px))';
    });

    // Initial collapsed state
    setTimeout(() => {
      dashboard.style.transform = 'translateX(calc(100% - 40px))';
    }, 3000);

    this.dashboard = dashboard;
  }

  updateDashboard() {
    if (!this.dashboard) return;

    const avgLoadTime = this.getAverageLoadTime();
    const cacheHitRate = this.metrics.cacheHitRate;
    const totalRequests = this.metrics.totalRequests;
    const networkQuality = this.networkQuality ? this.networkQuality.effectiveType : 'Unknown';

    document.getElementById('avg-load-time').textContent = `${avgLoadTime}ms`;
    document.getElementById('cache-hit-rate').textContent = `${cacheHitRate}%`;
    document.getElementById('total-requests').textContent = totalRequests;
    document.getElementById('network-quality').textContent = networkQuality;

    // Update icon status
    const iconStatus = document.getElementById('icon-status');
    const iconUrls = ['/icons/icon-192x192.png', '/icons/icon-512x512.png'];
    const statusHTML = iconUrls.map(url => {
      const metric = this.metrics.iconLoadTimes.find(m => m.url.includes(url));
      const status = metric ? '✅' : '⏳';
      const time = metric ? `${metric.loadTime.toFixed(1)}ms` : 'pending';
      return `${status} ${url.split('/').pop()}: ${time}`;
    }).join('<br>');

    iconStatus.innerHTML = statusHTML;
  }

  getPerformanceReport() {
    const report = {
      summary: {
        averageLoadTime: this.getAverageLoadTime(),
        cacheHitRate: this.metrics.cacheHitRate,
        totalRequests: this.metrics.totalRequests,
        uptime: ((performance.now() - this.metrics.startTime) / 1000).toFixed(2)
      },
      iconMetrics: this.metrics.iconLoadTimes,
      networkQuality: this.networkQuality,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const avgLoadTime = parseFloat(this.getAverageLoadTime());
    const cacheHitRate = parseFloat(this.metrics.cacheHitRate);

    if (avgLoadTime > 100) {
      recommendations.push('Consider optimizing icon file sizes (current average: ' + avgLoadTime + 'ms)');
    }

    if (cacheHitRate < 80) {
      recommendations.push('Cache hit rate is low (' + cacheHitRate + '%), check service worker configuration');
    }

    if (this.networkQuality && this.networkQuality.effectiveType === 'slow-2g') {
      recommendations.push('User on slow network, consider serving smaller icons');
    }

    if (recommendations.length === 0) {
      recommendations.push('Icon performance is optimal! 🎉');
    }

    return recommendations;
  }

  exportReport() {
    const report = this.getPerformanceReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `icon-performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Auto-initialize
window.addEventListener('load', () => {
  window.IconPerformanceMonitor = new IconPerformanceMonitor();
  
  // Add keyboard shortcut for report export
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      window.IconPerformanceMonitor.exportReport();
      console.log('📊 Performance report exported');
    }
  });
});

// Add to global scope for debugging
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IconPerformanceMonitor;
}