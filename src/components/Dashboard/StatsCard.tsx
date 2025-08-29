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
    bg: 'bg-white border border-gray-200',
    icon: 'bg-[#FF6200] text-white',
    text: 'text-[#FF6200]',
  },
  success: {
    bg: 'bg-white border border-gray-200',
    icon: 'bg-green-500 text-white',
    text: 'text-green-600',
  },
  warning: {
    bg: 'bg-white border border-gray-200',
    icon: 'bg-yellow-500 text-white',
    text: 'text-yellow-600',
  },
  info: {
    bg: 'bg-white border border-gray-200',
    icon: 'bg-blue-500 text-white',
    text: 'text-blue-600',
  },
};

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={`${colors.bg} p-6`}>
      <div className="flex items-center">
        <div className={`${colors.icon} p-3`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className={`ml-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}