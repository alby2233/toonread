const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'reader',
        coins INTEGER DEFAULT 0
      )`);

      // Comics table
      db.run(`CREATE TABLE IF NOT EXISTS comics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        type TEXT,
        coverUrl TEXT,
        synopsis TEXT,
        genres TEXT,
        status TEXT,
        rating REAL DEFAULT 0.0
      )`);

      // Chapters table
      db.run(`
      CREATE TABLE IF NOT EXISTS unlocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        chapterId INTEGER,
        unlockedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userId, chapterId)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        comicId INTEGER,
        savedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userId, comicId)
      )
    `);  
      db.run(`CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comicId INTEGER,
        number INTEGER,
        title TEXT,
        date TEXT,
        isPremium INTEGER DEFAULT 0,
        price INTEGER DEFAULT 0,
        pages TEXT, -- JSON string array of URLs
        FOREIGN KEY(comicId) REFERENCES comics(id)
      )`);

      // Transactions table
      db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        stripeSessionId TEXT,
        amount REAL,
        coinsAdded INTEGER,
        date TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // Purchases table (to track which chapters a user unlocked)
      db.run(`CREATE TABLE IF NOT EXISTS unlocked_chapters (
        userId INTEGER,
        chapterId INTEGER,
        PRIMARY KEY (userId, chapterId),
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(chapterId) REFERENCES chapters(id)
      )`);

      // Verification Codes table
      db.run(`CREATE TABLE IF NOT EXISTS verification_codes (
        email TEXT PRIMARY KEY,
        code TEXT,
        expiresAt INTEGER
      )`);

      // Create default admin user if none exists
      const bcrypt = require('bcrypt');
      db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
        if (!row) {
          const hash = bcrypt.hashSync('admin098', 10);
          db.run("INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@toonread.com', ?, 'admin')", [hash]);
          console.log("Default admin created: admin / admin098");
        }
      });
    });
  }
});

module.exports = db;
