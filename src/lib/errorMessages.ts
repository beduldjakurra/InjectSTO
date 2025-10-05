// Error message localization
export const ErrorMessages = {
  // Image conversion errors
  imageConversion: {
    general: 'Gagal Mengkonversi: Terjadi kesalahan saat mengkonversi gambar.',
    tableNotFound: (tableName: string) => `Tabel ${tableName} tidak ditemukan. Pastikan Anda berada di halaman yang benar dan tabel telah dimuat.`,
    offline: 'Anda sedang offline. Fitur ini memerlukan koneksi internet.',
    colorParse: 'Gagal Mengkonversi: Terjadi kesalahan pada parsing warna. Silakan refresh halaman dan coba lagi.',
    timeout: 'Gagal Mengkonversi: Proses konversi terlalu lama. Silakan coba lagi dengan koneksi yang lebih stabil.',
    canvasError: 'Gagal Mengkonversi: Terjadi kesalahan saat rendering gambar. Pastikan tabel terlihat dengan baik di layar.',
    dataError: 'Gagal Mengkonversi: Tidak dapat menghasilkan gambar. Silakan refresh halaman dan coba lagi.',
    unknown: 'Gagal Mengkonversi: Terjadi kesalahan yang tidak diketahui.',
    oklchError: 'Gagal Mengkonversi: Attempting to parse an unsupported color function \'oklch\'',
  },
  
  // Data validation errors
  dataValidation: {
    actBoxUndefined: 'Error: can\'t access property 0, state.inputValues.actBox is undefined',
    jsonParse: 'JSON.parse: unexpected character at line 1 column 1 of the JSON data',
    initializationFailed: 'Gagal menginisialisasi data. Silakan refresh halaman.',
  },
  
  // Success messages
  success: {
    imageDownloaded: (fileSizeMB: string) => `JPG berhasil diunduh (${fileSizeMB} MB)`,
    dataSaved: 'Data berhasil disimpan.',
    dataImported: 'Data berhasil diimpor.',
    dataReset: 'Data berhasil direset.',
  },
  
  // Common actions
  actions: {
    saveToExcel: 'Save to Excel',
    importExcel: 'Import Excel',
    convertToJpg: 'Convert to JPG',
    resetData: 'Reset Data',
    retry: 'Coba Lagi',
    refresh: 'Refresh Halaman',
  }
} as const;

// Helper function to get error messages
export const getErrorMessage = (type: keyof typeof ErrorMessages.imageConversion, detail?: string) => {
  const message = ErrorMessages.imageConversion[type];
  if (typeof message === 'function' && detail) {
    return message(detail);
  }
  return message;
};

// Helper function to get success messages
export const getSuccessMessage = (type: keyof typeof ErrorMessages.success, detail?: string) => {
  const message = ErrorMessages.success[type];
  if (typeof message === 'function' && detail) {
    return message(detail);
  }
  return message;
};