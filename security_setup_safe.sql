-- ============================================
-- SAFE SECURITY ENHANCEMENTS FOR SNAPCART
-- This version won't break existing data
-- ============================================

-- 1. ADD INDEXES FOR PERFORMANCE (Safe - always good)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON seller_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON seller_applications(status);

-- 2. PREVENT PRIVILEGE ESCALATION (Safe - adds protection)
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

-- 3. RATE LIMITING (Safe - prevents spam)
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
    
    IF recent_count >= 5 THEN
        RAISE EXCEPTION 'Too many applications. Please wait before trying again.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rate_limit_applications ON seller_applications;
CREATE TRIGGER rate_limit_applications
    BEFORE INSERT ON seller_applications
    FOR EACH ROW
    EXECUTE FUNCTION check_application_rate_limit();

-- 4. CLEANUP FUNCTION (Safe - run manually)
CREATE OR REPLACE FUNCTION cleanup_old_applications()
RETURNS void AS $$
BEGIN
    DELETE FROM seller_applications
    WHERE status = 'rejected'
    AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Don't run cleanup automatically, just make it available
-- To run manually: SELECT cleanup_old_applications();

-- VERIFY
SELECT 'Safe security measures applied!' as status;
