const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all coding platforms (public)
router.get('/', async (req, res) => {
  try {
    const [platforms] = await pool.query(
      'SELECT * FROM coding_platforms ORDER BY display_order ASC, problems_solved DESC'
    );
    res.json(platforms);
  } catch (error) {
    console.error('Get coding platforms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single coding platform (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [platforms] = await pool.query('SELECT * FROM coding_platforms WHERE id = ?', [id]);

    if (platforms.length === 0) {
      return res.status(404).json({ error: 'Coding platform not found' });
    }

    res.json(platforms[0]);
  } catch (error) {
    console.error('Get coding platform error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create coding platform (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, icon_name, url, problems_solved, rating, username, display_order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Platform name is required' });
    }

    if (!icon_name) {
      return res.status(400).json({ error: 'Icon name is required' });
    }

    const [result] = await pool.query(
      `INSERT INTO coding_platforms (name, icon_name, url, problems_solved, rating, username, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        icon_name,
        url || '',
        problems_solved || 0,
        rating || '',
        username || '',
        display_order || 0
      ]
    );

    const [newPlatform] = await pool.query('SELECT * FROM coding_platforms WHERE id = ?', [result.insertId]);
    res.status(201).json(newPlatform[0]);
  } catch (error) {
    console.error('Create coding platform error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update coding platform (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon_name, url, problems_solved, rating, username, display_order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Platform name is required' });
    }

    if (!icon_name) {
      return res.status(400).json({ error: 'Icon name is required' });
    }

    const [result] = await pool.query(
      `UPDATE coding_platforms SET name = ?, icon_name = ?, url = ?, problems_solved = ?,
       rating = ?, username = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        name,
        icon_name,
        url || '',
        problems_solved || 0,
        rating || '',
        username || '',
        display_order || 0,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Coding platform not found' });
    }

    const [updated] = await pool.query('SELECT * FROM coding_platforms WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Update coding platform error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete coding platform (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM coding_platforms WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Coding platform not found' });
    }

    res.json({ message: 'Coding platform deleted successfully' });
  } catch (error) {
    console.error('Delete coding platform error:', error);
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
      'UPDATE coding_platforms SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [display_order, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Coding platform not found' });
    }

    res.json({ message: 'Coding platform display order updated successfully' });
  } catch (error) {
    console.error('Update coding platform order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get platform statistics (public)
router.get('/stats/summary', async (req, res) => {
  try {
    const [totalResult] = await pool.query('SELECT SUM(problems_solved) as total_problems FROM coding_platforms');
    const [platformCount] = await pool.query('SELECT COUNT(*) as total_platforms FROM coding_platforms');
    const [topPlatform] = await pool.query(
      'SELECT name, problems_solved FROM coding_platforms ORDER BY problems_solved DESC LIMIT 1'
    );

    res.json({
      totalProblems: totalResult[0].total_problems || 0,
      totalPlatforms: platformCount[0].total_platforms,
      topPlatform: topPlatform[0] || null
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
