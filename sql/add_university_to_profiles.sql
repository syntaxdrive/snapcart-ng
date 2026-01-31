-- Add university field to profiles table

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS university TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
