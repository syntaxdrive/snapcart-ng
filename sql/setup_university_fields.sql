-- Complete university setup for SnapCart
-- Run this in Supabase SQL Editor

-- 1. Add university to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS university TEXT;

-- 2. Add university to seller_applications table  
ALTER TABLE seller_applications 
ADD COLUMN IF NOT EXISTS university TEXT;

-- 3. Verify columns were added
SELECT 'Profiles columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles'
AND column_name IN ('university', 'email', 'role')
ORDER BY ordinal_position;

SELECT 'Seller Applications columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'seller_applications'
AND column_name IN ('university', 'business_name', 'status')
ORDER BY ordinal_position;

SELECT 'Setup complete!' as status;
