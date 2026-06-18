import express from "express";
import pool from "./database.js";
import bcrypt from "bcryptjs";
import rateLimit from 'express-rate-limit'


const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5,
  skipSuccessfulRequests: true, // ✅ only counts failed attempts
  message: { error: 'Contul a fost temporar blocat. Încearcă din nou într-o oră sau resetează parola.' },
  standardHeaders: true,
  legacyHeaders: false,
})


// Login endpoint: checks email and password, updates status to 'logged_in'
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Utilizatorul nu există' });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Parolă incorectă' });
    }

    return res.json({ success: true, userId: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

export default router;
