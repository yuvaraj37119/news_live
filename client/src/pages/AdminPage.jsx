import { useEffect, useState } from 'react';
import { fetchJson, getAuthToken, setAuthToken } from '../services/api';

const emptyForm = {
  title: '',
  category: 'World',
  summary: '',
  content: '',
  author: '',
  readTime: '5 min read',
  image: '',
  featured: false,
};

export default function AdminPage() {
  const [token, setToken] = useState(getAuthToken());
  const [login, setLogin] = useState({ email: 'admin@novawire.local', password: 'admin123' });
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const loadArticles = async () => {
    if (!token) return;
    try {
      const payload = await fetchJson(`http://localhost:5000/api/admin/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(payload.items || []);
    } catch (error) {
      setStatus(error.message);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const payload = await fetchJson('http://localhost:5000/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(login),
      });
      setAuthToken(payload.token);
      setToken(payload.token);
      setStatus('Logged in successfully.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      content: form.content.split(/\n+/).map((item) => item.trim()).filter(Boolean),
      featured: Boolean(form.featured),
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? `http://localhost:5000/api/admin/articles/${editingId}` : 'http://localhost:5000/api/admin/articles';
      await fetchJson(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      setStatus(editingId ? 'Article updated.' : 'Article created.');
      setForm(emptyForm);
      setEditingId(null);
      await loadArticles();
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleEdit = (article) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      category: article.category,
      summary: article.summary,
      content: Array.isArray(article.content) ? article.content.join('\n\n') : article.summary,
      author: article.author,
      readTime: article.readTime || '5 min read',
      image: article.image,
      featured: Boolean(article.featured),
    });
  };

  const handleDelete = async (id) => {
    try {
      await fetchJson(`http://localhost:5000/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus('Article deleted.');
      await loadArticles();
    } catch (error) {
      setStatus(error.message);
    }
  };

  const onLogout = () => {
    setAuthToken(null);
    setToken(null);
    setArticles([]);
    setStatus('Logged out.');
  };

  if (!token) {
    return (
      <main className="admin-page">
        <div className="admin-login-box">
          <div className="section-heading">
            <span className="eyebrow">Admin access</span>
            <h2>Live News secure login</h2>
          </div>
          <form className="admin-login-form" onSubmit={handleLogin}>
            <input type="email" value={login.email} onChange={(event) => setLogin((current) => ({ ...current, email: event.target.value }))} placeholder="Email" required />
            <input type="password" value={login.password} onChange={(event) => setLogin((current) => ({ ...current, password: event.target.value }))} placeholder="Password" required />
            <button type="submit" className="primary-button">Log in</button>
          </form>
          {status && <p className="status-message">{status}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <section className="panel-box admin-form-box">
          <div className="section-heading">
            <span className="eyebrow">Admin</span>
            <h2>{editingId ? 'Edit article' : 'Create article'}</h2>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Article title" required />
            <select name="category" value={form.category} onChange={handleChange}>
              {['World', 'Business', 'Politics', 'Tech', 'Culture', 'Climate', 'Analysis'].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" required />
            <input name="readTime" value={form.readTime} onChange={handleChange} placeholder="Read time" />
            <textarea name="summary" value={form.summary} onChange={handleChange} rows="3" placeholder="Summary" required />
            <textarea name="content" value={form.content} onChange={handleChange} rows="8" placeholder="Article text" required />
            <label className="checkbox-row">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Feature on homepage
            </label>
            <div className="form-actions">
              <button type="submit" className="primary-button">{editingId ? 'Update article' : 'Create article'}</button>
              <button type="button" className="secondary-button" onClick={onLogout}>Log out</button>
            </div>
          </form>

          {status && <p className="status-message">{status}</p>}
        </section>

        <section className="panel-box article-manager-box">
          <div className="section-heading">
            <span className="eyebrow">Database</span>
            <h2>Article list</h2>
          </div>

          <div className="admin-list">
            {articles.map((article) => (
              <div key={article.id} className="admin-row">
                <div>
                  <strong>{article.title}</strong>
                  <span>{article.category}</span>
                </div>
                <div className="admin-actions">
                  <button type="button" className="secondary-button" onClick={() => handleEdit(article)}>Edit</button>
                  <button type="button" className="ghost-button danger" onClick={() => handleDelete(article.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
