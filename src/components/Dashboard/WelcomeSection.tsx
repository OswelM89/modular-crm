import { Settings, BookOpen } from 'lucide-react';

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


  return (
    <div className="mb-8">
      {/* Mensaje de bienvenida */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-0">
            Hola {userName}
          </h1>
          <p className="text-gray-600" style={{ fontSize: '18px' }}>
            {getDailyMessage()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSectionChange('tutoriales')}
            className="inline-flex items-center px-6 py-3 text-base bg-[#212830] text-white hover:bg-gray-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Tutoriales
          </button>
          <button
            onClick={() => onSectionChange('settings')}
            className="inline-flex items-center px-6 py-3 text-base bg-[#FF6200] text-white hover:bg-orange-600 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </button>
        </div>
      </div>

    </div>
  );
}