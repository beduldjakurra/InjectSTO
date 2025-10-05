'use client';

import { useProductionStore } from '@/store/productionStore';
import { Input } from '@/components/ui/input';
import { KODE_INJECT, STDRT_PACK, N } from '@/constants/production';
import { useEffect } from 'react';

export default function ProductionTable() {
  const {
    inputValues,
    actQtyValues,
    gapValues,
    updateInputValue,
    calculateGap
  } = useProductionStore();

  const handleInputChange = (field: keyof typeof inputValues, index: number, value: string) => {
    // Validate numeric input
    const cleanValue = value.replace(/[^0-9]/g, '');
    updateInputValue(field, index, cleanValue);
    
    // Recalculate GAP when relevant fields change
    if (['stockAwal', 'produksi', 'surcip', 'sunter', 'kiic'].includes(field)) {
      setTimeout(() => calculateGap(index), 100);
    }
  };

  const getGapClass = (value: number) => {
    if (value > 0) return 'text-green-600 font-bold';
    if (value < 0) return 'text-red-600 font-bold';
    return 'text-gray-600 font-semibold';
  };

  const getActQtyClass = (value: number) => {
    if (value > 0) return 'text-green-600 font-bold';
    return 'text-gray-600 font-semibold';
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <table id="mainTable" className="w-full border-collapse min-w-[900px]">
        <caption className="font-bold text-lg text-left p-4 text-blue-500 dark:text-blue-400 relative">
          Laporan Stock Produksi
          <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-blue-500" />
        </caption>
        
        <thead>
          <tr>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide sticky left-0 z-10 min-w-[120px]">
              KODE INJECT
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              STOCK AWAL
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              PRODUKSI
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              SURCIP
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              SUNTER
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              KIIC
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              ACT QTY
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              GAP
            </th>
          </tr>
        </thead>
        
        <tbody>
          {KODE_INJECT.map((kode, index) => (
            <tr
              key={kode}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <td className="p-3 text-left font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 sticky left-0 z-9 min-w-[120px] shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                {kode}
              </td>
              
              <td className="p-3 text-center border-b border-gray-200 dark:border-gray-700">
                <Input
                  type="number"
                  value={inputValues.stockAwal[index] || ''}
                  onChange={(e) => handleInputChange('stockAwal', index, e.target.value)}
                  className="w-full text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  min="0"
                  max="999999"
                />
              </td>
              
              <td className="p-3 text-center border-b border-gray-200 dark:border-gray-700">
                <Input
                  type="number"
                  value={inputValues.produksi[index] || ''}
                  onChange={(e) => handleInputChange('produksi', index, e.target.value)}
                  className="w-full text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  min="0"
                  max="999999"
                />
              </td>
              
              <td className="p-3 text-center border-b border-gray-200 dark:border-gray-700">
                <Input
                  type="number"
                  value={inputValues.surcip[index] || ''}
                  onChange={(e) => handleInputChange('surcip', index, e.target.value)}
                  className="w-full text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  min="0"
                  max="999999"
                />
              </td>
              
              <td className="p-3 text-center border-b border-gray-200 dark:border-gray-700">
                <Input
                  type="number"
                  value={inputValues.sunter[index] || ''}
                  onChange={(e) => handleInputChange('sunter', index, e.target.value)}
                  className="w-full text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  min="0"
                  max="999999"
                />
              </td>
              
              <td className="p-3 text-center border-b border-gray-200 dark:border-gray-700">
                <Input
                  type="number"
                  value={inputValues.kiic[index] || ''}
                  onChange={(e) => handleInputChange('kiic', index, e.target.value)}
                  className="w-full text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  min="0"
                  max="999999"
                />
              </td>
              
              <td className={`p-3 text-center border-b border-gray-200 dark:border-gray-700 ${getActQtyClass(actQtyValues[index] || 0)}`}>
                {actQtyValues[index] || '-'}
              </td>
              
              <td className={`p-3 text-center border-b border-gray-200 dark:border-gray-700 ${getGapClass(gapValues[index] || 0)}`}>
                {gapValues[index] || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}