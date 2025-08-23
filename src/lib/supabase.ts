import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  organization_id: string
  email: string
  first_name: string
  last_name: string
  role: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  organization_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  position?: string
  company_id?: string
  id_number?: string
  tax_document?: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  organization_id: string
  name: string
  industry: string
  size?: string
  website?: string
  address?: string
  phone?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  organization_id: string
  title: string
  value: number
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  probability: number
  expected_close_date: string
  contact_id: string
  company_id: string
  description: string
  created_at: string
  updated_at: string
}

// Auth helpers
export const signUp = async (email: string, password: string, organizationName: string, firstName: string, lastName: string) => {
  try {
    // 1. Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          organization_name: organizationName
        }
      }
    })

    if (authError) throw authError

    return { data: authData, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getCurrentProfile = async () => {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

// CRUD operations with organization filtering
export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      company:companies(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const createContact = async (contactData: Omit<Contact, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contactData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const createCompany = async (companyData: Omit<Company, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('companies')
    .insert([companyData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getDeals = async () => {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      contact:contacts(*),
      company:companies(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}