-- Add university field to seller_applications table

ALTER TABLE seller_applications 
ADD COLUMN IF NOT EXISTS university TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'seller_applications'
ORDER BY ordinal_position;
