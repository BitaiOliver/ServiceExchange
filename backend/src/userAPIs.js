import express from "express";
import pool from "./database.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto'
import { Resend } from 'resend'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config()


const resend = new Resend(process.env.RESEND_API_KEY)
const router = express.Router();

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,                    // only 3 reset emails per hour
  message: { error: 'Prea multe cereri de resetare. Te rugăm să aștepți o oră înainte de a încerca din nou.' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.get('/userInfo', async (req, res) => {
   const { userID } = req.query;
   if (!userID) {
      return res.status(400).json({ error: 'User ID is required' });
   }

   try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userID]);
      if (!rows || rows.length === 0) {
         return res.status(401).json({ error: 'Utilizatorul nu există' });
      }

      const user = rows[0];

      return res.json({
         success: true, name: user.name, surname: user.surname,
         phone: user.phone, country: user.country, state: user.state, city: user.city, street: user.street,
         number: user.number, postal_code: user.postal_code
      });
   } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
   }
});

router.put('/updateUserInfo', async (req, res) => {
   const { userID } = req.body;
   if (!userID) {
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
         return res.status(404).json({ message: 'User not found' });
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

// POST /sendOTP
/*router.post('/sendOTP', async (req, res) => {
   const { email } = req.body

   try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (!rows || rows.length === 0) {
         // Always return success (don't reveal if email exists)
         return res.json({ message: 'If that email exists, a reset link was sent.' })
      }
      const user = rows[0];

      // Generate secure token
      const token = crypto.randomInt(100000, 999999).toString('hex')
      const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

      // Save token to DB
      const [result] = await pool.query('UPDATE users SET token = ?, token_expiry = ? WHERE id = ?', [
         token,
         expires,
         user.id
      ]);

      if (result.affectedRows === 0) {
         return res.status(500).json({ error: 'Database error' });
      }
      else {
         console.log("Token info updated for userID:", user.id);
      }

      // obi12: send token per mail 
      return res.json({ message: 'Password reset successfully' })
      
   }
   catch (err) {
      console.error('Database error during reset password:', err);
      return res.status(500).json({ error: 'Database error' });
   }
})
*/

// POST /forgot-password
router.post('/forgot-password',forgotPasswordLimiter ,async (req, res) => {
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
         //return res.json({ success: true });
      }


      // Send email
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

      const email_result = await resend.emails.send({
         from: 'onboarding@resend.dev', // works out of the box, no domain needed
         to: email,
         subject: 'Reset your password',
         html: `
          <p>Hi ${user.name},</p>
          <p>Click the link below to reset your password. It expires in 1 hour.</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you didn't request this, ignore this email.</p>
        `
      })

      console.log('resend:', email_result); // Log the email for debugging
      return res.json({ success: true });


   }
   catch (err) {
      console.error('Database or email error during forgot password:', err);
      return res.status(500).json({ error: 'Database error' });
   }
})

// POST /reset-password
router.post('/reset-password',forgotPasswordLimiter , async (req, res) => {
   const { token, newPassword } = req.body

   try {
      const [rows] = await pool.query('SELECT * FROM users WHERE token = ?', [token]);
      if (!rows || rows.length === 0) {
         return res.status(401).json({ error: 'Utilizatorul nu există!' });
      }
      const user = rows[0];
      if (user.token_expiry < new Date(Date.now())) {
         // Always return success (don't reveal if email exists)
         return res.status(401).json({ error: 'Token expirat!' });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      const [result] = await pool.query('UPDATE users SET password_hash = ?, token = ?, token_expiry = ? WHERE id = ?', [
         passwordHash,
         null,
         null,
         user.id
      ]);
      return res.json({ message: 'Password reset successfully' })
      
   }
   catch (err) {
      console.error('Database error during reset password:', err);
      return res.status(500).json({ error: 'Database error' });
   }
})



export default router;

