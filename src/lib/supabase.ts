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

// Tipos actualizados para la base de datos
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          first_name: string
          last_name: string
          role: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
          organization_id: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          first_name: string
          last_name: string
          role?: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
          organization_id?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          first_name?: string
          last_name?: string
          role?: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
          organization_id?: string | null
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
          logo_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          logo_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
          invited_by: string | null
          joined_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          role?: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
          invited_by?: string | null
          joined_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          role?: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
          invited_by?: string | null
          joined_at?: string
          created_at?: string
        }
      }
      super_admins: {
        Row: {
          id: string
          user_id: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_by?: string | null
          created_at?: string
        }
      }
    }
  }
}