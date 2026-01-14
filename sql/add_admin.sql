-- Add a new admin user
-- Replace 'email@example.com' with the actual email

UPDATE profiles 
SET role = 'admin' 
WHERE email = 'email@example.com';

-- Verify the change
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'email@example.com';
