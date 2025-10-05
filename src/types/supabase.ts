export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      production_sessions: {
        Row: {
          id: string
          session_name: string
          created_at: string
          updated_at: string
          is_active: boolean
          created_by: string | null
        }
        Insert: {
          id?: string
          session_name: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          created_by?: string | null
        }
        Update: {
          id?: string
          session_name?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      production_data: {
        Row: {
          id: string
          session_id: string
          kode_inject: string
          inject_index: number
          stock_awal: number | null
          produksi: number | null
          surcip: number | null
          sunter: number | null
          kiic: number | null
          act_box: string | null
          stdrt_pack: number | null
          act_qty: number | null
          gap_value: number | null
          stock_reguler: number | null
          anzen_stock: number | null
          fc2d: number | null
          kekuatan_stock: number | null
          kekuatan_anzen: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          kode_inject: string
          inject_index: number
          stock_awal?: number | null
          produksi?: number | null
          surcip?: number | null
          sunter?: number | null
          kiic?: number | null
          act_box?: string | null
          stdrt_pack?: number | null
          act_qty?: number | null
          gap_value?: number | null
          stock_reguler?: number | null
          anzen_stock?: number | null
          fc2d?: number | null
          kekuatan_stock?: number | null
          kekuatan_anzen?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          kode_inject?: string
          inject_index?: number
          stock_awal?: number | null
          produksi?: number | null
          surcip?: number | null
          sunter?: number | null
          kiic?: number | null
          act_box?: string | null
          stdrt_pack?: number | null
          act_qty?: number | null
          gap_value?: number | null
          stock_reguler?: number | null
          anzen_stock?: number | null
          fc2d?: number | null
          kekuatan_stock?: number | null
          kekuatan_anzen?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_data_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "production_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          is_night_mode: boolean | null
          current_view: string | null
          last_session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          is_night_mode?: boolean | null
          current_view?: string | null
          last_session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          is_night_mode?: boolean | null
          current_view?: string | null
          last_session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_settings_last_session_id_fkey"
            columns: ["last_session_id"]
            isOneToOne: false
            referencedRelation: "production_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}