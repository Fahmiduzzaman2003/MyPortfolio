const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const router = express.Router();

// Register endpoint - DISABLED for security
// Only existing admin accounts can sign in
router.post('/register', async (req, res) => {
  return res.status(403).json({ error: 'Registration is disabled. Please contact the administrator.' });
});

// Login - check credentials against database
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user in database
    const [users] = await pool.query(
      'SELECT id, email, password, role, two_factor_enabled FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if 2FA is enabled
    if (user.two_factor_enabled) {
      // Return special response indicating 2FA is required
      return res.json({
        requiresTwoFactor: true,
        email: user.email,
        message: 'Please enter your 2FA code'
      });
    }

    // Return user data (no 2FA required)
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Complete login with 2FA
router.post('/login-2fa', async (req, res) => {
  try {
    const { email, twoFactorCode } = req.body;

    if (!email || !twoFactorCode) {
      return res.status(400).json({ error: 'Email and 2FA code are required' });
    }

    // Find user in database
    const [users] = await pool.query(
      'SELECT id, email, role, two_factor_enabled FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const user = users[0];

    if (!user.two_factor_enabled) {
      return res.status(400).json({ error: '2FA is not enabled for this account' });
    }

    // Validate 2FA code using the twoFactor validate endpoint logic
    const speakeasy = require('speakeasy');
    const [userWith2FA] = await pool.query(
      'SELECT two_factor_secret, two_factor_backup_codes FROM users WHERE email = ?',
      [email]
    );

    if (userWith2FA.length === 0 || !userWith2FA[0].two_factor_secret) {
      return res.status(400).json({ error: '2FA not properly configured' });
    }

    const userData = userWith2FA[0];

    // Check if it's a backup code
    let backupCodes = [];
    try {
      backupCodes = userData.two_factor_backup_codes ? JSON.parse(userData.two_factor_backup_codes) : [];
    } catch (e) {
      backupCodes = [];
    }

    let isValid = false;

    if (backupCodes.includes(twoFactorCode.toUpperCase())) {
      // Remove used backup code
      const updatedCodes = backupCodes.filter(code => code !== twoFactorCode.toUpperCase());
      await pool.query(
        'UPDATE users SET two_factor_backup_codes = ? WHERE id = ?',
        [JSON.stringify(updatedCodes), user.id]
      );
      isValid = true;
    } else {
      // Verify TOTP token
      isValid = speakeasy.totp.verify({
        secret: userData.two_factor_secret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2
      });
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid 2FA code' });
    }

    // Return user data
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('2FA login error:', error);
    res.status(500).json({ error: 'Server error during 2FA login' });
  }
});

// Get current user (simplified - just returns success if valid user)
router.get('/me', (req, res) => {
  // Since we're not using JWT, this endpoint is not really needed
  // But keeping it for compatibility
  res.json({ message: 'Authentication check endpoint' });
});

// Logout (client-side only)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Get all users (admin only) - requires session-based auth
router.get('/users', (req, res) => {
  // This would need session-based authentication
  // For now, return not implemented
  res.status(501).json({ error: 'Session-based authentication needed for this endpoint' });
});

module.exports = router;
