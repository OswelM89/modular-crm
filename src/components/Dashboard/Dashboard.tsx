import React from 'react';
import { Users, Building2, FileText, DollarSign, TrendingUp, UserPlus, HandshakeIcon } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { WelcomeSection } from './WelcomeSection';
import { SkeletonStats } from '../UI/SkeletonLoader';
import { ContactForm } from '../Contacts/ContactForm';
import { CompanyForm } from '../Companies/CompanyForm';
import { DealForm } from '../Deals/DealForm';
import { mockQuotes } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { formatCurrency } from '../../lib/utils';
import { createCompany, type CompanyFormData } from '../../utils/companies';
import { type Contact } from '../../utils/contacts';
import { type DealFormData } from '../Deals/DealForm';
import { Button } from '../ui/button';

interface DashboardProps {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url?: string | null;
  } | null;
  onSectionChange?: (section: string) => void;
}

export function Dashboard({ user, onSectionChange }: DashboardProps) {
  const [loading, setLoading] = React.useState(true);
  const [showContactForm, setShowContactForm] = React.useState(false);
  const [showCompanyForm, setShowCompanyForm] = React.useState(false);
  const [showDealForm, setShowDealForm] = React.useState(false);
  
  const { t } = useTranslation();
  const { 
    totalContacts, 
    totalCompanies, 
    totalMembers, 
    organizationName, 
    loading: statsLoading
  } = useDashboardStats();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleContactSubmit = (contact: Contact) => {
    console.log('Contacto creado:', contact);
    setShowContactForm(false);
  };

  const handleCompanySubmit = async (companyData: CompanyFormData) => {
    try {
      await createCompany(companyData);
      setShowCompanyForm(false);
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleDealSubmit = (dealData: DealFormData) => {
    console.log('Negocio creado:', dealData);
    setShowDealForm(false);
  };

  // Show loading while stats are being fetched
  const isLoading = loading || statsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Mensaje de bienvenida skeleton */}
        <div className="mb-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-36 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <SkeletonStats />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeSection 
        userName={user?.firstName || 'Usuario'} 
        onSectionChange={onSectionChange || (() => {})}
      />
      
      {/* Acciones Rápidas */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => setShowContactForm(true)}
            className="aspect-square h-20 flex flex-col items-start justify-center gap-2 bg-[#030712] text-white hover:bg-[#030712]/90 border-none p-4"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-xs text-left">Crear Contacto</span>
          </Button>
          
          <Button
            onClick={() => setShowCompanyForm(true)}
            className="aspect-square h-20 flex flex-col items-start justify-center gap-2 bg-[#030712] text-white hover:bg-[#030712]/90 border-none p-4"
          >
            <Building2 className="w-5 h-5" />
            <span className="text-xs text-left">Crear Empresa</span>
          </Button>
          
          <Button
            onClick={() => setShowDealForm(true)}
            className="aspect-square h-20 flex flex-col items-start justify-center gap-2 bg-[#030712] text-white hover:bg-[#030712]/90 border-none p-4"
          >
            <HandshakeIcon className="w-5 h-5" />
            <span className="text-xs text-left">Crear Negocio</span>
          </Button>
          
          <Button
            onClick={() => onSectionChange?.('quotes')}
            className="aspect-square h-20 flex flex-col items-start justify-center gap-2 bg-[#030712] text-white hover:bg-[#030712]/90 border-none p-4"
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs text-left">Crear Cotización</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title={t('dashboard.totalContacts')}
          value={totalContacts}
          icon={Users}
          color="primary"
          trend={{ value: totalContacts > 0 ? Math.floor(Math.random() * 20) + 5 : 0, isPositive: true }}
        />
        <StatsCard
          title={t('dashboard.companies')}
          value={totalCompanies}
          icon={Building2}
          color="success"
          trend={{ value: totalCompanies > 0 ? Math.floor(Math.random() * 15) + 3 : 0, isPositive: true }}
        />
        <StatsCard
          title="Miembros de Equipo"
          value={totalMembers}
          icon={Users}
          color="info"
        />
        <StatsCard
          title={t('dashboard.pendingQuotes')}
          value={mockQuotes.filter(q => q.status === 'sent').length}
          icon={FileText}
          color="warning"
        />
        <StatsCard
          title={t('dashboard.monthlyRevenue')}
          value={formatCurrency(mockQuotes.reduce((sum, q) => sum + q.total, 0))}
          icon={DollarSign}
          color="success"
          trend={{ value: 25, isPositive: true }}
        />
        <StatsCard
          title="Organización"
          value={organizationName || 'Mi Organización'}
          icon={TrendingUp}
          color="primary"
        />
      </div>

      {/* Modals */}
      <ContactForm
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        onSubmit={handleContactSubmit}
      />
      
      <CompanyForm
        isOpen={showCompanyForm}
        onClose={() => setShowCompanyForm(false)}
        onSubmit={handleCompanySubmit}
      />
      
      <DealForm
        isOpen={showDealForm}
        onClose={() => setShowDealForm(false)}
        onSubmit={handleDealSubmit}
      />
    </div>
  );
}