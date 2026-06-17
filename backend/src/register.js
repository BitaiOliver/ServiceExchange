import express from "express";
import pool from "./database.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Register endpoint: creates a new user if email is not already registered
router.post('/register', async (req, res) => {
  const { name, surname, country, state, city, street, number, postalCode, phone, email, password } = req.body;
  if (!name || !surname || !country || !state || !city || !street || !number || !postalCode || !phone || !email || !password) {
    return res.status(400).json({ error: 'va rugam completati toate campurile' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users ( name, surname, country, state, city, street, number, postal_code, phone, email, password_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [name, surname, country, state, city, street, number, postalCode, phone, email, passwordHash]
    );

    return res.status(201).json({ success: true, userId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

export default router;
