const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Migration endpoint - run once to add 2FA columns
// Access: POST /api/migration/add-2fa-columns
router.post('/add-2fa-columns', async (req, res) => {
  try {
    console.log('Starting 2FA migration...');
    
    // Check if columns exist
    const [columns] = await pool.query('SHOW COLUMNS FROM users');
    const existingColumns = columns.map(col => col.Field);
    
    const results = [];
    
    // Add two_factor_secret
    if (!existingColumns.includes('two_factor_secret')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL');
      results.push('✓ Added two_factor_secret column');
    } else {
      results.push('• two_factor_secret already exists');
    }
    
    // Add two_factor_enabled
    if (!existingColumns.includes('two_factor_enabled')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE');
      results.push('✓ Added two_factor_enabled column');
    } else {
      results.push('• two_factor_enabled already exists');
    }
    
    // Add two_factor_backup_codes
    if (!existingColumns.includes('two_factor_backup_codes')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_backup_codes JSON DEFAULT NULL');
      results.push('✓ Added two_factor_backup_codes column');
    } else {
      results.push('• two_factor_backup_codes already exists');
    }
    
    console.log('Migration completed');
    
    res.json({
      success: true,
      message: 'Migration completed successfully',
      results: results
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check migration status
router.get('/check-2fa-columns', async (req, res) => {
  try {
    const [columns] = await pool.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(col => col.Field);
    
    const has2FA = {
      two_factor_secret: columnNames.includes('two_factor_secret'),
      two_factor_enabled: columnNames.includes('two_factor_enabled'),
      two_factor_backup_codes: columnNames.includes('two_factor_backup_codes')
    };
    
    const allPresent = Object.values(has2FA).every(v => v === true);
    
    res.json({
      migrated: allPresent,
      columns: has2FA,
      allColumns: columnNames
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Setup 2FA for admin account - generates QR code
router.post('/setup-admin-2fa', async (req, res) => {
  try {
    const speakeasy = require('speakeasy');
    const QRCode = require('qrcode');
    const adminEmail = 'fahmiduxxaman@gmail.com';
    
    const [users] = await pool.query(
      'SELECT id, email, two_factor_enabled FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Admin user not found' });
    }
    
    if (users[0].two_factor_enabled) {
      return res.json({ message: '2FA already enabled', enabled: true });
    }
    
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Portfolio Admin (${adminEmail})`,
      issuer: 'Portfolio'
    });
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    
    // Save secret (but don't enable yet)
    await pool.query(
      'UPDATE users SET two_factor_secret = ? WHERE id = ?',
      [secret.base32, users[0].id]
    );
    
    res.json({
      success: true,
      message: 'QR code generated. Scan with Google Authenticator and verify.',
      qrCode: qrCode,
      secret: secret.base32,
      instructions: [
        '1. Scan this QR code with Google Authenticator app',
        '2. Get the 6-digit code from the app',
        '3. Call POST /api/migration/enable-admin-2fa with { "code": "123456" }'
      ]
    });
    
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enable 2FA after verification
router.post('/enable-admin-2fa', async (req, res) => {
  try {
    const speakeasy = require('speakeasy');
    const { code } = req.body;
    const adminEmail = 'fahmiduxxaman@gmail.com';
    
    if (!code || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Invalid code format' });
    }
    
    const [users] = await pool.query(
      'SELECT id, two_factor_secret FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (users.length === 0 || !users[0].two_factor_secret) {
      return res.status(400).json({ error: 'Run setup-admin-2fa first' });
    }
    
    // Verify code
    const verified = speakeasy.totp.verify({
      secret: users[0].two_factor_secret,
      encoding: 'base32',
      token: code,
      window: 2
    });
    
    if (!verified) {
      return res.status(401).json({ error: 'Invalid code' });
    }
    
    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    
    // Enable 2FA
    await pool.query(
      'UPDATE users SET two_factor_enabled = TRUE, two_factor_backup_codes = ? WHERE id = ?',
      [JSON.stringify(backupCodes), users[0].id]
    );
    
    res.json({
      success: true,
      message: '2FA enabled successfully!',
      backupCodes: backupCodes
    });
    
  } catch (error) {
    console.error('Enable error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
