'use client';

export default function Footer() {
  return (
    <footer className="text-center p-6 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 text-sm relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded" />
      <p>
        <i className="far fa-copyright mr-1" />
        2025 Laporan Produksi Harian - PT Fuji Seat Indonesia
      </p>
    </footer>
  );
}