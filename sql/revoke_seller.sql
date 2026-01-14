-- Revoke seller privileges
-- Replace 'user_email@example.com' with the actual email

-- Get user details
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'user_email@example.com';

-- After confirming, run these:
-- (Replace USER_ID with actual value)

-- Update user role back to user
UPDATE profiles 
SET role = 'user' 
WHERE id = 'USER_ID';

-- Reject their application
UPDATE seller_applications 
SET status = 'rejected' 
WHERE user_id = 'USER_ID' 
AND status = 'approved';

-- Verify
SELECT p.email, p.role, sa.status
FROM profiles p
LEFT JOIN seller_applications sa ON sa.user_id = p.id
WHERE p.email = 'user_email@example.com';
