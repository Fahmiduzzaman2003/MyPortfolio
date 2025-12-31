-- Initialize default data for portfolio
-- Run this after schema.sql if you need sample data

USE portfolio_db;

-- Insert default profile if none exists
INSERT INTO profiles (
    full_name,
    tagline,
    short_intro,
    bio,
    location,
    email,
    availability_text,
    roles,
    stats
)
SELECT
    'Your Name',
    'Developer | Student | Enthusiast',
    'Welcome to my portfolio! I am passionate about technology and building amazing things.',
    'Add your bio here. Tell visitors about your journey, skills, and what drives you.',
    'Your Location',
    'your.email@example.com',
    'Open to work',
    '[]',
    '[]'
WHERE NOT EXISTS (SELECT 1 FROM profiles);

-- Note: This script safely inserts data only if tables are empty
-- It will not duplicate or overwrite existing data
