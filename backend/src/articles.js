import express from 'express';
import pool from "./database.js";


const router = express.Router();


function validateArticlePayload(payload) {
  const {
    title,
    description,
    price,
    picture_url,
    author_id,
    contact_name,
    contact_surname,
    contact_phone,
    contact_email,
    creation_date,
    status
  } = payload;

  if (!author_id) return 'Author ID is required';
  if (!title || !description  == null) return 'Titlu si descriere sunt necesare';
  if (!contact_name || !contact_surname || !contact_phone || !contact_email) {
    return 'Informatiile despre persoana de contact sunt necesare';
  }
  return null;
}

router.get('/articles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM articles WHERE status = ?', ['active']);
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Nu există articole' });
    }
    return res.json({ success: true, articles: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Articles Database error' });
  }
});

router.get('/article/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Articolul nu există' });
    }
    return res.json({ success: true, article: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Articles Database error' });
  }
});

router.post('/article', async (req, res) => {
  const {
    title,
    description,
    price,
    picture_url,
    author_id,
    contact_name,
    contact_surname,
    contact_phone,
    contact_email,
    status
  } = req.body;
  const error = validateArticlePayload(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const [rows] = await pool.query('INSERT INTO articles ( title, description, price, picture_url, author_id, contact_name, contact_surname, contact_phone, contact_email, status) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [title, description, price, picture_url, author_id, contact_name, contact_surname, contact_phone, contact_email, status]);
    return res.status(201).json({ success: true, article: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Articles Database error' });
  }
});

/*
router.get('/articles/:id', (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find((item) => item.id === id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json({ success: true, article });
});

router.post('/articles', (req, res) => {
  const error = validateArticlePayload(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const article = {
    id: nextArticleId++,
    authorId: Number(req.body.authorId),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    price: Number(req.body.price),
    address: {
      country: req.body.address.country,
      state: req.body.address.state,
      city: req.body.address.city,
      street: req.body.address.street,
      number: req.body.address.number,
    },
    contact: {
      name: req.body.contact.name,
      telephone: req.body.contact.telephone,
      email: req.body.contact.email,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  articles.push(article);
  res.status(201).json({ success: true, article });
});

router.put('/articles/:id', (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find((item) => item.id === id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const authorId = Number(req.body.authorId);
  if (!authorId || article.authorId !== authorId) {
    return res.status(403).json({ error: 'Only the article author can edit this article' });
  }

  const error = validateArticlePayload(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  article.title = req.body.title;
  article.description = req.body.description;
  article.category = req.body.category;
  article.price = Number(req.body.price);
  article.address = {
    country: req.body.address.country,
    state: req.body.address.state,
    city: req.body.address.city,
    street: req.body.address.street,
    number: req.body.address.number,
  };
  article.contact = {
    name: req.body.contact.name,
    telephone: req.body.contact.telephone,
    email: req.body.contact.email,
  };
  article.updatedAt = new Date().toISOString();

  res.json({ success: true, article });
});*/

export default router;
