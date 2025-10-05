import * as XLSX from 'xlsx';
import { useProductionStore } from '@/store/productionStore';
import { KODE_INJECT, STDRT_PACK } from '@/constants/production';

export class ExcelManager {
  static saveToExcel() {
    try {
      const store = useProductionStore.getState();
      const { inputValues, actQtyValues, gapValues, kekuatanStockValues, kekuatanAnzenValues, isNightMode } = store;
      
      const wb = XLSX.utils.book_new();
      
      // Style for borders
      const borderStyle = {
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
      
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4361EE" } },
        alignment: { horizontal: "center" },
        border: borderStyle.border
      };
      
      // Sheet 1: Production
      const data1 = [['KODE INJECT', 'STOCK AWAL', 'PRODUKSI', 'SURCIP', 'SUNTER', 'KIIC', 'ACT QTY', 'GAP']];
      for (let i = 0; i < KODE_INJECT.length; i++) {
        data1.push([
          KODE_INJECT[i],
          inputValues.stockAwal[i] || '',
          inputValues.produksi[i] || '',
          inputValues.surcip[i] || '',
          inputValues.sunter[i] || '',
          inputValues.kiic[i] || '',
          actQtyValues[i]?.toString() || '',
          gapValues[i]?.toString() || ''
        ]);
      }
      
      const ws1 = XLSX.utils.aoa_to_sheet(data1);
      
      // Apply header style
      for (let col = 0; col < data1[0].length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws1[cellAddress]) ws1[cellAddress] = {};
        ws1[cellAddress].s = headerStyle;
      }
      
      // Apply borders to all cells
      for (let row = 0; row < data1.length; row++) {
        for (let col = 0; col < data1[row].length; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws1[cellAddress]) ws1[cellAddress] = {};
          if (!ws1[cellAddress].s) ws1[cellAddress].s = {};
          ws1[cellAddress].s.border = borderStyle.border;
        }
      }
      
      XLSX.utils.book_append_sheet(wb, ws1, 'Production');
      
      // Sheet 2: Box Calculation
      const data2 = [['KODE INJECT', 'STDRT PACK', 'ACT /BOX', 'ACT QTY']];
      for (let i = 0; i < KODE_INJECT.length; i++) {
        data2.push([
          KODE_INJECT[i],
          STDRT_PACK[i]?.toString() || '',
          inputValues.actBox[i] || '',
          actQtyValues[i]?.toString() || ''
        ]);
      }
      
      const ws2 = XLSX.utils.aoa_to_sheet(data2);
      
