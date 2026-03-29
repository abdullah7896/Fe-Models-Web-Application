-- ============================================
-- MIGRATION: ADD CASTING VIDEO SUPPORT
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add casting_video_url to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS casting_video_url TEXT;

-- Add casting_video_url to talents table
ALTER TABLE talents 
ADD COLUMN IF NOT EXISTS casting_video_url TEXT;

-- Verify changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('applications', 'talents') 
  AND column_name = 'casting_video_url';
