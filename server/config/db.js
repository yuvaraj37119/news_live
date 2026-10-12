const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const dataDir = path.resolve(__dirname, '../data');
const databaseFile = path.join(dataDir, 'newsroom.db');
const schemaFile = path.join(dataDir, 'schema.sql');

const DEFAULT_ARTICLES = [
  {
    title: 'AI infrastructure spending is reshaping the next decade of global growth',
    category: 'Tech',
    summary: 'Chipmakers, cloud providers, and power grids are racing to support the infrastructure needed for an AI-powered economy.',
    content: [
      'A new wave of capital is moving from software experimentation into physical infrastructure, with data centers, power systems, and semiconductor supply chains taking center stage.',
      'The scale of AI demand has pushed cloud providers and utilities to rethink capacity planning, cooling, and long-term network reliability.',
      'Analysts say the next growth cycle will reward firms that can combine compute throughput with sustainable energy and resilient delivery systems.',
    ],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    author: 'Ava Brooks',
    readTime: '6 min read',
    featured: true,
  },
  {
    title: 'Cities are rebuilding power systems around climate risk, not just demand forecasts',
    category: 'World',
    summary: 'Urban resilience budgets are shifting toward backup energy, smart grids, and more reliable service during extreme weather events.',
    content: [
      'Local governments are reevaluating utilities as part of public resilience planning rather than a back-office service.',
      'The new design priorities include faster restoration, diversified supply, and adaptive infrastructure that can withstand repeated shocks.',
      'The result is a more practical model of city planning focused on continuity, trust, and everyday stability.',
    ],
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    author: 'Lina Morris',
    readTime: '7 min read',
    featured: false,
  },
  {
    title: 'Productivity software buyers are demanding measurable returns before expansion',
    category: 'Business',
    summary: 'The market is shifting from feature-first pitches to proof-heavy adoption and direct ROI claims.',
    content: [
      'Enterprise buyers are looking for quicker payback and clearer operational gains, especially in workflow automation and reporting tools.',
      'Product teams are trimming feature sprawl to concentrate on specific pain points and measurable wins for teams under cost pressure.',
      'Investors are increasingly rewarding disciplined revenue quality over rapid but unfocused product expansion.',
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    author: 'David Chen',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'Turnout models are tightening as local trust and digital access reshape election strategy',
    category: 'Politics',
    summary: 'Campaigns are recalibrating toward neighborhood-level credibility, youth participation, and turnout quality.',
    content: [
      'Campaign teams are moving away from broad messaging alone and toward targeted ground operations that can verify community trust and turnout intent.',
      'The political story this cycle is increasingly local, with voters responding to services, neighborhood access, and clarity of leadership more than broad narratives.',
      'Operators say credibility and follow-through now matter as much as reach in determining success.',
    ],
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    author: 'Elliot Price',
    readTime: '4 min read',
    featured: false,
  },
  {
    title: 'Edge networks are bringing AI closer to the places where latency and trust matter most',
    category: 'Tech',
    summary: 'Distributed compute is becoming essential in retail, healthcare, and public infrastructure that cannot afford cloud lag.',
    content: [
      'Edge deployments are moving from experimental pilots into production systems where real-time response is critical.',
      'The advantage is not only lower latency but also better control over privacy, bandwidth use, and operational continuity.',
      'Businesses increasingly see edge architecture as a practical way to strengthen resilience and decision speed.',
    ],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    author: 'Nina Shah',
    readTime: '8 min read',
    featured: false,
  },
  {
    title: 'Publishers are investing in trust as the core growth metric behind audience loyalty',
    category: 'World',
    summary: 'Media businesses are shifting from raw reach to deeper community trust, quality context, and accountability.',
    content: [
      'Audiences are rewarding outlets that explain complexity and remain transparent about editorial standards and sourcing.',
      'Trust is now a visible business metric affecting subscriptions, partnerships, and brand health.',
      'Publishing teams increasingly frame product strategy around durable reader relationships rather than performance spikes alone.',
    ],
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    author: 'Mila Foster',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'The next energy grid is local, modular, and built for climate shocks',
    category: 'Climate',
    summary: 'Utilities are moving away from centralized systems and toward resilient local networks that can absorb disruption faster.',
    content: [
      'Climate adaptation is forcing grid planners to think differently about redundancy, flexibility, and local energy independence.',
      'New infrastructure models prioritize modular generation, storage, and public reliability over single-point dependency.',
      'The more resilient system is not necessarily the biggest one but the one that can recover quickly and maintain trust during disruption.',
    ],
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
    author: 'Noah Reeves',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'The real AI shift is not speed — it is governance, trust, and human accountability',
    category: 'Analysis',
    summary: 'The next phase of AI adoption is being shaped by policy discipline, management quality, and a clearer use of human oversight.',
    content: [
      'Leaders are moving past the excitement phase and asking harder questions about accountability, governance, and operational safety.',
      'The strongest AI strategies are building trust into workflows rather than assuming adoption alone will drive value.',
      'The organizations likely to win are those that combine compute capability with responsible oversight and realistic risk management.',
    ],
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    author: 'Amelia Stone',
    readTime: '8 min read',
    featured: true,
  },
  {
    title: 'Shipping corridors are redirecting as supply chains hedge against conflict and weather',
    category: 'World',
    summary: 'Global trade routes are adapting to delays, volatility, and climate-related disruptions with more flexible logistics planning.',
    content: [
      'Cargo handlers are rerouting large parts of freight traffic toward lower-risk corridors while balancing speed and cost.',
      'Businesses are increasing inventory buffers and diversifying suppliers to reduce the impact of pricing swings and service interruptions.',
      'The shift suggests a more complicated but resilient trading model for the next several quarters.',
    ],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    author: 'Sofia Nguyen',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'Coastal cities are fast-tracking flood defenses as insurance costs climb',
    category: 'Climate',
    summary: 'Resilience spending is increasing in ports, housing, and infrastructure projects as climate risks move into financial planning.',
    content: [
      'City leaders are prioritizing levees, drainage upgrades, and public risk mapping in response to repeated weather disruption.',
      'Insurance companies are also changing premiums and coverage rules, pushing communities to act sooner on adaptation.',
      'Analysts say the strongest projects are those that pair environmental solutions with long-term public affordability.',
    ],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    author: 'Priya Raman',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'Cultural brands are using live communities to deepen loyalty beyond the feed',
    category: 'Culture',
    summary: 'Media and lifestyle companies are turning audiences into active participants through events, commentary, and direct feedback loops.',
    content: [
      'Culture businesses are realizing that belonging and shared membership drive much stronger retention than pure content volume.',
      'New community features are increasingly tied to real-world events, themed experiences, and creator-led storytelling.',
      'Brands that focus on authenticity are seeing higher engagement and stronger long-term advocacy.',
    ],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    author: 'Hugo Barnes',
    readTime: '4 min read',
    featured: false,
  },
  {
    title: 'Small retailers are using AI tools to cut stock waste while improving service speed',
    category: 'Business',
    summary: 'The next wave of operational AI is focused on pricing, demand planning, and smarter fulfillment rather than flashy automation.',
    content: [
      'Retail teams are using predictive tools to reduce markdowns and improve inventory visibility without expanding headcount.',
      'The most effective deployments focus on repetitive decisions that can be automated with clear oversight and simple fallback paths.',
      'Executives increasingly expect AI to improve unit economics rather than just speed up experimentation.',
    ],
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    author: 'Rina Patel',
    readTime: '7 min read',
    featured: false,
  },
];

function ensureStorage() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(schemaFile)) {
    fs.writeFileSync(schemaFile, buildSchemaSql());
  }
}

