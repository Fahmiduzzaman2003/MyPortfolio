const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all co-curricular activities (public)
router.get('/', async (req, res) => {
  try {
    const [activities] = await pool.query(
      'SELECT * FROM co_curricular_activities ORDER BY display_order ASC, created_at DESC'
    );
    res.json(activities);
  } catch (error) {
    console.error('Get co-curricular activities error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single activity (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [activities] = await pool.query('SELECT * FROM co_curricular_activities WHERE id = ?', [id]);

    if (activities.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json(activities[0]);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create activity (admin only)
router.post('/', async (req, res) => {
  try {
    const { club_name, role, club_logo_url, display_order } = req.body;

    if (!club_name) {
      return res.status(400).json({ error: 'Club name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO co_curricular_activities (club_name, role, club_logo_url, display_order) VALUES (?, ?, ?, ?)',
      [
        club_name,
        role || '',
        club_logo_url || '',
        display_order || 0
      ]
    );

    const [newActivity] = await pool.query('SELECT * FROM co_curricular_activities WHERE id = ?', [result.insertId]);
    res.status(201).json(newActivity[0]);
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update activity (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { club_name, role, club_logo_url, display_order } = req.body;

    if (!club_name) {
      return res.status(400).json({ error: 'Club name is required' });
    }

    const [result] = await pool.query(
      `UPDATE co_curricular_activities SET club_name = ?, role = ?, club_logo_url = ?, 
       display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        club_name,
        role || '',
        club_logo_url || '',
        display_order || 0,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const [updated] = await pool.query('SELECT * FROM co_curricular_activities WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete activity (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM co_curricular_activities WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
