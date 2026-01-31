-- Add dynamic button fields to banners table

ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS button_text TEXT,
ADD COLUMN IF NOT EXISTS button_link TEXT,
ADD COLUMN IF NOT EXISTS show_default_buttons BOOLEAN DEFAULT TRUE;

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'banners';
