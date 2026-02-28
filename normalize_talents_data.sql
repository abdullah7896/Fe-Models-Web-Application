-- =====================================================
-- Normalize catalog and subcategory values to proper case
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Normalize catalog values
UPDATE talents 
SET catalog = CASE
  WHEN UPPER(catalog) = 'MODELS' THEN 'Models'
  WHEN UPPER(catalog) = 'ACTOR' THEN 'Actor'
  WHEN UPPER(catalog) = 'MIX TALENTS' THEN 'MIX TALENTS'
  WHEN UPPER(catalog) = 'LIFESTYLE' THEN 'Lifestyle'
  WHEN UPPER(catalog) = 'INFLUENCERS' THEN 'Influencers'
  WHEN UPPER(catalog) = 'CAST' THEN 'Cast'
  WHEN UPPER(catalog) = 'CREATIVE ARTISTS' THEN 'Creative Artists'
  WHEN UPPER(catalog) = 'PRODUCTION' THEN 'Production'
  ELSE catalog
END
WHERE catalog IS NOT NULL;

-- Normalize subcategory values
UPDATE talents 
SET subcategory = CASE
  -- Models subcategories
  WHEN UPPER(subcategory) = 'MEN' THEN 'Men'
  WHEN UPPER(subcategory) = 'WOMEN' THEN 'Women'
  WHEN UPPER(subcategory) = 'KIDS' THEN 'Kids'
  WHEN UPPER(subcategory) = 'FITNESS' THEN 'Fitness'
  WHEN UPPER(subcategory) = 'MATURE' THEN 'Mature'
  
  -- Actor subcategories
  WHEN UPPER(subcategory) = 'TEENS' THEN 'Teens'
  
  -- MIX TALENTS subcategories
  WHEN UPPER(subcategory) = 'HOSTESSES' THEN 'HOSTESSES'
  
  -- Lifestyle subcategories
  WHEN UPPER(subcategory) = 'TALENT' THEN 'Talent'
  
  -- Creative Artists subcategories
  WHEN UPPER(subcategory) = 'MAKEUP ARTIST' THEN 'MAKEUP ARTIST'
  
  -- Production subcategories
  WHEN UPPER(subcategory) = 'LOCATION PREMISSION' THEN 'location Premission'
  
  ELSE subcategory
END
WHERE subcategory IS NOT NULL;

-- Verify the results
SELECT catalog, subcategory, COUNT(*) as count
FROM talents
WHERE status = 'approved'
GROUP BY catalog, subcategory
ORDER BY catalog, subcategory;
