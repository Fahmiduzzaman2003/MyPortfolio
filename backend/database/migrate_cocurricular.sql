-- =====================================================
-- Migration Script for Co-Curricular Activities Table
-- Run this to update your existing table structure
-- =====================================================

USE portfolio_db;

-- Step 1: Check current table structure
DESCRIBE co_curricular_activities;

-- Step 2: Add new column if it doesn't exist
ALTER TABLE co_curricular_activities 
ADD COLUMN IF NOT EXISTS club_logo_url VARCHAR(500) AFTER role;

-- Step 3: Copy data from old column to new (if image_url exists)
UPDATE co_curricular_activities 
SET club_logo_url = image_url 
WHERE image_url IS NOT NULL AND club_logo_url IS NULL;

-- Step 4: Drop old columns (be careful - this deletes data!)
-- Uncomment the lines below only after verifying data is copied

-- ALTER TABLE co_curricular_activities DROP COLUMN IF EXISTS image_url;
-- ALTER TABLE co_curricular_activities DROP COLUMN IF EXISTS description;
-- ALTER TABLE co_curricular_activities DROP COLUMN IF EXISTS year;

-- Step 5: Verify the result
SELECT * FROM co_curricular_activities;

-- Step 6: Check final structure
DESCRIBE co_curricular_activities;
