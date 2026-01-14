-- Manually approve a seller application
-- Replace 'user_email@example.com' with the actual email

-- Get the user ID and application ID
SELECT 
    p.id as user_id,
    p.email,
    sa.id as application_id,
    sa.business_name,
    sa.status
FROM profiles p
JOIN seller_applications sa ON sa.user_id = p.id
WHERE p.email = 'user_email@example.com'
ORDER BY sa.created_at DESC
LIMIT 1;

-- After confirming the IDs above, run these:
-- (Replace USER_ID and APPLICATION_ID with actual values)

-- Update application status
UPDATE seller_applications 
SET status = 'approved' 
WHERE id = 'APPLICATION_ID';

-- Update user role
UPDATE profiles 
SET role = 'seller' 
WHERE id = 'USER_ID';

-- Verify
SELECT p.email, p.role, sa.status, sa.business_name
FROM profiles p
JOIN seller_applications sa ON sa.user_id = p.id
WHERE p.email = 'user_email@example.com';
