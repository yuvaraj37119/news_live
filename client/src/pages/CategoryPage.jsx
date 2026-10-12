import { Link, useParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { translateCategoryName, uiText } from '../i18n';
import { formatDate } from '../services/api';

export default function CategoryPage({ articles, language = 'en' }) {
  const { category } = useParams();
  const normalized = String(category || '').replace(/-/g, ' ');
  const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  const localizedCategory = translateCategoryName(capitalized, language);
  const items = articles.filter((article) => article.category.toLowerCase() === normalized.toLowerCase());
  const t = uiText[language] || uiText.en;

  if (!items.length) {
    return <div className="empty-state">{t.noStories.replace('{category}', localizedCategory)}</div>;
  }

  const lead = items[0];
  const rest = items.slice(1);

  return (
    <main className="category-page">
      <section className="category-hero">
        <div className="category-copy">
          <span className="eyebrow">{localizedCategory}</span>
          <h1>{lead.title}</h1>
          <p>{lead.summary}</p>
          <div className="meta-line">
            <span>{lead.author}</span>
            <span>{formatDate(lead.publishedAt)}</span>
            <span>{lead.readTime || '5 min read'}</span>
          </div>
          <Link to={lead.slug ? `/article/${lead.slug}` : `/article/${lead.id}`} className="primary-button inline-button">{t.readStory}</Link>
        </div>
        <img src={lead.image} alt={lead.title} />
      </section>

      <div className="story-grid category-grid">
        {rest.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} language={language} />
        ))}
      </div>
    </main>
  );
}
