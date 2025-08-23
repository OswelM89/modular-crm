import React from 'react';
import { UserPlus, FileText, Settings, Plus, ArrowRight } from 'lucide-react';

interface SettingsPageProps {
  onSectionChange?: (section: string) => void;
}

export function SettingsPage({ onSectionChange }: SettingsPageProps) {
  const settingsCards = [
    {
      id: 'add-user',
      title: 'Agregar Usuario',
      description: 'Invita nuevos miembros a tu equipo y gestiona permisos',
      icon: UserPlus,
      color: 'bg-blue-500',
      available: true,
      action: () => console.log('Agregar usuario')
    },
    {
      id: 'quote-config',
      title: 'Configurar Cotización',
      description: 'Personaliza plantillas, términos y configuración de cotizaciones',
      icon: FileText,
      color: 'bg-green-500',
      available: true,
      action: () => console.log('Configurar cotización')
    },
    {
      id: 'preferences',
      title: 'Preferencias',
      description: 'Ajusta idioma, notificaciones y configuración personal',
      icon: Settings,
      color: 'bg-orange-500',
      available: true,
      action: () => console.log('Preferencias')
    },
    {
      id: 'new-features',
      title: 'Nuevas Funciones',
      description: 'Descubre las próximas características que estamos desarrollando',
      icon: Plus,
      color: 'bg-gray-400',
      available: false,
      action: () => console.log('Nuevas funciones')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
            Configuración
          </h1>
          <p className="text-sm text-gray-600">
            Personaliza tu experiencia y gestiona la configuración del sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 ${
                card.available 
                  ? 'cursor-pointer hover:border-[#FF6200]' 
                  : 'cursor-not-allowed opacity-60'
              }`}
              onClick={() => card.available && card.action()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {card.available && (
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF6200] transition-colors" />
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {card.description}
              </p>
              
              {!card.available && (
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Próximamente
                  </span>
                </div>
              )}
              
              {card.available && (
                <div className="flex items-center text-[#FF6200] text-sm font-medium">
                  Configurar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              ¿Necesitas ayuda?
            </h4>
            <p className="text-sm text-blue-700">
              Si tienes dudas sobre alguna configuración, consulta nuestra documentación o contacta al soporte técnico.
            </p>
            <div className="mt-3 flex space-x-3">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Ver documentación
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Contactar soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}