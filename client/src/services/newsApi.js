import { fetchJson } from './api.js';

export const NEWSDATA_LATEST_URL = 'https://newsdata.io/api/1/latest?apikey=pub_cafbc04982c14ebeb9c429533f5cd8b6';

const CATEGORY_MAP = {
  world: 'World',
  business: 'Business',
  politics: 'Politics',
  tech: 'Tech',
  technology: 'Tech',
  culture: 'Culture',
  climate: 'Climate',
  environment: 'Climate',
  analysis: 'Analysis',
  general: 'World',
  entertainment: 'Culture',
  sports: 'World',
  politicsandgovernment: 'Politics',
};

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'live-story';
}

export function normalizeCategory(value) {
  const raw = String(value || 'World').trim();
  const key = raw.toLowerCase();
  return CATEGORY_MAP[key] || (raw === 'Top' ? 'World' : raw);
}

export function normalizeNewsItem(item, index = 0) {
  const title = item?.title || item?.headline || 'Live update';
  const summary = item?.description || item?.summary || item?.content || title;
  const category = normalizeCategory(Array.isArray(item?.category) ? item.category[0] : item?.category);
  const author = Array.isArray(item?.creator) && item.creator.length
    ? item.creator[0]
    : item?.creator || item?.source_id || 'Live Desk';
  const image = item?.image_url || item?.image || item?.urlToImage || '';
  const publishedAt = item?.pubDate || item?.publishedAt || new Date().toISOString();
  const content = typeof item?.content === 'string'
    ? item.content.split(/\n+/).map((segment) => segment.trim()).filter(Boolean)
    : Array.isArray(item?.content)
      ? item.content.filter(Boolean)
      : [summary];

  return {
    id: String(item?.article_id || item?.id || `${slugify(title)}-${index}`),
    slug: slugify(title),
    title,
    summary,
    content: content.length ? content : [summary],
    image,
    author,
    category,
    readTime: '5 min read',
    publishedAt,
    featured: index === 0,
    source: 'newsdata',
  };
}

export async function fetchLiveArticles() {
  const payload = await fetchJson(NEWSDATA_LATEST_URL);
  const results = Array.isArray(payload?.results) ? payload.results : [];

  return results
    .map((item, index) => normalizeNewsItem(item, index))
    .filter((item) => item.title)
    .slice(0, 24);
}
