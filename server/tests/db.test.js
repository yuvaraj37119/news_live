const test = require('node:test');
const assert = require('node:assert/strict');

const {
  initializeDatabase,
  listArticles,
  findArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../config/db');

test('database can create, read, update, and delete article rows in a local SQL-backed file', async () => {
  await initializeDatabase();

  const created = await createArticle({
    title: 'Local SQL Story',
    category: 'Tech',
    summary: 'This article is stored in the local SQL database file.',
    content: ['Paragraph one.', 'Paragraph two.'],
    image: 'https://example.com/test.jpg',
    author: 'Test Author',
    readTime: '4 min read',
    featured: true,
  });

  assert.ok(created && created.id, 'createArticle should return an inserted article');

  const article = await findArticleById(created.id);
  assert.equal(article.title, 'Local SQL Story');
  assert.equal(article.category, 'Tech');

  const updated = await updateArticle(created.id, {
    title: 'Updated Local SQL Story',
    category: 'World',
    summary: 'Updated summary',
    content: ['Updated paragraph.'],
    image: 'https://example.com/updated.jpg',
    author: 'Updated Author',
    readTime: '5 min read',
    featured: false,
  });

  assert.equal(updated.title, 'Updated Local SQL Story');

  const allArticles = await listArticles();
  assert.ok(allArticles.some((item) => String(item.id) === String(created.id)));

  const deleted = await deleteArticle(created.id);
  assert.equal(deleted, true);

  const afterDelete = await findArticleById(created.id);
  assert.equal(afterDelete, null);
});
