import { CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface RegistrationSuccessPageProps {
  onGoToLogin: () => void
}

export function RegistrationSuccessPage({ onGoToLogin }: RegistrationSuccessPageProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <img 
            src="/Logo modular CRM.svg" 
            alt="Modular CRM" 
            className="h-12 w-auto mx-auto mb-4"
          />
        </div>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-success" />
            </div>
            <CardTitle className="text-display-sm text-foreground">
              ¡Registro Exitoso!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-3">
              <p className="text-foreground">
                Tu cuenta ha sido creada correctamente.
              </p>
              <p className="text-muted-foreground text-sm">
                Revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
              <p className="text-sm text-primary">
                ✨ Se ha creado automáticamente tu organización y tienes rol administrador. Los usuarios que invites tendrán rol gestor.
              </p>
            </div>

            <Button
              onClick={onGoToLogin}
              className="w-full"
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}