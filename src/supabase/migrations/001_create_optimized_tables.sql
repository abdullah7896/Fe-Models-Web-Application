-- ============================================
-- OPTIMIZED DATABASE SCHEMA FOR TALENT AGENCY
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create the main talents table (replaces KV store for approved models)
CREATE TABLE IF NOT EXISTS talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  gender TEXT,
  date_of_birth DATE,
  nationality TEXT,
  
  -- Categorization (INDEXED for fast queries)
  catalog TEXT NOT NULL,        -- e.g., 'MODEL', 'ACTOR', 'PRODUCTION'
  subcategory TEXT NOT NULL,    -- e.g., 'Men', 'Women', 'Kids'
  
  -- Location
  country_of_residence TEXT,
  location TEXT,
  
  -- Contact
  whatsapp_number TEXT,
  mobile_uae TEXT,
  
  -- Social/Portfolio
  instagram_url TEXT,
  showreel_url TEXT,
  
  -- Images stored as array
  image_urls TEXT[] DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected', 'inactive')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  
  -- Store original application data as backup
  raw_data JSONB
);

-- 2. Create indexes for FAST queries
CREATE INDEX IF NOT EXISTS idx_talents_catalog ON talents(catalog);
CREATE INDEX IF NOT EXISTS idx_talents_subcategory ON talents(subcategory);
CREATE INDEX IF NOT EXISTS idx_talents_catalog_subcategory ON talents(catalog, subcategory);
CREATE INDEX IF NOT EXISTS idx_talents_status ON talents(status);
CREATE INDEX IF NOT EXISTS idx_talents_created_at ON talents(created_at DESC);

-- Composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_talents_approved_catalog ON talents(catalog, subcategory) 
  WHERE status = 'approved';

-- 3. Create applications table (for pending applications)
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  gender TEXT,
  date_of_birth DATE,
  nationality TEXT,
  ethnicity TEXT,
  
  -- Categorization
  catalog TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  
  -- Location
  country_of_residence TEXT,
  currently_in_uae TEXT,
  current_country TEXT,
  
  -- Contact
  whatsapp_number TEXT,
  residence_tel TEXT,
  mobile_uae TEXT,
  
  -- Languages
  primary_language TEXT,
  other_languages TEXT,
  
  -- Social/Portfolio
  instagram_url TEXT,
  showreel_url TEXT,
  role_comment TEXT,
  
  -- Images
  image_urls TEXT[] DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  
  -- Store complete original data
  raw_data JSONB
);

-- 4. Create indexes for applications
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_catalog ON applications(catalog, subcategory);

-- 5. Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to both tables
DROP TRIGGER IF EXISTS update_talents_updated_at ON talents;
CREATE TRIGGER update_talents_updated_at
  BEFORE UPDATE ON talents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Create a view for easy talent listing with computed fields
CREATE OR REPLACE VIEW talents_view AS
SELECT 
  id,
  first_name,
  last_name,
  first_name || ' ' || last_name AS full_name,
  email,
  gender,
  date_of_birth,
  EXTRACT(YEAR FROM AGE(date_of_birth))::INTEGER AS age,
  nationality,
  catalog,
  subcategory,
  country_of_residence,
  location,
  instagram_url,
  showreel_url,
  image_urls,
  status,
  created_at,
  approved_at
FROM talents
WHERE status = 'approved';

-- 7. Grant permissions for anon and authenticated users
GRANT SELECT ON talents TO anon;
GRANT SELECT ON talents_view TO anon;
GRANT ALL ON applications TO authenticated;
GRANT ALL ON talents TO authenticated;

-- 8. Enable Row Level Security
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (makes script re-runnable)
DROP POLICY IF EXISTS "Anyone can view approved talents" ON talents;
DROP POLICY IF EXISTS "Admins can manage all talents" ON talents;
DROP POLICY IF EXISTS "Admins can manage applications" ON applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;

-- Public can read approved talents
CREATE POLICY "Anyone can view approved talents" ON talents
  FOR SELECT USING (status = 'approved');

-- Admins can do everything (you'll need to set up admin role check)
CREATE POLICY "Admins can manage all talents" ON talents
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage applications" ON applications
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Anyone can submit applications
CREATE POLICY "Anyone can submit applications" ON applications
  FOR INSERT WITH CHECK (true);

-- ============================================
-- MIGRATION: Copy existing KV data to SQL
-- Run this AFTER the tables are created
-- ============================================
-- This is done via the /admin/migrate-kv-to-sql endpoint
