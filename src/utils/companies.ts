import { supabase } from '../lib/supabase';

export interface Company {
  id: string;
  user_id: string;
  organization_id: string;
  name: string;
  nit: string;
  sector?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  tax_document_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyFormData {
  name: string;
  nit: string;
  sector: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxDocument: File | null;
}

// Fetch all companies for the active organization
export const fetchCompanies = async (): Promise<Company[]> => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('User not authenticated');
  }

  // Get the user's organization
  const { data: orgMember, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.data.user.id)
    .single();

  if (orgError || !orgMember) {
    console.error('Error getting user organization:', orgError);
    throw new Error('No organization found for user');
  }

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('organization_id', orgMember.organization_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }

  return data || [];
};

// Create a new company
export const createCompany = async (companyData: CompanyFormData): Promise<Company> => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('User not authenticated');
  }

  // Get the user's organization
  const { data: orgMember, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.data.user.id)
    .single();

  if (orgError || !orgMember) {
    console.error('Error getting user organization:', orgError);
    throw new Error('No organization found for user');
  }

  let taxDocumentUrl: string | null = null;

  // Upload tax document if provided
  if (companyData.taxDocument) {
    const fileExt = companyData.taxDocument.name.split('.').pop();
    const fileName = `companies/${user.data.user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('tax-documents')
      .upload(fileName, companyData.taxDocument);

    if (uploadError) {
      console.error('Error uploading company tax document:', uploadError);
      throw uploadError;
    }

    // Guardar solo el path del archivo, no la URL completa
    taxDocumentUrl = fileName;
  }

  const { data, error } = await supabase
    .from('companies')
    .insert({
      user_id: user.data.user.id,
      organization_id: orgMember.organization_id,
      name: companyData.name,
      nit: companyData.nit,
      sector: companyData.sector || null,
      website: companyData.website || null,
      email: companyData.email || null,
      phone: companyData.phone || null,
      address: companyData.address || null,
      city: companyData.city || null,
      country: companyData.country || null,
      tax_document_url: taxDocumentUrl
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating company:', error);
    throw error;
  }

  return data;
};

// Update a company with optional tax document
export const updateCompanyWithDocument = async (
  id: string, 
  updates: Partial<CompanyFormData>, 
  newTaxDocument?: File | null
): Promise<Company> => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('User not authenticated');
  }

  let taxDocumentUrl: string | null = null;

  // Upload new tax document if provided
  if (newTaxDocument) {
    const fileExt = newTaxDocument.name.split('.').pop();
    const fileName = `companies/${user.data.user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('tax-documents')
      .upload(fileName, newTaxDocument);

    if (uploadError) {
      console.error('Error uploading company tax document:', uploadError);
      throw uploadError;
    }

    // Guardar solo el path del archivo, no la URL completa
    taxDocumentUrl = fileName;
  }

  const updateData: any = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.nit !== undefined) updateData.nit = updates.nit;
  if (updates.sector !== undefined) updateData.sector = updates.sector || null;
  if (updates.website !== undefined) updateData.website = updates.website || null;
  if (updates.email !== undefined) updateData.email = updates.email || null;
  if (updates.phone !== undefined) updateData.phone = updates.phone || null;
  if (updates.address !== undefined) updateData.address = updates.address || null;
  if (updates.city !== undefined) updateData.city = updates.city || null;
  if (updates.country !== undefined) updateData.country = updates.country || null;
  
  // Update tax document URL if new document was uploaded
  if (taxDocumentUrl) {
    updateData.tax_document_url = taxDocumentUrl;
  }
  
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('companies')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating company:', error);
    throw error;
  }

  return data;
};

// Update a company
export const updateCompany = async (id: string, updates: Partial<CompanyFormData>): Promise<Company> => {
  const updateData: any = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.nit !== undefined) updateData.nit = updates.nit;
  if (updates.sector !== undefined) updateData.sector = updates.sector || null;
  if (updates.website !== undefined) updateData.website = updates.website || null;
  if (updates.email !== undefined) updateData.email = updates.email || null;
  if (updates.phone !== undefined) updateData.phone = updates.phone || null;
  if (updates.address !== undefined) updateData.address = updates.address || null;
  if (updates.city !== undefined) updateData.city = updates.city || null;
  if (updates.country !== undefined) updateData.country = updates.country || null;
  
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('companies')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating company:', error);
    throw error;
  }

  return data;
};

// Delete a company
export const deleteCompany = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};

// Get company by ID
export const getCompanyById = async (id: string): Promise<Company | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }

  return data;
};