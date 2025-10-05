'use client';

import { useProductionStore } from '@/store/productionStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionTable from './ProductionTable';
import BoxCalculationTable from './BoxCalculationTable';
import StockStrengthTable from './StockStrengthTable';
import React, { useRef } from 'react';

// --- Tambahan untuk ekspor Excel/JPG ---
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

export default function TabNavigation() {
  const { currentView, setCurrentView } = useProductionStore();

  // Refs ke tabel
  const mainTableRef = useRef<HTMLTableElement>(null);
  const boxTableRef = useRef<HTMLTableElement>(null);
  const stockStrengthRef = useRef<HTMLTableElement>(null);

  const handleTabChange = (value: string) => {
    setCurrentView(value as 'main' | 'second' | 'third');
  };

  // Universal export handler
  const handleExport = async (type: 'excel' | 'jpg') => {
    let ref: React.RefObject<HTMLTableElement> | null = null;
    let title = '';
    if (currentView === 'main') {
      ref = mainTableRef;
      title = 'Stock Produksi';
    } else if (currentView === 'second') {
      ref = boxTableRef;
      title = 'Perhitungan Box';
    } else if (currentView === 'third') {
      ref = stockStrengthRef;
      title = 'Kekuatan Stock';
    }
    if (!ref?.current) {
      alert('Tabel aktif tidak ditemukan!');
      return;
    }
    if (type === 'excel') {
      const wb = XLSX.utils.table_to_book(ref.current, {sheet:"Sheet1"});
      XLSX.writeFile(wb, `${title}.xlsx`);
    } else {
      const canvas = await html2canvas(ref.current);
      const link = document.createElement('a');
      link.download = `${title}.jpg`;
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          className="btn btn-primary"
          onClick={() => handleExport('excel')}
        >
          <i className="fa fa-file-excel"></i> Ekspor Excel Tabel Aktif
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleExport('jpg')}
        >
          <i className="fa fa-file-image"></i> Ekspor JPG Tabel Aktif
        </button>
      </div>
      <Tabs value={currentView} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger 
            value="main" 
            className="data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            Stock Produksi
          </TabsTrigger>
          <TabsTrigger 
            value="second" 
            className="data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            Perhitungan Box
          </TabsTrigger>
          <TabsTrigger 
            value="third" 
            className="data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            Kekuatan Stock
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="mt-0">
          <ProductionTable ref={mainTableRef}/>
        </TabsContent>
        
        <TabsContent value="second" className="mt-0">
          <BoxCalculationTable ref={boxTableRef}/>
        </TabsContent>
        
        <TabsContent value="third" className="mt-0">
          <StockStrengthTable ref={stockStrengthRef}/>
        </TabsContent>
      </Tabs>
    </>
  );
}