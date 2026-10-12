import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="empty-state large-empty">
      <h1>Page not found</h1>
      <p>The story you’re looking for may have moved or no longer exists.</p>
      <Link to="/" className="primary-button">Return home</Link>
    </main>
  );
}