function buildSchemaSql() {
  return `
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      email TEXT,
      avatar TEXT,
      bio TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      author_id INTEGER,
      category_id INTEGER,
      read_time TEXT DEFAULT '5 min read',
      featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published',
      published_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      source TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT,
      article_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_email, article_id),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
    CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured, published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_title ON articles(title);
  `;
}

function openDatabase() {
  ensureStorage();
  return new sqlite3.Database(databaseFile);
}

function runSql(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function runCallback(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getRow(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row || null);
    });
  });
}

function getAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows || []);
    });
  });
}

function parseContent(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item)).filter(Boolean);
    }
  } catch (error) {
    // fallback to plain string array below
  }

  return [String(value)].filter(Boolean);
}

function slugify(value) {
  return String(value || 'untitled-story')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-story';
}

function normalizeArticle(row) {
  return {
    id: row.id,
    slug: row.slug || slugify(row.title),
    title: row.title,
    category: row.category || row.category_name || 'General',
    summary: row.summary,
    content: parseContent(row.content),
    image: row.image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    author: row.author || row.author_name || 'Staff Writer',
    readTime: row.read_time || row.readTime || '5 min read',
    featured: Boolean(row.featured),
    publishedAt: row.published_at || row.publishedAt || new Date().toISOString(),
    status: row.status || 'published',
  };
}

