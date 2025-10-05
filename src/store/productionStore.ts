import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, ProductionData, SheetData, SyncStatus } from '@/types/production';
import { KODE_INJECT, STDRT_PACK, N } from '@/constants/production';
import { SupabaseProductionService } from '@/lib/supabase-production';
import { supabase } from '@/lib/supabase';

const initialProductionData: ProductionData = {
  stockAwal: {},
  produksi: {},
  surcip: {},
  sunter: {},
  kiic: {},
  actBox: {},
  stockReguler: {},
  anzenStock: {},
  fc2d: {}
};

const initialState: Omit<AppState, 'sheetsData'> = {
  currentView: 'main',
  isNightMode: false,
  currentSheet: 1,
  inputValues: { ...initialProductionData },
  actQtyValues: {},
  gapValues: {},
  kekuatanStockValues: {},
  kekuatanAnzenValues: {}
};

// Supabase integration state
const supabaseState = {
  currentSessionId: null as string | null,
  isOnline: true,
  lastSyncTime: null as Date | null,
  realtimeChannel: null as any
};

interface ProductionStore extends AppState {
  // Supabase integration
  currentSessionId: string | null;
  isOnline: boolean;
  lastSyncTime: Date | null;
  
  // Actions
  setCurrentView: (view: 'main' | 'second' | 'third') => void;
  toggleNightMode: () => void;
  setNightMode: (isNightMode: boolean) => void;
  updateInputValue: (field: keyof ProductionData, index: number, value: string) => void;
  updateActBoxValue: (index: number, value: string) => void;
  calculateActQty: (index: number) => void;
  calculateGap: (index: number) => void;
  calculateKekuatanStock: (index: number) => void;
  calculateAllValues: () => void;
  resetData: () => void;
  saveCurrentSheetData: () => void;
  loadSheetData: (sheetNumber: number) => void;
  getDeviceId: () => string;
  syncStatus: SyncStatus;
  updateSyncStatus: (status: SyncStatus) => void;
  
  // Supabase methods
  initializeSession: (userId: string) => Promise<void>;
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
}

