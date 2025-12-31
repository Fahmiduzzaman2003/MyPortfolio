-- =====================================================
-- Co-Curricular Activities Table Setup
-- Run this in MySQL Workbench to create/update the table
-- =====================================================

USE portfolio_db;

-- Drop existing table if you want to recreate (CAUTION: This deletes all data)
-- DROP TABLE IF EXISTS co_curricular_activities;

-- Create co_curricular_activities table
CREATE TABLE IF NOT EXISTS co_curricular_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_name VARCHAR(255) NOT NULL COMMENT 'Name of the club/organization',
    role VARCHAR(255) COMMENT 'Your position or role (e.g., President, Member, Volunteer)',
    club_logo_url VARCHAR(500) COMMENT 'URL to club logo/icon',
    display_order INT DEFAULT 0 COMMENT 'Order to display activities (lower number = shown first)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_activities_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Co-curricular activities and club memberships';

-- =====================================================
-- Sample Data (Optional - Remove if you want empty table)
-- =====================================================

-- Insert sample activities
INSERT INTO co_curricular_activities 
(club_name, role, club_logo_url, display_order) 
VALUES
(
    'Technical Club',
    'President',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop',
    1
),
(
    'Coding Competition Team',
    'Team Lead',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop',
    2
),
(
    'Community Service Club',
    'Volunteer',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop',
    3
),
(
    'College Magazine',
    'Technical Editor',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop',
    4
),
(
    'Robotics Club',
    'Member',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop',
    5
);

-- =====================================================
-- Verify Data
-- =====================================================

-- View all activities
SELECT 
    id,
    club_name,
    role,
    club_logo_url,
    display_order,
    created_at
FROM co_curricular_activities
ORDER BY display_order ASC;

-- Count total activities
SELECT COUNT(*) as total_activities FROM co_curricular_activities;

-- =====================================================
-- Useful Queries for Management
-- =====================================================

-- Get activities by year
-- SELECT * FROM co_curricular_activities WHERE year LIKE '%2024%';

-- Update display order
-- UPDATE co_curricular_activities SET display_order = 1 WHERE id = 1;

-- Delete a specific activity
-- DELETE FROM co_curricular_activities WHERE id = 1;

-- Clear all activities (CAUTION)
-- DELETE FROM co_curricular_activities;

-- Reset auto increment counter
-- ALTER TABLE co_curricular_activities AUTO_INCREMENT = 1;

-- =====================================================
-- Table Structure Verification
-- =====================================================

DESCRIBE co_curricular_activities;
