'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PWARedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke PWA standalone
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-amber-500 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Mengarahkan ke Aplikasi PWA...</p>
      </div>
    </div>
  );
}