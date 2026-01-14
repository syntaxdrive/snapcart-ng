-- Add unique constraint to prevent duplicate seller applications
-- and ensure data integrity

-- 1. Add unique constraint on user_id (one application per user)
ALTER TABLE seller_applications 
DROP CONSTRAINT IF EXISTS seller_applications_user_id_key;

ALTER TABLE seller_applications 
ADD CONSTRAINT seller_applications_user_id_key UNIQUE (user_id);

-- 2. Add check constraint to ensure valid status values
ALTER TABLE seller_applications 
DROP CONSTRAINT IF EXISTS seller_applications_status_check;

ALTER TABLE seller_applications 
ADD CONSTRAINT seller_applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- 3. Ensure whatsapp_number is not null
ALTER TABLE seller_applications 
ALTER COLUMN whatsapp_number SET NOT NULL;

-- 4. Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_seller_applications_status 
ON seller_applications(status);

CREATE INDEX IF NOT EXISTS idx_seller_applications_user_id 
ON seller_applications(user_id);

-- Verify constraints
SELECT 
    constraint_name, 
    constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'seller_applications';
