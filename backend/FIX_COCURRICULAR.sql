-- =====================================================
-- CRITICAL FIX: Update co_curricular_activities table
-- Run this NOW in MySQL Workbench
-- =====================================================

USE portfolio_db;

-- Add new column
ALTER TABLE co_curricular_activities 
ADD COLUMN club_logo_url VARCHAR(500) AFTER role;

-- Copy existing data
UPDATE co_curricular_activities 
SET club_logo_url = image_url 
WHERE image_url IS NOT NULL;

-- Drop old columns
ALTER TABLE co_curricular_activities 
DROP COLUMN image_url,
DROP COLUMN description,
DROP COLUMN year;

-- Verify
SELECT * FROM co_curricular_activities;
DESCRIBE co_curricular_activities;
