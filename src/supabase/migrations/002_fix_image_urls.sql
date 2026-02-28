-- ============================================
-- FIX: Populate image_urls from raw_data JSON
-- Run this in Supabase SQL Editor
-- ============================================

-- Update applications table: extract imageUrls from raw_data
UPDATE applications
SET image_urls = ARRAY(
  SELECT jsonb_array_elements_text(raw_data->'imageUrls')
)
WHERE raw_data->'imageUrls' IS NOT NULL 
  AND jsonb_array_length(raw_data->'imageUrls') > 0
  AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);

-- Also update other fields from raw_data if missing
UPDATE applications
SET 
  instagram_url = COALESCE(instagram_url, raw_data->>'instagramURL'),
  showreel_url = COALESCE(showreel_url, raw_data->>'showreelURL'),
  whatsapp_number = COALESCE(whatsapp_number, raw_data->>'whatsAppNumber')
WHERE raw_data IS NOT NULL;

-- Show count of updated records
SELECT 
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE image_urls IS NOT NULL AND array_length(image_urls, 1) > 0) as records_with_images
FROM applications;
