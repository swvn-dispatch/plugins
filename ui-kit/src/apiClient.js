/**
 * @param {string} opts.tokenKey - localStorage key, e.g. 'ff_access_token' / 'mv_token'
 * @param {string} [opts.basePath] - defaults to (window.__BASE_PATH__) || '/'; pass an
 *                                    explicit static value to override (e.g. a hardcoded mount path)
 * @param {(err: Error) => void} [opts.onUnauthorized]
 * @returns {{ request, login, logout, isAuthenticated, getToken, basePath }}
 */
export function createApiClient({ tokenKey, basePath, onUnauthorized } = {}) {
  const BASE = basePath ?? ((typeof window !== 'undefined' && window.__BASE_PATH__) || '/');

  function getToken() {
    return localStorage.getItem(tokenKey);
  }

  function setToken(token) {
    if (token) localStorage.setItem(tokenKey, token);
    else localStorage.removeItem(tokenKey);
  }

  async function request(path, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE}api${path}`, { ...options, headers });

    if (res.status === 401) {
      setToken(null);
      const err = new Error('Session expired, please log in again');
      err.status = 401;
      onUnauthorized?.(err);
      throw err;
    }
    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const data = await res.json();
        message = data.error || message;
      } catch {
        // ignore
      }
      throw new Error(message);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async function login(username, password, loginPath = '/auth/token') {
    const data = await request(loginPath, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(data.access);
    return data;
  }

  function logout() {
    setToken(null);
  }

  function isAuthenticated() {
    return !!getToken();
  }

  return { request, login, logout, isAuthenticated, getToken, basePath: BASE };
}
