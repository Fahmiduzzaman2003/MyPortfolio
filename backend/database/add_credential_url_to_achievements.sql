-- Add credential_url column to achievements table

ALTER TABLE achievements 
ADD COLUMN credential_url VARCHAR(500) AFTER image_url;
