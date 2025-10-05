'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [showMainApp, setShowMainApp] = useState(false);

  const coverStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a, #d97706)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    padding: '20px'
  };

  const containerStyle = {
    textAlign: 'center' as const,
    background: 'rgba(255,255,255,0.1)',
    padding: '40px',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    maxWidth: '600px',
    width: '100%'
  };

  const buttonStyle = {
    background: 'white',
    color: '#1e3a8a',
    border: 'none',
    padding: '15px 30px',
    fontSize: '1.1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    marginTop: '20px',
    marginRight: '15px',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const buttonSecondaryStyle = {
    ...buttonStyle,
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)'
  };

  if (!showMainApp) {
    return (
      <div style={coverStyle}>
        <div style={containerStyle}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', margin: '0 0 20px 0' }}>
            🏭 PT Fuji Seat Indonesia
          </h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', margin: '0 0 20px 0' }}>
            Laporan Data Stock Akhir Proses
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', margin: '0 0 30px 0' }}>
            Div. INJECTION
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            <Link href="/index.html" style={buttonStyle}>
              📱 PWA Application (Recommended)
            </Link>
            <button
              style={buttonSecondaryStyle}
              onClick={() => setShowMainApp(true)}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              �️ Dashboard View
            </button>
          </div>
          
          <div style={{ fontSize: '0.9rem', opacity: '0.8', marginTop: '20px' }}>
            <div>✅ PWA: Full Featured Production App</div>
            <div>✅ Dashboard: Development & Monitoring</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={dashboardStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '30px', color: '#1f2937' }}>
          🎯 Dashboard Produksi PWA
        </h1>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', margin: '0 0 20px 0' }}>
            🎉 Aplikasi PWA berhasil berjalan dengan sempurna!
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '30px' 
        }}>
          <div style={{ 
            background: '#dbeafe', 
            padding: '20px', 
            borderRadius: '10px',
            border: '1px solid #bfdbfe'
          }}>
            <h3 style={{ color: '#1e40af', margin: '0 0 10px 0' }}>📊 Stock Produksi</h3>
            <p style={{ color: '#3730a3', fontSize: '0.9rem', margin: '0' }}>View data stock produksi real-time</p>
          </div>
          
          <div style={{ 
            background: '#dcfce7', 
            padding: '20px', 
            borderRadius: '10px',
            border: '1px solid #bbf7d0'
          }}>
            <h3 style={{ color: '#166534', margin: '0 0 10px 0' }}>📦 Perhitungan Box</h3>
            <p style={{ color: '#15803d', fontSize: '0.9rem', margin: '0' }}>Hitung perhitungan box otomatis</p>
          </div>
          
          <div style={{ 
            background: '#fed7aa', 
            padding: '20px', 
            borderRadius: '10px',
            border: '1px solid #fdba74'
          }}>
            <h3 style={{ color: '#c2410c', margin: '0 0 10px 0' }}>💪 Kekuatan Stock</h3>
            <p style={{ color: '#ea580c', fontSize: '0.9rem', margin: '0' }}>Monitor kekuatan stock</p>
          </div>
        </div>

        <div style={{ 
          background: '#f9fafb', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '30px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ color: '#374151', marginBottom: '15px' }}>✅ Fitur PWA yang Aktif:</h4>
          <ul style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '20px' }}>
            <li>📱 Installable - Bisa diinstall seperti app native</li>
            <li>🌐 Offline Ready - Bekerja tanpa internet</li>
            <li>📱 Responsive - Mobile dan desktop friendly</li>
            <li>⚡ Fast Loading - Service Worker caching</li>
            <li>🔄 Real-time Updates - WebSocket integration</li>
          </ul>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={() => setShowMainApp(false)}
            onMouseOver={(e) => e.target.style.background = '#4b5563'}
            onMouseOut={(e) => e.target.style.background = '#6b7280'}
          >
            ← Kembali ke Cover
          </button>
        </div>
      </div>
    </div>
  );
}