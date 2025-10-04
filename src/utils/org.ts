import { supabase } from '../lib/supabase'

export interface Organization {
  id: string
  name: string
  slug?: string | null
  organization_type?: string | null
  created_at: string | null
  updated_at: string | null
}

export const fetchMyOrganizations = async (): Promise<Organization[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, slug, organization_type, created_at, updated_at')
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

// Función robusta que garantiza obtener la organización correcta del usuario
export const ensureUserOrganization = async (): Promise<string | null> => {
  try {
    // Primero intentar desde localStorage
    let activeOrgId = localStorage.getItem('activeOrganizationId');
    
    if (activeOrgId) {
      // Verificar que la organización existe y pertenece al usuario
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        console.error('❌ Usuario no autenticado');
        localStorage.removeItem('activeOrganizationId');
        return null;
      }
      
      const { data: orgCheck, error } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('organization_id', activeOrgId)
        .eq('user_id', user.data.user.id)
        .single();
      
      if (!error && orgCheck) {
        console.log('✅ Organización activa válida desde localStorage:', activeOrgId);
        return activeOrgId;
      } else {
        console.warn('⚠️ Organización en localStorage no válida, buscando en base de datos...');
        localStorage.removeItem('activeOrganizationId');
      }
    }
    
    // Si no hay en localStorage o no es válida, buscar en la base de datos
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      console.error('❌ Usuario no autenticado');
      return null;
    }
    
    const { data: userOrgs, error: orgError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.data.user.id)
      .limit(1);
    
    if (orgError || !userOrgs || userOrgs.length === 0) {
      console.error('❌ No se encontraron organizaciones para el usuario:', orgError);
      return null;
    }
    
    const correctOrgId = userOrgs[0].organization_id;
    console.log('✅ Organización encontrada en base de datos:', correctOrgId);
    
    // Actualizar localStorage con la organización correcta
    localStorage.setItem('activeOrganizationId', correctOrgId);
    
    return correctOrgId;
  } catch (error) {
    console.error('❌ Error en ensureUserOrganization:', error);
    return null;
  }
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
      
      // Set as active using the robust function
      const currentOrgId = await ensureUserOrganization();
      if (!currentOrgId) {
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

// Función para actualizar organización
export const updateOrganization = async (organizationId: string, updates: { name?: string; organization_type?: string }): Promise<void> => {
  const { error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', organizationId)
  
  if (error) {
    console.error('Error updating organization:', error)
    throw error
  }
}