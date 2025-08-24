import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

// Para desarrollo, usamos valores por defecto que permiten que la app funcione
// En producción, deberás configurar las variables de entorno reales
export const supabase = createClient(supabaseUrl, supabaseAnonKey)