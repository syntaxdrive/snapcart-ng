-- Find a user by email
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
WHERE email ILIKE '%search_term%';

-- Find products by name
SELECT 
    id,
    name,
    price,
    category,
    seller_id,
    created_at
FROM products
WHERE name ILIKE '%search_term%'
ORDER BY created_at DESC;

-- Find seller by business name
SELECT 
    sa.business_name,
    sa.whatsapp_number,
    sa.status,
    p.email,
    p.full_name
FROM seller_applications sa
JOIN profiles p ON p.id = sa.user_id
WHERE sa.business_name ILIKE '%search_term%';
