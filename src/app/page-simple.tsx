'use client';

import { useState } from 'react';

// Simple CoverScreen component without external dependencies
function SimpleCoverScreen({ onEnter }: { onEnter: () => void }) {
  const [isHidden, setIsHidden] = useState(false);

  const handleEnter = () => {
    setIsHidden(true);
    setTimeout(() => {
      onEnter();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-blue-900 to-amber-600 flex flex-col justify-center items-center z-50 overflow-hidden transition-all duration-500 ${
        isHidden ? 'opacity-0 invisible' : 'opacity-100 visible'
      }`}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm20 0a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM10 37a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm10-17h20v20H20V20zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-2xl">
        {/* Company Logo */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🏭</div>
        </div>

        {/* Company Name */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          PT Fuji Seat Indonesia
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
          Laporan Data Stock Akhir Proses
        </h2>

        {/* Division */}
        <p className="text-lg md:text-xl text-white/80 mb-12 font-light">
          Division INJECTION
        </p>

        {/* Enter Button */}
        <button
          onClick={handleEnter}
          className="bg-white text-blue-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          📱 Masuk Aplikasi PWA
        </button>

        {/* PWA Badge */}
        <div className="mt-8">
          <span className="text-white/70 text-sm">
            ✅ Progressive Web App Ready
          </span>
        </div>
      </div>
    </div>
  );
}

// Simple main app component
function SimpleMainApp({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            🎯 Dashboard Produksi STO
          </h1>
          <p className="text-center text-gray-600">
            Sistem Tracking & Monitoring Production - PT Fuji Seat Indonesia
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎉 Aplikasi PWA Berhasil Berjalan!
            </h2>
            <p className="text-gray-600">
              Tampilan awal telah dikembalikan dengan fitur PWA lengkap
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Stock Produksi</h3>
              <p className="text-blue-600 text-sm">Monitor data stock produksi real-time</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Perhitungan Box</h3>
              <p className="text-green-600 text-sm">Sistem perhitungan box otomatis</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">💪</div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Kekuatan Stock</h3>
              <p className="text-orange-600 text-sm">Analisis kekuatan stock inventory</p>
            </div>
          </div>

          {/* PWA Features Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">✅ Fitur PWA Aktif:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📱 Installable - Bisa diinstall seperti app native</li>
                <li>🌐 Offline Ready - Bekerja tanpa internet</li>
                <li>📱 Responsive - Mobile dan desktop friendly</li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>⚡ Fast Loading - Service Worker caching</li>
                <li>🔄 Real-time Updates - WebSocket integration</li>
                <li>🔒 Secure - HTTPS dan security headers</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-x-4">
            <button
              onClick={onBack}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Kembali ke Cover
            </button>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🚀 Mulai Production Mode
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2025 PT Fuji Seat Indonesia - Progressive Web Application</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [showMainApp, setShowMainApp] = useState(false);

  // Register service worker
  useState(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }
  });

  const handleEnterApp = () => {
    setShowMainApp(true);
  };

  const handleBackToCover = () => {
    setShowMainApp(false);
  };

  return (
    <div className="min-h-screen">
      {/* Cover Screen */}
      {!showMainApp && <SimpleCoverScreen onEnter={handleEnterApp} />}
      
      {/* Main Application */}
      {showMainApp && <SimpleMainApp onBack={handleBackToCover} />}
    </div>
  );
}