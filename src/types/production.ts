export interface ProductionData {
  stockAwal: Record<number, string>;
  produksi: Record<number, string>;
  surcip: Record<number, string>;
  sunter: Record<number, string>;
  kiic: Record<number, string>;
  actBox: Record<number, string>;
  stockReguler: Record<number, string>;
  anzenStock: Record<number, string>;
  fc2d: Record<number, string>;
}

export interface CalculatedValues {
  actQtyValues: Record<number, number>;
  gapValues: Record<number, number>;
  kekuatanStockValues: Record<number, number>;
  kekuatanAnzenValues: Record<number, number>;
}

export interface SheetData {
  inputValues: ProductionData;
  actQtyValues: Record<number, number>;
  gapValues: Record<number, number>;
  kekuatanStockValues: Record<number, number>;
  kekuatanAnzenValues: Record<number, number>;
}

export interface AppState {
  currentView: 'main' | 'second' | 'third';
  isNightMode: boolean;
  currentSheet: number;
  sheetsData: Record<number, SheetData>;
  inputValues: ProductionData;
  actQtyValues: Record<number, number>;
  gapValues: Record<number, number>;
  kekuatanStockValues: Record<number, number>;
  kekuatanAnzenValues: Record<number, number>;
}

export interface SyncStatus {
  status: 'syncing' | 'synced' | 'error';
  message: string;
  errorCount: number;
}

export interface DeviceInfo {
  deviceId: string;
  timestamp: string;
  userAgent: string;
  url: string;
}