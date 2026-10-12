import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { translateCategoryName, uiText } from '../i18n';
import { formatDate } from '../services/api';

function getTone(category) {
  const tones = {
    Home: 'cyan',
    World: 'blue',
    Business: 'amber',
    Politics: 'gold',
    Tech: 'violet',
    Culture: 'rose',
    Climate: 'emerald',
    Analysis: 'slate',
  };

  return tones[String(category || 'Home')] || 'cyan';
}

export default function ArticleCard({ article, index = 0, language = 'en' }) {
  const navigate = useNavigate();
  const href = article.slug ? `/article/${article.slug}` : `/article/${article.id}`;
  const t = uiText[language] || uiText.en;

  const handleOpen = () => navigate(href);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(href);
    }
  };

  return (
    <motion.article
      className="story-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open story: ${article.title}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="story-image-wrap">
        <img src={article.image} alt={article.title} loading="lazy" />
      </div>

      <div className="story-body">
        <div className="story-card-topline">
          <span className={`story-badge ${getTone(article.category)}`}>{translateCategoryName(article.category, language)}</span>
          <span className="story-badge live">LIVE</span>
          <span>{article.readTime || '5 min read'}</span>
        </div>

        <h3>{article.title}</h3>
        <p>{article.summary}</p>

        <div className="story-meta-row">
          <span>{article.author}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <Link to={href} className="story-link" onClick={(event) => event.stopPropagation()}>{t.readStory}</Link>
      </div>
    </motion.article>
  );
}
