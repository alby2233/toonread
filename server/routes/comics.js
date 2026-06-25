const express = require('express');
const db = require('../database');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get all comics
router.get('/', (req, res) => {
  db.all("SELECT * FROM comics", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse genres from JSON string
    const comics = rows.map(row => ({
      ...row,
      genres: JSON.parse(row.genres || '[]')
    }));
    res.json(comics);
  });
});

// Get comic by ID
router.get('/:id', (req, res) => {
  db.get("SELECT * FROM comics WHERE id = ?", [req.params.id], (err, comic) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!comic) return res.status(404).json({ error: 'Comic not found' });
    
    comic.genres = JSON.parse(comic.genres || '[]');
    res.json(comic);
  });
});

// Get chapters for a comic
router.get('/:id/chapters', (req, res) => {
  db.all("SELECT id, comicId, number, title, date, isPremium, price FROM chapters WHERE comicId = ? ORDER BY number ASC", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get specific chapter (Requires Auth for Premium)
// We will allow anyone to request it, but if it's premium, we must check if they unlocked it.
router.get('/:id/chapter/:chapterNumber', verifyToken, (req, res) => {
  const { id, chapterNumber } = req.params;
  const userId = req.user.id;

  db.get("SELECT * FROM chapters WHERE comicId = ? AND number = ?", [id, chapterNumber], (err, chapter) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    // Check premium status
    if (chapter.isPremium) {
      if (req.user.role === 'admin') {
        // Admin bypass
        return res.json({ ...chapter, pages: JSON.parse(chapter.pages || '[]') });
      }

      db.get("SELECT * FROM unlocked_chapters WHERE userId = ? AND chapterId = ?", [userId, chapter.id], (err, unlocked) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (!unlocked) {
          return res.status(403).json({ error: 'Premium chapter locked', price: chapter.price, chapterId: chapter.id });
        }
        
        // Unlocked!
        res.json({ ...chapter, pages: JSON.parse(chapter.pages || '[]') });
      });
    } else {
      // Free chapter
      res.json({ ...chapter, pages: JSON.parse(chapter.pages || '[]') });
    }
  });
});

// Unlock a chapter
router.post('/unlock/:chapterId', verifyToken, (req, res) => {
  const userId = req.user.id;
  const chapterId = req.params.chapterId;

  db.get("SELECT * FROM chapters WHERE id = ?", [chapterId], (err, chapter) => {
    if (err || !chapter) return res.status(404).json({ error: 'Chapter not found' });
    if (!chapter.isPremium) return res.json({ success: true, message: 'Chapter is free' });

    db.get("SELECT coins FROM users WHERE id = ?", [userId], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'User not found' });

      if (user.coins < chapter.price) {
        return res.status(400).json({ error: 'Not enough coins' });
      }

      // Deduct coins and unlock
      db.run("UPDATE users SET coins = coins - ? WHERE id = ?", [chapter.price, userId], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to deduct coins' });

        db.run("INSERT INTO unlocked_chapters (userId, chapterId) VALUES (?, ?)", [userId, chapterId], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to unlock chapter' });
          res.json({ success: true, remainingCoins: user.coins - chapter.price });
        });
      });
    });
  });
});

module.exports = router;
