'use client';

import { useState } from 'react';

interface CoverScreenProps {
  onEnter: () => void;
}

export default function CoverScreen({ onEnter }: CoverScreenProps) {
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

      <div className="text-center mb-8 animate-fade-in-up">
        {/* Logo Image */}
        <div
          className="w-48 h-48 mx-auto mb-6 bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: `url('https://z-cdn-media.chatglm.cn/files/69f99746-a6e5-4c67-8736-aa794f5a64aa_logo1.png?auth_key=1789873019-ba71f0ed107b47f99393be8734b708f4-0-e8e8d6d8a8cc00a3fa694ba0b32dcd1d')`,
          }}
        />
        
        <h1 className="text-4xl font-bold text-white mb-4 text-shadow-lg tracking-wide">
          PT FUJI SEAT INDONESIA
        </h1>
        
        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-normal">
          Laporan Data Stock Akhir Proses Div.INJECTION
        </p>
      </div>

      <button
        onClick={handleEnter}
        className="px-8 py-4 bg-white/15 text-white border-2 border-white/30 text-lg font-semibold rounded-full backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:border-white/50 hover:transform hover:-translate-y-1 hover:shadow-xl animate-fade-in-up animation-delay-300 flex items-center gap-3"
      >
        <span>MASUK APLIKASI</span>
        <i className="fas fa-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .text-shadow-lg {
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}