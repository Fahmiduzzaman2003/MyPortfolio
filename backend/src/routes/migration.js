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

module.exports = router;
