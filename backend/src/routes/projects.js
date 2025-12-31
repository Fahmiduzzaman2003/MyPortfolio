const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const [projects] = await pool.query(
      'SELECT * FROM projects ORDER BY display_order ASC, created_at DESC'
    );

    // tech_stack is already parsed as JSON by mysql2
    const parsedProjects = projects.map(project => ({
      ...project,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack : []
    }));

    res.json(parsedProjects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [projects] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projects[0];
    project.tech_stack = Array.isArray(project.tech_stack) ? project.tech_stack : [];

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create project (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, tech_stack, github_url, live_url, image_url, display_order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const [result] = await pool.query(
      `INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || '',
        JSON.stringify(tech_stack || []),
        github_url || '',
        live_url || '',
        image_url || '',
        display_order || 0
      ]
    );

    const [newProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    const project = newProject[0];
    project.tech_stack = Array.isArray(project.tech_stack) ? project.tech_stack : [];

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update project (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tech_stack, github_url, live_url, image_url, display_order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const [result] = await pool.query(
      `UPDATE projects SET title = ?, description = ?, tech_stack = ?, github_url = ?,
       live_url = ?, image_url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        title,
        description || '',
        JSON.stringify(tech_stack || []),
        github_url || '',
        live_url || '',
        image_url || '',
        display_order || 0,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const [updated] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    const project = updated[0];
    project.tech_stack = Array.isArray(project.tech_stack) ? project.tech_stack : [];

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Delete project (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
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
      'UPDATE projects SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [display_order, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project display order updated successfully' });
  } catch (error) {
    console.error('Update project order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
