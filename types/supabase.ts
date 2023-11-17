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
      testing: {
        Row: {
          cat_name: string | null
          created_at: string
          id: number
        }
        Insert: {
          cat_name?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          cat_name?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
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
