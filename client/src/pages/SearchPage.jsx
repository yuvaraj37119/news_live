import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { localizeArticles, uiText } from '../i18n';
import { fetchJson, formatDate } from '../services/api';

export default function SearchPage({ language = 'en' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const query = searchParams.get('q') || '';
  const t = uiText[language] || uiText.en;
  const localizedResults = useMemo(() => localizeArticles(results, language), [results, language]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const payload = await fetchJson(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/search?q=${encodeURIComponent(query)}`);
        setResults(payload.items || []);
      } catch (requestError) {
        setError(requestError.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const handleInput = (event) => {
    const value = event.target.value;
    if (value) setSearchParams({ q: value });
    else setSearchParams({});
  };

  return (
    <main className="search-page">
      <div className="search-header">
        <h1>{t.searchStories}</h1>
        <div className="search-input-wrap">
          <input type="search" value={query} onChange={handleInput} placeholder={t.searchPlaceholder} />
        </div>
      </div>

      {loading && <div className="loading-state">{t.searchingStories}</div>}
      {error && <div className="empty-state">{error}</div>}
      {!loading && !query && <div className="empty-state">{t.searchIntro}</div>}
      {!loading && query && !results.length && !error && <div className="empty-state">{t.noMatch.replace('{query}', query)}</div>}

      <div className="search-results">
        {localizedResults.map((article) => (
          <Link key={article.id} to={article.slug ? `/article/${article.slug}` : `/article/${article.id}`} className="search-result-card">
            <img src={article.image} alt={article.title} />
            <div>
              <span className="eyebrow">{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <small>{article.author} • {formatDate(article.publishedAt)}</small>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
