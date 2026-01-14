
-- 1. Add image_url column to banners if it doesn't exist
ALTER TABLE public.banners 
ADD COLUMN IF NOT EXISTS image_url text;

-- 2. (Optional) Storage Policy via SQL (If you didn't set Public in dashboard)
-- Note: It is safer to set 'Public' in the dashboard UI when creating the bucket.
