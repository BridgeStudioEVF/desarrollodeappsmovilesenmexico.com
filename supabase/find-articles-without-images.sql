-- Simple list of titles without images (for copy-paste)
SELECT title
FROM articles
WHERE site_id = 'desarrolloappsmoviles.com.mx'
  AND (image_url IS NULL OR image_url = '')
ORDER BY published_at DESC;

-- Detailed query to find articles without images
SELECT 
    id,
    title,
    slug,
    status,
    CASE 
        WHEN image_url IS NULL OR image_url = '' THEN '❌ Sin imagen'
        ELSE '✅ Con imagen'
    END as image_status
FROM articles
WHERE site_id = 'desarrolloappsmoviles.com.mx'
  AND (image_url IS NULL OR image_url = '')
ORDER BY published_at DESC;

-- Count of articles without images
SELECT 
    COUNT(*) as total_sin_imagen
FROM articles
WHERE site_id = 'desarrolloappsmoviles.com.mx'
  AND (image_url IS NULL OR image_url = '');
