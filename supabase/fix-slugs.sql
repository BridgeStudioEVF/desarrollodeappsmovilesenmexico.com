-- Fix slugs with leading slashes in existing articles
-- Run this in Supabase SQL Editor

UPDATE articles
SET slug = TRIM(LEADING '/' FROM slug)
WHERE slug LIKE '/%'
  AND site_id = 'desarrolloappsmoviles.com.mx';

-- Verify the fix
SELECT id, title, slug 
FROM articles 
WHERE site_id = 'desarrolloappsmoviles.com.mx'
ORDER BY created_at DESC
LIMIT 20;
