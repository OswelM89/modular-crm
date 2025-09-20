import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Calendar, CheckCircle, XCircle, Clock, AlertTriangle, Ban } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { supabase } from '../../integrations/supabase/client';

interface BillingPageProps {
  onBack: () => void;
}

export function BillingPage({ onBack }: BillingPageProps) {
  const { 
    subscription, 
    paymentOrders, 
    loading, 
    hasActiveSubscription, 
    createPaymentOrder,
    checkSubscriptionStatus 
  } = useSubscription();
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [reactivatingSubscription, setReactivatingSubscription] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Calculate time remaining when subscription is cancelled
  useEffect(() => {
    if (subscription?.status === 'cancelled' && subscription?.expires_at) {
      const updateTimeRemaining = () => {
        const now = new Date().getTime();
        const expiry = new Date(subscription.expires_at!).getTime();
        const difference = expiry - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          
          if (days > 0) {
            setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
          } else if (hours > 0) {
            setTimeRemaining(`${hours}h ${minutes}m`);
          } else {
            setTimeRemaining(`${minutes}m`);
          }
        } else {
          setTimeRemaining('Expirado');
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [subscription]);

  const handleCancelSubscription = async () => {
    try {
      setCancellingSubscription(true);
      const { error } = await supabase.rpc('cancel_subscription');
      
      if (error) {
        console.error('Error cancelling subscription:', error);
        alert('Error al cancelar la suscripción. Por favor, inténtalo de nuevo.');
      } else {
        await checkSubscriptionStatus();
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Error al cancelar la suscripción. Por favor, inténtalo de nuevo.');
    } finally {
      setCancellingSubscription(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setReactivatingSubscription(true);
      const { error } = await supabase.rpc('reactivate_subscription');
      
      if (error) {
        console.error('Error reactivating subscription:', error);
        alert('Error al reactivar la suscripción. Por favor, inténtalo de nuevo.');
      } else {
        await checkSubscriptionStatus();
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      alert('Error al reactivar la suscripción. Por favor, inténtalo de nuevo.');
    } finally {
      setReactivatingSubscription(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'failed':
        return 'Fallido';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
          <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
            Facturación
          </h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>
        <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
          Facturación
        </h1>
      </div>

      {/* Subscription Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Estado de Suscripción
            </h2>
            {hasActiveSubscription && subscription?.status === 'active' ? (
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-green-700 font-medium">Suscripción Activa</span>
              </div>
            ) : subscription?.status === 'cancelled' ? (
              <div className="flex items-center space-x-2 mb-4">
                <Ban className="w-6 h-6 text-amber-600" />
                <span className="text-amber-700 font-medium">Suscripción Cancelada</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <span className="text-red-700 font-medium">Suscripción Inactiva</span>
              </div>
            )}
            
            {subscription?.expires_at && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>
                  {hasActiveSubscription ? 'Renovación automática: ' : 'Expiró: '}
                  {formatDate(subscription.expires_at)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {subscription?.status === 'cancelled' ? (
              <div className="flex flex-col gap-3 items-end">
                <button
                  onClick={handleReactivateSubscription}
                  disabled={reactivatingSubscription}
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors rounded-lg font-medium"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {reactivatingSubscription ? 'Reactivando...' : 'Reanudar Suscripción'}
                </button>
                <div className="text-sm text-amber-600 font-medium">
                  Te quedan {timeRemaining} de suscripción pagada
                </div>
              </div>
            ) : !hasActiveSubscription ? (
              <button
                onClick={handleCreatePayment}
                disabled={creatingOrder}
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors rounded-lg font-medium"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {creatingOrder ? 'Procesando...' : 'Suscribirse Ahora'}
              </button>
            ) : subscription?.status === 'active' ? (
              <button
                onClick={handleCancelSubscription}
                disabled={cancellingSubscription}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors rounded-lg font-medium"
              >
                <Ban className="w-5 h-5 mr-2" />
                {cancellingSubscription ? 'Cancelando...' : 'Cancelar Suscripción'}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Plan de Suscripción
        </h2>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">Plan Mensual CRM</h3>
              <p className="text-gray-600">Acceso completo a todas las funcionalidades</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(120000)}
              </div>
              <div className="text-gray-600">por mes</div>
            </div>
          </div>
        </div>
        
        {hasActiveSubscription && (
          <button
            onClick={handleCreatePayment}
            disabled={creatingOrder}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors rounded-lg"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {creatingOrder ? 'Procesando...' : 'Renovar Suscripción'}
          </button>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Historial de Pagos
        </h2>
        
        {paymentOrders.length === 0 ? (
          <p className="text-gray-600">No hay órdenes de pago registradas.</p>
        ) : (
          <div className="space-y-3">
            {paymentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatAmount(order.amount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {getStatusText(order.status)}
                  </div>
                  {order.bold_order_id && (
                    <div className="text-sm text-gray-600">
                      ID: {order.bold_order_id.slice(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          ¿Necesitas ayuda con tu facturación?
        </h2>
        <p className="text-gray-600 mb-4">
          Si tienes preguntas sobre tu suscripción, pagos o necesitas asistencia técnica, contacta nuestro soporte.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a 
            href="#" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
          >
            Ver FAQ
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
  );
}