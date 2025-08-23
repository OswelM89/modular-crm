import React from 'react';
import { Users, Building2, Target, FileText, BarChart3, Plus } from 'lucide-react';

interface WelcomeSectionProps {
  userName: string;
  onSectionChange: (section: string) => void;
}

const welcomeMessages = [
  "¡Bienvenido de vuelta! Hoy es un gran día para hacer crecer tu negocio.",
  "¡Excelente día para conectar con nuevos clientes!",
  "¡Es hora de convertir esas oportunidades en ventas exitosas!",
  "¡Perfecto momento para revisar tu pipeline de ventas!",
  "¡Hoy es ideal para fortalecer las relaciones con tus clientes!",
  "¡Un nuevo día lleno de oportunidades de negocio te espera!",
  "¡Tiempo de hacer que las cosas sucedan en tu CRM!"
];

export function WelcomeSection({ userName, onSectionChange }: WelcomeSectionProps) {
  // Obtener mensaje basado en el día del año para que cambie cada 24h
  const getDailyMessage = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return welcomeMessages[dayOfYear % welcomeMessages.length];
  };

  const quickActions = [
    {
      id: 'contacts',
      name: 'Contactos',
      icon: Users,
      color: 'bg-blue-500',
      available: true
    },
    {
      id: 'companies',
      name: 'Empresas',
      icon: Building2,
      color: 'bg-green-500',
      available: true
    },
    {
      id: 'deals',
      name: 'Negocios',
      icon: Target,
      color: 'bg-orange-500',
      available: true
    },
    {
      id: 'quotes',
      name: 'Cotizaciones',
      icon: FileText,
      color: 'bg-purple-500',
      available: true
    },
    {
      id: 'pipeline',
      name: 'Pipeline',
      icon: BarChart3,
      color: 'bg-gray-400',
      available: false
    }
    {
      id: 'new-features',
      name: 'Nuevas Funciones',
      icon: Plus,
      color: 'bg-gray-400',
      available: false
    }
  ];

  return (
    <div className="mb-8">
      {/* Mensaje de bienvenida */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hola {userName}
        </h1>
        <p className="text-lg text-gray-600">
          {getDailyMessage()}
        </p>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => action.available && onSectionChange(action.id)}
              disabled={!action.available}
              className={`flex flex-col items-center p-4 bg-[#212830] ${
                action.available 
                  ? 'cursor-pointer' 
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="w-12 h-12 bg-[#212830] flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-[#FF6200]" />
              </div>
              <span className={`text-sm font-medium ${
                action.available ? 'text-white' : 'text-gray-500'
              }`}>
                {action.name}
              </span>
              {!action.available && (
                <span className="text-xs text-gray-400 mt-1">Próximamente</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}