import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { KODE_INJECT } from '@/constants/production'

type ProductionData = Database['public']['Tables']['production_data']['Row']
type ProductionInsert = Database['public']['Tables']['production_data']['Insert']
type ProductionUpdate = Database['public']['Tables']['production_data']['Update']

export class SupabaseProductionService {
  // Create new production session
  static async createSession(sessionName: string, userId: string) {
    const { data, error } = await supabase
      .from('production_sessions')
      .insert({
        session_name: sessionName,
        created_by: userId,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get active session for user
  static async getActiveSession(userId: string) {
    const { data, error } = await supabase
      .from('production_sessions')
      .select('*')
      .eq('created_by', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Initialize production data for session
  static async initializeProductionData(sessionId: string) {
    const initialData: ProductionInsert[] = KODE_INJECT.map((kode, index) => ({
      session_id: sessionId,
      kode_inject: kode,
      inject_index: index,
      stock_awal: 0,
      produksi: 0,
      surcip: 0,
      sunter: 0,
      kiic: 0,
      act_box: '',
      stdrt_pack: 0,
      act_qty: 0,
      gap_value: 0,
      stock_reguler: 0,
      anzen_stock: 0,
      fc2d: 0,
      kekuatan_stock: 0,
      kekuatan_anzen: 0
    }))

    const { data, error } = await supabase
      .from('production_data')
      .insert(initialData)
      .select()

    if (error) throw error
    return data
  }

  // Get production data for session
  static async getProductionData(sessionId: string) {
    const { data, error } = await supabase
      .from('production_data')
      .select('*')
      .eq('session_id', sessionId)
      .order('inject_index', { ascending: true })

    if (error) throw error
    return data
  }

  // Update production data
  static async updateProductionData(
    sessionId: string,
    injectIndex: number,
    updates: Partial<ProductionUpdate>
  ) {
    const { data, error } = await supabase
      .from('production_data')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .eq('inject_index', injectIndex)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Real-time subscription to production data changes
  static subscribeToProductionData(
    sessionId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel('production_data_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'production_data',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe()
  }

  // Get user settings
  static async getUserSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Update user settings
  static async updateUserSettings(
    userId: string,
    settings: {
      is_night_mode?: boolean
      current_view?: string
      last_session_id?: string
    }
  ) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Calculate derived values
  static calculateActQty(actBoxValue: string, stdrtPack: number): number {
    if (!actBoxValue || stdrtPack === 0) return 0
    
    const boxes = actBoxValue.split(',').map(v => parseFloat(v.trim()) || 0)
    const totalBoxes = boxes.reduce((sum, box) => sum + box, 0)
    
    return totalBoxes * stdrtPack
  }

  static calculateGap(
    actQty: number,
    stockAwal: number,
    produksi: number,
    surcip: number,
    sunter: number,
    kiic: number
  ): number {
    return actQty - (stockAwal + produksi - surcip - sunter - kiic)
  }

  static calculateKekuatanStock(stockReguler: number, fc2d: number): number {
    if (fc2d === 0) return 0
    return stockReguler / fc2d
  }

  static calculateKekuatanAnzen(anzenStock: number, fc2d: number): number {
    if (fc2d === 0) return 0
    return anzenStock / fc2d
  }
}