export const useProductionStore = create<ProductionStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      sheetsData: { 
        1: {
          inputValues: { ...initialProductionData },
          actQtyValues: {},
          gapValues: {},
          kekuatanStockValues: {},
          kekuatanAnzenValues: {}
        }, 
        2: {
          inputValues: { ...initialProductionData },
          actQtyValues: {},
          gapValues: {},
          kekuatanStockValues: {},
          kekuatanAnzenValues: {}
        }
      },
      syncStatus: {
        status: 'synced',
        message: 'Tersinkronisasi',
        errorCount: 0
      },

      setCurrentView: (view) => set({ currentView: view }),

      toggleNightMode: () => {
        const state = get();
        const newNightMode = !state.isNightMode;
        
        // Save current sheet data before switching
        state.saveCurrentSheetData();
        
        // Switch to appropriate sheet
        const newSheet = newNightMode ? 2 : 1;
        
        set({
          isNightMode: newNightMode,
          currentSheet: newSheet
        });
        
        // Load new sheet data
        state.loadSheetData(newSheet);
      },

      setNightMode: (isNightMode) => {
        const state = get();
        
        if (state.isNightMode !== isNightMode) {
          state.saveCurrentSheetData();
          
          const newSheet = isNightMode ? 2 : 1;
          
          set({
            isNightMode,
            currentSheet: newSheet
          });
          
          state.loadSheetData(newSheet);
        }
      },

      updateInputValue: (field, index, value) => {
        set((state) => ({
          inputValues: {
            ...state.inputValues,
            [field]: {
              ...(state.inputValues[field] || {}),
              [index]: value
            }
          }
        }));
      },

      updateActBoxValue: (index, value) => {
        set((state) => ({
          inputValues: {
            ...state.inputValues,
            actBox: {
              ...(state.inputValues.actBox || {}),
              [index]: value
            }
          }
        }));
        
        // Calculate ACT QTY after updating ACT/BOX
        get().calculateActQty(index);
      },

      calculateActQty: (index) => {
        const state = get();
        
        // Ensure inputValues exists and is properly initialized
        if (!state.inputValues) {
          set((prevState) => ({
            inputValues: { ...initialProductionData }
          }));
        }
        
        // Get fresh state after potential update
        const freshState = get();
        
        // Ensure actBox exists and is properly initialized
        if (!freshState.inputValues.actBox) {
          set((prevState) => ({
            inputValues: {
              ...prevState.inputValues,
              actBox: {}
            }
          }));
        }
        
        // Get final fresh state
        const finalState = get();
        
        // Double-check actBox exists before accessing
        if (!finalState.inputValues.actBox) {
          console.error('actBox is still undefined after initialization');
          return;
        }
        
        const actBoxInput = finalState.inputValues.actBox[index] || '0';
        
        // Process ACT/BOX input to get total
        const totalActBox = processActBoxInput(actBoxInput);
        const stdrtPack = STDRT_PACK[index] || 0;
        const actQty = stdrtPack * totalActBox;
        
        set((prevState) => ({
          actQtyValues: {
            ...prevState.actQtyValues,
            [index]: isNaN(actQty) ? 0 : actQty
          }
        }));
        
        // Calculate GAP after ACT QTY is updated
        get().calculateGap(index);
      },

      calculateGap: (index) => {
        const state = get();
        
        // Ensure inputValues exists
        if (!state.inputValues) {
          return;
        }
        
        const sa = parseInt(state.inputValues.stockAwal?.[index] || '0');
        const p = parseInt(state.inputValues.produksi?.[index] || '0');
        const s = parseInt(state.inputValues.surcip?.[index] || '0');
        const su = parseInt(state.inputValues.sunter?.[index] || '0');
        const k = parseInt(state.inputValues.kiic?.[index] || '0');
        const aq = state.actQtyValues[index] || 0;
        
        // GAP formula: ACT QTY - (STOCK AWAL + PRODUKSI - SURCIP - SUNTER - KIIC)
        const gap = aq - (sa + p - s - su - k);
        
        set((prevState) => ({
          gapValues: {
            ...prevState.gapValues,
            [index]: isNaN(gap) ? 0 : gap
          }
        }));
      },

      calculateKekuatanStock: (index) => {
        const state = get();
        
        // Ensure inputValues exists
        if (!state.inputValues) {
          return;
        }
        
        const stockReguler = parseFloat(state.actQtyValues[index]?.toString() || '0');
        const anzenStock = parseFloat(state.inputValues.anzenStock?.[index] || '0');
        const fc2d = parseFloat(state.inputValues.fc2d?.[index] || '0');
        
        let kekuatanStock = 0;
        let kekuatanAnzen = 0;
        
        if (fc2d > 0 && !isNaN(fc2d)) {
          kekuatanStock = stockReguler / fc2d;
          kekuatanAnzen = anzenStock / fc2d;
        }
        
        set((prevState) => ({
          kekuatanStockValues: {
            ...prevState.kekuatanStockValues,
            [index]: isNaN(kekuatanStock) ? 0 : kekuatanStock
          },
          kekuatanAnzenValues: {
            ...prevState.kekuatanAnzenValues,
            [index]: isNaN(kekuatanAnzen) ? 0 : kekuatanAnzen
          }
        }));
      },

      calculateAllValues: () => {
        const state = get();
        
        // Calculate all ACT QTY
        for (let i = 0; i < N; i++) {
          state.calculateActQty(i);
        }
        
        // Calculate all kekuatan stock
        for (let i = 0; i < N; i++) {
          state.calculateKekuatanStock(i);
        }
      },

      resetData: () => {
        set({
          inputValues: { ...initialProductionData },
          actQtyValues: {},
          gapValues: {},
          kekuatanStockValues: {},
          kekuatanAnzenValues: {}
        });
      },

      saveCurrentSheetData: () => {
        const state = get();
        const sheetData: SheetData = {
          inputValues: { ...state.inputValues },
          actQtyValues: { ...state.actQtyValues },
          gapValues: { ...state.gapValues },
          kekuatanStockValues: { ...state.kekuatanStockValues },
          kekuatanAnzenValues: { ...state.kekuatanAnzenValues }
        };
        
        set((prevState) => ({
          sheetsData: {
            ...prevState.sheetsData,
            [state.currentSheet]: sheetData
          }
        }));
      },

      loadSheetData: (sheetNumber) => {
        const state = get();
        let sheetData = state.sheetsData[sheetNumber];
        
        // If sheet data doesn't exist, create empty data
        if (!sheetData) {
          sheetData = {
            inputValues: { ...initialProductionData },
            actQtyValues: {},
            gapValues: {},
            kekuatanStockValues: {},
            kekuatanAnzenValues: {}
          };
        }
        
        // Ensure inputValues exists and is properly initialized
        if (!sheetData.inputValues) {
          sheetData.inputValues = { ...initialProductionData };
        }
        
        // Ensure actBox is properly initialized in the loaded data
        const inputValues = {
          ...sheetData.inputValues,
          actBox: sheetData.inputValues.actBox || {}
        };
        
        // Validate all required properties exist
        const validatedInputValues = {
          ...inputValues,
          actBox: inputValues.actBox || {},
          planQty: inputValues.planQty || {},
          actQty: inputValues.actQty || {},
          balance: inputValues.balance || {}
        };
        
        set({
          inputValues: validatedInputValues,
          actQtyValues: { ...(sheetData.actQtyValues || {}) },
          gapValues: { ...(sheetData.gapValues || {}) },
          kekuatanStockValues: { ...(sheetData.kekuatanStockValues || {}) },
          kekuatanAnzenValues: { ...(sheetData.kekuatanAnzenValues || {}) },
          currentSheet: sheetNumber
        });
        
        // Recalculate all values after loading
        setTimeout(() => {
          state.calculateAllValues();
        }, 100);
      },

      getDeviceId: () => {
        if (typeof window !== 'undefined') {
          let deviceId = localStorage.getItem('deviceId');
          if (!deviceId) {
            deviceId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            localStorage.setItem('deviceId', deviceId);
          }
          return deviceId;
        }
        return 'unknown';
      },

      updateSyncStatus: (status) => {
        set({ syncStatus: status });
      }
    }),
    {
      name: 'production-store',
      partialize: (state) => ({
        sheetsData: state.sheetsData,
        currentSheet: state.currentSheet,
        isNightMode: state.isNightMode
      })
    }
  )
);

// Helper function to process ACT/BOX input
function processActBoxInput(value: string): number {
  if (!value || value.trim() === '') return 0;
  
  const parts = value.split(',');
  let sum = 0;
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    if (trimmedPart === '') continue;
    
    const num = parseFloat(trimmedPart);
    if (!isNaN(num)) {
      sum += num;
    }
  }
  
  return sum;
}