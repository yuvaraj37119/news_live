export const GNEWS_SEARCH_URL = 'https://gnews.io/api/v4/search';
export const GNEWS_API_KEY = '2f58c423ff744440ba587a39a5d55347';
export const API_URL = 'https://newsdata.io/api/1/latest';

const NEWS_CACHE_TTL = 5 * 60 * 1000;
const newsCache = new Map();
const inFlight = new Map();

let rateLimitedUntil = 0;

export function getRateLimitRemainingMs() {
  return Math.max(0, rateLimitedUntil - Date.now());
}

export function isNewsRateLimited() {
  return getRateLimitRemainingMs() > 0;
}

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
  const summary = item?.description || item?.summary || item?.content || '';

  const content = typeof item?.content === 'string'
    ? item.content.split(/\n+/).map((text) => text.trim()).filter(Boolean)
    : Array.isArray(item?.content)
      ? item.content.filter(Boolean)
      : summary
        ? [summary]
        : [];

  const author = Array.isArray(item?.creator)
    ? item.creator[0] || item?.source_id || 'News Desk'
    : item?.creator || item?.author || item?.source?.name || 'News Desk';

  return {
    id: String(item?.article_id || item?.id || item?.url || `${slugify(title)}-${index}`),
    slug: slugify(title),
    title,
    summary,
    content,
    category: normalizeCategory(item?.category || item?.topic || 'World'),
    author,
    image: item?.image_url || item?.image || item?.urlToImage || '',
    publishedAt: item?.pubDate || item?.publishedAt || item?.publishedAtDate || '',
    readTime: '5 min read',
    featured: index === 0,
    source: 'newsdata',
    sourceLanguage: language,
    sourceUrl: item?.link || item?.url || '',
  };
}

const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;

export async function fetchNewsFromApi({
  language = 'en',
  page,
  signal,
  category,
} = {}) {
  if (!API_KEY) {
    throw new Error('Missing VITE_NEWSDATA_API_KEY in .env');
  }

  const selectedLanguage = ['en', 'ta', 'hi'].includes(language)
    ? language
    : 'en';

  const params = new URLSearchParams({
    apikey: API_KEY,
    language: selectedLanguage,
  });

  if (page) params.set('page', page);
  if (category) params.set('category', category);

  const response = await fetch(`${API_URL}?${params.toString()}`, { signal });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('News API rate limit reached. Please wait before retrying.');
    }
    throw new Error(`News API failed: ${response.status}`);
  }

  let data;

  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (parseError) {
    throw new Error('Failed to load response data from the news service.');
  }

  if (data.status !== 'success') {
    throw new Error(data.results?.message || 'Unable to load news.');
  }

  const articles = (data.results || []).map((item) => ({
    id: item.article_id,
    slug: item.article_id,
    title: item.title || 'Untitled',
    summary: item.description || '',
    content: item.content || item.description || '',
    image: item.image_url || '',
    author: item.creator?.[0] || item.source_id || 'News desk',
    category: category || 'World',
    publishedAt: item.pubDate,
    readTime: '5 min read',
    featured: false,
    url: item.link,
    language,
  }));

  return {
    articles,
    nextPage: data.nextPage || null,
  };
}

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

  if (isNewsRateLimited()) {
    throw new Error('News API rate limit reached. Please wait before retrying.');
  }

  if (inFlight.has(key)) {
    const existingRequest = inFlight.get(key);

    if (!existingRequest.signal?.aborted) {
      return existingRequest.promise;
    }

    inFlight.delete(key);
  }

  const request = (async () => {
    const selectedLanguage = ['en', 'ta', 'hi'].includes(language)
      ? language
      : 'en';

    if (!API_KEY) {
      throw new Error('Missing VITE_NEWSDATA_API_KEY in .env');
    }

    const params = new URLSearchParams({
      apikey: API_KEY,
      language: selectedLanguage,
    });

    if (category) params.set('category', category);
    if (page) params.set('page', String(page));

    let response;

    try {
      response = await fetch(`${API_URL}?${params.toString()}`, { signal });
    } catch (fetchError) {
      if (fetchError?.name === 'AbortError') {
        console.warn('News request was aborted:', { language, page });
        throw fetchError;
      }

      throw new Error('Failed to send request to the news service. Please try again.');
    }

    let payload;

    try {
      const text = await response.text();
      payload = text ? JSON.parse(text) : {};
    } catch (parseError) {
      throw new Error('Failed to load response data from the news service.');
    }

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After'));
      rateLimitedUntil =
        Date.now() + (retryAfter > 0 ? retryAfter * 1000 : 60_000);

      throw new Error('News API rate limit reached. Please wait before retrying.');
    }

    if (!response.ok || payload?.status !== 'success') {
      console.error('NewsData API response:', {
        status: response.status,
        payload,
      });

      throw new Error(
        payload?.results?.message ||
        payload?.message ||
        payload?.detail ||
        `NewsData API request failed: ${response.status}`
      );
    }

    const results = Array.isArray(payload.results) ? payload.results : [];
    const nextPage = payload.nextPage || null;

    const data = {
      items: results
        .map((item, index) =>
          normalizeNewsItem(
            {
              ...item,
              article_id: item.article_id || item.id,
              link: item.link || item.url,
              description:
                item.description || item.summary || item.content,
            },
            index,
            selectedLanguage
          )
        )
        .filter((item) => item.title),
      nextPage,
      totalResults: Number(payload.totalResults || results.length),
    };

    newsCache.set(key, { time: Date.now(), data });
    return data;
  })();

  const requestEntry = { promise: request, signal };
  inFlight.set(key, requestEntry);

  try {
    return await request;
  } finally {
    if (inFlight.get(key) === requestEntry) {
      inFlight.delete(key);
    }
  }
}