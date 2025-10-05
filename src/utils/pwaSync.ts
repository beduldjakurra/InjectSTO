/**
 * PWA Data Sync Script
 * Ensures PWA constants are in sync with TypeScript constants
 */

import { KODE_INJECT, STDRT_PACK, N, APP_CONFIG } from '../constants/production.js';

// Verify data consistency
export function validatePWAData() {
  console.log('🔍 Validating PWA Data Consistency...');
  
  // Check if PWA constants match TypeScript constants
  const validationResults = {
    kodeInjectLength: KODE_INJECT.length === N,
    stdrtPackLength: STDRT_PACK.length === N,
    dataIntegrity: KODE_INJECT.length === STDRT_PACK.length
  };
  
  if (Object.values(validationResults).every(Boolean)) {
    console.log('✅ PWA Data Validation Passed');
    return true;
  } else {
    console.error('❌ PWA Data Validation Failed:', validationResults);
    return false;
  }
}

// Export for PWA usage
export const PWA_CONSTANTS = {
  KODE_INJECT,
  STDRT_PACK,
  N,
  APP_CONFIG
};

// Auto-validation on import
validatePWAData();