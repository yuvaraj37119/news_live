import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { localizeArticle, uiText } from '../i18n';
import { API_BASE, fetchJson, formatDate } from '../services/api';

export default function ArticlePage({ articles = [], language = 'en' }) {
  const { id } = useParams();

  const [fetchedArticle, setFetchedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);

  const t = uiText[language] || uiText.en;

  // Find the article from App.jsx first.
  // App.jsx already passes localized articles to this page.
  const listedArticle = useMemo(() => {
    const routeKey = String(id || '');

    return articles.find((item) =>
      [item.id, item._id, item.slug]
        .filter(Boolean)
        .some((value) => String(value) === routeKey)
    ) || null;
  }, [articles, id]);

  // Only fetch from the backend if the article is not already in the list.
  useEffect(() => {
    if (listedArticle) {
      setFetchedArticle(null);
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function loadArticle() {
      setLoading(true);

      try {
        const article = await fetchJson(`${API_BASE}/articles/${encodeURIComponent(id)}`);

        if (active) {
          setFetchedArticle(article);
        }
      } catch (error) {
        if (active) {
          setFetchedArticle(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      active = false;
    };
  }, [id, listedArticle]);

  // Listed articles are already localized by App.jsx.
  // Localize backend-fetched articles as a fallback.
  const currentArticle = useMemo(() => {
    if (listedArticle) return listedArticle;
    return localizeArticle(fetchedArticle, language);
  }, [listedArticle, fetchedArticle, language]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('novawire_bookmarks') || '[]'
      );

      setBookmarked(
        saved.some((value) => String(value) === String(id))
      );
    } catch {
      setBookmarked(false);
    }
  }, [id]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const percentage =
        scrollableHeight > 0
          ? (window.scrollY / scrollableHeight) * 100
          : 0;

      setProgress(Math.min(100, Math.max(0, percentage)));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [currentArticle]);

  const related = useMemo(() => {
    if (!currentArticle) return [];

    return articles
      .filter((item) => {
        const sameCategory =
          item.category === currentArticle.category;

        const differentArticle =
          String(item.id || item._id) !==
          String(currentArticle.id || currentArticle._id);

        return sameCategory && differentArticle;
      })
      .slice(0, 3);
  }, [currentArticle, articles]);

  const toggleBookmark = () => {
    try {
      const key = 'novawire_bookmarks';
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      const articleId = String(id);

      const exists = saved.some(
        (value) => String(value) === articleId
      );

      const next = exists
        ? saved.filter((value) => String(value) !== articleId)
        : [...saved, articleId];

      localStorage.setItem(key, JSON.stringify(next));
      setBookmarked(!exists);
    } catch (error) {
      console.error('Unable to update bookmark:', error);
    }
  };

  const shareArticle = async () => {
    const url = window.location.href;
    const title = currentArticle?.title || 'Live News';

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        window.alert(t.storyCopied);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Unable to share article:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        {t.loadingStories}
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="empty-state">
        {t.articleNotFound}
      </div>
    );
  }

  const paragraphs =
    Array.isArray(currentArticle.content) &&
    currentArticle.content.length > 0
      ? currentArticle.content
      : currentArticle.summary
        ? [currentArticle.summary]
        : [];

  return (
    <main className="article-page">
      <div
        className="reading-progress"
        role="progressbar"
        aria-label="Article reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <article className="article-shell">
        <header className="article-header">
          <span className="eyebrow">
            {currentArticle.category}
          </span>

          <h1>{currentArticle.title}</h1>

          {currentArticle.summary && (
            <p className="article-summary">
              {currentArticle.summary}
            </p>
          )}

          <div className="meta-line">
            <span>{currentArticle.author}</span>
            <span>{formatDate(currentArticle.publishedAt)}</span>
            <span>
              {currentArticle.readTime || '5 min read'}
            </span>
          </div>

          <div className="article-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={shareArticle}
            >
              {t.share}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={toggleBookmark}
            >
              {bookmarked ? t.saved : t.saveStory}
            </button>
          </div>
        </header>

        {currentArticle.image && (
          <img
            src={currentArticle.image}
            alt={currentArticle.title}
            className="article-image"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        )}

        <div className="article-body" lang={language}>
          {paragraphs.map((paragraph, index) => (
            <p key={`${currentArticle.id || id}-${index}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <aside className="article-sidepanel">
        <div className="panel-box">
          <div className="panel-header">
            <span className="eyebrow">{t.related}</span>
            <h3>{t.moreStories}</h3>
          </div>

          <div className="related-list">
            {related.map((item) => (
              <Link
                key={item.id || item._id}
                to={`/article/${item.slug || item.id || item._id}`}
                className="related-item"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                  />
                )}

                <div>
                  <span>{item.category}</span>
                  <h4>{item.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
