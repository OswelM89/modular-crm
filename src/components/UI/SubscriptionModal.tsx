import { useState } from 'react';
import { AlertTriangle, CreditCard, CheckCircle, X } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { createPaymentOrder } = useSubscription();
  const [creatingOrder, setCreatingOrder] = useState(false);

  const handleCreatePayment = async () => {
    try {
      setCreatingOrder(true);
      await createPaymentOrder();
      onClose();
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Error al crear la orden de pago. Por favor, inténtalo de nuevo.');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Suscripción Requerida</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-gray-600">
            Para agregar datos necesitas activar tu suscripción
          </p>
        </div>

        {/* Plan Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Plan Mensual CRM
          </h3>
          
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-gray-900">$ 120.000,00</div>
            <div className="text-sm text-gray-600">por mes</div>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Gestión completa de contactos</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Pipeline de ventas</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Generación de cotizaciones</span>
            </div>
          </div>
          
          <button
            onClick={handleCreatePayment}
            disabled={creatingOrder}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {creatingOrder ? 'Procesando...' : 'Suscribirse Ahora'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Pago seguro procesado por Bold.co
          </p>
        </div>
      </div>
    </div>
  );
}