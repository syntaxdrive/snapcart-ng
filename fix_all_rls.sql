-- ============================================
-- COMPREHENSIVE RLS FIX FOR ALL TABLES
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. PROFILES TABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Allow public read for seller names, etc
CREATE POLICY "Public profiles viewable" ON public.profiles
FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- 2. PRODUCTS TABLE
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Sellers can insert products" ON public.products;
DROP POLICY IF EXISTS "Sellers can update products" ON public.products;
DROP POLICY IF EXISTS "Sellers can delete products" ON public.products;

-- Public read for marketplace
CREATE POLICY "Public can view products" ON public.products
FOR SELECT USING (true);

-- Sellers can manage their own products
CREATE POLICY "Sellers can insert products" ON public.products
FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update products" ON public.products
FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete products" ON public.products
FOR DELETE USING (auth.uid() = seller_id);

-- 3. SELLER_APPLICATIONS TABLE
ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can submit applications" ON public.seller_applications;
DROP POLICY IF EXISTS "Users can view own applications" ON public.seller_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.seller_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.seller_applications;
DROP POLICY IF EXISTS "Public can view approved sellers" ON public.seller_applications;

-- Users can submit their own application
CREATE POLICY "Users can submit applications" ON public.seller_applications
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON public.seller_applications
FOR SELECT USING (auth.uid() = user_id);

-- Public can view approved sellers (for Stores page)
CREATE POLICY "Public can view approved sellers" ON public.seller_applications
FOR SELECT USING (status = 'approved');

-- Admins can view all
CREATE POLICY "Admins can view all applications" ON public.seller_applications
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Admins can update (approve/reject)
CREATE POLICY "Admins can update applications" ON public.seller_applications
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 4. BANNERS TABLE
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active banners" ON public.banners;
DROP POLICY IF EXISTS "Admins can manage banners" ON public.banners;

-- Public can view active banners
CREATE POLICY "Public can view active banners" ON public.banners
FOR SELECT USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage banners" ON public.banners
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 5. STORAGE BUCKETS
-- Products bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Banners bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for products
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload products" ON storage.objects;

CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Authenticated can upload products" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Storage policies for banners
DROP POLICY IF EXISTS "Public can view banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload banners" ON storage.objects;

CREATE POLICY "Public can view banners" ON storage.objects
FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Admins can upload banners" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'banners' AND 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 6. PROMOTE USER TO ADMIN
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'quakestartup@gmail.com';

-- 7. VERIFY EVERYTHING
SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Seller Applications', COUNT(*) FROM seller_applications
UNION ALL
SELECT 'Banners', COUNT(*) FROM banners;

SELECT email, role FROM profiles WHERE email = 'quakestartup@gmail.com';
