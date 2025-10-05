'use client';

import { useProductionStore } from '@/store/productionStore';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useRef } from 'react';
import { ExcelManager } from '@/utils/excelUtils';
import { ImageManager } from '@/utils/imageUtils';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const {
    isNightMode,
    setNightMode,
    syncStatus,
    updateSyncStatus,
    getDeviceId,
    currentView,
    resetData
  } = useProductionStore();
  
  const [currentDate, setCurrentDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      );
    };

    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleSyncClick = () => {
    if (syncStatus.status === 'error') {
      updateSyncStatus({
        status: 'syncing',
        message: 'Menyinkronkan data...',
        errorCount: 0
      });
      
      // Simulate sync process
      setTimeout(() => {
        updateSyncStatus({
          status: 'synced',
          message: 'Tersinkronisasi',
          errorCount: 0
        });
        toast({
          title: "Sinkronisasi Berhasil",
          description: "Data berhasil disinkronkan",
        });
      }, 2000);
    }
  };

  const handleSaveExcel = () => {
    try {
      const fileName = ExcelManager.saveToExcel();
      toast({
        title: "Berhasil Disimpan",
        description: `File Excel "${fileName}" telah berhasil disimpan.`,
      });
    } catch (error) {
      console.error('Error saving Excel:', error);
      toast({
        title: "Gagal Menyimpan",
        description: "Gagal menyimpan file Excel. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleConvertToJpg = async () => {
    if (isConverting) return; // Prevent multiple clicks
    
    setIsConverting(true);
    try {
      await ImageManager.captureStockProductionTable();
      toast({
        title: "Berhasil Dikonversi",
        description: "Tabel berhasil dikonversi ke JPG dan diunduh.",
      });
    } catch (error) {
      console.error('Error converting to JPG:', error);
      toast({
        title: "Gagal Mengkonversi",
        description: error instanceof Error ? error.message : "Gagal mengkonversi ke JPG. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleImportExcel = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const isThirdTable = currentView === 'third';
      const importCount = await ExcelManager.importExcel(file, isThirdTable);
      
      toast({
        title: "Import Berhasil",
        description: `Berhasil mengimpor ${importCount} data dari Excel.`,
      });
    } catch (error) {
      console.error('Error importing Excel:', error);
      toast({
        title: "Import Gagal",
        description: error instanceof Error ? error.message : "Gagal mengimpor file Excel. Silakan periksa format file.",
        variant: "destructive",
      });
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan.')) {
      resetData();
      toast({
        title: "Data Direset",
        description: "Semua data telah direset.",
      });
    }
  };

  return (
    <header className="p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-center relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Gradient Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 to-pink-500" />

      <h1 className="text-4xl font-bold mb-6 text-blue-500 dark:text-blue-400 flex items-center justify-center gap-3 relative">
        <i className={`fas ${isNightMode ? 'fa-moon' : 'fa-sun'}`} />
        STOCK PRODUKSI {isNightMode ? 'NIGHT' : 'DAY'}
        
        {/* Underline */}
        <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 h-[3px] bg-gradient-to-r from-blue-500 to-green-500 rounded" />
      </h1>

      <div className="text-gray-600 dark:text-gray-400 mb-6 text-lg font-medium flex items-center justify-center gap-2">
        <i className="fas fa-calendar" />
        {currentDate}
      </div>

      {/* Sync Status */}
      <div
        className={`flex items-center justify-center gap-2 mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-md ${
          syncStatus.status === 'syncing' ? 'text-blue-500' :
          syncStatus.status === 'synced' ? 'text-green-500' : 'text-red-500'
        }`}
        onClick={handleSyncClick}
      >
        <i className={`fas fa-sync-alt ${syncStatus.status === 'syncing' ? 'animate-spin' : ''}`} />
        <span>{syncStatus.message}</span>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300">
        <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100 transition-colors">
          <i className="fas fa-sun" />
          <span>Day</span>
        </div>
        
        <Switch
          checked={isNightMode}
          onCheckedChange={setNightMode}
        />
        
        <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100 transition-colors">
          <i className="fas fa-moon" />
          <span>Night</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <Button
          onClick={handleSaveExcel}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-0.5"
        >
          <i className="fas fa-file-excel mr-2" />
          Save to Excel
        </Button>
        
        <Button
          onClick={handleConvertToJpg}
          disabled={isConverting}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isConverting ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2" />
              Mengkonversi...
            </>
          ) : (
            <>
              <i className="fas fa-image mr-2" />
              Convert to JPG
            </>
          )}
        </Button>
        
        <Button
          onClick={handleImportExcel}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-0.5"
        >
          <i className="fas fa-file-import mr-2" />
          Import Excel
        </Button>
        
        <Button
          onClick={handleResetData}
          variant="destructive"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-0.5"
        >
          <i className="fas fa-redo mr-2" />
          Reset Data
        </Button>
      </div>
    </header>
  );
}