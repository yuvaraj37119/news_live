# NovaWire

NovaWire is a premium digital newsroom and discovery platform built with React, Vite, and SQLite. It includes a polished editorial front end, complete article search, category browsing, an admin workflow, newsletter signup, secure admin login, and a production-ready Express API.

## Stack
- Frontend: React + Vite + Framer Motion
- Backend: Express + SQLite
- Auth: JWT-based admin auth for protected admin actions
- Data: SQLite with migration-style schema initialization and deterministic seed data

## Local setup

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```
3. Run both processes:
   ```bash
   npm run dev
   ```
4. Open:
   - Frontend: http://localhost:5173
   - API: http://localhost:5000/api/health

## Admin access

The app bootstraps an admin user from environment values when the password is configured. In local development, the default values are:

```env
ADMIN_EMAIL=admin@novawire.local
ADMIN_PASSWORD=admin123
```

For production, set a unique password and JWT secret in your hosting environment instead of committing them.

## Available scripts

```bash
npm run dev       # start backend + frontend together
npm run server    # start only the Express server
npm run client    # start only the Vite frontend
npm run build     # production frontend build
npm --prefix server test   # backend tests
```

## API overview

- `GET /api/health` — service and database status
- `GET /api/articles` — paginated, searchable, sortable article feed
- `GET /api/search` — debounced article search
- `GET /api/categories` — category index
- `GET /api/categories/:slug` — category detail with stories
- `GET /api/articles/:id` — article fetch by ID or slug
- `POST /api/newsletter/subscribe` — newsletter signup
- `POST /api/admin/login` — admin authentication
- `POST /api/admin/articles` — create article
- `PUT /api/admin/articles/:id` — update article
- `DELETE /api/admin/articles/:id` — delete article

## Database notes

The current implementation uses SQLite to keep local development simple while still providing reliable initial schema creation, indexes, and seeded demo content. The database file lives in `server/data/newsroom.db`.

## Deployment notes

- Keep secrets in the server environment, not in source control.
- Use a persistent filesystem for the SQLite database in production.
- Ensure the app runs with a secure admin password and long JWT secret.
- Use a reverse proxy or hosting service that keeps the API and frontend behind the same domain if you want stricter CSP and cookie handling.
