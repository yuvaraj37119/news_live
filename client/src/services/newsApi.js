export const NEWSDATA_LATEST_URL =
  'https://newsdata.io/api/1/latest?apikey=pub_cafbc04982c14ebeb9c429533f5cd8b6';

const NEWS_CACHE_TTL = 5 * 60 * 1000;
const newsCache = new Map();
const inFlight = new Map();

let rateLimitedUntil = 0;

function newsKey(options = {}) {
  return JSON.stringify({
    language: options.language || 'en',
    category: options.category || '',
    query: options.query || '',
    page: options.page || '',
  });
}

const CATEGORY_MAP = {
  world: 'World',
  business: 'Business',
  politics: 'Politics',
  tech: 'Tech',
  technology: 'Tech',
  science: 'Tech',
  culture: 'Culture',
  entertainment: 'Culture',
  sports: 'Sports',
  climate: 'Climate',
  environment: 'Climate',
  health: 'Health',
  education: 'Education',
  lifestyle: 'Lifestyle',
  general: 'World',
  top: 'World',
};

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'live-story';
}

export function normalizeCategory(value) {
  const raw = String(
    Array.isArray(value) ? value[0] : value || 'World'
  ).trim();

  return CATEGORY_MAP[raw.toLowerCase()] || raw;
}

export function normalizeNewsItem(item, index = 0, language = 'en') {
  const title = item?.title || item?.headline || '';
  const summary = item?.description || item?.summary || '';

  const content = typeof item?.content === 'string'
    ? item.content.split(/\n+/).map((text) => text.trim()).filter(Boolean)
    : Array.isArray(item?.content)
      ? item.content.filter(Boolean)
      : summary
        ? [summary]
        : [];

  const author = Array.isArray(item?.creator)
    ? item.creator[0] || item?.source_id || 'News Desk'
    : item?.creator || item?.source_id || 'News Desk';

  return {
    id: String(item?.article_id || item?.id || `${slugify(title)}-${index}`),
    slug: slugify(title),
    title,
    summary,
    content,
    category: normalizeCategory(item?.category),
    author,
    image: item?.image_url || item?.image || item?.urlToImage || '',
    publishedAt: item?.pubDate || item?.publishedAt || '',
    readTime: '5 min read',
    featured: index === 0,
    source: 'newsdata',
    sourceLanguage: language,
    sourceUrl: item?.link || item?.url || '',
  };
}

/**
 * Fetch live articles in the requested source language.
 * `page` is NewsData's opaque continuation token, not a page number.
 */
export async function fetchLiveArticles({
  language = 'en',
  page,
  category,
  query,
  signal,
} = {}) {
  const key = newsKey({ language, category, query, page });
  const cached = newsCache.get(key);

  if (cached && Date.now() - cached.time < NEWS_CACHE_TTL) {
    return cached.data;
  }

  if (Date.now() < rateLimitedUntil) {
    throw new Error('News API rate limit reached. Please wait before retrying.');
  }

  if (inFlight.has(key)) {
    return inFlight.get(key);
  }

  const request = (async () => {
    const url = new URL(NEWSDATA_LATEST_URL);
    url.searchParams.set('language', language);

    const categoryMap = {
      world: 'world',
      business: 'business',
      politics: 'politics',
      tech: 'technology',
      culture: 'entertainment',
      climate: 'environment',
    };

    if (page) url.searchParams.set('page', page);
    if (category && categoryMap[String(category).toLowerCase()]) {
      url.searchParams.set('category', categoryMap[String(category).toLowerCase()]);
    }
    if (query) url.searchParams.set('q', query);

    const response = await fetch(url.toString(), { signal });
    const payload = await response.json().catch(() => ({}));

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After'));
      const waitMs = retryAfter > 0 ? retryAfter * 1000 : 60 * 1000;

      rateLimitedUntil = Date.now() + waitMs;
      throw new Error('News API rate limit reached. Please wait before retrying.');
    }

    if (!response.ok || payload?.status === 'error') {
      throw new Error(
        payload?.results?.message ||
        payload?.message ||
        'Unable to fetch news.'
      );
    }

    const results = Array.isArray(payload?.results) ? payload.results : [];
    const data = {
      items: results
        .map((item, index) => normalizeNewsItem(item, index, language))
        .filter((item) => item.title),
      nextPage: payload?.nextPage || null,
      totalResults: Number(payload?.totalResults || results.length),
    };

    newsCache.set(key, { time: Date.now(), data });
    return data;
  })();

  inFlight.set(key, request);

  try {
    return await request;
  } finally {
    inFlight.delete(key);
  }
}