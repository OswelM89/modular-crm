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
          <p className="text-gray-600 text-sm font-medium mb-2">Good Morning</p>
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            {userName}
          </h1>
          <p className="text-gray-600 text-base">
            {getDailyMessage()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-2 flex items-center gap-2 text-sm">
            <span className="text-gray-600">2024</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button
            onClick={() => onSectionChange('settings')}
            className="inline-flex items-center px-4 py-2 text-sm bg-teal-primary text-white rounded-lg hover:bg-teal-dark transition-colors"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}