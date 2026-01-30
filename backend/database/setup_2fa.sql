-- Two-Factor Authentication Setup Script
-- Run this script in your MySQL database

USE portfolio_db;

-- Step 1: Add 2FA columns to users table (if they don't exist)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_factor_backup_codes JSON DEFAULT NULL;

-- Step 2: Check if admin user exists
SELECT 
    email, 
    role,
    two_factor_enabled as '2FA_Enabled',
    CASE 
        WHEN two_factor_secret IS NOT NULL THEN 'Secret Set'
        ELSE 'No Secret'
    END as '2FA_Secret_Status'
FROM users 
WHERE email = 'fahmiduxxaman@gmail.com';

-- If the admin user doesn't exist, create one (uncomment the lines below)
-- INSERT INTO users (email, password, role) 
-- VALUES ('fahmiduxxaman@gmail.com', '$2a$10$YourHashedPasswordHere', 'admin');

-- After running this, you can:
-- 1. Start your backend server
-- 2. Login with your credentials
-- 3. Go to Admin Panel > Security
-- 4. Enable 2FA and scan the QR code with Google Authenticator
