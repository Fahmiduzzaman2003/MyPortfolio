const express = require('express');
const pool = require('../config/database');
const { sendNewMessageNotification, sendReplyEmail } = require('../config/email');

const router = express.Router();

// Get all messages (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, is_read } = req.query;

    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (is_read !== undefined) {
      query += ' AND is_read = ?';
      params.push(is_read === 'true');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [messages] = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM contact_messages WHERE 1=1';
    const countParams = [];

    if (is_read !== undefined) {
      countQuery += ' AND is_read = ?';
      countParams.push(is_read === 'true');
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single message (admin only)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [messages] = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [id]);

    if (messages.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(messages[0]);
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), message.trim()]
    );

    // Send email notification to admin (non-blocking)
    sendNewMessageNotification({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    }).catch(err => {
      console.error('Failed to send notification email:', err);
      // Don't fail the request if email fails
    });

    res.status(201).json({
      message: 'Message sent successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Submit message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark message as read/unread (admin only)
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read = true } = req.body;

    const [result] = await pool.query(
      'UPDATE contact_messages SET is_read = ? WHERE id = ?',
      [is_read, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: `Message marked as ${is_read ? 'read' : 'unread'}` });
  } catch (error) {
    console.error('Mark read/unread error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reply to message (send email to the sender)
router.post('/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Reply message is required' });
    }

    // Get the original message
    const [messages] = await pool.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const originalMessage = messages[0];

    // Send reply email
    const emailResult = await sendReplyEmail({
      to: originalMessage.email,
      subject: subject || `Re: Your message to ${process.env.EMAIL_USER || 'us'}`,
      message: message.trim(),
      originalMessage: originalMessage.message
    });

    if (!emailResult.success) {
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: emailResult.error 
      });
    }

    // Mark message as read
    await pool.query(
      'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
      [id]
    );

    res.json({ 
      message: 'Reply sent successfully',
      emailId: emailResult.messageId 
    });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get message statistics (admin only)
router.get('/stats/summary', async (req, res) => {
  try {
    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM contact_messages');
    const [unreadResult] = await pool.query('SELECT COUNT(*) as unread FROM contact_messages WHERE is_read = FALSE');
    const [todayResult] = await pool.query(
      'SELECT COUNT(*) as today FROM contact_messages WHERE DATE(created_at) = CURDATE()'
    );

    res.json({
      total: totalResult[0].total,
      unread: unreadResult[0].unread,
      today: todayResult[0].today
    });
  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
