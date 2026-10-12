const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const {
  initializeDatabase,
  listArticles,
  searchArticles,
  findArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getCategories,
  getCategoryDetails,
  getAuthors,
  subscribeNewsletter,
  getUserByEmail,
  verifyPassword,
} = require('./config/db');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || 'novawire-dev-secret-change-me';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again shortly.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many admin login attempts. Please try again later.' },
});

app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));

app.use('/api', apiLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

function getAuthToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

function authenticateAdmin(req, res, next) {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

app.get('/api/health', async (req, res) => {
  const status = await initializeDatabase();

  res.status(status.connected ? 200 : 503).json({
    status: status.connected ? 'ok' : 'error',
    database: 'sqlite',
    databaseFile: status.file || null,
    message: 'NovaWire newsroom API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load categories.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/categories/:slug', async (req, res) => {
  try {
    const category = await getCategoryDetails(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load category.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/authors', async (req, res) => {
  try {
    const authors = await getAuthors();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load authors.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const payload = await listArticles({
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 12),
      category: req.query.category || 'all',
      query: req.query.q || req.query.search || '',
      sort: req.query.sort || 'newest',
      featured: Boolean(req.query.featured),
    });

    return res.json(payload);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch articles.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/articles/featured', async (req, res) => {
  try {
    const payload = await listArticles({
      limit: Number(req.query.limit || 4),
     featured: true,
      sort: 'featured',
    });
    return res.json(payload.items || []);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch featured articles.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/articles/trending', async (req, res) => {
  try {
    const payload = await listArticles({
      limit: Number(req.query.limit || 5),
      sort: 'newest',
    });
    return res.json(payload.items || []);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch trending articles.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/search', async (req, res) => {
  const query = String(req.query.q || '').trim();
  const category = String(req.query.category || 'all');
  if (!query) {
    return res.json({ items: [], total: 0, pagination: { page: 1, limit: 12, total: 0, totalPages: 1 } });
  }

  try {
    const payload = await searchArticles({
      query,
      category,
      sort: req.query.sort || 'newest',
      page: Number(req.query.page || 1),
      limit: Math.min(
  Math.max(Number(req.query.limit) || 10, 10),
  50
),
    });

    return res.json(payload);
  } catch (error) {
    return res.status(500).json({ message: 'Search failed.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const article = await findArticleById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    return res.json(article);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch article.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, source } = req.body || {};
    const result = await subscribeNewsletter({ email, source: source || 'homepage' });
    return res.status(result.status === 'exists' ? 200 : 201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Newsletter subscription failed.' });
  }
});

app.post('/api/admin/login', authLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '12h' });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Authentication failed.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/admin/overview', authenticateAdmin, async (req, res) => {
  try {
    const [articles, categories] = await Promise.all([listArticles({ page: 1, limit: 200 }), getCategories()]);
    return res.json({
      totalArticles: articles.total,
      totalCategories: categories.length,
      featuredCount: articles.items.filter((item) => item.featured).length,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load admin overview.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/admin/articles', authenticateAdmin, async (req, res) => {
  try {
    const payload = await listArticles({ page: Number(req.query.page || 1), limit: Number(req.query.limit || 50), sort: req.query.sort || 'newest' });
    return res.json(payload);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load admin article list.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.post('/api/admin/articles', authenticateAdmin, async (req, res) => {
  try {
    const { title, category, summary, content, image, author, readTime, featured } = req.body || {};
    if (!title || !summary || !content || !author) {
      return res.status(400).json({ message: 'Title, summary, content, and author are required.' });
    }

    const created = await createArticle({ title, category, summary, content, image, author, readTime, featured: Boolean(featured) });
    return res.status(201).json({ message: 'Article created successfully.', article: created });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create article.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.put('/api/admin/articles/:id', authenticateAdmin, async (req, res) => {
  try {
    const updated = await updateArticle(req.params.id, req.body || {});
    if (!updated) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    return res.json({ message: 'Article updated successfully.', article: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update article.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.delete('/api/admin/articles/:id', authenticateAdmin, async (req, res) => {
  try {
    const removed = await deleteArticle(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    return res.json({ message: 'Article deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete article.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error('Unhandled API error:', error);
  res.status(500).json({
    message: 'Something went wrong.',
    ...(process.env.NODE_ENV === 'development' && { error: error.message }),
  });
});

async function startServer() {
  const status = await initializeDatabase();
  if (!status.connected) {
    console.warn('⚠️ SQLite database was not initialized.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 NovaWire API running on http://localhost:${PORT}`);
    console.log(`📦 SQLite database: ${status.file || 'unavailable'}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
