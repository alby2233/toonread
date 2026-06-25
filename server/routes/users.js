const express = require('express');
const db = require('../database');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get user profile (coins, bookmarks)
router.get('/profile', verifyToken, (req, res) => {
  const userId = req.user.id;
  
  db.get('SELECT id, username, email, role, coins FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    
    // Get bookmarks
    db.all(`
      SELECT c.*, b.savedAt 
      FROM bookmarks b
      JOIN comics c ON b.comicId = c.id
      WHERE b.userId = ?
      ORDER BY b.savedAt DESC
    `, [userId], (err, bookmarks) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ user, bookmarks });
    });
  });
});

// Toggle bookmark
router.post('/bookmarks/toggle', verifyToken, (req, res) => {
  const userId = req.user.id;
  const { comicId } = req.body;
  
  db.get('SELECT * FROM bookmarks WHERE userId = ? AND comicId = ?', [userId, comicId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row) {
      // Remove bookmark
      db.run('DELETE FROM bookmarks WHERE userId = ? AND comicId = ?', [userId, comicId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ bookmarked: false });
      });
    } else {
      // Add bookmark
      db.run('INSERT INTO bookmarks (userId, comicId) VALUES (?, ?)', [userId, comicId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ bookmarked: true });
      });
    }
  });
});

// Check if a specific comic is bookmarked
router.get('/bookmarks/check/:comicId', verifyToken, (req, res) => {
  const userId = req.user.id;
  const comicId = req.params.comicId;
  
  db.get('SELECT id FROM bookmarks WHERE userId = ? AND comicId = ?', [userId, comicId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ bookmarked: !!row });
  });
});

module.exports = router;
