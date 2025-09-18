import { supabase } from '../lib/supabase';

export interface Contact {
  id: string;
  user_id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  id_number?: string | null;
  company_id?: string | null;
  position?: string | null;
  email: string;
  phone: string;
  tax_document_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  idNumber: string;
  companyId: string;
  position: string;
  email: string;
  phone: string;
  taxDocument: File | null;
}

// Fetch all contacts for the active organization
export const fetchContacts = async (): Promise<Contact[]> => {
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
    .from('contacts')
    .select('*')
    .eq('organization_id', orgMember.organization_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }

  return data || [];
};

// Create a new contact
export const createContact = async (contactData: ContactFormData): Promise<Contact> => {
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
  if (contactData.taxDocument) {
    const fileExt = contactData.taxDocument.name.split('.').pop();
    const fileName = `${user.data.user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('tax-documents')
      .upload(fileName, contactData.taxDocument);

    if (uploadError) {
      console.error('Error uploading tax document:', uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from('tax-documents')
      .getPublicUrl(fileName);
    
    taxDocumentUrl = urlData.publicUrl;
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      user_id: user.data.user.id,
      organization_id: orgMember.organization_id,
      first_name: contactData.firstName,
      last_name: contactData.lastName,
      id_number: contactData.idNumber || null,
      company_id: contactData.companyId || null,
      position: contactData.position || null,
      email: contactData.email,
      phone: contactData.phone,
      tax_document_url: taxDocumentUrl
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating contact:', error);
    throw error;
  }

  return data;
};

// Update a contact
export const updateContact = async (id: string, updates: Partial<ContactFormData>): Promise<Contact> => {
  const { data, error } = await supabase
    .from('contacts')
    .update({
      first_name: updates.firstName,
      last_name: updates.lastName,
      id_number: updates.idNumber || null,
      company_id: updates.companyId || null,
      position: updates.position || null,
      email: updates.email,
      phone: updates.phone,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact:', error);
    throw error;
  }

  return data;
};

// Delete a contact
export const deleteContact = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

// Get contact by ID
export const getContactById = async (id: string): Promise<Contact | null> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching contact:', error);
    return null;
  }

  return data;
};