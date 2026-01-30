-- Add Two-Factor Authentication fields to users table

USE portfolio_db;

ALTER TABLE users
ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL,
ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN two_factor_backup_codes JSON DEFAULT NULL;
