const express = require('express');
const pool = require('../config/database');
const { cacheMiddleware, del } = require('../utils/cache');

const router = express.Router();

// Get all achievements (public)
router.get('/', cacheMiddleware(600), async (req, res) => {
  try {
    const [achievements] = await pool.query(
      'SELECT * FROM achievements ORDER BY display_order ASC, year DESC, created_at DESC'
    );
    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single achievement (public)
router.get('/:id', cacheMiddleware(600), async (req, res) => {
  try {
    const { id } = req.params;
    const [achievements] = await pool.query('SELECT * FROM achievements WHERE id = ?', [id]);

    if (achievements.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json(achievements[0]);
  } catch (error) {
    console.error('Get achievement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create achievement (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, organization, year, image_url, credential_url, display_order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Achievement title is required' });
    }

    if (!year) {
      return res.status(400).json({ error: 'Achievement year is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO achievements (title, organization, year, image_url, credential_url, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [
        title,
        organization || '',
        year,
        image_url || '',
        credential_url || '',
        display_order || 0
      ]
    );

    const [newAchievement] = await pool.query('SELECT * FROM achievements WHERE id = ?', [result.insertId]);
    
    // Clear achievements cache
    await del('api:/api/achievements*');
    
    res.status(201).json(newAchievement[0]);
  } catch (error) {
    console.error('Create achievement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update achievement (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, organization, year, image_url, credential_url, display_order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Achievement title is required' });
    }

    if (!year) {
      return res.status(400).json({ error: 'Achievement year is required' });
    }

    const [result] = await pool.query(
      `UPDATE achievements SET title = ?, organization = ?, year = ?,
       image_url = ?, credential_url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        title,
        organization || '',
        year,
        image_url || '',
        credential_url || '',
        display_order || 0,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    const [updated] = await pool.query('SELECT * FROM achievements WHERE id = ?', [id]);
    
    // Clear achievements cache
    await del('api:/api/achievements*');
    
    res.json(updated[0]);
  } catch (error) {
    console.error('Update achievement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete achievement (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM achievements WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    // Clear achievements cache
    await del('api:/api/achievements*');

    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Delete achievement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update display order (admin only)
router.put('/order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { display_order } = req.body;

    if (typeof display_order !== 'number') {
      return res.status(400).json({ error: 'Display order must be a number' });
    }

    const [result] = await pool.query(
      'UPDATE achievements SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [display_order, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json({ message: 'Achievement display order updated successfully' });
  } catch (error) {
    console.error('Update achievement order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
