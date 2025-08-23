import React from 'react';
import { Users, Building2, Target, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { SkeletonCard } from '../UI/SkeletonLoader';
import { mockDashboardStats, mockDeals, mockQuotes } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';

export function Dashboard() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
    </div>
  );
}