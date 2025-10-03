import { UserPlus, FileText, Plus, CreditCard } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AddUserPage } from './AddUserPage';
import { QuoteConfigPage } from './QuoteConfigPage';
import { BillingPage } from './BillingPage';

export function SettingsPage() {
  const navigate = useNavigate();

  const settingsCards = [
    {
      id: 'billing',
      title: 'Facturación',
      description: 'Gestiona tu suscripción y métodos de pago',
      icon: CreditCard,
      color: 'bg-gray-100',
      available: true,
      action: () => navigate('/configuracion/facturacion')
    },
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      description: 'Administra los usuarios de tu equipo y sus permisos',
      icon: UserPlus,
      color: 'bg-gray-100',
      available: true,
      action: () => navigate('/configuracion/gestion-de-usuarios')
    },
    {
      id: 'quotes',
      title: 'Configuración de Cotizaciones',
      description: 'Personaliza plantillas y configuraciones de cotizaciones',
      icon: FileText,
      color: 'bg-gray-100',
      available: true,
      action: () => navigate('/configuracion/configuracion-de-cotizaciones')
    },
    {
      id: 'integrations',
      title: 'Integraciones',
      description: 'Conecta con herramientas externas y APIs',
      icon: Plus,
      color: 'bg-gray-100',
      available: false,
      action: () => {}
    },
    {
      id: 'security',
      title: 'Seguridad',
      description: 'Configuraciones de seguridad y acceso',
      icon: Plus,
      color: 'bg-gray-100',
      available: false,
      action: () => {}
    }
  ];

  const MainSettings = () => (
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
              className={`bg-white border border-gray-200 rounded-xl p-6 transition-colors ${
                card.available 
                  ? 'cursor-pointer' 
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex flex-col items-start space-y-1">
                <Icon className="w-8 h-8 text-black" />
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-sm text-gray-500">{card.description}</p>
                
                {!card.available && (
                  <div className="pt-2">
                    <span className="text-sm text-gray-400 font-medium">Próximamente</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
              >
                Ver Documentación
              </a>
              <a 
                href="#" 
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg"
              >
                Contactar Soporte
              </a>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route index element={<MainSettings />} />
      <Route path="facturacion" element={<BillingPage onBack={() => navigate('/configuracion')} />} />
      <Route path="gestion-de-usuarios" element={<AddUserPage onBack={() => navigate('/configuracion')} />} />
      <Route path="configuracion-de-cotizaciones" element={<QuoteConfigPage onBack={() => navigate('/configuracion')} />} />
    </Routes>
  );
}