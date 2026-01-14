
-- 1. DELETE ALL DATA (Order matters due to foreign keys)

-- Delete all products first (they belong to sellers)
DELETE FROM public.products;

-- Delete seller applications
DELETE FROM public.seller_applications;

-- Delete banners
DELETE FROM public.banners;

-- Delete profiles (This is the public info for users)
DELETE FROM public.profiles;


-- 2. NOW GO TO AUTHENTICATION TAB
-- Go to Supabase Dashboard -> Authentication -> Users.
-- Select All -> Delete.
-- It should work now because there is no data linked to them!
