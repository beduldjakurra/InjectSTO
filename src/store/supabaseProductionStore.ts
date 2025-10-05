import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductionData } from '@/types/production';
import { KODE_INJECT, STDRT_PACK, N } from '@/constants/production';
import { SupabaseProductionService } from '@/lib/supabase-production';
import { supabase } from '@/lib/supabase';

interface SupabaseProductionState {
  // Session Management
  currentSessionId: string | null;
  sessionName: string;
  isOnline: boolean;
  lastSyncTime: Date | null;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  
  // UI State
  currentView: 'main' | 'second' | 'third';
  isNightMode: boolean;
  
  // Production Data
  productionData: Record<number, {
    kode_inject: string;
    inject_index: number;
    stock_awal: number;
    produksi: number;
    surcip: number;
    sunter: number;
    kiic: number;
    act_box: string;
    stdrt_pack: number;
    act_qty: number;
    gap_value: number;
    stock_reguler: number;
    anzen_stock: number;
    fc2d: number;
    kekuatan_stock: number;
    kekuatan_anzen: number;
  }>;
  
  // Real-time
  realtimeChannel: any;
  
  // Actions
  initializeSession: (userId: string, sessionName?: string) => Promise<void>;
  loadProductionData: () => Promise<void>;
  updateProductionValue: (index: number, field: string, value: string | number) => Promise<void>;
  calculateDerivedValues: (index: number) => Promise<void>;
  setCurrentView: (view: 'main' | 'second' | 'third') => void;
  toggleNightMode: () => void;
  syncToSupabase: () => Promise<void>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
  resetData: () => void;
}