function getDefaultAdminConfig() {
  const email = process.env.ADMIN_EMAIL || 'admin@novawire.local';
  const fallbackPassword = process.env.NODE_ENV === 'production' ? null : 'admin123';
  const password = process.env.ADMIN_PASSWORD || fallbackPassword;

  return { email, password };
}

async function ensureAuthor(db, name) {
  const safeName = String(name || 'Staff Writer').trim();
  if (!safeName) return 1;

  const existing = await getRow(db, 'SELECT id FROM authors WHERE name = ? LIMIT 1', [safeName]);
  if (existing) return existing.id;

  const result = await runSql(db, 'INSERT INTO authors (name) VALUES (?)', [safeName]);
  return result.id;
}

async function ensureCategory(db, category) {
  const safeName = String(category || 'General').trim();
  const safeSlug = slugify(safeName) || 'general';

  const existing = await getRow(db, 'SELECT id FROM categories WHERE slug = ? OR name = ? LIMIT 1', [safeSlug, safeName]);
  if (existing) return existing.id;

  const result = await runSql(db, 'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)', [safeName, safeSlug, `Stories about ${safeName}`]);
  return result.id;
}

async function ensureArticleRecord(db, article) {
  const title = String(article.title || '').trim();
  if (!title) return null;

  const existing = await getRow(db, 'SELECT id FROM articles WHERE title = ? LIMIT 1', [title]);
  if (existing) return existing.id;

  const authorId = await ensureAuthor(db, article.author || 'Staff Writer');
  const categoryId = await ensureCategory(db, article.category || 'General');
  const content = Array.isArray(article.content) ? article.content : [article.content || article.summary || title];
  const slug = `${slugify(title)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await runSql(
    db,
    `INSERT INTO articles (slug, title, summary, content, image, author_id, category_id, read_time, featured, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      title,
      article.summary || '',
      JSON.stringify(content),
      article.image || '',
      authorId,
      categoryId,
      article.readTime || '5 min read',
      article.featured ? 1 : 0,
      article.publishedAt || new Date().toISOString(),
    ],
  );

  return true;
}

async function purgePlaceholderArticles(db) {
  await runSql(
    db,
    `DELETE FROM articles
     WHERE image LIKE 'https://example.com%' 
        OR lower(title) LIKE '%novawire search test story%'
        OR lower(title) LIKE '%updated local sql story%'`,
  );
}

async function seedDefaultArticles(db) {
  const row = await getRow(db, 'SELECT COUNT(*) AS total FROM articles');
  if ((row?.total || 0) > 0) return;

  for (const article of DEFAULT_ARTICLES) {
    await ensureArticleRecord(db, article);
  }
}

async function ensureAdminUser(db) {
  const { email, password } = getDefaultAdminConfig();
  if (!password) {
    console.warn('No ADMIN_PASSWORD configured. The admin login route will remain unavailable until it is set in production.');
    return null;
  }

  const existing = await getRow(db, 'SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  if (existing) {
    return existing.id;
  }

  const hash = await bcrypt.hash(password, 10);
  const result = await runSql(db, 'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)', [email, hash, 'NovaWire Administrator', 'admin']);
  return result.id;
}

