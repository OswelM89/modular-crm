import { supabase } from '../lib/supabase'

export interface Organization {
  id: string
  name: string
  slug?: string | null
  created_at: string | null
  updated_at: string | null
}

export const fetchMyOrganizations = async (): Promise<Organization[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, slug, created_at, updated_at')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching organizations:', error)
    throw error
  }

  return data || []
}

export const getActiveOrganizationId = (): string | null => {
  return localStorage.getItem('activeOrganizationId')
}

export const setActiveOrganizationId = (organizationId: string): void => {
  localStorage.setItem('activeOrganizationId', organizationId)
}

export const clearActiveOrganizationId = (): void => {
  localStorage.removeItem('activeOrganizationId')
}

// Get user's first organization (typically the one created during signup)
export const getDefaultOrganization = async (): Promise<Organization | null> => {
  try {
    const organizations = await fetchMyOrganizations()
    if (organizations.length > 0) {
      const defaultOrg = organizations[0]
      
      // Set as active if no active organization is set
      if (!getActiveOrganizationId()) {
        setActiveOrganizationId(defaultOrg.id)
      }
      
      return defaultOrg
    }
    return null
  } catch (error) {
    console.error('Error getting default organization:', error)
    return null
  }
}

// Función para invitar usuarios a una organización (rol gestor automático)
export const inviteToOrg = async (organizationId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('organization_members')
    .insert([{ organization_id: organizationId, user_id: userId }]) // role omitido - trigger lo fijará a 'gestor'
  
  if (error) {
    console.error('Error inviting user to organization:', error)
    throw error
  }
}