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
    const webhookData = await req.json();
    
    console.log('Received Bold.co webhook:', JSON.stringify(webhookData, null, 2));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { order, transaction } = webhookData;
    
    if (!order || !transaction) {
      console.log('Invalid webhook data - missing order or transaction');
      return new Response('Invalid webhook data', { status: 400 });
    }

    // Find payment order by order reference (our internal payment order ID)
    const { data: paymentOrder, error: findError } = await supabase
      .from('payment_orders')
      .select('*, organization_id')
      .eq('id', order.order_reference)
      .single();

    if (findError || !paymentOrder) {
      console.error('Payment order not found:', order.order_reference, findError);
      return new Response('Payment order not found', { status: 404 });
    }

    console.log('Found payment order:', paymentOrder);

    // Update payment order status based on transaction status
    let newStatus = 'pending';
    if (transaction.status === 'APPROVED') {
      newStatus = 'completed';
    } else if (transaction.status === 'REJECTED' || transaction.status === 'FAILED') {
      newStatus = 'failed';
    } else if (transaction.status === 'CANCELLED') {
      newStatus = 'cancelled';
    }

    // Update payment order
    const { error: updatePaymentError } = await supabase
      .from('payment_orders')
      .update({ 
        status: newStatus,
        bold_order_id: order.id
      })
      .eq('id', paymentOrder.id);

    if (updatePaymentError) {
      console.error('Error updating payment order:', updatePaymentError);
    }

    // If payment is successful, activate or extend subscription
    if (transaction.status === 'APPROVED') {
      console.log('Payment approved, activating subscription for organization:', paymentOrder.organization_id);
      
      // Calculate expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Check if subscription exists
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('organization_id', paymentOrder.organization_id)
        .single();

      if (existingSubscription) {
        // Update existing subscription
        const { error: updateSubError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            expires_at: expiryDate.toISOString()
          })
          .eq('organization_id', paymentOrder.organization_id);

        if (updateSubError) {
          console.error('Error updating subscription:', updateSubError);
        } else {
          console.log('Subscription updated successfully');
        }
      } else {
        // Create new subscription
        const { error: createSubError } = await supabase
          .from('subscriptions')
          .insert({
            organization_id: paymentOrder.organization_id,
            status: 'active',
            expires_at: expiryDate.toISOString()
          });

        if (createSubError) {
          console.error('Error creating subscription:', createSubError);
        } else {
          console.log('Subscription created successfully');
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in payment-webhook function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});