-- Make snapcart882@gmail.com an admin
-- This bypasses the security trigger temporarily

-- Step 1: Disable the trigger temporarily
DROP TRIGGER IF EXISTS prevent_role_escalation ON profiles;

-- Step 2: Check if user exists
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'snapcart882@gmail.com';

-- Step 3: Promote to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'snapcart882@gmail.com';

-- Step 4: Re-enable the security trigger
CREATE TRIGGER prevent_role_escalation
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_self_promotion();

-- Step 5: Verify the change
SELECT id, email, full_name, role, created_at
FROM profiles 
WHERE email = 'snapcart882@gmail.com';

-- Step 6: Check all admins
SELECT email, full_name, role 
FROM profiles 
WHERE role = 'admin'
ORDER BY created_at;
