-- Enable RLS (just in case)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 1. INSERT Policy
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
CREATE POLICY "Users can insert their own products" ON public.products
FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- 2. UPDATE Policy
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
CREATE POLICY "Users can update their own products" ON public.products
FOR UPDATE USING (auth.uid() = seller_id);

-- 3. DELETE Policy
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
CREATE POLICY "Users can delete their own products" ON public.products
FOR DELETE USING (auth.uid() = seller_id);

-- 4. STORAGE Policies (Crucial for Image Upload)
-- We need to ensure the 'products' bucket allows upload
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read
DROP POLICY IF EXISTS "Public Display" ON storage.objects;
CREATE POLICY "Public Display" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'products' AND auth.role() = 'authenticated' );

-- Allow users to update/delete their own files (Optional but good)
DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
CREATE POLICY "Owner Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'products' AND auth.uid() = owner );
