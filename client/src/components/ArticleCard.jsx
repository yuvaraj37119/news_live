import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { translateCategoryName, uiText } from '../i18n';
import { formatDate } from '../services/api';

function getTone(category) {
  const tones = {
    World: 'blue',
    Business: 'amber',
    Politics: 'gold',
    Tech: 'violet',
    Culture: 'rose',
    Climate: 'emerald',
    Analysis: 'slate',
    Sports: 'rose',
    Health: 'emerald',
  };

  return tones[String(category || 'World')] || 'cyan';
}

export default function ArticleCard({ article, index = 0, language = 'en' }) {
  const navigate = useNavigate();
  const href = article.slug
    ? `/article/${article.slug}`
    : `/article/${article.id}`;

  const t = uiText[language] || uiText.en;

  const shareArticle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const url = new URL(href, window.location.origin).href;

    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        window.alert(t.storyCopied);
      } else {
        window.prompt('Copy this story link:', url);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Could not share story:', error);
      }
    }
  };

  return (
    <motion.article
      className="story-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index % 6, 5) * 0.045,
        ease: 'easeOut',
      }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(href)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(href);
      }}
      role="link"
      tabIndex={0}
    >
      <div className="story-image-wrap">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="story-body">
        <div className="story-card-topline">
          <span className={`story-badge ${getTone(article.category)}`}>
            {translateCategoryName(article.category, language)}
          </span>

          {article.source === 'newsdata' && (
            <span className="story-badge live">{t.live}</span>
          )}

          <span>{article.readTime || '5 min read'}</span>
        </div>

        <h3>{article.title}</h3>
        <p>{article.summary}</p>

        <div className="story-meta-row">
          <span>{article.author}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <div className="story-card-actions">
          <Link
            to={href}
            className="story-link"
            onClick={(event) => event.stopPropagation()}
          >
            {t.readStory}
          </Link>

          <button
            type="button"
            className="story-share-button"
            onClick={shareArticle}
            aria-label={t.share}
          >
            {t.share}
          </button>
        </div>
      </div>
    </motion.article>
  );
}