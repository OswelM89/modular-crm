import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { ensureUserOrganization } from '../utils/org';

export interface Subscription {
  id: string;
  organization_id: string;
  status: 'active' | 'expired' | 'pending_payment' | 'cancelled';
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentOrder {
  id: string;
  organization_id: string;
  bold_order_id?: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const checkSubscriptionStatus = async () => {
    try {
      const organizationId = await ensureUserOrganization();
      if (!organizationId) {
        console.warn('⚠️ No se pudo obtener organización del usuario');
        setLoading(false);
        return;
      }
      
      console.log('🔍 Verificando estado de suscripción para organización:', organizationId);

      const { data, error } = await supabase.functions.invoke('subscription-status', {
        body: { organizationId }
      });

      if (error) {
        console.error('Error checking subscription status:', error);
        return;
      }

      setHasActiveSubscription(data.hasActiveSubscription);
      setSubscription(data.subscription);
      setPaymentOrders(data.recentPaymentOrders || []);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPaymentOrder = async () => {
    try {
      const organizationId = await ensureUserOrganization();
      if (!organizationId) {
        throw new Error('No se pudo obtener la organización del usuario');
      }
      
      console.log('💳 Creando orden de pago para organización:', organizationId);

      const { data, error } = await supabase.functions.invoke('create-subscription-order', {
        body: { organizationId }
      });

      if (error) {
        console.error('Error creating payment order:', error);
        throw error;
      }

      // Redirect to Bold.co payment page
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
      }

      // Refresh subscription status
      await checkSubscriptionStatus();

      return data;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    } else {
      setLoading(false);
      setHasActiveSubscription(false);
      setSubscription(null);
      setPaymentOrders([]);
    }
  }, [user]);

  return {
    subscription,
    paymentOrders,
    loading,
    hasActiveSubscription,
    checkSubscriptionStatus,
    createPaymentOrder
  };
}