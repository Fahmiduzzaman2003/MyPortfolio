const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const pool = require('../config/database');

const router = express.Router();

// Generate 2FA secret and QR code
router.post('/setup', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const [users] = await pool.query('SELECT id, email FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Portfolio Admin (${email})`,
      issuer: 'Portfolio'
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Store secret in database (but don't enable 2FA yet)
    await pool.query(
      'UPDATE users SET two_factor_secret = ? WHERE id = ?',
      [secret.base32, user.id]
    );

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      message: 'Scan this QR code with Google Authenticator'
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

// Verify and enable 2FA
router.post('/verify', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: 'Email and token are required' });
    }

    // Find user with secret
    const [users] = await pool.query(
      'SELECT id, email, two_factor_secret FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0 || !users[0].two_factor_secret) {
      return res.status(404).json({ error: 'User not found or 2FA not set up' });
    }

    const user = users[0];

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps before/after for clock drift
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }

    // Enable 2FA
    await pool.query(
      'UPDATE users SET two_factor_enabled = TRUE, two_factor_backup_codes = ? WHERE id = ?',
      [JSON.stringify(backupCodes), user.id]
    );

    res.json({
      message: '2FA enabled successfully',
      backupCodes: backupCodes
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// Verify 2FA token during login
router.post('/validate', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: 'Email and token are required' });
    }

    // Find user
    const [users] = await pool.query(
      'SELECT id, email, two_factor_secret, two_factor_enabled, two_factor_backup_codes FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    if (!user.two_factor_enabled) {
      return res.status(400).json({ error: '2FA is not enabled for this user' });
    }

    // Check if it's a backup code
    let backupCodes = [];
    try {
      backupCodes = user.two_factor_backup_codes ? JSON.parse(user.two_factor_backup_codes) : [];
    } catch (e) {
      backupCodes = [];
    }

    if (backupCodes.includes(token.toUpperCase())) {
      // Remove used backup code
      const updatedCodes = backupCodes.filter(code => code !== token.toUpperCase());
      await pool.query(
        'UPDATE users SET two_factor_backup_codes = ? WHERE id = ?',
        [JSON.stringify(updatedCodes), user.id]
      );

      return res.json({
        valid: true,
        message: 'Backup code accepted',
        remainingBackupCodes: updatedCodes.length
      });
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid authentication code' });
    }

    res.json({
      valid: true,
      message: 'Authentication successful'
    });
  } catch (error) {
    console.error('2FA validation error:', error);
    res.status(500).json({ error: 'Failed to validate 2FA code' });
  }
});

// Check if user has 2FA enabled
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const [users] = await pool.query(
      'SELECT two_factor_enabled FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      enabled: users[0].two_factor_enabled || false
    });
  } catch (error) {
    console.error('2FA status error:', error);
    res.status(500).json({ error: 'Failed to check 2FA status' });
  }
});

// Disable 2FA
router.post('/disable', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Verify user password first
    const bcrypt = require('bcryptjs');
    const [users] = await pool.query(
      'SELECT id, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Disable 2FA
    await pool.query(
      'UPDATE users SET two_factor_enabled = FALSE, two_factor_secret = NULL, two_factor_backup_codes = NULL WHERE id = ?',
      [user.id]
    );

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

module.exports = router;
