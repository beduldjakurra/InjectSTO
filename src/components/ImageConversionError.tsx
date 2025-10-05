'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ImageConversionErrorProps {
  error?: Error;
  retry: () => void;
}

export function ImageConversionError({ error, retry }: ImageConversionErrorProps) {
  const getErrorSuggestion = (errorMessage: string) => {
    if (errorMessage.includes('oklch') || errorMessage.includes('color')) {
      return {
        title: 'Kesalahan Parsing Warna',
        suggestions: [
          'Refresh halaman browser Anda',
          'Bersihkan cache browser',
          'Coba gunakan browser lain (Chrome, Firefox, atau Edge)',
          'Pastikan browser Anda diperbarui'
        ]
      };
    }
    
    if (errorMessage.includes('tidak ditemukan')) {
      return {
        title: 'Tabel Tidak Ditemukan',
        suggestions: [
          'Pastikan Anda berada di halaman yang benar',
          'Tunggu hingga tabel selesai dimuat',
          'Refresh halaman dan coba lagi'
        ]
      };
    }
    
    if (errorMessage.includes('offline')) {
      return {
        title: 'Koneksi Internet Terputus',
        suggestions: [
          'Periksa koneksi internet Anda',
          'Hubungkan kembali ke jaringan',
          'Coba lagi setelah terhubung'
        ]
      };
    }
    
    return {
      title: 'Kesalahan Konversi',
      suggestions: [
        'Refresh halaman browser',
        'Periksa koneksi internet',
        'Pastikan tabel terlihat dengan baik',
        'Coba lagi dengan koneksi yang lebih stabil'
      ]
    };
  };

  const suggestion = getErrorSuggestion(error?.message || '');

  return (
    <div className="space-y-4 p-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{suggestion.title}</AlertTitle>
        <AlertDescription>
          {error?.message || 'Terjadi kesalahan saat mengkonversi gambar.'}
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Solusi yang disarankan:</p>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
          {suggestion.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <Button onClick={retry} variant="default">
          <RefreshCw className="h-4 w-4 mr-2" />
          Coba Lagi
        </Button>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Refresh Halaman
        </Button>
      </div>
    </div>
  );
}