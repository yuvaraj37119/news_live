import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeNewsItem } from './newsApi.js';

test('normalizeNewsItem converts a NewsData item into app-ready article data', () => {
  const item = {
    title: 'AI expands across emerging markets',
    description: 'New capacity is flowing into regional data centers and clean-power grids.',
    category: ['technology'],
    creator: ['Ava Brooks'],
    pubDate: '2026-10-12T09:00:00Z',
    image_url: 'https://example.com/image.jpg',
    link: 'https://example.com/ai-expands',
  };

  const article = normalizeNewsItem(item, 0);

  assert.equal(article.title, 'AI expands across emerging markets');
  assert.equal(article.category, 'Tech');
  assert.equal(article.author, 'Ava Brooks');
  assert.equal(article.image, 'https://example.com/image.jpg');
  assert.equal(article.featured, true);
  assert.ok(Array.isArray(article.content));
  assert.equal(article.slug, 'ai-expands-across-emerging-markets');
});
