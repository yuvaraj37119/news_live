import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { translateCategoryName, uiText } from '../i18n';
import { formatDate } from '../services/api';

const marketData = [
  { name: 'S&P 500', value: '5,436.19', delta: '+1.42%' },
  { name: 'NASDAQ', value: '17,802.64', delta: '+1.89%' },
  { name: 'NIFTY 50', value: '23,842.31', delta: '+0.87%' },
  { name: 'Dow Jones', value: '39,817.05', delta: '+0.93%' },
  { name: 'FTSE 100', value: '8,216.44', delta: '+0.72%' },
  { name: 'Crude Oil', value: '$77.18', delta: '-0.34%' },
  { name: 'Gold', value: '$2,349.80', delta: '+1.12%' },
  { name: 'Bitcoin', value: '$62,184', delta: '+3.61%' },
];

const categoryCoverage = ['World', 'Business', 'Politics', 'Tech', 'Culture', 'Climate', 'Analysis'];

function describeWeatherCode(code) {
  if (code === 0) return 'Clear sky';
  if ([1, 2].includes(code)) return 'Mainly clear / partly cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([71, 73, 75, 77].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Rain showers';
  if ([85, 86].includes(code)) return 'Snow showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Conditions unavailable';
}

export default function HomePage({
  articles,
  language = 'en',
  onLoadMore,
  hasMore,
  loadingMore,
}) {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState('');
  const loadMoreSentinel = useRef(null);
  const intersectionArmed = useRef(true);
  const t = uiText[language] || uiText.en;

  const lead = articles.find((item) => item.featured) || articles[0];
  const featuredArticle = lead;
  const moreStories = (articles || [])
    .filter(
      (article) =>
        String(article.id || article.slug) !==
        String(lead?.id || lead?.slug)
    )
    .slice(0, 3);
  const stories = articles;
  const featured = articles.slice(0, 4);
  const localizedCategoryCoverage = categoryCoverage.map((category) => ({
    key: category,
    label: translateCategoryName(category, language),
  }));
  const tickerItems = useMemo(
    () => (articles || [])
      .map((article) => article?.title || '')
      .filter(Boolean)
      .slice(0, 6),
    [articles]
  );
  const trendingTopics = [
    t.aiInfrastructure,
    t.globalEconomy,
    t.climateAction,
    t.startupFunding,
    t.sportsAnalytics,
    t.culturalShifts,
  ];

  useEffect(() => {
    const sentinel = loadMoreSentinel.current;

    if (!sentinel || !hasMore || loadingMore) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          intersectionArmed.current = true;
          return;
        }

        if (!intersectionArmed.current) return;

        intersectionArmed.current = false;
        onLoadMore?.();
      },
      {
        rootMargin: '100px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    let active = true;

    async function loadWeather(latitude, longitude, locationName) {
      try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');

        url.searchParams.set('latitude', latitude);
        url.searchParams.set('longitude', longitude);
        url.searchParams.set(
          'current',
          'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m'
        );
        url.searchParams.set('timezone', 'auto');

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error('Weather service unavailable');
        }

        const data = await response.json();
        const current = data.current;

        if (!current) {
          throw new Error('No current weather data');
        }

        if (active) {
          setWeather({
            location: locationName,
            temperature: current.temperature_2m,
            feelsLike: current.apparent_temperature,
            humidity: current.relative_humidity_2m,
            wind: current.wind_speed_10m,
            precipitation: current.precipitation,
            condition: describeWeatherCode(current.weather_code),
            updatedAt: current.time,
          });
          setWeatherError('');
        }
      } catch (error) {
        if (active) {
          setWeatherError('');
          setWeather({
            location: 'Chennai',
            temperature: 30,
            feelsLike: 31,
            humidity: 68,
            wind: 10,
            precipitation: 0,
            condition: 'Default weather fallback',
            updatedAt: new Date().toISOString(),
          });
        }
      } finally {
        if (active) setWeatherLoading(false);
      }
    }

    const loadDefaultWeather = () => loadWeather(13.0827, 80.2707, 'Chennai');

    const geolocationAvailable = typeof navigator !== 'undefined' && 'geolocation' in navigator;

    if (!geolocationAvailable || window.location.protocol === 'file:') {
      loadDefaultWeather();
      return undefined;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeather(
          position.coords.latitude,
          position.coords.longitude,
          'Your location'
        );
      },
      () => {
        loadDefaultWeather();
      },
      { timeout: 5000, maximumAge: 600000, enableHighAccuracy: false }
    );

    return () => {
      active = false;
    };
  }, []);

  if (!lead) {
    return <div className="empty-state">{t.noArticles}</div>;
  }

  return (
    <main className="home-page">
      <div className="ticker-bar">
        <span className="ticker-label">{t.live}</span>
        <div className="ticker-viewport">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span className="ticker-item" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="hero-layout">
        <motion.article
          className="featured-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="featured-copy">
            <span className="eyebrow">{t.morningBrief}</span>
            <h1>{lead.title}</h1>
            <p>{lead.summary}</p>
            <div className="meta-line">
              <span>{lead.author}</span>
              <span>{formatDate(lead.publishedAt)}</span>
              <span>{lead.readTime || '5 min read'}</span>
            </div>
            <div className="hero-actions">
              <Link to={lead.slug ? `/article/${lead.slug}` : `/article/${lead.id}`} className="primary-button">{t.readLead}</Link>
              <Link to="/search" className="secondary-button">{t.browseLatest}</Link>
            </div>
          </div>

          <div className="featured-visual">
            <img src={lead.image} alt={lead.title} />
          </div>
        </motion.article>

        <div className="hero-extra-news">
          {(articles || [])
            .filter(
              (article) =>
                String(article.id || article.slug) !==
                String(lead?.id || lead?.slug)
            )
            .slice(0, 3)
            .map((article, index) => (
              <ArticleCard
                key={article.id || article.slug || index}
                article={article}
                index={index}
                language={language}
              />
            ))}
        </div>

        <aside className="sidebar-panel">
          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.marketPulse}</span>
              <h3>Sample market data</h3>
            </div>
            <div className="market-list">
              {marketData.map((entry) => (
                <div className="market-row" key={entry.name}>
                  <span>{entry.name}</span>
                  <div>
                    <strong>{entry.value}</strong>
                    <em>{entry.delta}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.climateBrief}</span>
              <h3>Weather & Conditions</h3>
            </div>

            {weatherLoading ? (
              <p className="weather-status">Loading current weather…</p>
            ) : weatherError || !weather ? (
              <p className="weather-status">Live weather is temporarily unavailable.</p>
            ) : (
              <>
                <p className="weather-location">{weather.location}</p>

                <div className="weather-temperature">
                  <strong>{weather.temperature}°C</strong>
                  <span>{weather.condition}</span>
                </div>

                <div className="market-list">
                  <div className="market-row">
                    <span>Feels like</span>
                    <strong>{weather.feelsLike}°C</strong>
                  </div>
                  <div className="market-row">
                    <span>Humidity</span>
                    <strong>{weather.humidity}%</strong>
                  </div>
                  <div className="market-row">
                    <span>Wind speed</span>
                    <strong>{weather.wind} km/h</strong>
                  </div>
                  <div className="market-row">
                    <span>Precipitation</span>
                    <strong>{weather.precipitation} mm</strong>
                  </div>
                </div>

                <p className="weather-updated">Weather observation: {weather.updatedAt}</p>
              </>
            )}
          </div>

          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.trending}</span>
              <h3>{t.topics}</h3>
            </div>
            <div className="chip-row">
              {trendingTopics.map((topic) => (
                <span key={topic} className="chip-item">{topic}</span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="stats-grid">
        {[
          { value: '2.4M', label: 'daily readers' },
          { value: '76', label: 'news desks' },
          { value: '18K', label: 'stories indexed' },
          { value: '4.8/5', label: 'reader rating' },
        ].map((stat) => (
          <div className="stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="editorial-rail">
        <div className="section-heading">
          <span className="eyebrow">{t.coverageMap}</span>
          <h2>{t.todaysNewsroom}</h2>
        </div>

        <div className="section-grid highlight-grid">
          {localizedCategoryCoverage.map(({ key, label }) => {
            const count = articles.filter((item) => item.category === key).length;
            return (
              <Link key={key} to={`/category/${key.toLowerCase()}`} className="coverage-card">
                <span>{label}</span>
                <strong>{label}</strong>
                <small>{count} {t.topics}</small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="content-grid">
        <div className="main-stack" />

        <aside className="side-stack">
          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.whatMattersNow}</span>
              <h3>{t.briefing}</h3>
            </div>
            <div className="brief-list">
              {featured.map((item) => (
                <Link
                  key={item.id}
                  to={item.slug ? `/article/${item.slug}` : `/article/${item.id}`}
                  className="brief-article-link"
                >
                  <div className="brief-item">
                    <span className="brief-tag">{translateCategoryName(item.category, language)}</span>
                    <div>
                      <h4>{item.title}</h4>
                      <small>{formatDate(item.publishedAt)}</small>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.editorsPick}</span>
              <h3>{t.deepReads}</h3>
            </div>
            <div className="compact-list">
              {articles.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  to={item.slug ? `/article/${item.slug}` : `/article/${item.id}`}
                  className="compact-item-link"
                >
                  <div className="compact-item">
                    <h4>{item.title}</h4>
                    <span>{item.category} • {item.readTime || '5 min read'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="infinite-news-section">
        <div className="section-heading">
          <span className="eyebrow">EXPLORE THE NEWS</span>
          <h2>More stories</h2>
          <p>Discover the latest stories from around the world.</p>
        </div>

        {articles.slice(4).length > 0 ? (
          <div className="infinite-news-grid">
            {articles.slice(4).map((article, index) => (
              <ArticleCard
                key={article.id || article.slug || index}
                article={article}
                index={index}
                language={language}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">No more stories available right now.</p>
        )}

        {hasMore && (
          <div className="loading-state">Loading more stories…</div>
        )}

        {loadingMore && (
          <div className="loading-state">Loading more stories…</div>
        )}

        {!hasMore && articles.length > 0 && (
          <div className="end-of-news">You’re up to date.</div>
        )}

        <div ref={loadMoreSentinel} className="load-more-sentinel" aria-hidden="true" />
      </section>
    </main>
  );
}
