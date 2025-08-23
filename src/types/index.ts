export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyId?: string;
  company?: Company;
  idNumber?: string;
  taxDocument?: File | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  website: string;
  address: string;
  phone: string;
  email: string;
  contacts?: Contact[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: Date;
  contactId: string;
  companyId: string;
  contact?: Contact;
  company?: Company;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  title: string;
  contactId: string;
  companyId: string;
  dealId?: string;
  contact?: Contact;
  company?: Company;
  deal?: Deal;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalContacts: number;
  totalCompanies: number;
  activeDeals: number;
  pendingQuotes: number;
  monthlyRevenue: number;
  wonDeals: number;
}