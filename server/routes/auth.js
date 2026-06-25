const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../database');

const router = express.Router();
const JWT_SECRET = 'super_secret_jwt_key_for_dev_only'; // In production, use env variable

// Nodemailer setup
let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  // Use Real SMTP (e.g., Gmail)
  transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or configure custom host
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('Nodemailer configured to use REAL email via Gmail.');
} else {
  // Fallback to Ethereal for testing
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return;
    }
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });
    console.log('Nodemailer configured to use Ethereal (Mock Emails).');
  });
}

// Send Verification Code
router.post('/send-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  db.run(`INSERT INTO verification_codes (email, code, expiresAt) VALUES (?, ?, ?) 
          ON CONFLICT(email) DO UPDATE SET code = excluded.code, expiresAt = excluded.expiresAt`, 
  [email, code, expiresAt], async (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    console.log(`\n========================================`);
    console.log(`VERIFICATION CODE FOR ${email}: ${code}`);
    console.log(`========================================\n`);

    if (transporter) {
      const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e293b; text-align: center;">Welcome to ToonRead!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Hello, <br><br>
            Thank you for registering an account with ToonRead. To securely verify your email address and complete your registration, please use the 6-digit verification code below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #3b82f6; border-radius: 4px;">
              ${code}
            </span>
          </div>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">
            If you did not request this code, please safely ignore this email. This code will expire in 15 minutes.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} ToonRead Platform. All rights reserved.
          </p>
        </div>
      `;

      const msg = {
        from: `"ToonRead" <${process.env.EMAIL_USER || 'admin@toonread.com'}>`,
        to: email,
        subject: "ToonRead - Secure Verification Code",
        text: `Welcome to ToonRead!\n\nYour secure verification code is: ${code}\n\nIf you did not request this code, please ignore this email.`,
        html: htmlTemplate
      };
      try {
        const info = await transporter.sendMail(msg);
        console.log('Email sent successfully:', info.messageId);
      } catch (emailErr) {
        console.error('Failed to send email via NodeMailer:', emailErr);
      }
    }

    res.json({ message: 'Verification code sent!' });
  });
});

// Registration (Requires Email & Code)
router.post('/register', async (req, res) => {
  const { email, code, username, password } = req.body;
  if (!email || !code || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Verify Code
  db.get(`SELECT * FROM verification_codes WHERE email = ?`, [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(400).json({ error: 'No code found for this email' });
    if (row.code !== code) return res.status(400).json({ error: 'Invalid code' });
    if (Date.now() > row.expiresAt) return res.status(400).json({ error: 'Code expired' });

    // Code matches, create user
    try {
      const hash = await bcrypt.hash(password, 10);
      db.run("INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, 'reader')", [email, username, hash], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or Email already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        
        // Delete the used code
        db.run("DELETE FROM verification_codes WHERE email = ?", [email]);

        const token = jwt.sign({ id: this.lastID, role: 'reader', username }, JWT_SECRET);
        res.json({ token, user: { id: this.lastID, username, role: 'reader', coins: 0 } });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, coins: user.coins } });
  });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to require Admin
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

module.exports = router;
module.exports.verifyToken = verifyToken;
module.exports.requireAdmin = requireAdmin;
