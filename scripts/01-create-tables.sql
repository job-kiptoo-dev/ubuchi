
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -- Create products table
-- CREATE TABLE IF NOT EXISTS public.products (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   name TEXT NOT NULL,
--   description TEXT,
--   price DECIMAL(10,2) NOT NULL,
--   category TEXT NOT NULL CHECK (category IN ('hormonal_balance', 'energy', 'sleep', 'wellness')),
--   image_url TEXT,
--   stock_quantity INTEGER DEFAULT 0,
--   is_active BOOLEAN DEFAULT true,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );


CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('hormonal_balance', 'energy', 'sleep', 'wellness')),
  image_url TEXT,
  stock_grams INTEGER DEFAULT 0, -- total grams in stock
  price_per_gram NUMERIC(10,2), -- optional, if you still want to calculate money
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

)CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  kg NUMERIC(10,3) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Create cart table for persistent shopping cart
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  grams_ordered INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (
    public.is_admin()
  );

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    public.is_admin()
  );

-- Order items policies
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Cart policies
CREATE POLICY "Users can manage own cart" ON public.cart_items
  FOR ALL USING (user_id = auth.uid());

-- Use is_admin() where admin-checks need to bypass RLS on profiles

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  mpesa_receipt_number TEXT,
  transaction_status TEXT DEFAULT 'pending' CHECK (transaction_status IN ('pending', 'paid', 'failed')),
  callback_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Customers can view their own payments (through orders)
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_id AND public.orders.user_id = auth.uid()
    )
  );

-- Insert policy (only via your backend after order creation)
CREATE POLICY "Allow insert payments via backend" ON public.payments
  FOR INSERT WITH CHECK (true);


-- Create checkout table
CREATE TABLE IF NOT EXISTS checkout (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional: a join table for checkout items
CREATE TABLE IF NOT EXISTS checkout_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_id UUID REFERENCES checkout(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  price NUMERIC(10,2) NOT NULL
);
