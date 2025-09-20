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

    // Bold.co credentials
    const boldPublicKey = Deno.env.get('BOLD_PUBLIC_KEY');
    const boldSecretKey = Deno.env.get('BOLD_SECRET_KEY');
    const boldEnvironment = Deno.env.get('BOLD_ENVIRONMENT');
    
    const baseUrl = boldEnvironment === 'sandbox' 
      ? 'https://api-sandbox.bold.co' 
      : 'https://api.bold.co';

    console.log('Creating Bold.co payment order for organization:', organizationId);

    // Create payment order in database first
    const { data: paymentOrder, error: insertError } = await supabase
      .from('payment_orders')
      .insert({
        organization_id: organizationId,
        amount: 120000,
        currency: 'COP',
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating payment order:', insertError);
      throw new Error('Failed to create payment order');
    }

    // Create order in Bold.co
    const boldPayload = {
      amount: {
        currency: "COP",
        total_amount: 120000
      },
      order_reference: paymentOrder.id,
      description: "Suscripción mensual CRM - $120,000 COP",
      redirect_url: `${req.headers.get('origin')}/settings?payment=success`,
      webhook_url: `${supabaseUrl}/functions/v1/payment-webhook`,
      payment_methods: ["CARD", "PSE"],
      buyer: {
        buyer_reference: organizationId
      }
    };

    console.log('Sending request to Bold.co:', JSON.stringify(boldPayload, null, 2));

    const boldResponse = await fetch(`${baseUrl}/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${boldSecretKey}`
      },
      body: JSON.stringify(boldPayload)
    });

    if (!boldResponse.ok) {
      const errorText = await boldResponse.text();
      console.error('Bold.co API error:', boldResponse.status, errorText);
      throw new Error(`Bold.co API error: ${boldResponse.status} ${errorText}`);
    }

    const boldOrder = await boldResponse.json();
    console.log('Bold.co order created:', JSON.stringify(boldOrder, null, 2));

    // Update payment order with Bold.co order ID
    const { error: updateError } = await supabase
      .from('payment_orders')
      .update({ bold_order_id: boldOrder.id })
      .eq('id', paymentOrder.id);

    if (updateError) {
      console.error('Error updating payment order with Bold ID:', updateError);
    }

    return new Response(JSON.stringify({ 
      paymentUrl: boldOrder.checkout_url,
      orderId: boldOrder.id,
      orderReference: paymentOrder.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-subscription-order function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});