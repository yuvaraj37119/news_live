import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { navLabels, supportedLanguages, uiText } from '../i18n';

const navItems = [
  { key: 'Home', path: '/' },
  { key: 'World', path: '/category/world' },
  { key: 'Business', path: '/category/business' },
  { key: 'Politics', path: '/category/politics' },
  { key: 'Tech', path: '/category/tech' },
  { key: 'Culture', path: '/category/culture' },
  { key: 'Climate', path: '/category/climate' },
  { key: 'Analysis', path: '/category/analysis' },
];

export default function Header({ language = 'en', setLanguage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const isHome = useMemo(() => location.pathname === '/', [location.pathname]);
  const currentLabels = navLabels[language] || navLabels.en;
  const t = uiText[language] || uiText.en;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === 'Escape') {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = searchValue.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    if (!value) {
      navigate('/search');
      return;
    }

    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <>
      <header className={`topbar ${isHome ? 'topbar-home' : ''}`}>
        <div className="topbar-inner">
          <Link to="/" className="brand-block" aria-label="Live News home">
            <span className="brand-mark">L</span>
            <div>
              <p className="brand-name">Live News</p>
              <span className="brand-subtitle">live brief</span>
            </div>
          </Link>

          <nav className="primary-nav" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <NavLink key={item.key} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                {currentLabels[index]}
              </NavLink>
            ))}
            <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              {t.admin}
            </NavLink>
          </nav>

          <div className="topbar-actions">
            <select
              className="language-select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label="Select language"
            >
              {supportedLanguages.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button type="button" className="icon-button" aria-label={t.openSearch} onClick={() => setSearchOpen(true)}>
              {t.searchIcon}
            </button>
            <button type="button" className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileOpen((value) => !value)}>
              {mobileOpen ? t.close : t.menu}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mobile-navigation">
            {navItems.map((item, index) => (
              <NavLink key={item.key} to={item.path} className="mobile-nav-item" onClick={() => setMobileOpen(false)}>
                {currentLabels[index]}
              </NavLink>
            ))}
            <NavLink to="/admin" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>
              {t.admin}
            </NavLink>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="search-modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div className="search-modal" onClick={(event) => event.stopPropagation()}>
            <form onSubmit={submitSearch} className="search-form">
              <label htmlFor="freshnews-search" className="sr-only">{t.searchStories}</label>
              <input
                id="freshnews-search"
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
              />
              <button type="submit" className="primary-button">{t.search}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
