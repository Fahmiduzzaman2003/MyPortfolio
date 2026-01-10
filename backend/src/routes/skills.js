const express = require('express');
const pool = require('../config/database');
const { cacheMiddleware, del } = require('../utils/cache');

const router = express.Router();

// Get all skill categories with their skills (public)
router.get('/categories', cacheMiddleware(600), async (req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM skill_categories ORDER BY display_order ASC, created_at DESC'
    );

    const [skills] = await pool.query(`
      SELECT s.*, sc.name as category_name
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      ORDER BY s.name ASC
    `);

    const result = categories.map(category => ({
      ...category,
      skills: skills.filter(skill => skill.category_id === category.id)
    }));

    res.json(result);
  } catch (error) {
    console.error('Get skill categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single skill category (public)
router.get('/categories/:id', cacheMiddleware(600), async (req, res) => {
  try {
    const { id } = req.params;
    const [categories] = await pool.query('SELECT * FROM skill_categories WHERE id = ?', [id]);

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Skill category not found' });
    }

    const [skills] = await pool.query('SELECT * FROM skills WHERE category_id = ? ORDER BY name ASC', [id]);

    res.json({
      ...categories[0],
      skills
    });
  } catch (error) {
    console.error('Get skill category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create skill category (admin only)
router.post('/categories', async (req, res) => {
  try {
    const { name, icon, logo_url, display_order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO skill_categories (name, icon, logo_url, display_order) VALUES (?, ?, ?, ?)',
      [name, icon || '', logo_url || '', display_order || 0]
    );

    const [newCategory] = await pool.query('SELECT * FROM skill_categories WHERE id = ?', [result.insertId]);
    
    // Clear skills cache
    await del('api:/api/skills*');
    
    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error('Create skill category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update skill category (admin only)
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, logo_url, display_order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const [result] = await pool.query(
      'UPDATE skill_categories SET name = ?, icon = ?, logo_url = ?, display_order = ? WHERE id = ?',
      [name, icon || '', logo_url || '', display_order || 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill category not found' });
    }

    const [updated] = await pool.query('SELECT * FROM skill_categories WHERE id = ?', [id]);
    
    // Clear skills cache
    await del('api:/api/skills*');
    
    res.json(updated[0]);
  } catch (error) {
    console.error('Update skill category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete skill category (admin only)
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete associated skills first
    await pool.query('DELETE FROM skills WHERE category_id = ?', [id]);

    const [result] = await pool.query('DELETE FROM skill_categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill category not found' });
    }

    // Clear skills cache
    await del('api:/api/skills*');

    res.json({ message: 'Skill category and associated skills deleted successfully' });
  } catch (error) {
    console.error('Delete skill category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const [skills] = await pool.query(`
      SELECT s.*, sc.name as category_name, sc.icon as category_icon
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      ORDER BY s.name ASC
    `);
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single skill (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [skills] = await pool.query(`
      SELECT s.*, sc.name as category_name, sc.icon as category_icon
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      WHERE s.id = ?
    `, [id]);

    if (skills.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skills[0]);
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create skill (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, level, category_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    if (!category_id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Verify category exists
    const [categories] = await pool.query('SELECT id FROM skill_categories WHERE id = ?', [category_id]);
    if (categories.length === 0) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const [result] = await pool.query(
      'INSERT INTO skills (name, level, category_id) VALUES (?, ?, ?)',
      [name, level || 0, category_id]
    );

    const [newSkill] = await pool.query(`
      SELECT s.*, sc.name as category_name, sc.icon as category_icon
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      WHERE s.id = ?
    `, [result.insertId]);

    // Clear skills cache
    await del('api:/api/skills*');

    res.status(201).json(newSkill[0]);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update skill (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level, category_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    if (!category_id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Verify category exists
    const [categories] = await pool.query('SELECT id FROM skill_categories WHERE id = ?', [category_id]);
    if (categories.length === 0) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const [result] = await pool.query(
      'UPDATE skills SET name = ?, level = ?, category_id = ? WHERE id = ?',
      [name, level || 0, category_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const [updated] = await pool.query(`
      SELECT s.*, sc.name as category_name, sc.icon as category_icon
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      WHERE s.id = ?
    `, [id]);

    // Clear skills cache
    await del('api:/api/skills*');

    res.json(updated[0]);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete skill (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Clear skills cache
    await del('api:/api/skills*');

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
