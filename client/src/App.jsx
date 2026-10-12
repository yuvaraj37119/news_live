import { Component, useCallback, useEffect, useMemo, useState } from 'react';
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
import { fetchLiveArticles } from './services/newsApi';

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

  const refreshArticles = async (selectedLanguage = language) => {
    setLoading(true);
    setError('');
    setArticles([]);
    setNextPage(null);
    setHasMore(false);

    try {
      const response = await fetchLiveArticles({
        language: selectedLanguage,
      });

      const liveArticles = response.items || [];

      if (liveArticles.length > 0) {
        setArticles(liveArticles);
        setNextPage(response.nextPage || null);
        setHasMore(Boolean(response.nextPage));
        return;
      }

      throw new Error('No live stories returned');
    } catch (requestError) {
      console.warn('Live news unavailable:', requestError.message);

      try {
        const payload = await fetchJson(
          `${API_BASE}/articles?limit=24`
        );

        const fallback = Array.isArray(payload)
          ? payload
          : payload.items || [];

        setArticles(fallback);

        if (fallback.length === 0) {
          setError('No articles are available. Please try again later.');
        }
      } catch (fallbackError) {
        setArticles([]);
        setError(
          'News is temporarily unavailable. Please try again later.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshArticles(language);
    // Initial load only; language changes are handled separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMoreNews = useCallback(async () => {
    if (!nextPage || loadingMore) return;

    setLoadingMore(true);

    try {
      const response = await fetchLiveArticles({
        language,
        page: nextPage,
      });

      setArticles((current) => uniqueArticles([...current, ...response.items]));
      setNextPage(response.nextPage);
      setHasMore(Boolean(response.nextPage));
    } catch (requestError) {
      setError(requestError.message || 'Unable to load more news.');
    } finally {
      setLoadingMore(false);
    }
  }, [language, nextPage, loadingMore]);

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