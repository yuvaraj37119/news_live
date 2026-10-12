import { useEffect, useMemo, useState } from 'react';
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

const allowedLanguages = new Set(supportedLanguages.map((language) => language.value));

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('freshnews_language');
    return allowedLanguages.has(saved) ? saved : 'en';
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadingScreen(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!allowedLanguages.has(language)) {
      setLanguage('en');
      return;
    }

    localStorage.setItem('freshnews_language', language);
  }, [language]);

  const refreshArticles = async () => {
    try {
      setLoading(true);

      const liveArticles = await fetchLiveArticles();
      if (liveArticles.length) {
        setArticles(liveArticles);
        setError('');
        return;
      }

      const payload = await fetchJson(`${API_BASE}/articles?limit=24`);
      setArticles(payload.items || payload || []);
      setError('');
    } catch (requestError) {
      try {
        const payload = await fetchJson(`${API_BASE}/articles?limit=24`);
        setArticles(payload.items || payload || []);
        setError('');
      } catch {
        setError(requestError.message);
        setArticles([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const localizedArticles = useMemo(() => localizeArticles(articles, language), [articles, language]);

  useEffect(() => {
    refreshArticles();
  }, []);

  if (loadingScreen) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <div className="news-app-shell">
        <Header language={language} setLanguage={setLanguage} />

        {loading ? (
          <div className="loading-state">Loading stories…</div>
        ) : error ? (
          <div className="empty-state">Unable to load stories: {error}</div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage articles={localizedArticles} language={language} />} />
            <Route path="/category/:category" element={<CategoryPage articles={localizedArticles} language={language} />} />
            <Route path="/search" element={<SearchPage articles={localizedArticles} language={language} />} />
            <Route path="/article/:id" element={<ArticlePage articles={localizedArticles} language={language} />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
