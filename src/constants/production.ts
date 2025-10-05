export const KODE_INJECT = [
  "J-303 RH", "J-305", "J-306 RH", "J-306 LH", "J-307", "J-308 RH", "J-308 LH", "J-309", 
  "J-1401 RH", "J-1402 LH", "J-1403 RH", "J-1403 LH", "J-1404 RH", "J-1404 LH", "J-1405 RH", "J-1405 LH", 
  "J-1406 RH", "J-1406 LH", "J-1407 RH", "J-1407 LH", "J-1408 RH", "J-1408 LH", "J-1409 RH", "J-1409 LH", 
  "J-1410 RH", "J-1411 LH", "J-1412 RH", "J-1413 LH", "J-5501", "J-5502", "J-5503", "J-5504", "J-5505", 
  "J-5506", "J-5508 RH", "J-5508 LH", "J-5509 RH", "J-5509 LH", "136B", "202B"
];

export const STDRT_PACK = [
  104, 200, 32, 32, 52, 15, 15, 48, 72, 72, 40, 40, 60, 60, 9, 9, 10, 10, 144, 144, 120, 120, 40, 40, 
  18, 18, 24, 24, 11, 11, 12, 12, 192, 180, 200, 200, 24, 24, 25, 25
];

export const N = KODE_INJECT.length;

export const APP_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  saveDelay: 2000,
  autoSaveInterval: 30000,
  toastDuration: 3000,
  statusIndicatorDuration: 2000,
  virtualScrollThreshold: Infinity,
  installPromptDelay: 5000,
  offlineCheckInterval: 5000,
  syncInterval: 60000,
  jpgConfig: {
    maxSize: 2000000,
    initialQuality: 0.95,
    minQuality: 0.5,
    scale: 2.5,
    maxScale: 4,
    minScale: 1,
    maxIterations: 5
  },
  cacheConfig: {
    cacheName: 'fuji-seat-app-v1',
    cacheUrls: [
      '/',
      '/index.html',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
      'icons/icon-192x192.png',
      'icons/icon-512x512.png'
    ]
  }
};