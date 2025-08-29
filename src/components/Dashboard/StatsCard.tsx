import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'primary' | 'success' | 'warning' | 'info';
}

const colorClasses = {
  primary: {
    bg: 'bg-white rounded-xl shadow-sm border border-gray-100',
    icon: 'bg-teal-primary text-white rounded-lg',
    text: 'text-teal-primary',
    accent: 'text-teal-600'
  },
  success: {
    bg: 'bg-white rounded-xl shadow-sm border border-gray-100',
    icon: 'bg-green-500 text-white rounded-lg',
    text: 'text-green-600',
    accent: 'text-green-500'
  },
  warning: {
    bg: 'bg-white rounded-xl shadow-sm border border-gray-100',
    icon: 'bg-yellow-500 text-white rounded-lg',
    text: 'text-yellow-600',
    accent: 'text-yellow-500'
  },
  info: {
    bg: 'bg-white rounded-xl shadow-sm border border-gray-100',
    icon: 'bg-blue-500 text-white rounded-lg',
    text: 'text-blue-600',
    accent: 'text-blue-500'
  },
};

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={`${colors.bg} p-6 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors.icon} p-3`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-500">{title}</p>
      </div>
    </div>
  );
}