'use client';

import { useProductionStore } from '@/store/productionStore';
import { Input } from '@/components/ui/input';
import { KODE_INJECT, N } from '@/constants/production';
import { useEffect } from 'react';

export default function StockStrengthTable() {
  const {
    inputValues,
    actQtyValues,
    kekuatanStockValues,
    kekuatanAnzenValues,
    updateInputValue,
    calculateKekuatanStock
  } = useProductionStore();

  const handleInputChange = (field: keyof typeof inputValues, index: number, value: string) => {
    // Validate numeric input
    let cleanValue = value;
    
    if (field === 'fc2d') {
      // Allow decimal for F/C 2D
      cleanValue = value.replace(/[^0-9.]/g, '');
      // Prevent multiple decimal points
      const decimalCount = (cleanValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        cleanValue = cleanValue.substring(0, cleanValue.lastIndexOf('.'));
      }
    } else {
      // Only integers for other fields
      cleanValue = value.replace(/[^0-9]/g, '');
    }
    
    updateInputValue(field, index, cleanValue);
    
    // Recalculate kekuatan stock when relevant fields change
    if (['anzenStock', 'fc2d'].includes(field)) {
      setTimeout(() => calculateKekuatanStock(index), 100);
    }
  };

  const getValueClass = (value: number) => {
    if (value > 0) return 'text-green-600 font-bold';
    if (value === 0) return 'text-gray-600 font-semibold';
    return 'text-gray-600 font-semibold';
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <table id="stockStrengthTable" className="w-full border-collapse min-w-[900px]">
        <caption className="font-bold text-lg text-left p-4 text-blue-500 dark:text-blue-400 relative">
          Kekuatan Stock
          <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-blue-500" />
        </caption>
        
        <thead>
          <tr>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide sticky left-0 z-10 min-w-[120px]">
              KODE INJECT
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              STOCK REGULER
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              ANZEN STOCK
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              F/C 2D
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[120px]">
              KEKUATAN STOCK /DAY
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[140px]">
              KEKUATAN ANZEN STOCK /DAY
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
              
              <td className={`p-3 text-center border-b border-gray-200 dark:border-gray-700 ${getValueClass(actQtyValues[index] || 0)}`}>
                {actQtyValues[index] || 0}
              </td>
              
              <td className="p-3 text-center border-b border-gray-200 dark:border-gray-700">
                <Input
                  type="number"
                  value={inputValues.anzenStock[index] || ''}
                  onChange={(e) => handleInputChange('anzenStock', index, e.target.value)}
                  className="w-full text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  min="0"
                  max="999999"
                />
              </td>
              
              <td className="p-3 text-center border-b border-gray-200 dark:border-gray-700">
                <Input
                  type="text"
                  value={inputValues.fc2d[index] || ''}
                  onChange={(e) => handleInputChange('fc2d', index, e.target.value)}
                  className="w-full text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  min="0"
                  max="999999"
                  step="0.01"
                />
              </td>
              
              <td className={`p-3 text-center border-b border-gray-200 dark:border-gray-700 ${getValueClass(kekuatanStockValues[index] || 0)}`}>
                {kekuatanStockValues[index] !== undefined && !isNaN(kekuatanStockValues[index]) 
                  ? kekuatanStockValues[index].toFixed(2) 
                  : '-'
                }
              </td>
              
              <td className={`p-3 text-center border-b border-gray-200 dark:border-gray-700 ${getValueClass(kekuatanAnzenValues[index] || 0)}`}>
                {kekuatanAnzenValues[index] !== undefined && !isNaN(kekuatanAnzenValues[index]) 
                  ? kekuatanAnzenValues[index].toFixed(2) 
                  : '-'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}