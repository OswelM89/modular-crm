-- Create subscription status enum
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'pending_payment', 'cancelled');

-- Create payment order status enum  
CREATE TYPE payment_order_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL,
  status subscription_status NOT NULL DEFAULT 'pending_payment',
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(organization_id)
);

-- Create payment_orders table
CREATE TABLE public.payment_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL,
  bold_order_id text,
  amount numeric NOT NULL DEFAULT 120000,
  currency text NOT NULL DEFAULT 'COP',
  status payment_order_status NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their organization subscriptions"
ON public.subscriptions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = subscriptions.organization_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can insert their organization subscriptions"
ON public.subscriptions 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = subscriptions.organization_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can update their organization subscriptions"
ON public.subscriptions 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = subscriptions.organization_id 
  AND m.user_id = auth.uid()
));

-- Create RLS policies for payment_orders
CREATE POLICY "Users can view their organization payment orders"
ON public.payment_orders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = payment_orders.organization_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can insert their organization payment orders"
ON public.payment_orders 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = payment_orders.organization_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can update their organization payment orders"
ON public.payment_orders 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = payment_orders.organization_id 
  AND m.user_id = auth.uid()
));

-- Add triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_orders_updated_at
  BEFORE UPDATE ON public.payment_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();