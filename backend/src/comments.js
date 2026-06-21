import express from 'express';
import pool from './database.js';
import { authenticateToken } from './authMiddleware.js';

const router = express.Router();

router.get('/comments', async (req, res) => {
  const articleId = Number(req.query.article_id);

  if (!articleId) {
    return res.status(400).json({ error: 'article_id is required' });
  }

  try {
    const [rows] = await pool.query(
      `
        SELECT
          c.id,
          c.article_id,
          c.author_id,
          c.comment_text,
          CONCAT(u.name, ' ', u.surname) AS author_name
        FROM comments c
        LEFT JOIN users u ON c.author_id = u.id
        WHERE c.article_id = ?
        ORDER BY c.id DESC
      `,
      [articleId]
    );

    return res.json({
      success: true,
      comments: rows.map((comment) => ({
        id: comment.id,
        article_id: comment.article_id,
        author_id: comment.author_id,
        author_name: comment.author_name || 'Utilizator',
        text: comment.comment_text,
        created_date: null,
      }))
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Comments database error' });
  }
});

router.post('/comments', authenticateToken, async (req, res) => {
  const { article_id, comment_text } = req.body;
  const authenticatedUserId = req.user?.id;

  if (!article_id || !authenticatedUserId || !comment_text?.trim()) {
    return res.status(400).json({ error: 'article_id, authenticated user, and comment_text are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO comments (article_id, author_id, comment_text) VALUES (?, ?, ?)',
      [Number(article_id), Number(authenticatedUserId), comment_text.trim()]
    );

    const [rows] = await pool.query(
      `
        SELECT
          c.id,
          c.article_id,
          c.author_id,
          c.comment_text,
          CONCAT(u.name, ' ', u.surname) AS author_name
        FROM comments c
        LEFT JOIN users u ON c.author_id = u.id
        WHERE c.id = ?
      `,
      [result.insertId]
    );

    if (!rows.length) {
      return res.status(500).json({ error: 'Comment was created but could not be loaded' });
    }

    const comment = rows[0];
    return res.status(201).json({
      success: true,
      comment: {
        id: comment.id,
        article_id: comment.article_id,
        author_id: comment.author_id,
        author_name: comment.author_name || 'Utilizator',
        text: comment.comment_text,
        created_date: null,
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Comments database error' });
  }
});

router.delete('/comments/:id', authenticateToken, async (req, res) => {
  const commentId = Number(req.params.id);
  const authenticatedUserId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';

  if (!commentId) {
    return res.status(400).json({ error: 'Comment id is required' });
  }

  if (!authenticatedUserId) {
    return res.status(401).json({ error: 'You must be logged in to delete comments' });
  }

  try {
    const [commentRows] = await pool.query(
      'SELECT author_id FROM comments WHERE id = ?',
      [commentId]
    );

    if (!commentRows.length) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = commentRows[0];

    if (!isAdmin && Number(comment.author_id) !== Number(authenticatedUserId)) {
      return res.status(403).json({ error: 'You do not have permission to delete this comment' });
    }

    const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    return res.json({ success: true, deletedCommentId: commentId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Comments database error' });
  }
});

export default router;
