import express from 'express';

const router = express.Router();

let nextArticleId = 1;
const articles = [];

function validateArticlePayload(payload) {
  const {
    title,
    description,
    category,
    price,
    address,
    contact,
    authorId,
  } = payload;

  if (!authorId) return 'Author ID is required';
  if (!title || !description || !category || price == null) return 'Title, description, category, and price are required';
  if (!address || !address.country || !address.state || !address.city || !address.street || !address.number) {
    return 'Address fields are required';
  }
  if (!contact || !contact.name || !contact.telephone || !contact.email) {
    return 'Contact person information is required';
  }

  return null;
}

router.get('/articles', (req, res) => {
  const { authorId } = req.query;
  if (authorId) {
    const filtered = articles.filter((item) => item.authorId === Number(authorId));
    return res.json({ success: true, articles: filtered });
  }

  res.json({ success: true, articles });
});

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
});

export default router;
