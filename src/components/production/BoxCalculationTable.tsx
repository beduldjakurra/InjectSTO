'use client';

import { useProductionStore } from '@/store/productionStore';
import { Input } from '@/components/ui/input';
import { KODE_INJECT, STDRT_PACK, N } from '@/constants/production';
import { useEffect } from 'react';

export default function BoxCalculationTable() {
  const {
    inputValues,
    actQtyValues,
    updateActBoxValue
  } = useProductionStore();

  const handleActBoxChange = (index: number, value: string) => {
    // Allow numbers and commas only
    let cleanValue = value.replace(/[^0-9,]/g, '');
    
    // Prevent comma at the beginning
    if (cleanValue.startsWith(',')) {
      cleanValue = cleanValue.substring(1);
    }
    
    // Prevent consecutive commas
    cleanValue = cleanValue.replace(/,+/g, ',');
    
    updateActBoxValue(index, cleanValue);
  };

  const handleActBoxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const input = e.currentTarget;
    const value = input.value;
    const cursorPos = input.selectionStart || 0;
    
    // Prevent comma if at beginning or if previous character is comma
    if (e.key === ',') {
      if (cursorPos === 0 || (cursorPos > 0 && value[cursorPos - 1] === ',')) {
        e.preventDefault();
        return;
      }
    }
  };

  const handleActBoxBlur = (index: number, value: string) => {
    // Remove trailing comma
    let cleanValue = value.replace(/,+$/, '');
    updateActBoxValue(index, cleanValue);
  };

  const getActQtyClass = (value: number) => {
    if (value > 0) return 'text-green-600 font-bold';
    return 'text-gray-600 font-semibold';
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <table id="boxCalculationTable" className="w-full border-collapse min-w-[900px]">
        <caption className="font-bold text-lg text-left p-4 text-blue-500 dark:text-blue-400 relative">
          Perhitungan Box
          <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-blue-500" />
        </caption>
        
        <thead>
          <tr>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide sticky left-0 z-10 min-w-[120px]">
              KODE INJECT
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              STDRT PACK
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              ACT /BOX
            </th>
            <th className="p-3 text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-sm uppercase tracking-wide min-w-[100px]">
              ACT QTY
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
                {STDRT_PACK[index]}
              </td>
              
              <td className="p-3 text-center border-b border-gray-200 dark:border-gray-700">
                <Input
                  type="text"
                  value={inputValues.actBox[index] || ''}
                  onChange={(e) => handleActBoxChange(index, e.target.value)}
                  onKeyDown={(e) => handleActBoxKeyDown(e, index)}
                  onBlur={(e) => handleActBoxBlur(index, e.target.value)}
                  className="w-full text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  placeholder="Contoh: 10,20,30"
                />
              </td>
              
              <td className={`p-3 text-center border-b border-gray-200 dark:border-gray-700 ${getActQtyClass(actQtyValues[index] || 0)}`}>
                {actQtyValues[index] || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}