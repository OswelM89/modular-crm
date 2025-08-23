import React from 'react';
import { Users, Building2, Target, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { WelcomeSection } from './WelcomeSection';
import { SkeletonCard } from '../UI/SkeletonLoader';
import { mockDashboardStats, mockDeals, mockQuotes } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';

interface DashboardProps {
  user?: {
    firstName: string;
    lastName: string;
  };
  onSectionChange?: (section: string) => void;
}

export function Dashboard({ user, onSectionChange }: DashboardProps) {
  const [loading, setLoading] = React.useState(true);
  const recentDeals = mockDeals.slice(0, 3);
  const recentQuotes = mockQuotes.slice(0, 3);
  const { t } = useTranslation();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'prospecting': 'bg-gray-100 text-gray-800',
      'qualification': 'bg-blue-100 text-blue-800',
      'proposal': 'bg-yellow-100 text-yellow-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed-won': 'bg-green-100 text-green-800',
      'closed-lost': 'bg-red-100 text-red-800',
    };
    return colors[stage as keyof typeof colors] || colors.prospecting;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'expired': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Welcome Section Skeleton */}
        <div className="mb-8">
          {/* Mensaje de bienvenida skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 w-1/3 mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 w-2/3 animate-pulse"></div>
          </div>
          
          {/* Acciones rápidas skeleton */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center p-4 bg-gray-200 animate-pulse">
                <div className="w-12 h-12 bg-gray-300 mb-3"></div>
                <div className="h-4 bg-gray-300 w-16"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        
        {/* Recent sections skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        
        {/* Articles section skeleton */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 w-24 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-80 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 w-16 mb-2 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 w-full mb-3 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 w-1/2 animate-pulse"></div>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 ml-4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeSection 
        userName={user?.firstName || 'Usuario'} 
        onSectionChange={onSectionChange || (() => {})}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title={t('dashboard.totalContacts')}
          value={mockDashboardStats.totalContacts}
          icon={Users}
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title={t('dashboard.companies')}
          value={mockDashboardStats.totalCompanies}
          icon={Building2}
          color="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title={t('dashboard.activeDeals')}
          value={mockDashboardStats.activeDeals}
          icon={Target}
          color="warning"
        />
        <StatsCard
          title={t('dashboard.pendingQuotes')}
          value={mockDashboardStats.pendingQuotes}
          icon={FileText}
          color="info"
        />
        <StatsCard
          title={t('dashboard.monthlyRevenue')}
          value={formatCurrency(mockDashboardStats.monthlyRevenue)}
          icon={DollarSign}
          color="success"
          trend={{ value: 25, isPositive: true }}
        />
        <StatsCard
          title={t('dashboard.wonDeals')}
          value={mockDashboardStats.wonDeals}
          icon={TrendingUp}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentDeals')}</h3>
          <div className="space-y-4">
            {recentDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{deal.title}</h4>
                  <p className="text-sm text-gray-600">{deal.company?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(deal.value)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(deal.stage)}`}>
                    {deal.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentQuotes')}</h3>
          <div className="space-y-4">
            {recentQuotes.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{quote.quoteNumber}</h4>
                  <p className="text-sm text-gray-600">{quote.company?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(quote.total)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección de Artículos - Bento Layout */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900" style={{ fontSize: '1.875rem' }}>Artículos Destacados</h3>
        <button 
          onClick={() => onSectionChange && onSectionChange('blog')}
          className="inline-flex items-center px-4 py-2 bg-[#FF6200] text-white hover:bg-orange-600 transition-colors text-sm"
        >
          Ver Blog
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Artículo Principal - Izquierda */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#FF6200] to-orange-600 p-6 text-white h-full min-h-[300px] flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-white bg-opacity-20 text-xs font-medium mb-4">
                  DESTACADO
                </span>
                <h4 className="text-xl font-bold mb-3 leading-tight">
                  Cómo optimizar tu pipeline de ventas en 2024
                </h4>
                <p className="text-orange-100 text-sm leading-relaxed">
                  Descubre las mejores estrategias para aumentar tus conversiones y acelerar tu ciclo de ventas con técnicas probadas.
                </p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-orange-200 text-xs">5 min de lectura</span>
                <button className="text-white hover:text-orange-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Artículos Secundarios - Derecha */}
          <div className="lg:col-span-2 space-y-4">
            {/* Artículo 1 */}
            <div className="bg-gray-50 p-6 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium mb-2">
                    CRM
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    10 funciones de CRM que debes usar diariamente
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Maximiza el potencial de tu CRM con estas funciones esenciales que todo vendedor debe dominar.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>3 min de lectura</span>
                    <span className="mx-2">•</span>
                    <span>Hace 2 días</span>
                  </div>
                </div>
                <img 
                  src="/Modular cover.jpg" 
                  alt="CRM Functions" 
                  className="w-16 h-16 ml-4 flex-shrink-0 object-cover rounded"
                />
              </div>
            </div>
            
            {/* Artículo 2 */}
            <div className="bg-gray-50 p-6 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium mb-2">
                    VENTAS
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Automatización de seguimiento: Guía completa
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Aprende a configurar flujos automáticos que nutran tus leads sin esfuerzo manual.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>7 min de lectura</span>
                    <span className="mx-2">•</span>
                    <span>Hace 1 semana</span>
                  </div>
                </div>
                <img 
                  src="/Modular cover.jpg" 
                  alt="Sales Automation" 
                  className="w-16 h-16 ml-4 flex-shrink-0 object-cover rounded"
                />
              </div>
            </div>
            
            {/* Artículo 3 */}
            <div className="bg-gray-50 p-6 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium mb-2">
                    PRODUCTIVIDAD
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Métricas clave para medir el éxito de tu equipo
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Identifica los KPIs más importantes para evaluar el rendimiento de tu equipo de ventas.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>4 min de lectura</span>
                    <span className="mx-2">•</span>
                    <span>Hace 2 semanas</span>
                  </div>
                </div>
                <img 
                  src="/Modular cover.jpg" 
                  alt="Team Metrics" 
                  className="w-16 h-16 ml-4 flex-shrink-0 object-cover rounded"
                />
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}