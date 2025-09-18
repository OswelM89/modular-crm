import { createClient } from '@supabase/supabase-js'
import type { Database } from '../integrations/supabase/types'

const supabaseUrl = "https://drmismwbcohktquctoal.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybWlzbXdiY29oa3RxdWN0b2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDkyNTksImV4cCI6MjA3MTU4NTI1OX0.u6MuoodnZfLMSVcjWwa9V1OzTwMmR87dxBXV-7sODTE"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})