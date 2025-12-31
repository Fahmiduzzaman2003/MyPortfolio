const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all contact info (public)
router.get('/', async (req, res) => {
  try {
    const [contactInfo] = await pool.query(
      'SELECT * FROM contact_info ORDER BY type, display_order'
    );
    res.json(contactInfo);
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single contact info (admin)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [items] = await pool.query('SELECT * FROM contact_info WHERE id = ?', [id]);

    if (items.length === 0) {
      return res.status(404).json({ error: 'Contact info not found' });
    }

    res.json(items[0]);
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create contact info (admin)
router.post('/', async (req, res) => {
  try {
    const { type, icon_name, label, value, href, color_class, display_order } = req.body;

    if (!type || !label || !value) {
      return res.status(400).json({ error: 'Type, label, and value are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO contact_info (type, icon_name, label, value, href, color_class, display_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [type, icon_name || null, label, value, href || null, color_class || null, display_order || 0]
    );

    const [newItem] = await pool.query('SELECT * FROM contact_info WHERE id = ?', [result.insertId]);
    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('Create contact info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update contact info (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, icon_name, label, value, href, color_class, display_order } = req.body;

    const [result] = await pool.query(
      `UPDATE contact_info 
       SET type = ?, icon_name = ?, label = ?, value = ?, href = ?, color_class = ?, display_order = ?
       WHERE id = ?`,
      [type, icon_name || null, label, value, href || null, color_class || null, display_order || 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact info not found' });
    }

    const [updated] = await pool.query('SELECT * FROM contact_info WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Update contact info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete contact info (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM contact_info WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact info not found' });
    }

    res.json({ message: 'Contact info deleted successfully' });
  } catch (error) {
    console.error('Delete contact info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
