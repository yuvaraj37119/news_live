import { Component, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ArticlePage from './pages/ArticlePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import { localizeArticles, supportedLanguages } from './i18n';
import { API_BASE, fetchJson } from './services/api';
import { fetchLiveArticles, fetchNewsFromApi, isNewsRateLimited } from './services/newsApi';

const allowedLanguages = new Set(supportedLanguages.map(({ value }) => value));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error boundary caught a render failure:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="loading-state" role="alert" aria-live="assertive">
          <h2>Something went wrong.</h2>
          <p>Please refresh the page and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function uniqueArticles(items) {
  const seen = new Set();

  return items.filter((article) => {
    const key = String(article.id || article.slug || article.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [error, setError] = useState('');
  const [loadingScreen, setLoadingScreen] = useState(true);
  const loadingMoreRef = useRef(false);
  const requestedPagesRef = useRef(new Set());

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('freshnews_language');
    return allowedLanguages.has(saved) ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('freshnews_language', language);
  }, [language]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadingScreen(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const refreshArticles = useCallback(async (selectedLanguage, signal) => {
    requestedPagesRef.current.clear();
    loadingMoreRef.current = false;

    setLoading(true);
    setError('');
    setArticles([]);
    setNextPage(null);
    setHasMore(false);

    try {
      const response = await fetchLiveArticles({
        language: selectedLanguage,
        signal,
      });

      if (signal.aborted) return;

      const liveArticles = response.items || [];

      setArticles(liveArticles);
      setNextPage(response.nextPage || null);
      setHasMore(Boolean(response.nextPage));

      if (liveArticles.length === 0) {
        setError(
          selectedLanguage === 'ta'
            ? 'தமிழ் செய்திகள் தற்போது கிடைக்கவில்லை. சிறிது நேரம் கழித்து முயற்சிக்கவும்.'
            : 'No live news is available right now. Please try again later.'
        );
      }
    } catch (requestError) {
      if (signal.aborted || requestError?.name === 'AbortError') {
        return;
      }

      console.error('Live news request failed:', requestError);

      setArticles([]);
      setNextPage(null);
      setHasMore(false);
      setError(
        selectedLanguage === 'ta'
          ? 'தமிழ் செய்திகளை ஏற்ற முடியவில்லை. API வரம்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
          : requestError?.message || 'Failed to send request. Please try again.'
      );
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    refreshArticles(language, controller.signal);

    return () => controller.abort();
  }, [language, refreshArticles]);

  const loadMoreNews = useCallback(async () => {
    const page = nextPage;

    if (!page || loadingMoreRef.current || isNewsRateLimited()) {
      setHasMore(false);
      return;
    }
    if (requestedPagesRef.current.has(page)) return;

    loadingMoreRef.current = true;
    requestedPagesRef.current.add(page);
    setLoadingMore(true);
    setError('');

    try {
      const response = await fetchNewsFromApi({
        language,
        page,
      });

      setArticles((current) => uniqueArticles([
        ...current,
        ...(response.articles || []),
      ]));

      const next = response.nextPage || null;
      const hasNextPage = Boolean(next && next !== page);

      setNextPage(next && hasNextPage ? next : null);
      setHasMore(hasNextPage);
    } catch (requestError) {
      setNextPage(null);
      setHasMore(false);
      setError(requestError.message || 'Unable to load more news.');
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [language, nextPage]);

  const localizedArticles = useMemo(() => {
    const localized = localizeArticles(articles, language);

    // Live articles requested in their source language are already in
    // that language. Keep them; hide archive entries without translations.
    if (language === 'en') return localized;

    return localized.filter(
      (article) =>
        article.sourceLanguage === language ||
        article.translationStatus === 'translated'
    );
  }, [articles, language]);

  if (loadingScreen) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="news-app-shell">
          <Header language={language} setLanguage={setLanguage} />

          {error && <div className="news-error" role="status">{error}</div>}

          {loading ? (
            <div className="loading-state">Loading news…</div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    articles={localizedArticles}
                    language={language}
                    onLoadMore={loadMoreNews}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                  />
                }
              />
              <Route
                path="/category/:category"
                element={<CategoryPage articles={localizedArticles} language={language} />}
              />
              <Route
                path="/search"
                element={<SearchPage language={language} />}
              />
              <Route
                path="/article/:id"
                element={<ArticlePage articles={localizedArticles} language={language} />}
              />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          )}
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;