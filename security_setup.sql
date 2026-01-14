-- ============================================
-- SECURITY ENHANCEMENTS FOR SNAPCART
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. ADD INPUT VALIDATION CONSTRAINTS
-- Ensure data integrity at database level

-- Profiles table constraints
ALTER TABLE profiles ADD CONSTRAINT check_role_valid 
CHECK (role IN ('user', 'seller', 'admin'));

ALTER TABLE profiles ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Products table constraints
ALTER TABLE products ADD CONSTRAINT check_price_positive 
CHECK (price > 0);

ALTER TABLE products ADD CONSTRAINT check_name_not_empty 
CHECK (LENGTH(TRIM(name)) > 0);

ALTER TABLE products ADD CONSTRAINT check_category_valid 
CHECK (category IN ('Fashion', 'Electronics', 'Home', 'Beauty', 'Sports', 'Other'));

-- Seller applications constraints
ALTER TABLE seller_applications ADD CONSTRAINT check_status_valid 
CHECK (status IN ('pending', 'approved', 'rejected'));

ALTER TABLE seller_applications ADD CONSTRAINT check_whatsapp_format 
CHECK (whatsapp_number ~ '^[0-9]{10,15}$');

ALTER TABLE seller_applications ADD CONSTRAINT check_business_name_not_empty 
CHECK (LENGTH(TRIM(business_name)) > 0);

-- 2. ADD INDEXES FOR PERFORMANCE AND SECURITY
-- Prevent brute force attacks by making queries faster

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON seller_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON seller_applications(status);

-- 3. ENABLE REALTIME ONLY FOR NECESSARY TABLES
-- Disable realtime for sensitive data

ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS profiles;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS seller_applications;

-- 4. ADD AUDIT TRIGGERS (Optional - for tracking changes)
-- Uncomment if you want to track who changed what

-- CREATE TABLE IF NOT EXISTS audit_log (
--     id BIGSERIAL PRIMARY KEY,
--     table_name TEXT NOT NULL,
--     record_id UUID NOT NULL,
--     action TEXT NOT NULL,
--     old_data JSONB,
--     new_data JSONB,
--     user_id UUID REFERENCES profiles(id),
--     created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- 5. PREVENT SQL INJECTION WITH PREPARED STATEMENTS
-- Already handled by Supabase client, but add extra validation

-- Add function to sanitize text inputs
CREATE OR REPLACE FUNCTION sanitize_text(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Remove any potential SQL injection characters
    RETURN REGEXP_REPLACE(input_text, '[;<>''"]', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. RATE LIMITING AT DATABASE LEVEL
-- Prevent spam by limiting inserts per user

CREATE OR REPLACE FUNCTION check_application_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- Count applications from this user in last hour
    SELECT COUNT(*) INTO recent_count
    FROM seller_applications
    WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '1 hour';
    
    IF recent_count >= 3 THEN
        RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting again.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rate_limit_applications ON seller_applications;
CREATE TRIGGER rate_limit_applications
    BEFORE INSERT ON seller_applications
    FOR EACH ROW
    EXECUTE FUNCTION check_application_rate_limit();

-- 7. PREVENT PRIVILEGE ESCALATION
-- Users cannot promote themselves to admin

CREATE OR REPLACE FUNCTION prevent_self_promotion()
RETURNS TRIGGER AS $$
BEGIN
    -- Only admins can change roles
    IF OLD.role != NEW.role THEN
        IF NOT EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Only admins can change user roles';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_role_escalation ON profiles;
CREATE TRIGGER prevent_role_escalation
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_self_promotion();

-- 8. AUTO-DELETE OLD REJECTED APPLICATIONS
-- Keep database clean and prevent data bloat

CREATE OR REPLACE FUNCTION cleanup_old_applications()
RETURNS void AS $$
BEGIN
    DELETE FROM seller_applications
    WHERE status = 'rejected'
    AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run manually or set up cron job)
-- SELECT cleanup_old_applications();

-- 9. VERIFY SECURITY SETUP
SELECT 'Security measures applied successfully!' as status;

-- Check constraints
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name
FROM pg_constraint
WHERE contype = 'c'
AND conrelid::regclass::text IN ('profiles', 'products', 'seller_applications')
ORDER BY table_name, constraint_name;
