-- Delete old rejected applications (older than 90 days)

-- Preview what will be deleted
SELECT 
    COUNT(*) as total_to_delete,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM seller_applications
WHERE status = 'rejected'
AND created_at < NOW() - INTERVAL '90 days';

-- If the preview looks good, run this:
DELETE FROM seller_applications
WHERE status = 'rejected'
AND created_at < NOW() - INTERVAL '90 days';

-- Verify
SELECT 
    status,
    COUNT(*) as count,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM seller_applications
GROUP BY status;
