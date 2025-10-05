export default function SimplePage() {
  return (
    <html>
      <head>
        <title>STO PWA Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{
        margin: 0,
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #1e3a8a, #d97706)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'rgba(255,255,255,0.1)',
          padding: '40px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
            🏭 PT Fuji Seat Indonesia
          </h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            Laporan Data Stock Akhir Proses
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Div. INJECTION
          </p>
          <button style={{
            background: 'white',
            color: '#1e3a8a',
            border: 'none',
            padding: '15px 30px',
            fontSize: '1.1rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            📱 PWA Ready!
          </button>
          <div style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            ✅ Next.js 15.3.5 | ✅ React 19 | ✅ TypeScript | ✅ PWA
          </div>
        </div>
      </body>
    </html>
  );
}