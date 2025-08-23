import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos para la base de datos
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          email: string
          first_name: string
          last_name: string
          role: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          email: string
          first_name: string
          last_name: string
          role?: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          email?: string
          first_name?: string
          last_name?: string
          role?: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}