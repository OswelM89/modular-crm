import { Settings, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';

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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-display-lg mb-2">
            <span className="text-foreground">
              Hola 
            </span>
            <span className="ml-2 bg-gradient-primary bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {getDailyMessage()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onSectionChange('tutoriales')}
            variant="secondary"
            size="lg"
            className="hover-scale bg-[#77ff00] text-black hover:bg-[#77ff00]/90"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Tutoriales
          </Button>
          <Button
            onClick={() => onSectionChange('settings')}
            variant="default"
            size="lg"
            className="hover-scale"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

    </div>
  );
}