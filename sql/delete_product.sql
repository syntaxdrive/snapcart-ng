-- Delete a specific product
-- Replace 'PRODUCT_ID' with the actual product ID

-- Preview the product
SELECT id, name, price, seller_id, created_at
FROM products
WHERE id = 'PRODUCT_ID';

-- If correct, delete it
DELETE FROM products
WHERE id = 'PRODUCT_ID';

-- Verify deletion
SELECT COUNT(*) as remaining_products
FROM products
WHERE id = 'PRODUCT_ID';
