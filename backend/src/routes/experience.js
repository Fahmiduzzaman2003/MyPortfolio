const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all experiences
router.get('/', async (req, res) => {
  try {
    const [experiences] = await pool.query(
      'SELECT * FROM experience ORDER BY display_order ASC, created_at DESC'
    );
    res.json(experiences);
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new experience (admin only)
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/experience - Request body:', req.body);
    const { company_name, position, duration, description, company_logo_url, display_order } = req.body;

    if (!company_name || !position || !duration) {
      console.log('Validation failed:', { company_name, position, duration });
      return res.status(400).json({ error: 'Company name, position, and duration are required' });
    }

    console.log('Inserting experience:', { company_name, position, duration, description, company_logo_url, display_order });

    const [result] = await pool.query(
      'INSERT INTO experience (company_name, position, duration, description, company_logo_url, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [company_name, position, duration, description || '', company_logo_url || '', display_order || 0]
    );

    console.log('Insert result:', result);

    const [newExperience] = await pool.query('SELECT * FROM experience WHERE id = ?', [result.insertId]);
    console.log('New experience created:', newExperience[0]);
    res.status(201).json(newExperience[0]);
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update experience (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, position, duration, description, company_logo_url, display_order } = req.body;

    if (!company_name || !position || !duration) {
      return res.status(400).json({ error: 'Company name, position, and duration are required' });
    }

    const [result] = await pool.query(
      'UPDATE experience SET company_name = ?, position = ?, duration = ?, description = ?, company_logo_url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [company_name, position, duration, description || '', company_logo_url || '', display_order || 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const [updated] = await pool.query('SELECT * FROM experience WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete experience (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM experience WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
