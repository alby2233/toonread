const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../database');
const { verifyToken, requireAdmin } = require('./auth');

const router = express.Router();

// Multer config
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, fileFilter });

// Create a new Comic
router.post('/comic', verifyToken, requireAdmin, upload.single('cover'), (req, res) => {
  const { title, author, type, synopsis, genres, status, rating } = req.body;
  const coverUrl = req.file ? `/uploads/${req.file.filename}` : '';

  db.run(`INSERT INTO comics (title, author, type, coverUrl, synopsis, genres, status, rating) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
    [title, author, type, coverUrl, synopsis, genres, status, rating || 0], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Comic created successfully' });
  });
});

// Create a new Chapter
router.post('/chapter', verifyToken, requireAdmin, upload.array('pages', 100), (req, res) => {
  const { comicId, number, title, date, isPremium, price } = req.body;
  
  // Create array of URLs for the uploaded pages
  const pagesUrls = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

  db.run(`INSERT INTO chapters (comicId, number, title, date, isPremium, price, pages) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [comicId, number, title, date, isPremium || 0, price || 0, JSON.stringify(pagesUrls)],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Chapter created successfully' });
  });
});

module.exports = router;
