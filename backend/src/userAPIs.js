import express from "express";
import pool from "./database.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto'
import { Resend } from 'resend'

const RESEND_API_KEY='re_xxxxxxxxx';
const FRONTEND_URL='http://localhost:5173';

const resend = new Resend(RESEND_API_KEY)


const router = express.Router();

router.get('/userInfo', async (req, res) => {
  const {userID} = req.query;
  if (!userID ) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userID]);
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Utilizatorul nu există' });
    }

    const user = rows[0];

    return res.json({ success: true, name: user.name, surname: user.surname, 
      phone: user.phone, country: user.country, state: user.state, city: user.city, street: user.street, 
      number: user.number, postal_code: user.postal_code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

router.put('/updateUserInfo', async (req, res) => {
  const {userID} = req.body;
  if (!userID ) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const [result] = await pool.query('UPDATE users SET name = ?, surname = ?, phone = ?, country = ?, state = ?, city = ?, street = ?, number = ?, postal_code = ? WHERE id = ?', [
        req.body.name,
        req.body.surname,
        req.body.phone,
        req.body.country,
        req.body.state,
        req.body.city,
        req.body.street,
        req.body.number,
        req.body.postal_code,
        userID
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({message: 'User not found'});
    }
    else {      
        //console.log("User info updated for userID:", userID);
        return res.json({ success: true });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

   try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (!rows || rows.length === 0) {
         // Always return success (don't reveal if email exists)
         return res.json({ message: 'If that email exists, a reset link was sent.' })
      }
      const user = rows[0];

      // Generate secure token
      const token = crypto.randomBytes(16).toString('hex')
      const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

      // Save token to DB
      const [result] = await pool.query('UPDATE users SET token = ?, token_expiry = ? WHERE id = ?', [
         token,
         expires,
         user.id
      ]);

      if (result.affectedRows === 0) {
            // Always return success (don't reveal if email exists)
            return res.json({ message: 'If that email exists, a reset link was sent.' })
      }
      else {      
         console.log("Token info updated for userID:", user.id);
         return res.json({ success: true });
      }
      
   } 
   catch (err) {
      console.error('Database error during forgot password:', err);
      return res.status(500).json({ error: 'Database error' });
   }

  // Send email
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: 'Reset your password',
    html: `
      <p>Hi ${user.name},</p>
      <p>Click the link below to reset your password. It expires in 1 hour.</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, ignore this email.</p>
    `
  })

  res.json({ message: 'If that email exists, a reset link was sent.' })
})



export default router;

