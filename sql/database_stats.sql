-- Get database statistics

-- Total users by role
SELECT 
    role,
    COUNT(*) as count
FROM profiles
GROUP BY role;

-- Total products
SELECT COUNT(*) as total_products FROM products;

-- Products by category
SELECT 
    category,
    COUNT(*) as count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products
GROUP BY category
ORDER BY count DESC;

-- Applications by status
SELECT 
    status,
    COUNT(*) as count
FROM seller_applications
GROUP BY status;

-- Active banners
SELECT COUNT(*) as active_banners 
FROM banners 
WHERE is_active = true;

-- Recent activity (last 7 days)
SELECT 
    'New Users' as metric,
    COUNT(*) as count
FROM profiles
WHERE created_at > NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
    'New Products',
    COUNT(*)
FROM products
WHERE created_at > NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
    'New Applications',
    COUNT(*)
FROM seller_applications
WHERE created_at > NOW() - INTERVAL '7 days';
