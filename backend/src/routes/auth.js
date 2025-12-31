const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const router = express.Router();

// Register new user (first user becomes admin)
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Check if this is the first user (make them admin)
    const [allUsers] = await pool.query('SELECT id FROM users');
    const role = allUsers.length === 0 ? 'admin' : 'user';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );

    res.status(201).json({
      user: { id: result.insertId, email, role },
      message: role === 'admin' ? 'Admin account created successfully' : 'User account created successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
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
      'SELECT id, email, password, role FROM users WHERE email = ?',
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

    // Return user data (no token needed)
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
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
