import html2canvas from 'html2canvas';
import { useProductionStore } from '@/store/productionStore';
import { ErrorMessages, getErrorMessage } from '@/lib/errorMessages';

export class ImageManager {
  static async captureStockProductionTable(): Promise<void> {
    try {
      const store = useProductionStore.getState();
      const { isNightMode, currentView, currentSheet } = store;
      
      // Check if we're online
      if (!navigator.onLine) {
        throw new Error(ErrorMessages.imageConversion.offline);
      }
      
      // Wait longer for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the target table container based on current view
      let targetContainer = null;
      let tableName = '';
      
      switch (currentView) {
        case 'main':
          // Find the ProductionTable container - multiple methods
          targetContainer = document.querySelector('[data-value="main"]') || 
                           document.querySelector('[data-state="active"][data-value="main"]') ||
                           document.getElementById('mainTable')?.closest('[role="tabpanel"]') ||
                           document.getElementById('mainTable')?.closest('div') ||
                           document.querySelector('table[id="mainTable"]')?.parentElement;
          tableName = 'Stock Produksi';
          break;
        case 'second':
          // Find the BoxCalculationTable container
          targetContainer = document.querySelector('[data-value="second"]') || 
                           document.querySelector('[data-state="active"][data-value="second"]') ||
                           document.getElementById('boxCalculationTable')?.closest('[role="tabpanel"]') ||
                           document.getElementById('boxCalculationTable')?.closest('div') ||
                           document.querySelector('table[id="boxCalculationTable"]')?.parentElement;
          tableName = 'Perhitungan Box';
          break;
        case 'third':
          // Find the StockStrengthTable container
          targetContainer = document.querySelector('[data-value="third"]') || 
                           document.querySelector('[data-state="active"][data-value="third"]') ||
                           document.getElementById('stockStrengthTable')?.closest('[role="tabpanel"]') ||
                           document.getElementById('stockStrengthTable')?.closest('div') ||
                           document.querySelector('table[id="stockStrengthTable"]')?.parentElement;
          tableName = 'Kekuatan Stock';
          break;
        default:
          targetContainer = document.querySelector('[data-value="main"]') || 
                           document.getElementById('mainTable')?.closest('div');
          tableName = 'Stock Produksi';
      }
      
      // Fallback: find the active tab content
      if (!targetContainer) {
        const activeTab = document.querySelector('[data-state="active"]');
        if (activeTab) {
          const tabValue = activeTab.getAttribute('data-value');
          if (tabValue) {
            targetContainer = document.querySelector(`[data-value="${tabValue}"]`);
            tableName = tabValue === 'main' ? 'Stock Produksi' : 
                       tabValue === 'second' ? 'Perhitungan Box' : 'Kekuatan Stock';
          }
        }
      }
      
      // Final fallback: find any table container
      if (!targetContainer) {
        const tables = document.querySelectorAll('table');
        if (tables.length > 0) {
          targetContainer = tables[0].closest('div');
          console.warn('Using fallback table container');
        }
      }
      
      if (!targetContainer) {
        console.error('Target container not found. Current view:', currentView);
        console.error('Available elements:', {
          mainTable: document.getElementById('mainTable'),
          boxCalculationTable: document.getElementById('boxCalculationTable'),
          stockStrengthTable: document.getElementById('stockStrengthTable'),
          activeTabs: document.querySelectorAll('[data-state="active"]'),
          allTabs: document.querySelectorAll('[data-value]')
        });
        throw new Error(getErrorMessage('tableNotFound', tableName));
      }
      
      // Save current night mode state
      const originalNightMode = isNightMode;
      
      // Force light mode for best image quality
      if (originalNightMode) {
        document.body.classList.remove('dark');
        // Wait for theme change to apply
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Create full-screen wrapper for browser-like capture
      const wrapper = document.createElement('div');
      wrapper.className = 'browser-capture-wrapper';
      wrapper.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #ffffff;
        z-index: 99999;
        overflow: auto;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      `;
      
      // Create header section
      const headerSection = document.createElement('div');
      headerSection.className = 'capture-header-section';
      headerSection.style.cssText = `
        background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #4c1d95 100%);
        color: white;
        padding: 40px 20px;
        text-align: center;
        position: relative;
        overflow: hidden;
      `;
      
      // Add decorative elements
      headerSection.innerHTML = `
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1;">
          <div style="position: absolute; top: 10%; left: 5%; width: 200px; height: 200px; background: white; border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 10%; right: 5%; width: 150px; height: 150px; background: white; border-radius: 50%;"></div>
        </div>
        <div style="position: relative; z-index: 1;">
          <h1 style="font-size: 36px; font-weight: bold; margin-bottom: 12px; text-shadow: 0 4px 8px rgba(0,0,0,0.3);">
            PT FUJI SEAT INDONESIA
          </h1>
          <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 8px; opacity: 0.95;">
            Laporan Data Stock Akhir Proses Div.INJECTION
          </h2>
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; opacity: 0.9;">
            ${tableName} - Sheet ${currentSheet}
          </h3>
          <div style="display: flex; justify-content: center; gap: 30px; font-size: 16px; opacity: 0.85;">
            <span><strong>Shift:</strong> ${originalNightMode ? 'NIGHT' : 'DAY'}</span>
            <span><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span><strong>Waktu:</strong> ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      `;
      wrapper.appendChild(headerSection);
      
      // Create content section
      const contentSection = document.createElement('div');
      contentSection.className = 'capture-content-section';
      contentSection.style.cssText = `
        padding: 40px 20px;
        background: #ffffff;
        min-height: calc(100vh - 200px);
      `;
      
      // Clone the target container
      const containerClone = targetContainer.cloneNode(true) as HTMLElement;
      containerClone.style.cssText = `
        max-width: 1400px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      `;
      
      // Find and style the table within the cloned container
      const table = containerClone.querySelector('table');
      if (table) {
        // Apply comprehensive table styling
        table.style.cssText = `
          width: 100%;
          border-collapse: collapse;
          font-size: 16px;
          background: #ffffff;
          border: 3px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          margin: 0;
        `;
        
        // Remove any problematic classes
        table.className = '';
        
        // Style caption
        const caption = table.querySelector('caption');
        if (caption) {
          const captionElement = caption as HTMLElement;
          captionElement.style.cssText = `
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            font-size: 20px;
            font-weight: bold;
            padding: 20px;
            text-align: center;
            margin: 0;
            border-bottom: 3px solid #1d4ed8;
            text-transform: uppercase;
            letter-spacing: 1px;
          `;
          captionElement.innerHTML = `${tableName} - Sheet ${currentSheet}`;
        }
        
        // Style headers with enhanced design
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(th => {
          const element = th as HTMLElement;
          element.className = '';
          element.style.cssText = `
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            color: #ffffff !important;
            font-weight: 700;
            padding: 18px 16px;
            text-align: center;
            border: 2px solid #1d4ed8 !important;
            font-size: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            white-space: nowrap;
            position: relative;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          `;
        });
        
        // Style data cells with enhanced readability
        const dataCells = table.querySelectorAll('tbody td');
        dataCells.forEach(td => {
          const element = td as HTMLElement;
          const text = element.textContent || '';
          
          // Base styling
          element.className = '';
          element.style.cssText = `
            padding: 16px 12px;
            text-align: center;
            border-bottom: 2px solid #f3f4f6 !important;
            border-left: 2px solid #f3f4f6 !important;
            border-right: 2px solid #f3f4f6 !important;
            background: #ffffff !important;
            font-size: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1f2937 !important;
            vertical-align: middle;
            transition: all 0.2s ease;
          `;
          
          // KODE INJECT cells
          if (text.match(/J-\d+|136B|202B/)) {
            element.style.textAlign = 'left';
            element.style.fontWeight = 'bold';
            element.style.paddingLeft = '20px';
            element.style.backgroundColor = '#f8fafc !important';
            element.style.fontFamily = 'Courier New, monospace';
            element.style.fontSize = '16px';
            element.style.color = '#1e40af !important';
          }
          
          // Positive values
          if (text.match(/^\d+$/) && parseInt(text) > 0) {
            element.style.color = '#059669 !important';
            element.style.fontWeight = 'bold';
            element.style.backgroundColor = '#ecfdf5 !important';
            element.style.fontSize = '16px';
          }
          
          // Negative values
          if (text.match(/^-\d+$/)) {
            element.style.color = '#dc2626 !important';
            element.style.fontWeight = 'bold';
            element.style.backgroundColor = '#fef2f2 !important';
            element.style.fontSize = '16px';
          }
          
          // Decimal values
          if (text.match(/^\d+\.\d+$/) && parseFloat(text) > 0) {
            element.style.color = '#059669 !important';
            element.style.fontWeight = 'bold';
            element.style.backgroundColor = '#ecfdf5 !important';
            element.style.fontSize = '16px';
          }
          
          // Zero values
          if (text === '0' || text === '0.00') {
            element.style.color = '#6b7280 !important';
            element.style.fontWeight = '500';
          }
          
          // Empty values
          if (text === '-' || text.trim() === '') {
            element.style.color = '#9ca3af !important';
            element.style.fontStyle = 'italic';
          }
          
          // Input fields - convert to displayed values
          const input = element.querySelector('input');
          if (input) {
            const inputValue = input.value || '';
            element.style.backgroundColor = '#f9fafb !important';
            element.style.border = '2px solid #d1d5db';
            element.style.borderRadius = '6px';
            element.style.fontWeight = '600';
            
            if (input.type === 'text' && inputValue.includes(',')) {
              element.textContent = inputValue || '-';
            } else if (input.type === 'number' || input.type === 'text') {
              element.textContent = inputValue || '0';
            } else {
              element.textContent = inputValue || '-';
            }
            
            if (!inputValue) {
              element.style.color = '#d1d5db !important';
              element.style.fontStyle = 'italic';
            }
          }
        });
        
        // Style table rows with alternating colors
        const tableRows = table.querySelectorAll('tbody tr');
        tableRows.forEach((row, index) => {
          const element = row as HTMLElement;
          if (index % 2 === 0) {
            element.style.backgroundColor = '#f9fafb';
          }
          element.style.transition = 'background-color 0.2s ease';
        });
      }
      
      contentSection.appendChild(containerClone);
      wrapper.appendChild(contentSection);
      
      // Create footer section
      const footerSection = document.createElement('div');
      footerSection.className = 'capture-footer-section';
      footerSection.style.cssText = `
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        color: white;
        padding: 30px 20px;
        text-align: center;
        border-top: 3px solid #374151;
      `;
      
      footerSection.innerHTML = `
        <div style="max-width: 1400px; margin: 0 auto;">
          <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">
            © 2025 Laporan Produksi Harian - PT Fuji Seat Indonesia
          </p>
          <p style="font-size: 14px; opacity: 0.8; margin-bottom: 4px;">
            Dibuat pada: ${new Date().toLocaleString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
          <p style="font-size: 12px; opacity: 0.6;">
            Generated by Production Management System v2.0 | Sheet ${currentSheet} | View: ${currentView}
          </p>
        </div>
      `;
      wrapper.appendChild(footerSection);
      
      // Add wrapper to body
      document.body.appendChild(wrapper);
      
      // Wait for wrapper to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Capture with html2canvas using full browser dimensions
        const canvas = await html2canvas(wrapper, {
          backgroundColor: '#ffffff',
          scale: 3, // Higher scale for better quality
          useCORS: true,
          logging: false,
          allowTaint: false,
          width: window.innerWidth,
          height: wrapper.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          foreignObjectRendering: false,
          removeContainer: false,
          imageTimeout: 45000,
          windowWidth: window.innerWidth,
          windowHeight: wrapper.scrollHeight,
          onclone: (clonedDoc) => {
            // Clean up cloned document
            const clonedWrapper = clonedDoc.querySelector('.browser-capture-wrapper') as HTMLElement;
            if (clonedWrapper) {
              const allElements = clonedWrapper.querySelectorAll('*');
              allElements.forEach(el => {
                const element = el as HTMLElement;
                if (element.style) {
                  element.style.removeProperty('filter');
                  element.style.removeProperty('backdrop-filter');
                  element.style.removeProperty('mix-blend-mode');
                  element.style.removeProperty('isolation');
                  element.style.removeProperty('color-scheme');
                  
                  const computedStyle = window.getComputedStyle(element);
                  const color = computedStyle.color;
                  const backgroundColor = computedStyle.backgroundColor;
                  
                  if (color && color.includes('oklch')) {
                    element.style.color = '#1f2937';
                  }
                  if (backgroundColor && backgroundColor.includes('oklch')) {
                    element.style.backgroundColor = '#ffffff';
                  }
                }
              });
              
              const styleTags = clonedWrapper.querySelectorAll('style');
              styleTags.forEach(tag => {
                if (tag.textContent && tag.textContent.includes('oklch')) {
                  tag.remove();
                }
              });
            }
          }
        });
        
        // Remove wrapper
        if (document.body.contains(wrapper)) {
          document.body.removeChild(wrapper);
        }
        
        // Restore night mode
        if (originalNightMode) {
          document.body.classList.add('dark');
        }
        
        // Validate canvas
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error(ErrorMessages.imageConversion.canvasError);
        }
        
        // Convert to high-quality JPG with minimum 2MB target
        const targetSize = 2 * 1024 * 1024; // 2MB in bytes
        let quality = 1.0; // Start with maximum quality
        let imgData = canvas.toDataURL('image/jpeg', quality);
        
        // Calculate current file size
        const base64Data = imgData.split(',')[1];
        let currentSize = Math.round(base64Data.length * 0.75); // Approximate size
        
        console.log(`Initial image size: ${(currentSize / 1024 / 1024).toFixed(2)}MB at quality ${quality}`);
        
        // If image is too small, increase dimensions to reach minimum 2MB
        if (currentSize < targetSize) {
          console.log('Image too small, upscaling...');
          const scaleFactor = Math.sqrt(targetSize / currentSize);
          const newCanvas = document.createElement('canvas');
          const ctx = newCanvas.getContext('2d')!;
          const img = new Image();
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imgData;
          });
          
          const newWidth = Math.floor(canvas.width * scaleFactor);
          const newHeight = Math.floor(canvas.height * scaleFactor);
          
          newCanvas.width = newWidth;
          newCanvas.height = newHeight;
          
          // Use high-quality image scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          imgData = newCanvas.toDataURL('image/jpeg', 0.95);
          const newBase64Data = imgData.split(',')[1];
          currentSize = Math.round(newBase64Data.length * 0.75);
          
          console.log(`Upscaled image size: ${(currentSize / 1024 / 1024).toFixed(2)}MB`);
        }
        
        // If image is too large, reduce quality while maintaining minimum 2MB
        while (currentSize > targetSize * 2 && quality > 0.5) {
          quality -= 0.05;
          imgData = canvas.toDataURL('image/jpeg', quality);
          const newBase64Data = imgData.split(',')[1];
          currentSize = Math.round(newBase64Data.length * 0.75);
          console.log(`Reduced quality to ${quality}, size: ${(currentSize / 1024 / 1024).toFixed(2)}MB`);
        }
        
        // Validate final image data
        if (!imgData || imgData === 'data:,') {
          throw new Error(ErrorMessages.imageConversion.dataError);
        }
        
        // Download image with enhanced filename
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const fileName = `Laporan_${tableName.replace(/\s+/g, '_')}_Sheet${currentSheet}_${originalNightMode ? 'Night' : 'Day'}_${timestamp}.jpg`;
        
        link.download = fileName;
        link.href = imgData;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        const finalSizeMB = (currentSize / 1024 / 1024).toFixed(2);
        console.log(`✅ High-quality JPG downloaded: ${finalSizeMB}MB`);
        
        // Show success message
        if (typeof window !== 'undefined') {
          const successDiv = document.createElement('div');
          successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
            z-index: 100000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
          `;
          successDiv.innerHTML = `✅ Gambar berhasil diunduh (${finalSizeMB}MB)`;
          document.body.appendChild(successDiv);
          
          // Add animation keyframes
          const style = document.createElement('style');
          style.textContent = `
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `;
          document.head.appendChild(style);
          
          setTimeout(() => {
            if (document.body.contains(successDiv)) {
              document.body.removeChild(successDiv);
            }
            if (document.head.contains(style)) {
              document.head.removeChild(style);
            }
          }, 3000);
        }
        
      } catch (error) {
        // Clean up on error
        if (document.body.contains(wrapper)) {
          document.body.removeChild(wrapper);
        }
        
        // Restore night mode
        if (originalNightMode) {
          document.body.classList.add('dark');
        }
        
        // Enhanced error handling
        if (error instanceof Error) {
          if (error.message.includes('oklch') || error.message.includes('color') || error.message.includes('parse')) {
            throw new Error(ErrorMessages.imageConversion.colorParse);
          } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
            throw new Error(ErrorMessages.imageConversion.timeout);
          } else if (error.message.includes('canvas') || error.message.includes('render') || error.message.includes('ukuran kanvas tidak valid')) {
            throw new Error(ErrorMessages.imageConversion.canvasError);
          } else if (error.message.includes('data gambar')) {
            throw new Error(ErrorMessages.imageConversion.dataError);
          } else {
            throw new Error(ErrorMessages.imageConversion.general + ' ' + error.message);
          }
        } else {
          throw new Error(ErrorMessages.imageConversion.unknown);
        }
      }
      
    } catch (error) {
      console.error('Error capturing table:', error);
      
      // Provide more user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('oklch') || error.message.includes('color') || error.message.includes('parse')) {
          throw new Error(ErrorMessages.imageConversion.colorParse);
        } else if (error.message.includes('tidak ditemukan')) {
          throw error;
        } else if (error.message.includes('offline')) {
          throw error;
        } else {
          throw new Error(ErrorMessages.imageConversion.general + ' ' + error.message);
        }
      } else {
        throw new Error(ErrorMessages.imageConversion.unknown);
      }
    }
  }
}