const useSupabaseProductionStore = create<SupabaseProductionState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSessionId: null,
      sessionName: 'Default Session',
      isOnline: true,
      lastSyncTime: null,
      syncStatus: 'idle',
      currentView: 'main',
      isNightMode: false,
      productionData: {},
      realtimeChannel: null,

      // Initialize session
      initializeSession: async (userId: string, sessionName = 'Production Session') => {
        try {
          set({ syncStatus: 'syncing' });
          
          // Get or create active session
          let session = await SupabaseProductionService.getActiveSession(userId);
          
          if (!session) {
            session = await SupabaseProductionService.createSession(sessionName, userId);
            await SupabaseProductionService.initializeProductionData(session.id);
          }
          
          set({ 
            currentSessionId: session.id,
            sessionName: session.session_name,
            syncStatus: 'success',
            lastSyncTime: new Date()
          });
          
          // Load production data
          await get().loadProductionData();
          
          // Subscribe to real-time updates
          get().subscribeToRealtime();
          
        } catch (error) {
          console.error('Failed to initialize session:', error);
          set({ syncStatus: 'error' });
        }
      },

      // Load production data from Supabase
      loadProductionData: async () => {
        const { currentSessionId } = get();
        if (!currentSessionId) return;

        try {
          const data = await SupabaseProductionService.getProductionData(currentSessionId);
          const productionData: Record<number, any> = {};
          
          data.forEach((item) => {
            productionData[item.inject_index] = {
              kode_inject: item.kode_inject,
              inject_index: item.inject_index,
              stock_awal: item.stock_awal || 0,
              produksi: item.produksi || 0,
              surcip: item.surcip || 0,
              sunter: item.sunter || 0,
              kiic: item.kiic || 0,
              act_box: item.act_box || '',
              stdrt_pack: STDRT_PACK[item.inject_index] || 0,
              act_qty: item.act_qty || 0,
              gap_value: item.gap_value || 0,
              stock_reguler: item.stock_reguler || 0,
              anzen_stock: item.anzen_stock || 0,
              fc2d: item.fc2d || 0,
              kekuatan_stock: item.kekuatan_stock || 0,
              kekuatan_anzen: item.kekuatan_anzen || 0,
            };
          });
          
          set({ productionData, lastSyncTime: new Date() });
        } catch (error) {
          console.error('Failed to load production data:', error);
          set({ syncStatus: 'error' });
        }
      },

      // Update production value
      updateProductionValue: async (index: number, field: string, value: string | number) => {
        const { currentSessionId, productionData } = get();
        if (!currentSessionId) return;

        try {
          // Update local state immediately for responsiveness
          const updatedData = {
            ...productionData,
            [index]: {
              ...productionData[index],
              [field]: value
            }
          };
          set({ productionData: updatedData });

          // Update in Supabase
          await SupabaseProductionService.updateProductionData(
            currentSessionId,
            index,
            { [field]: value }
          );

          // Trigger calculations if needed
          if (['stock_awal', 'produksi', 'surcip', 'sunter', 'kiic', 'act_box', 'anzen_stock', 'fc2d'].includes(field)) {
            await get().calculateDerivedValues(index);
          }

          set({ lastSyncTime: new Date() });
        } catch (error) {
          console.error('Failed to update production value:', error);
          set({ syncStatus: 'error' });
        }
      },

      // Calculate derived values
      calculateDerivedValues: async (index: number) => {
        const { currentSessionId, productionData } = get();
        if (!currentSessionId || !productionData[index]) return;

        try {
          const data = productionData[index];
          
          // Calculate ACT QTY
          const actQty = SupabaseProductionService.calculateActQty(data.act_box, data.stdrt_pack);
          
          // Calculate GAP
          const gap = SupabaseProductionService.calculateGap(
            actQty,
            data.stock_awal,
            data.produksi,
            data.surcip,
            data.sunter,
            data.kiic
          );
          
          // Calculate Kekuatan Stock
          const kekuatanStock = SupabaseProductionService.calculateKekuatanStock(data.stock_reguler, data.fc2d);
          const kekuatanAnzen = SupabaseProductionService.calculateKekuatanAnzen(data.anzen_stock, data.fc2d);

          // Update calculated values
          const updates = {
            act_qty: actQty,
            gap_value: gap,
            stock_reguler: actQty, // Stock reguler = ACT QTY
            kekuatan_stock: kekuatanStock,
            kekuatan_anzen: kekuatanAnzen
          };

          // Update local state
          const updatedData = {
            ...productionData,
            [index]: {
              ...productionData[index],
              ...updates
            }
          };
          set({ productionData: updatedData });

          // Update in Supabase
          await SupabaseProductionService.updateProductionData(currentSessionId, index, updates);
          
        } catch (error) {
          console.error('Failed to calculate derived values:', error);
        }
      },

      // UI Actions
      setCurrentView: (view) => set({ currentView: view }),
      
      toggleNightMode: () => set((state) => ({ isNightMode: !state.isNightMode })),

      // Sync to Supabase
      syncToSupabase: async () => {
        const { currentSessionId } = get();
        if (!currentSessionId) return;

        try {
          set({ syncStatus: 'syncing' });
          await get().loadProductionData();
          set({ syncStatus: 'success', lastSyncTime: new Date() });
        } catch (error) {
          console.error('Sync failed:', error);
          set({ syncStatus: 'error' });
        }
      },

      // Real-time subscription
      subscribeToRealtime: () => {
        const { currentSessionId } = get();
        if (!currentSessionId) return;

        const channel = SupabaseProductionService.subscribeToProductionData(
          currentSessionId,
          (payload) => {
            console.log('Real-time update:', payload);
            // Reload data when changes occur
            get().loadProductionData();
          }
        );

        set({ realtimeChannel: channel });
      },

      unsubscribeFromRealtime: () => {
        const { realtimeChannel } = get();
        if (realtimeChannel) {
          supabase.removeChannel(realtimeChannel);
          set({ realtimeChannel: null });
        }
      },

      // Reset data
      resetData: () => {
        get().unsubscribeFromRealtime();
        set({
          currentSessionId: null,
          sessionName: 'Default Session',
          lastSyncTime: null,
          syncStatus: 'idle',
          productionData: {},
          realtimeChannel: null
        });
      }
    }),
    {
      name: 'supabase-production-store',
      partialize: (state) => ({
        currentSessionId: state.currentSessionId,
        sessionName: state.sessionName,
        isNightMode: state.isNightMode,
        currentView: state.currentView
      })
    }
  )
);

export default useSupabaseProductionStore;