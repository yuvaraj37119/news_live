const runtimeEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const API_BASE = runtimeEnv.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
}

export function formatDate(value) {
  if (!value) return 'Today';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Today';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getAuthToken() {
  return localStorage.getItem('novawire_admin_token');
}

export function setAuthToken(token) {
  if (token) localStorage.setItem('novawire_admin_token', token);
  else localStorage.removeItem('novawire_admin_token');
}

export function buildCategoryHref(category) {
  const value = String(category || '').trim();
  return value ? `/category/${value.toLowerCase()}` : '/';
}
