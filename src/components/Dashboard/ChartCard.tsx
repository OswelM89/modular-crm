import { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
          <div className="flex items-center gap-3">
            <p className="text-4xl font-bold text-foreground">
              {total}
            </p>
            <div className="w-12 h-8 flex items-center justify-center">
              <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 16C8 16 8 8 16 8C24 8 24 24 32 24C40 24 40 16 48 16" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold mt-2" style={{ color }}>
            +45%
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

      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="50%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: color,
                border: 'none',
                borderRadius: '12px',
                padding: '8px 12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              labelStyle={{ color: '#000', fontWeight: 600, fontSize: '12px' }}
              itemStyle={{ color: '#000', fontSize: '14px', fontWeight: 700 }}
              cursor={{ stroke: color, strokeWidth: 2, strokeDasharray: '5 5' }}
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