async function initializeDatabase() {
  const db = openDatabase();

  try {
    await new Promise((resolve, reject) => {
      db.exec(buildSchemaSql(), (error) => (error ? reject(error) : resolve()));
    });

    await purgePlaceholderArticles(db);
    await seedDefaultArticles(db);
    await ensureAdminUser(db);

    return { connected: true, file: databaseFile };
  } catch (error) {
    console.warn('⚠️ Could not initialize SQLite database file.');
    console.warn(error.message);
    return { connected: false, error };
  } finally {
    db.close();
  }
}

async function withDatabase(operation) {
  const db = openDatabase();
  try {
    return await operation(db);
  } finally {
    db.close();
  }
}

async function listArticles(filters = {}) {
  const page = Number(filters.page || 1);
  const limit = Number(filters.limit || 12);
  const offset = (page - 1) * limit;
  const sort = String(filters.sort || 'newest');
  const category = String(filters.category || '').trim();
  const q = String(filters.query || filters.q || '').trim();
  const featuredOnly = Boolean(filters.featured);

  const allowedSorts = {
    newest: 'a.published_at DESC, a.id DESC',
    oldest: 'a.published_at ASC, a.id ASC',
    title: 'a.title ASC',
    featured: 'a.featured DESC, a.published_at DESC',
  };

  return withDatabase(async (db) => {
    const whereClauses = [];
    const params = [];

    if (category && category !== 'all' && category !== 'Home') {
      whereClauses.push('c.name = ?');
      params.push(category);
    }

    if (featuredOnly) {
      whereClauses.push('a.featured = 1');
    }

    if (q) {
      const pattern = `%${q}%`;
      whereClauses.push('(a.title LIKE ? OR a.summary LIKE ? OR a.content LIKE ?)');
      params.push(pattern, pattern, pattern);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderBy = allowedSorts[sort] || allowedSorts.newest;

    const countQuery = `
      SELECT COUNT(a.id) AS total
      FROM articles a
      LEFT JOIN authors au ON au.id = a.author_id
      LEFT JOIN categories c ON c.id = a.category_id
      ${whereSql}
    `;
    const totalRow = await getRow(db, countQuery, params);

    const query = `
      SELECT a.*, au.name AS author, c.name AS category
      FROM articles a
      LEFT JOIN authors au ON au.id = a.author_id
      LEFT JOIN categories c ON c.id = a.category_id
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const rows = await getAll(db, query, [...params, limit, offset]);
    const normalized = rows.map(normalizeArticle);
    const total = Number(totalRow?.total || 0);

    const isLegacyArrayResponse = !filters.page && !filters.limit && !filters.query && !filters.q && !filters.sort && !filters.featured;
    if (isLegacyArrayResponse) {
      return normalized;
    }

    return {
      items: normalized,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  });
}

async function searchArticles(options = {}) {
  return listArticles({
    query: options.query || options.q || '',
    category: options.category || 'all',
    sort: options.sort || 'newest',
    page: options.page || 1,
    limit: options.limit || 12,
  });
}

async function findArticleById(id) {
  const articleId = String(id || '').trim();
  if (!articleId) return null;

  return withDatabase(async (db) => {
    const row = await getRow(
      db,
      `
        SELECT a.*, au.name AS author, c.name AS category
        FROM articles a
        LEFT JOIN authors au ON au.id = a.author_id
        LEFT JOIN categories c ON c.id = a.category_id
        WHERE a.id = ? OR a.slug = ?
        LIMIT 1
      `,
      [articleId, articleId],
    );

    return row ? normalizeArticle(row) : null;
  });
}

async function createArticle(articleInput = {}) {
  const { title, category, summary, content, image, author, readTime, featured } = articleInput;

  if (!title || !summary || !content || !author) {
    throw new Error('Title, summary, content, and author are required.');
  }

  return withDatabase(async (db) => {
    const authorId = await ensureAuthor(db, author);
    const categoryId = await ensureCategory(db, category || 'General');
    const contentArray = Array.isArray(content) ? content : [content];
    const slugBase = slugify(title);
    const slug = `${slugBase}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const result = await runSql(
      db,
      `INSERT INTO articles (slug, title, summary, content, image, author_id, category_id, read_time, featured, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        summary,
        JSON.stringify(contentArray),
        image || '',
        authorId,
        categoryId,
        readTime || '5 min read',
        featured ? 1 : 0,
        new Date().toISOString(),
      ],
    );

    return { id: result.id, slug };
  });
}

async function updateArticle(id, articleInput = {}) {
  const { title, category, summary, content, image, author, readTime, featured } = articleInput;

  return withDatabase(async (db) => {
    const current = await getRow(db, 'SELECT * FROM articles WHERE id = ?', [id]);
    if (!current) return null;

    const authorId = await ensureAuthor(db, author || current.author_id || 'Staff Writer');
    const categoryId = await ensureCategory(db, category || 'General');
    const contentArray = Array.isArray(content) ? content : [content || current.summary || ''];

    const result = await runSql(
      db,
      `UPDATE articles
       SET title = ?, summary = ?, content = ?, image = ?, author_id = ?, category_id = ?, read_time = ?, featured = ?, published_at = ?
       WHERE id = ?`,
      [
        title || current.title,
        summary || current.summary,
        JSON.stringify(contentArray),
        image || current.image || '',
        authorId,
        categoryId,
        readTime || current.read_time || '5 min read',
        featured ? 1 : 0,
        new Date().toISOString(),
        id,
      ],
    );

    if (!result.changes) return null;
    return findArticleById(id);
  });
}

async function deleteArticle(id) {
  return withDatabase(async (db) => {
    const result = await runSql(db, 'DELETE FROM articles WHERE id = ?', [id]);
    return result.changes > 0;
  });
}

async function getCategories() {
  return withDatabase(async (db) => {
    const rows = await getAll(
      db,
      `SELECT c.*, COUNT(a.id) AS article_count
       FROM categories c
       LEFT JOIN articles a ON a.category_id = c.id
       GROUP BY c.id
       ORDER BY c.name ASC`,
    );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      articleCount: Number(row.article_count || 0),
    }));
  });
}

async function getCategoryDetails(slug) {
  const safeSlug = String(slug || '').trim();
  if (!safeSlug) return null;

  return withDatabase(async (db) => {
    const category = await getRow(db, 'SELECT * FROM categories WHERE slug = ? OR name = ? LIMIT 1', [safeSlug, safeSlug]);
    if (!category) return null;

    const items = await listArticles({ category: category.name, limit: 25, page: 1 });
    return { ...category, articleCount: items.total, articles: items.items };
  });
}

async function getAuthors() {
  return withDatabase(async (db) => {
    const rows = await getAll(
      db,
      `SELECT au.*, COUNT(a.id) AS article_count
       FROM authors au
       LEFT JOIN articles a ON a.author_id = au.id
       GROUP BY au.id
       ORDER BY au.name ASC`,
    );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      bio: row.bio,
      articleCount: Number(row.article_count || 0),
    }));
  });
}

async function subscribeNewsletter({ email, source = 'homepage' }) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized || !normalized.includes('@')) {
    throw new Error('A valid email is required.');
  }

  return withDatabase(async (db) => {
    const existing = await getRow(db, 'SELECT id, email FROM newsletter_subscriptions WHERE email = ? LIMIT 1', [normalized]);
    if (existing) {
      return { status: 'exists', email: existing.email };
    }

    const result = await runSql(db, 'INSERT INTO newsletter_subscriptions (email, source) VALUES (?, ?)', [normalized, source]);
    return { id: result.id, email: normalized, status: 'subscribed' };
  });
}

async function getUserByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return null;

  return withDatabase(async (db) => getRow(db, 'SELECT * FROM users WHERE email = ? LIMIT 1', [normalized]));
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

module.exports = {
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
  hashPassword,
  verifyPassword,
  ensureAdminUser,
  openDatabase,
  databaseFile,
};
