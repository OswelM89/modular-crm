import { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  data: ChartData[];
  color?: string;
  onPeriodChange?: (period: string) => void;
}

export function ChartCard({ title, data, color = '#77ff00', onPeriodChange }: ChartCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  const periods = [
    { id: 'today', label: 'Hoy' },
    { id: '7days', label: 'Últimos 7 días' },
    { id: '30days', label: 'Últimos 30 días' },
    { id: 'custom', label: 'Personalizado' }
  ];

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-3xl font-bold mt-2" style={{ color }}>
            {total}
          </p>
        </div>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => handlePeriodChange(period.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedPeriod === period.id
                ? 'text-black'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            style={
              selectedPeriod === period.id
                ? { backgroundColor: color }
                : {}
            }
          >
            {period.label}
          </button>
        ))}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="50%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              fill={`url(#gradient-${title})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
