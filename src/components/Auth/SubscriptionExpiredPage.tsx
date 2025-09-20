import { useState, useEffect } from 'react';
import { AlertTriangle, CreditCard, CheckCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';

export function SubscriptionExpiredPage() {
  const { 
    createPaymentOrder,
    checkSubscriptionStatus,
    loading 
  } = useSubscription();
  const { user, signOut } = useAuth();
  const [creatingOrder, setCreatingOrder] = useState(false);

  const handleCreatePayment = async () => {
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

  // Check for payment success in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const boldOrderId = urlParams.get('bold-order-id');
    const boldTxStatus = urlParams.get('bold-tx-status');
    
    if (paymentStatus === 'success' || boldTxStatus === 'approved') {
      if (boldOrderId && boldTxStatus === 'approved') {
        // Activate subscription for this specific payment
        activatePayment(boldOrderId);
      } else {
        // Just refresh subscription status
        checkSubscriptionStatus();
      }
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [checkSubscriptionStatus]);

  const activatePayment = async (boldOrderId: string) => {
    try {
      const { error } = await supabase.rpc('activate_subscription_for_order', {
        p_bold_order_id: boldOrderId
      });
      
      if (error) {
        console.error('Error activating subscription:', error);
      } else {
        // Refresh subscription status after activation
        setTimeout(() => checkSubscriptionStatus(), 1000);
      }
    } catch (error) {
      console.error('Error activating payment:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* User Info Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user?.user_metadata?.first_name && user?.user_metadata?.last_name 
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                  : user?.email
                }
              </p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Subscription Required Card */}
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Suscripción Requerida
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            Tu cuenta ha sido creada exitosamente. Para continuar usando el CRM, necesitas activar tu suscripción.
          </p>

          {/* Plan Card */}
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Plan Mensual CRM
              </h2>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $ 120.000,00
                </div>
                <div className="text-gray-600">por mes</div>
              </div>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Gestión completa de contactos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Administración de empresas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Pipeline de ventas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Generación de cotizaciones</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Dashboard y reportes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Gestión de usuarios</span>
                </div>
              </div>
              
              <button
                onClick={handleCreatePayment}
                disabled={creatingOrder}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {creatingOrder ? 'Procesando...' : 'Suscribirse Ahora'}
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Pago seguro procesado por Bold.co
            </p>
            <p className="text-sm text-gray-500">
              Tu suscripción se activará inmediatamente después del pago
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">¿Tienes preguntas?</p>
          <a 
            href="#" 
            className="text-blue-600 hover:text-blue-700 font-medium"
            onClick={(e) => {
              e.preventDefault();
              alert('Contacta nuestro soporte: soporte@inmolinks.com');
            }}
          >
            Contacta soporte
          </a>
        </div>
      </div>
    </div>
  );
}