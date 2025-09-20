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

    console.log('🏢 Validando organización:', organizationId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('❌ Error validating user:', userError);
      throw new Error('Invalid authentication');
    }

    // Validate that the organization belongs to the authenticated user
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      console.error('❌ Usuario no pertenece a la organización:', membershipError);
      throw new Error('User does not belong to this organization');
    }

    console.log('✅ Organización validada correctamente para usuario:', user.id);

    // Bold.co credentials
    const boldPublicKey = Deno.env.get('BOLD_PUBLIC_KEY');
    const boldSecretKey = Deno.env.get('BOLD_SECRET_KEY');
    const boldEnvironment = Deno.env.get('BOLD_ENVIRONMENT');
    
    // Correct Bold.co API URL
    const baseUrl = 'https://integrations.api.bold.co';

    console.log('Creating Bold.co payment order for organization:', organizationId);

    // Create payment order in database first
    const { data: paymentOrder, error: insertError } = await supabase
      .from('payment_orders')
      .insert({
        organization_id: organizationId,
        amount: 20000,
        currency: 'COP',
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating payment order:', insertError);
      throw new Error('Failed to create payment order');
    }

    // Create payment link in Bold.co using Payment Link API
    const boldPayload = {
      amount_type: "CLOSE", // Fixed amount
      amount: {
        currency: "COP",
        total_amount: 20000
      },
      description: "Suscripción mensual CRM - $20,000 COP",
      callback_url: `${req.headers.get('origin')}/settings?payment=success`,
      webhook_url: `https://drmismwbcohktquctoal.supabase.co/functions/v1/payment-webhook`,
      payment_methods: ["CREDIT_CARD", "PSE"]
    };

    console.log('Sending request to Bold.co:', JSON.stringify(boldPayload, null, 2));

    const boldResponse = await fetch(`${baseUrl}/online/link/v1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `x-api-key ${boldPublicKey}`
      },
      body: JSON.stringify(boldPayload)
    });

    if (!boldResponse.ok) {
      const errorText = await boldResponse.text();
      console.error('Bold.co API error:', boldResponse.status, errorText);
      throw new Error(`Bold.co API error: ${boldResponse.status} ${errorText}`);
    }

    const boldResponse_data = await boldResponse.json();
    console.log('Bold.co payment link created:', JSON.stringify(boldResponse_data, null, 2));

    const boldOrder = boldResponse_data.payload;

    // Update payment order with Bold.co link ID
    const { error: updateError } = await supabase
      .from('payment_orders')
      .update({ bold_order_id: boldOrder.payment_link })
      .eq('id', paymentOrder.id);

    if (updateError) {
      console.error('Error updating payment order with Bold ID:', updateError);
    }

    return new Response(JSON.stringify({ 
      paymentUrl: boldOrder.url,
      orderId: boldOrder.payment_link,
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