      // Apply header style
      for (let col = 0; col < data2[0].length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws2[cellAddress]) ws2[cellAddress] = {};
        ws2[cellAddress].s = headerStyle;
      }
      
      // Apply borders to all cells
      for (let row = 0; row < data2.length; row++) {
        for (let col = 0; col < data2[row].length; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws2[cellAddress]) ws2[cellAddress] = {};
          if (!ws2[cellAddress].s) ws2[cellAddress].s = {};
          ws2[cellAddress].s.border = borderStyle.border;
        }
      }
      
      XLSX.utils.book_append_sheet(wb, ws2, 'Box Calculation');
      
      // Sheet 3: Stock Strength
      const data3 = [['KODE INJECT', 'STOCK REGULER', 'ANZEN STOCK', 'F/C 2D', 'KEKUATAN STOCK /DAY', 'KEKUATAN ANZEN STOCK /DAY']];
      for (let i = 0; i < KODE_INJECT.length; i++) {
        data3.push([
          KODE_INJECT[i],
          actQtyValues[i]?.toString() || '',
          inputValues.anzenStock[i] || '',
          inputValues.fc2d[i] || '',
          kekuatanStockValues[i]?.toString() || '',
          kekuatanAnzenValues[i]?.toString() || ''
        ]);
      }
      
      const ws3 = XLSX.utils.aoa_to_sheet(data3);
      
      // Apply header style
      for (let col = 0; col < data3[0].length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws3[cellAddress]) ws3[cellAddress] = {};
        ws3[cellAddress].s = headerStyle;
      }
      
      // Apply borders to all cells
      for (let row = 0; row < data3.length; row++) {
        for (let col = 0; col < data3[row].length; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws3[cellAddress]) ws3[cellAddress] = {};
          if (!ws3[cellAddress].s) ws3[cellAddress].s = {};
          ws3[cellAddress].s.border = borderStyle.border;
        }
      }
      
      XLSX.utils.book_append_sheet(wb, ws3, 'Stock Strength');
      
      // Save file
      const fileName = `Laporan_Produksi_${isNightMode ? 'Night' : 'Day'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      return fileName;
    } catch (error) {
      console.error('Error saving to Excel:', error);
      throw error;
    }
  }
  
  static importExcel(file: File, isThirdTable: boolean = false) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Tidak ada file yang dipilih.'));
        return;
      }
      
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        reject(new Error('File harus berformat .xlsx atau .xls.'));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Ukuran file terlalu besar. Maksimal 5MB.'));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            reject(new Error('File Excel tidak memiliki sheet.'));
            return;
          }
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
          
          if (jsonData.length < 2) {
            reject(new Error('File Excel tidak memiliki data yang cukup.'));
            return;
          }
          
          // Get headers
          const headers = jsonData[0].map(header => 
            header ? header.toString().trim().toUpperCase().replace(/\s+/g, ' ') : ''
          );
          
          let expectedHeaders: string[];
          let importCount = 0;
          
          if (isThirdTable) {
            expectedHeaders = ['KODE INJECT', 'STOCK REGULER', 'ANZEN STOCK', 'F/C 2D'];
            
            if (!expectedHeaders.every(header => headers.includes(header))) {
              reject(new Error('Format file Excel tidak sesuai. Pastikan kolom sesuai dengan template: KODE INJECT, STOCK REGULER, ANZEN STOCK, F/C 2D'));
              return;
            }
            
            // Process third table data
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (!row || row.length === 0) continue;
              
              const kodeInject = row[headers.indexOf('KODE INJECT')]?.toString().trim() || '';
              const index = KODE_INJECT.indexOf(kodeInject);
              
              if (index === -1) continue;
              
              const stockReguler = row[headers.indexOf('STOCK REGULER')]?.toString() || '';
              const anzenStock = row[headers.indexOf('ANZEN STOCK')]?.toString() || '';
              const fc2d = row[headers.indexOf('F/C 2D')]?.toString() || '';
              
              // Validate data
              if (stockReguler && isNaN(parseFloat(stockReguler))) continue;
              if (anzenStock && isNaN(parseFloat(anzenStock))) continue;
              if (fc2d && isNaN(parseFloat(fc2d))) continue;
              
              // Update store
              const store = useProductionStore.getState();
              store.updateInputValue('stockReguler', index, stockReguler);
              store.updateInputValue('anzenStock', index, anzenStock);
              store.updateInputValue('fc2d', index, fc2d);
              
              importCount++;
            }
          } else {
            expectedHeaders = ['KODE INJECT', 'STOCK AWAL', 'PRODUKSI', 'SURCIP', 'SUNTER', 'KIIC'];
            
            if (!expectedHeaders.every(header => headers.includes(header))) {
              reject(new Error('Format file Excel tidak sesuai. Pastikan kolom sesuai dengan template: KODE INJECT, STOCK AWAL, PRODUKSI, SURCIP, SUNTER, KIIC'));
              return;
            }
            
            // Process main table data
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (!row || row.length === 0) continue;
              
              const kodeInject = row[headers.indexOf('KODE INJECT')]?.toString().trim() || '';
              const index = KODE_INJECT.indexOf(kodeInject);
              
              if (index === -1) continue;
              
              const stockAwal = row[headers.indexOf('STOCK AWAL')]?.toString() || '';
              const produksi = row[headers.indexOf('PRODUKSI')]?.toString() || '';
              const surcip = row[headers.indexOf('SURCIP')]?.toString() || '';
              const sunter = row[headers.indexOf('SUNTER')]?.toString() || '';
              const kiic = row[headers.indexOf('KIIC')]?.toString() || '';
              
              // Validate data
              if (stockAwal && isNaN(parseFloat(stockAwal))) continue;
              if (produksi && isNaN(parseFloat(produksi))) continue;
              if (surcip && isNaN(parseFloat(surcip))) continue;
              if (sunter && isNaN(parseFloat(sunter))) continue;
              if (kiic && isNaN(parseFloat(kiic))) continue;
              
              // Update store
              const store = useProductionStore.getState();
              store.updateInputValue('stockAwal', index, stockAwal);
              store.updateInputValue('produksi', index, produksi);
              store.updateInputValue('surcip', index, surcip);
              store.updateInputValue('sunter', index, sunter);
              store.updateInputValue('kiic', index, kiic);
              
              importCount++;
            }
          }
          
          if (importCount === 0) {
            reject(new Error('Tidak ada data valid yang dapat diimpor.'));
            return;
          }
          
          // Recalculate all values
          const store = useProductionStore.getState();
          store.calculateAllValues();
          
          resolve(importCount);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Gagal membaca file Excel.'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
}