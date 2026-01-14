-- Remove the unique constraint that's causing issues
-- This allows users to reapply after rejection without complex delete logic

ALTER TABLE seller_applications 
DROP CONSTRAINT IF EXISTS seller_applications_user_id_key;

-- Verify
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'seller_applications' 
AND constraint_type = 'UNIQUE';
