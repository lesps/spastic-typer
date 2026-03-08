// Update this URL after deploying the backend to Render.com
export const BACKEND_URL = 'https://spastic-typer.onrender.com';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export function apiRegister(username, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function apiLogin(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function apiGetMyProfile(token) {
  return apiFetch('/profile/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function apiUpdateProfile(token, data) {
  return apiFetch('/profile/me', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function apiLookupUser(username) {
  return apiFetch(`/profile/${encodeURIComponent(username)}`);
}
