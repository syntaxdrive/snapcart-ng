-- Remove admin privileges from a user
-- Replace 'email@example.com' with the actual email

UPDATE profiles 
SET role = 'user' 
WHERE email = 'email@example.com';

-- Verify the change
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'email@example.com';
