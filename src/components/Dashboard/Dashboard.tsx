import React from 'react';
import { Users, Building2, Target, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { WelcomeSection } from './WelcomeSection';
import { SkeletonStats } from '../UI/SkeletonLoader';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { mockDashboardStats, mockDeals, mockQuotes } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';
import { formatCurrency } from '../../lib/utils';

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
  const recentDeals = mockDeals.slice(0, 3);
  const recentQuotes = mockQuotes.slice(0, 3);
  const { t } = useTranslation();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getStageVariant = (stage: string) => {
    const variants = {
      'prospecting': 'gray' as const,
      'qualification': 'info' as const,
      'proposal': 'warning' as const,
      'negotiation': 'warning' as const,
      'closed-won': 'success' as const,
      'closed-lost': 'destructive' as const,
    };
    return variants[stage as keyof typeof variants] || 'gray';
  };

  const getStatusVariant = (status: string) => {
    const variants = {
      'draft': 'gray' as const,
      'sent': 'info' as const,
      'accepted': 'success' as const,
      'rejected': 'destructive' as const,
      'expired': 'warning' as const,
    };
    return variants[status as keyof typeof variants] || 'gray';
  };

  if (loading) {
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
        
        {/* Recent sections skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Articles section skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-6 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded ml-4 animate-pulse"></div>
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
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentDeals')}</h3>
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{deal.title}</h4>
                    <p className="text-sm text-gray-600">{deal.company?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(deal.value)}</p>
                    <Badge variant={getStageVariant(deal.stage)} className="mt-1">
                      {deal.stage}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentQuotes')}</h3>
            <div className="space-y-4">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{quote.quoteNumber}</h4>
                    <p className="text-sm text-gray-600">{quote.company?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(quote.total)}</p>
                    <Badge variant={getStatusVariant(quote.status)} className="mt-1">
                      {quote.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Separador */}
      <div className="border-t border-border my-8"></div>

      {/* Sección de Artículos - Bento Layout */}
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-display-lg font-bold text-foreground">Artículos Destacados</h3>
        <button 
          onClick={() => onSectionChange && onSectionChange('blog')}
          className="inline-flex items-center px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md"
        >
          Ver Blog
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Artículo Principal - Izquierda */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-primary p-6 text-primary-foreground h-full min-h-[300px] flex flex-col justify-between rounded-lg">
              <div>
                <Badge variant="secondary" className="mb-4 bg-white/20 text-white hover:bg-white/30">
                  DESTACADO
                </Badge>
                <h4 className="text-xl font-bold mb-3 leading-tight">
                  Cómo optimizar tu pipeline de ventas en 2024
                </h4>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">
                  Descubre las mejores estrategias para aumentar tus conversiones y acelerar tu ciclo de ventas con técnicas probadas.
                </p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-primary-foreground/70 text-xs">5 min de lectura</span>
                <button className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">
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
            <div className="bg-muted p-6 hover:bg-muted/80 transition-colors cursor-pointer rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge variant="info" className="mb-2">
                    CRM
                  </Badge>
                  <h4 className="font-semibold text-foreground mb-2">
                    10 funciones de CRM que debes usar diariamente
                  </h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    Maximiza el potencial de tu CRM con estas funciones esenciales que todo vendedor debe dominar.
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
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
            <div className="bg-muted p-6 hover:bg-muted/80 transition-colors cursor-pointer rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge variant="success" className="mb-2">
                    VENTAS
                  </Badge>
                  <h4 className="font-semibold text-foreground mb-2">
                    Automatización de seguimiento: Guía completa
                  </h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    Aprende a configurar flujos automáticos que nutran tus leads sin esfuerzo manual.
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
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
            <div className="bg-muted p-6 hover:bg-muted/80 transition-colors cursor-pointer rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge variant="warning" className="mb-2">
                    PRODUCTIVIDAD
                  </Badge>
                  <h4 className="font-semibold text-foreground mb-2">
                    Métricas clave para medir el éxito de tu equipo
                  </h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    Identifica los KPIs más importantes para evaluar el rendimiento de tu equipo de ventas.
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
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