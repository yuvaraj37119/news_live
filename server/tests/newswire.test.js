const test = require('node:test');
const assert = require('node:assert/strict');

const {
  initializeDatabase,
  createArticle,
  listArticles,
  searchArticles,
  subscribeNewsletter,
  findArticleById,
  deleteArticle,
} = require('../config/db');

test('database initializes and supports article creation, search, and cleanup', async () => {
  const init = await initializeDatabase();
  assert.equal(init.connected, true);

  const created = await createArticle({
    title: 'NovaWire Search Test Story',
    category: 'Tech',
    summary: 'A test summary for search and filtering.',
    content: ['This story is about AI search indexing.', 'It demonstrates newsroom filtering.'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    author: 'Test Reporter',
    readTime: '5 min read',
    featured: true,
  });

  assert.ok(created && created.id, 'article should be created');

  const searchable = await searchArticles({ query: 'indexing', category: 'Tech' });
  assert.ok(searchable.items.some((item) => String(item.id) === String(created.id)));

  const filtered = await listArticles({ category: 'Tech', limit: 5 });
  assert.ok(filtered.items.some((item) => String(item.id) === String(created.id)));

  const article = await findArticleById(created.id);
  assert.equal(article.title, 'NovaWire Search Test Story');

  const subscription = await subscribeNewsletter({ email: 'reader@example.com', source: 'homepage' });
  assert.equal(subscription.email, 'reader@example.com');

  const duplicate = await subscribeNewsletter({ email: 'reader@example.com', source: 'homepage' });
  assert.equal(duplicate.status, 'exists');

  const removed = await deleteArticle(created.id);
  assert.equal(removed, true);
});
