const express = require('express');
const pool = require('../config/database');
const { cacheMiddleware, del } = require('../utils/cache');

const router = express.Router();

// Get profile
router.get('/', cacheMiddleware(600), async (req, res) => {
  try {
    const [profiles] = await pool.query('SELECT * FROM profiles LIMIT 1');

    if (profiles.length === 0) {
      return res.json({
        full_name: '',
        tagline: '',
        short_intro: '',
        bio: '',
        location: '',
        email: '',
        phone: '',
        linkedin_url: '',
        github_url: '',
        whatsapp_number: '',
        profile_photo_url: '',
        cv_url: '',
        availability_text: 'Open to work',
        roles: [],
        stats: []
      });
    }

    const profile = profiles[0];
    
    // DEBUG: Log raw data from database
    console.log('=== GET Profile - Raw from DB ===');
    console.log('Raw roles type:', typeof profile.roles);
    console.log('Raw roles value:', profile.roles);
    console.log('Raw stats type:', typeof profile.stats);
    console.log('Raw stats value:', profile.stats);
    
    // Parse JSON fields (MySQL might return them as strings or objects)
    try {
      if (typeof profile.roles === 'string') {
        profile.roles = JSON.parse(profile.roles || '[]');
      } else if (!Array.isArray(profile.roles)) {
        profile.roles = [];
      }
      
      if (typeof profile.stats === 'string') {
        profile.stats = JSON.parse(profile.stats || '[]');
      } else if (!Array.isArray(profile.stats)) {
        profile.stats = [];
      }
    } catch (e) {
      console.error('JSON parse error:', e);
      profile.roles = [];
      profile.stats = [];
    }
    
    console.log('=== GET Profile - After parsing ===');
    console.log('Parsed roles:', profile.roles);
    console.log('Parsed stats:', profile.stats);

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/', async (req, res) => {
  try {
    const {
      full_name,
      tagline,
      short_intro,
      bio,
      location,
      email,
      phone,
      linkedin_url,
      github_url,
      whatsapp_number,
      profile_photo_url,
      cv_url,
      availability_text,
      roles,
      stats
    } = req.body;

    // DEBUG: Log received data
    console.log('=== Profile Update Request ===');
    console.log('Roles received:', JSON.stringify(roles, null, 2));
    console.log('Stats received:', JSON.stringify(stats, null, 2));
    console.log('Roles type:', typeof roles, 'Is Array:', Array.isArray(roles));
    console.log('Stats type:', typeof stats, 'Is Array:', Array.isArray(stats));

    // Convert arrays/objects to JSON strings
    const rolesJson = JSON.stringify(roles || []);
    const statsJson = JSON.stringify(stats || []);
    
    console.log('Roles JSON to be saved:', rolesJson);
    console.log('Stats JSON to be saved:', statsJson);

    // Check if profile exists
    const [existing] = await pool.query('SELECT id FROM profiles LIMIT 1');

    if (existing.length === 0) {
      // Create new profile
      const [result] = await pool.query(`
        INSERT INTO profiles (
          full_name, tagline, short_intro, bio, location, email, phone,
          linkedin_url, github_url, whatsapp_number, profile_photo_url,
          cv_url, availability_text, roles, stats
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        full_name || '', tagline || '', short_intro || '', bio || '',
        location || '', email || '', phone || '', linkedin_url || '',
        github_url || '', whatsapp_number || '', profile_photo_url || '',
        cv_url || '', availability_text || 'Open to work', rolesJson, statsJson
      ]);

      res.json({ id: result.insertId, message: 'Profile created successfully' });
    } else {
      // Update existing profile
      await pool.query(`
        UPDATE profiles SET
          full_name = ?, tagline = ?, short_intro = ?, bio = ?, location = ?,
          email = ?, phone = ?, linkedin_url = ?, github_url = ?,
          whatsapp_number = ?, profile_photo_url = ?, cv_url = ?,
          availability_text = ?, roles = ?, stats = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        full_name || '', tagline || '', short_intro || '', bio || '',
        location || '', email || '', phone || '', linkedin_url || '',
        github_url || '', whatsapp_number || '', profile_photo_url || '',
        cv_url || '', availability_text || 'Open to work', rolesJson, statsJson,
        existing[0].id
      ]);

      console.log('=== Profile updated in database ===');
      console.log('Updated ID:', existing[0].id);

      res.json({ message: 'Profile updated successfully' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
