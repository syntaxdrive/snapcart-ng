-- View all admins
SELECT id, email, full_name, created_at
FROM profiles
WHERE role = 'admin'
ORDER BY created_at;

-- View all sellers
SELECT id, email, full_name, created_at
FROM profiles
WHERE role = 'seller'
ORDER BY created_at;

-- View all users
SELECT id, email, full_name, created_at
FROM profiles
WHERE role = 'user'
ORDER BY created_at;

-- Summary by role
SELECT 
    role,
    COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;
