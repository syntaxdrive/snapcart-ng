-- Ensure products table has category column

-- Add category column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Set default categories for existing products without category
UPDATE products 
SET category = 'Other' 
WHERE category IS NULL;

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;

SELECT 'Category column ready!' as status;
