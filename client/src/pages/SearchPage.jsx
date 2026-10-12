import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { uiText } from '../i18n';
import { API_BASE, fetchJson, formatDate } from '../services/api';
import { fetchLiveArticles } from '../services/newsApi';
import { motion } from 'framer-motion';

const PAGE_SIZE = 10;

function uniqueById(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = String(item.id || item.slug || item.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function SearchPage({ language = 'en' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [nextLivePage, setNextLivePage] = useState(null);
  const [databasePage, setDatabasePage] = useState(1);
  const [databaseHasMore, setDatabaseHasMore] = useState(false);
  const [liveHasMore, setLiveHasMore] = useState(false);

  const query = searchParams.get('q') || '';
  const t = uiText[language] || uiText.en;

  useEffect(() => {
    let active = true;

    if (!query.trim()) {
      setResults([]);
      setError('');
      setNextLivePage(null);
      setDatabasePage(1);
      setDatabaseHasMore(false);
      setLiveHasMore(false);
      return undefined;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      setResults([]);
      setNextLivePage(null);
      setDatabasePage(1);
      setDatabaseHasMore(false);
      setLiveHasMore(false);

      const databaseRequest = fetchJson(
        `${API_BASE}/search?q=${encodeURIComponent(query)}&page=1&limit=${PAGE_SIZE}`,
        { signal: controller.signal }
      );

      const liveRequest = fetchLiveArticles({
        language,
        query,
      });

      const [databaseResult, liveResult] = await Promise.allSettled([
        databaseRequest,
        liveRequest,
      ]);

      if (!active) return;

      const dbPayload = databaseResult.status === 'fulfilled'
        ? databaseResult.value
        : { items: [] };

      const livePayload = liveResult.status === 'fulfilled'
        ? liveResult.value
        : { items: [], nextPage: null };

      const dbItems = Array.isArray(dbPayload.items) ? dbPayload.items : [];
      const liveItems = Array.isArray(livePayload.items) ? livePayload.items : [];

      const combined = uniqueById([
        ...liveItems,
        ...dbItems,
      ]);

      setResults(combined);
      setNextLivePage(livePayload.nextPage || null);
      setLiveHasMore(Boolean(livePayload.nextPage));

      const dbTotalPages = Number(
        dbPayload.totalPages ||
        dbPayload.pagination?.totalPages ||
        1
      );

      setDatabaseHasMore(dbTotalPages > 1);
      setDatabasePage(1);

      if (!combined.length) {
        if (databaseResult.status === 'rejected' && liveResult.status === 'rejected') {
          setError('Search is temporarily unavailable. Please try again.');
        } else {
          setError(t.noMatch.replace('{query}', query));
        }
      }
    }, 300);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query, language, t.noMatch]);

  const loadMore = async () => {
    if (loadingMore || (!liveHasMore && !databaseHasMore)) return;

    setLoadingMore(true);
    setError('');

    try {
      let incoming = [];
      let newNextLivePage = nextLivePage;
      let newDatabasePage = databasePage;
      let newLiveHasMore = liveHasMore;
      let newDatabaseHasMore = databaseHasMore;

      if (liveHasMore && nextLivePage) {
        const response = await fetchLiveArticles({
          language,
          query,
          page: nextLivePage,
        });

        incoming = [...incoming, ...(response.items || [])];
        newNextLivePage = response.nextPage || null;
        newLiveHasMore = Boolean(response.nextPage);
      }

      if (databaseHasMore) {
        const requestedPage = databasePage + 1;

        const payload = await fetchJson(
          `${API_BASE}/search?q=${encodeURIComponent(query)}&page=${requestedPage}&limit=${PAGE_SIZE}`
        );

        incoming = [...incoming, ...(payload.items || [])];
        newDatabasePage = requestedPage;

        const totalPages = Number(
          payload.totalPages ||
          payload.pagination?.totalPages ||
          requestedPage
        );

        newDatabaseHasMore = requestedPage < totalPages;
      }

      setResults((current) => uniqueById([...current, ...incoming]));
      setNextLivePage(newNextLivePage);
      setDatabasePage(newDatabasePage);
      setLiveHasMore(newLiveHasMore);
      setDatabaseHasMore(newDatabaseHasMore);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load more results.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleInput = (event) => {
    const value = event.target.value;

    if (value) setSearchParams({ q: value });
    else setSearchParams({});
  };

  const canLoadMore = liveHasMore || databaseHasMore;

  return (
    <main className="search-page">
      <motion.div
        className="search-header"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>{t.searchStories}</h1>

        <div className="search-input-wrap">
          <input
            type="search"
            value={query}
            onChange={handleInput}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchStories}
          />
        </div>

        {query && (
          <p className="search-count">
            {results.length} {language === 'ta' ? 'செய்திகள்' : 'results'}
          </p>
        )}
      </motion.div>

      {loading && (
        <div className="loading-state">{t.searchingStories}</div>
      )}

      {error && !loading && (
        <div className="empty-state" role="status">{error}</div>
      )}

      {!loading && !query && (
        <div className="empty-state">{t.searchIntro}</div>
      )}

      <div className="search-results">
        {results.map((article, index) => (
          <motion.div
            key={article.id || article.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index % PAGE_SIZE, 5) * 0.04 }}
          >
            <Link
              to={article.slug
                ? `/article/${article.slug}`
                : `/article/${article.id}`}
              className="search-result-card"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                />
              )}

              <div>
                <span className="eyebrow">{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <small>
                  {article.author} • {formatDate(article.publishedAt)}
                </small>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {!loading && query && canLoadMore && (
        <button
          type="button"
          className="primary-button load-more-button"
          onClick={loadMore}
          disabled={loadingMore}
        >
          {loadingMore
            ? t.loadingStories
            : language === 'ta'
              ? 'மேலும் செய்திகள்'
              : 'Load more results'}
        </button>
      )}
    </main>
  );
}