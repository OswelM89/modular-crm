import React from 'react';
import { Users, Building2, FileText, DollarSign, TrendingUp, Plus } from 'lucide-react';
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
export function Dashboard({
  user,
  onSectionChange
}: DashboardProps) {
  const [loading, setLoading] = React.useState(true);
  const [showContactForm, setShowContactForm] = React.useState(false);
  const [showCompanyForm, setShowCompanyForm] = React.useState(false);
  const [showDealForm, setShowDealForm] = React.useState(false);
  const {
    t
  } = useTranslation();
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
    return <div className="space-y-6">
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
      </div>;
  }
  return <div className="space-y-6">
      <WelcomeSection userName={user?.firstName || 'Usuario'} onSectionChange={onSectionChange || (() => {})} />
      
      {/* Acciones Rápidas */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
      </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div onClick={() => setShowContactForm(true)} className="bg-[#030712] p-6 rounded-xl cursor-pointer hover:bg-[#030712]/90 transition-colors">
            <div className="flex flex-col items-start space-y-1">
              <Plus className="w-8 h-8 text-white" />
              <p className="text-sm font-medium text-gray-300">Crear Contacto</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-white">
              </p>
              </div>
            </div>
          </div>

          <div onClick={() => setShowCompanyForm(true)} className="bg-[#030712] p-6 rounded-xl cursor-pointer hover:bg-[#030712]/90 transition-colors">
            <div className="flex flex-col items-start space-y-1">
              <Plus className="w-8 h-8 text-white" />
              <p className="text-sm font-medium text-gray-300">Crear Empresa</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-white">
              </p>
              </div>
            </div>
          </div>

          <div onClick={() => setShowDealForm(true)} className="bg-[#030712] p-6 rounded-xl cursor-pointer hover:bg-[#030712]/90 transition-colors">
            <div className="flex flex-col items-start space-y-1">
              <Plus className="w-8 h-8 text-white" />
              <p className="text-sm font-medium text-gray-300">Crear Negocio</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-white">
              </p>
              </div>
            </div>
          </div>

          <div onClick={() => onSectionChange?.('quotes')} className="bg-[#030712] p-6 rounded-xl cursor-pointer hover:bg-[#030712]/90 transition-colors">
            <div className="flex flex-col items-start space-y-1">
              <Plus className="w-8 h-8 text-white" />
              <p className="text-sm font-medium text-gray-300">Crear Cotización</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-white">
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title={t('dashboard.totalContacts')} value={totalContacts} icon={Users} color="primary" trend={{
        value: totalContacts > 0 ? Math.floor(Math.random() * 20) + 5 : 0,
        isPositive: true
      }} />
        <StatsCard title={t('dashboard.companies')} value={totalCompanies} icon={Building2} color="success" trend={{
        value: totalCompanies > 0 ? Math.floor(Math.random() * 15) + 3 : 0,
        isPositive: true
      }} />
        <StatsCard title="Miembros de Equipo" value={totalMembers} icon={Users} color="info" />
        <StatsCard title={t('dashboard.pendingQuotes')} value={mockQuotes.filter(q => q.status === 'sent').length} icon={FileText} color="warning" />
        <StatsCard title={t('dashboard.monthlyRevenue')} value={formatCurrency(mockQuotes.reduce((sum, q) => sum + q.total, 0))} icon={DollarSign} color="success" trend={{
        value: 25,
        isPositive: true
      }} />
        <StatsCard title="Organización" value={organizationName || 'Mi Organización'} icon={TrendingUp} color="primary" />
      </div>

      {/* Modals */}
      <ContactForm isOpen={showContactForm} onClose={() => setShowContactForm(false)} onSubmit={handleContactSubmit} />
      
      <CompanyForm isOpen={showCompanyForm} onClose={() => setShowCompanyForm(false)} onSubmit={handleCompanySubmit} />
      
      <DealForm isOpen={showDealForm} onClose={() => setShowDealForm(false)} onSubmit={handleDealSubmit} />
    </div>;
}