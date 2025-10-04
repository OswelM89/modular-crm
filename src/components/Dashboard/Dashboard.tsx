
import { Users, Building2, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { WelcomeSection } from './WelcomeSection';
import { ChartCard } from './ChartCard';
import { useTranslation } from '../../hooks/useTranslation';

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
  const { t } = useTranslation();

  // Mock data
  const quotesData = [
    { name: 'Lun', value: 12 },
    { name: 'Mar', value: 19 },
    { name: 'Mié', value: 8 },
    { name: 'Jue', value: 15 },
    { name: 'Vie', value: 22 },
    { name: 'Sáb', value: 7 },
    { name: 'Dom', value: 5 }
  ];

  const dealsData = [
    { name: 'Lun', value: 5 },
    { name: 'Mar', value: 8 },
    { name: 'Mié', value: 3 },
    { name: 'Jue', value: 6 },
    { name: 'Vie', value: 10 },
    { name: 'Sáb', value: 4 },
    { name: 'Dom', value: 2 }
  ];

  return (
    <div className="space-y-6">
      <WelcomeSection 
        userName={user?.firstName || 'Usuario'} 
        onSectionChange={onSectionChange || (() => {})} 
      />
      
      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Cotizaciones Realizadas"
          data={quotesData}
          color="#77ff00"
          onPeriodChange={(period) => console.log('Periodo cotizaciones:', period)}
        />
        <ChartCard
          title="Negocios Ganados"
          data={dealsData}
          color="#77ff00"
          onPeriodChange={(period) => console.log('Periodo negocios:', period)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title={t('dashboard.totalContacts')} 
          value={0} 
          icon={Users} 
          color="primary"
        />
        <StatsCard 
          title={t('dashboard.companies')} 
          value={0} 
          icon={Building2} 
          color="success"
        />
        <StatsCard 
          title="Miembros de Equipo" 
          value={1} 
          icon={Users} 
          color="info" 
        />
        <StatsCard 
          title={t('dashboard.pendingQuotes')} 
          value={0} 
          icon={FileText} 
          color="warning" 
        />
        <StatsCard 
          title={t('dashboard.monthlyRevenue')} 
          value="$0" 
          icon={DollarSign} 
          color="success"
        />
        <StatsCard 
          title="Organización" 
          value="Mi Organización" 
          icon={TrendingUp} 
          color="primary" 
        />
      </div>
    </div>
  );
}
