-- Deletes all products from the database
-- This works if you have ON DELETE CASCADE set up for related tables (like reviews/likes).
-- If not, we attempt to clean known related tables first (if they exist in your schema).

-- 1. Clean up product-specific relations (modify based on your exact schema if needed)
-- Attempting to delete from dependent tables if they exist (commented out common ones)
-- DELETE FROM product_images WHERE product_id IS NOT NULL; 
-- DELETE FROM saved_items WHERE product_id IS NOT NULL;

-- 2. Delete the products
DELETE FROM products;

-- Note: This does not delete the actual image files from Supabase Storage buckets, 
-- but they will no longer appear in the app.
