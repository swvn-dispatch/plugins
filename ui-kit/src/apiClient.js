/**
 * @param {string} opts.tokenKey - localStorage key, e.g. 'ff_access_token' / 'mv_token'
 * @param {string} [opts.basePath] - defaults to (window.__BASE_PATH__) || '/'; pass an
 *                                    explicit static value to override (e.g. a hardcoded mount path)
 * @param {(err: Error) => void} [opts.onUnauthorized]
 * @param {string} [opts.refreshTokenKey] - localStorage key for the refresh token, defaults to `${tokenKey}_refresh`
 * @param {string} [opts.refreshPath] - refresh endpoint, relative to the api base, defaults to '/auth/refresh'
 * @returns {{ request, login, logout, isAuthenticated, getToken, basePath }}
 */
export function createApiClient({
  tokenKey,
  basePath,
  onUnauthorized,
  refreshTokenKey = `${tokenKey}_refresh`,
  refreshPath = '/auth/refresh',
} = {}) {
  const BASE = basePath ?? ((typeof window !== 'undefined' && window.__BASE_PATH__) || '/');

  function getToken() {
    return localStorage.getItem(tokenKey);
  }

  function setToken(token) {
    if (token) localStorage.setItem(tokenKey, token);
    else localStorage.removeItem(tokenKey);
  }

  function getRefreshToken() {
    return localStorage.getItem(refreshTokenKey);
  }

  function setRefreshToken(token) {
    if (token) localStorage.setItem(refreshTokenKey, token);
    else localStorage.removeItem(refreshTokenKey);
  }

  async function rawRequest(path, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE}api${path}`, { ...options, headers });

    if (res.status === 401) {
      const err = new Error('Session expired, please log in again');
      err.status = 401;
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

  // Shared across concurrent 401s (e.g. multiple polling intervals firing at
  // once) so a token expiry never triggers more than one refresh call.
  let refreshInFlight = null;

  function refreshAccessToken() {
    if (!refreshInFlight) {
      refreshInFlight = (async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');
        const res = await fetch(`${BASE}api${refreshPath}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (!res.ok) throw new Error('Refresh failed');
        const data = await res.json();
        setToken(data.access);
      })().finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  }

  async function request(path, options = {}) {
    try {
      return await rawRequest(path, options);
    } catch (err) {
      if (err.status !== 401) throw err;

      if (getRefreshToken()) {
        try {
          await refreshAccessToken();
          return await rawRequest(path, options);
        } catch {
          // refresh (or the retried request) failed — fall through to a full logout below
        }
      }

      setToken(null);
      setRefreshToken(null);
      onUnauthorized?.(err);
      throw err;
    }
  }

  async function login(username, password, loginPath = '/auth/token') {
    const data = await rawRequest(loginPath, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(data.access);
    if (data.refresh) setRefreshToken(data.refresh);
    return data;
  }

  function logout() {
    setToken(null);
    setRefreshToken(null);
  }

  function isAuthenticated() {
    return !!getToken();
  }

  return { request, login, logout, isAuthenticated, getToken, basePath: BASE };
}
