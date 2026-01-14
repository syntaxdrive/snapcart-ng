-- Promote user to Admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'quakestartup@gmail.com';

-- Check the result
SELECT email, role FROM profiles WHERE email = 'quakestartup@gmail.com';
