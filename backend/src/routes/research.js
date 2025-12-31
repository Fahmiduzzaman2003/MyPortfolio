const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all research entries (public)
router.get('/', async (req, res) => {
  try {
    const [research] = await pool.query(
      'SELECT * FROM research ORDER BY display_order ASC, created_at DESC'
    );

    // Parse technologies JSON for each research entry
    const parsedResearch = research.map(item => {
      let parsedTech = [];
      try {
        if (item.technologies && item.technologies !== '' && item.technologies !== 'null') {
          parsedTech = JSON.parse(item.technologies);
        }
      } catch (e) {
        console.error('Failed to parse technologies for research item:', item.id, e);
      }
      return {
        ...item,
        technologies: parsedTech
      };
    });

    res.json(parsedResearch);
  } catch (error) {
    console.error('Get research error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single research entry (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [research] = await pool.query('SELECT * FROM research WHERE id = ?', [id]);

    if (research.length === 0) {
      return res.status(404).json({ error: 'Research entry not found' });
    }

    const item = research[0];
    let parsedTech = [];
    try {
      if (item.technologies && item.technologies !== '' && item.technologies !== 'null') {
        parsedTech = JSON.parse(item.technologies);
      }
    } catch (e) {
      console.error('Failed to parse technologies:', e);
    }
    item.technologies = parsedTech;

    res.json(item);
  } catch (error) {
    console.error('Get research entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create research entry (admin only)
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/research - Request body:', req.body);
    const { title, abstract, venue, status, technologies, paper_url, display_order } = req.body;

    if (!title) {
      console.log('Validation failed: title is required');
      return res.status(400).json({ error: 'Research title is required' });
    }

    // Validate status
    const validStatuses = ['ongoing', 'completed', 'published'];
    if (status && !validStatuses.includes(status)) {
      console.log('Validation failed: invalid status', status);
      return res.status(400).json({ error: 'Invalid status. Must be one of: ongoing, completed, published' });
    }

    console.log('Inserting research with data:', {
      title,
      abstract: abstract || '',
      status: status || 'ongoing',
      technologies: technologies || [],
      paper_url: paper_url || '',
      display_order: display_order || 0
    });

    const [result] = await pool.query(
      `INSERT INTO research (title, abstract, venue, status, technologies, paper_url, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        abstract || '',
        venue || '',
        status || 'ongoing',
        JSON.stringify(technologies || []),
        paper_url || '',
        display_order || 0
      ]
    );

    console.log('Insert result:', result);

    const [newResearch] = await pool.query('SELECT * FROM research WHERE id = ?', [result.insertId]);
    const item = newResearch[0];
    
    let parsedTech = [];
    try {
      if (item.technologies && item.technologies !== '' && item.technologies !== 'null') {
        parsedTech = JSON.parse(item.technologies);
      }
    } catch (e) {
      console.error('Failed to parse technologies:', e);
    }
    item.technologies = parsedTech;

    console.log('Created research:', item);
    res.status(201).json(item);
  } catch (error) {
    console.error('Create research error:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update research entry (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, abstract, venue, status, technologies, paper_url, display_order } = req.body;

    console.log('PUT /api/research/:id - Request body:', JSON.stringify(req.body, null, 2));
    console.log('Technologies received:', technologies, 'Type:', typeof technologies, 'IsArray:', Array.isArray(technologies));

    if (!title) {
      return res.status(400).json({ error: 'Research title is required' });
    }

    // Validate status
    const validStatuses = ['ongoing', 'completed', 'published'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: ongoing, completed, published' });
    }

    const [result] = await pool.query(
      `UPDATE research SET title = ?, abstract = ?, venue = ?, status = ?, technologies = ?,
       paper_url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        title,
        abstract || '',
        venue || '',
        status || 'ongoing',
        JSON.stringify(technologies || []),
        paper_url || '',
        display_order || 0,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Research entry not found' });
    }

    const [updated] = await pool.query('SELECT * FROM research WHERE id = ?', [id]);
    const item = updated[0];
    
    let parsedTech = [];
    try {
      if (item.technologies && item.technologies !== '' && item.technologies !== 'null') {
        parsedTech = JSON.parse(item.technologies);
      }
    } catch (e) {
      console.error('Failed to parse technologies:', e);
    }
    item.technologies = parsedTech;

    res.json(item);
  } catch (error) {
    console.error('Update research error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete research entry (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM research WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Research entry not found' });
    }

    res.json({ message: 'Research entry deleted successfully' });
  } catch (error) {
    console.error('Delete research error:', error);
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
      'UPDATE research SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [display_order, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Research entry not found' });
    }

    res.json({ message: 'Research display order updated successfully' });
  } catch (error) {
    console.error('Update research order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
