import { useState, useEffect } from 'react';
import { UserPlus, FileText, Settings, Plus, ArrowRight } from 'lucide-react';
import { AddUserPage } from './AddUserPage';
import { QuoteConfigPage } from './QuoteConfigPage';
import { PreferencesPage } from './PreferencesPage';

export function SettingsPage() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return localStorage.getItem('settingsCurrentPage') || 'main';
  });

  useEffect(() => {
    localStorage.setItem('settingsCurrentPage', currentPage);
  }, [currentPage]);

  const settingsCards = [
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      description: 'Administra los usuarios de tu equipo y sus permisos',
      icon: UserPlus,
      color: 'bg-blue-500',
      available: true,
      action: () => setCurrentPage('users')
    },
    {
      id: 'quotes',
      title: 'Configuración de Cotizaciones',
      description: 'Personaliza plantillas y configuraciones de cotizaciones',
      icon: FileText,
      color: 'bg-green-500',
      available: true,
      action: () => setCurrentPage('quotes')
    },
    {
      id: 'preferences',
      title: 'Preferencias Generales',
      description: 'Configura idioma, zona horaria y otras preferencias',
      icon: Settings,
      color: 'bg-purple-500',
      available: true,
      action: () => setCurrentPage('preferences')
    },
    {
      id: 'integrations',
      title: 'Integraciones',
      description: 'Conecta con herramientas externas y APIs',
      icon: Plus,
      color: 'bg-gray-400',
      available: false,
      action: () => {}
    },
    {
      id: 'security',
      title: 'Seguridad',
      description: 'Configuraciones de seguridad y acceso',
      icon: Plus,
      color: 'bg-gray-400',
      available: false,
      action: () => {}
    },
    {
      id: 'billing',
      title: 'Facturación',
      description: 'Gestiona tu suscripción y métodos de pago',
      icon: Plus,
      color: 'bg-gray-400',
      available: false,
      action: () => {}
    }
  ];

  // Renderizar páginas específicas
  if (currentPage === 'users') {
    return <AddUserPage onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'quotes') {
    return <QuoteConfigPage onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'preferences') {
    return <PreferencesPage onBack={() => setCurrentPage('main')} />;
  }

  // Vista principal de configuraciones
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
          Configuración
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.id}
              onClick={card.available ? card.action : undefined}
              className={`bg-white border border-gray-200 p-6 transition-all duration-200 ${
                card.available 
                  ? 'cursor-pointer hover:shadow-md hover:border-primary' 
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`${card.color} p-3 mr-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {card.title}
                  </h3>
                </div>
                {card.available && (
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {card.description}
              </p>
              
              {!card.available && (
                <div className="flex items-center justify-center py-2">
                  <span className="text-sm text-gray-400 font-medium">Próximamente</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-gray-600 mb-4">
            Si tienes preguntas sobre la configuración o necesitas asistencia técnica, no dudes en contactarnos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href="#" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Ver Documentación
            </a>
            <a 
              href="#" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contactar Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}