-- ============================================
-- SNAPCART - COMPLETE DATABASE SETUP
-- Run this ONCE in Supabase SQL Editor
-- ============================================

-- 1. PROFILES TABLE - Simple RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "admins_update_profiles" ON public.profiles;
CREATE POLICY "admins_update_profiles" ON public.profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 2. PRODUCTS TABLE - Simple RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select" ON public.products;
CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "products_insert" ON public.products;
CREATE POLICY "products_insert" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "products_update" ON public.products;
CREATE POLICY "products_update" ON public.products FOR UPDATE USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "products_delete" ON public.products;
CREATE POLICY "products_delete" ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- 3. SELLER_APPLICATIONS TABLE - Simple RLS
ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "applications_select" ON public.seller_applications;
CREATE POLICY "applications_select" ON public.seller_applications FOR SELECT USING (
    auth.uid() = user_id OR 
    status = 'approved' OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "applications_insert" ON public.seller_applications;
CREATE POLICY "applications_insert" ON public.seller_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "applications_update" ON public.seller_applications;
CREATE POLICY "applications_update" ON public.seller_applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 4. BANNERS TABLE - Simple RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "banners_select" ON public.banners;
CREATE POLICY "banners_select" ON public.banners FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "banners_all" ON public.banners;
CREATE POLICY "banners_all" ON public.banners FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 5. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT DO NOTHING;

-- 6. STORAGE POLICIES
DROP POLICY IF EXISTS "storage_select" ON storage.objects;
CREATE POLICY "storage_select" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "storage_insert" ON storage.objects;
CREATE POLICY "storage_insert" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 7. REMOVE UNIQUE CONSTRAINT (allow reapplication)
ALTER TABLE seller_applications DROP CONSTRAINT IF EXISTS seller_applications_user_id_key;

-- 8. MAKE YOU ADMIN
UPDATE profiles SET role = 'admin' WHERE email = 'quakestartup@gmail.com';

-- 9. VERIFY
SELECT 'Setup Complete!' as status;
SELECT email, role FROM profiles WHERE email = 'quakestartup@gmail.com';
