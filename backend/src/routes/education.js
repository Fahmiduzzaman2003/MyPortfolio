const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all education entries (public)
router.get('/', async (req, res) => {
  try {
    const [education] = await pool.query(
      'SELECT * FROM education ORDER BY display_order ASC, created_at DESC'
    );
    res.json(education);
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single education entry (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [education] = await pool.query('SELECT * FROM education WHERE id = ?', [id]);

    if (education.length === 0) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    res.json(education[0]);
  } catch (error) {
    console.error('Get education by ID error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create education entry (admin only)
router.post('/', async (req, res) => {
  try {
    const { degree, institution, duration, description, cgpa, cgpa_scale, semester_completed, core_courses, display_order } = req.body;

    if (!degree || !institution || !duration) {
      return res.status(400).json({ error: 'Degree, institution, and duration are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO education (degree, institution, duration, description, cgpa, cgpa_scale, semester_completed, core_courses, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [degree, institution, duration, description || '', cgpa || '', cgpa_scale || '', semester_completed || '', core_courses || '', display_order || 0]
    );

    const [newEducation] = await pool.query('SELECT * FROM education WHERE id = ?', [result.insertId]);
    res.status(201).json(newEducation[0]);
  } catch (error) {
    console.error('Create education error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update education entry (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { degree, institution, duration, description, cgpa, cgpa_scale, semester_completed, core_courses, display_order } = req.body;

    if (!degree || !institution || !duration) {
      return res.status(400).json({ error: 'Degree, institution, and duration are required' });
    }

    const [result] = await pool.query(
      `UPDATE education SET degree = ?, institution = ?, duration = ?, 
       description = ?, cgpa = ?, cgpa_scale = ?, semester_completed = ?, core_courses = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [degree, institution, duration, description || '', cgpa || '', cgpa_scale || '', semester_completed || '', core_courses || '', display_order || 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    const [updated] = await pool.query('SELECT * FROM education WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete education entry (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM education WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    res.json({ message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
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
      'UPDATE education SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [display_order, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    res.json({ message: 'Display order updated successfully' });
  } catch (error) {
    console.error('Update education order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
