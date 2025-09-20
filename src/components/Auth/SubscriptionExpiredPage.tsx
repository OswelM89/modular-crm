import { useState } from 'react';
import { CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';

export function SubscriptionExpiredPage() {
  const { createPaymentOrder } = useSubscription();
  const [creatingOrder, setCreatingOrder] = useState(false);

  const handleSubscribe = async () => {
    try {
      setCreatingOrder(true);
      await createPaymentOrder();
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Error al crear la orden de pago. Por favor, inténtalo de nuevo.');
    } finally {
      setCreatingOrder(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Suscripción Requerida
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tu suscripción ha expirado. Renueva para continuar usando el CRM.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Plan Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Plan Mensual CRM
            </h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatAmount(120000)}
                  </div>
                  <div className="text-gray-600">por mes</div>
                </div>
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Gestión completa de contactos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Administración de empresas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Pipeline de ventas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Generación de cotizaciones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Dashboard y reportes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Gestión de usuarios</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="mb-6">
            <button
              onClick={handleSubscribe}
              disabled={creatingOrder}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {creatingOrder ? 'Procesando...' : 'Suscribirse Ahora'}
            </button>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Pago seguro procesado por Bold.co
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tu suscripción se activará inmediatamente después del pago
            </p>
          </div>
        </div>

        {/* Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Tienes preguntas?{' '}
            <a href="#" className="text-primary hover:text-primary/90 font-medium">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}