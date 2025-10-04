import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { organizationId } = await req.json();
    
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Checking subscription status for organization:', organizationId);

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (subError && subError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching subscription:', subError);
      throw new Error('Failed to fetch subscription');
    }

    if (!subscription) {
      console.log('No subscription found for organization:', organizationId);
      return new Response(JSON.stringify({ 
        hasActiveSubscription: false,
        status: 'no_subscription',
        expiresAt: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if subscription is active and not expired
    const now = new Date();
    const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null;
    
    let isActive = false;
    let status = subscription.status;

    if (subscription.status === 'active' && expiresAt && expiresAt > now) {
      isActive = true;
    } else if (subscription.status === 'active' && expiresAt && expiresAt <= now) {
      // Subscription has expired, update status
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('organization_id', organizationId);

      if (updateError) {
        console.error('Error updating expired subscription:', updateError);
      }
      
      status = 'expired';
      isActive = false;
    }

    // Get recent payment orders for this organization
    const { data: paymentOrders } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('Subscription status check result:', {
      hasActiveSubscription: isActive,
      status,
      expiresAt: subscription.expires_at,
      recentPayments: paymentOrders?.length || 0
    });

    return new Response(JSON.stringify({ 
      hasActiveSubscription: isActive,
      status,
      expiresAt: subscription.expires_at,
      subscription,
      recentPaymentOrders: paymentOrders || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in subscription-status function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});