-- View all pending seller applications
SELECT 
    sa.id,
    sa.business_name,
    sa.whatsapp_number,
    p.email,
    p.full_name,
    sa.created_at
FROM seller_applications sa
JOIN profiles p ON p.id = sa.user_id
WHERE sa.status = 'pending'
ORDER BY sa.created_at DESC;

-- View all approved sellers
SELECT 
    sa.id,
    sa.business_name,
    sa.whatsapp_number,
    p.email,
    p.full_name,
    sa.created_at
FROM seller_applications sa
JOIN profiles p ON p.id = sa.user_id
WHERE sa.status = 'approved'
ORDER BY sa.created_at DESC;

-- Summary by status
SELECT 
    status,
    COUNT(*) as count
FROM seller_applications
GROUP BY status;
