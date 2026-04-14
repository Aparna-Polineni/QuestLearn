// src/services/api.js
// Centralised API client for QuestLearn Spring Boot backend.
// Handles: JWT auth, network error interception, 401 redirect with ql_redirect,
// offline detection, and draft answer persistence.

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const TOKEN_KEY = 'ql_token';

// ── Connection state — drives the offline banner in ConnectionBanner.jsx ────
let connectionListeners = [];
let isOnline = true;

export function subscribeConnection(fn) {
  connectionListeners.push(fn);
  return () => { connectionListeners = connectionListeners.filter(f => f !== fn); };
}

function setOnline(val) {
  if (isOnline === val) return;
  isOnline = val;
  connectionListeners.forEach(fn => fn(val));
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${BASE}${path}`, { ...options, headers });
    setOnline(true); // successful network contact
  } catch (networkErr) {
    // Network unreachable — backend down or no connection
    setOnline(false);
    const err = new Error('NETWORK_ERROR');
    err.isNetworkError = true;
    throw err;
  }

  // ── 401 intercept — token expired mid-session ────────────────────────────
  if (response.status === 401) {
    // Preserve where the user was BEFORE clearing auth
    const dest = window.location.pathname + window.location.search;
    if (dest && dest !== '/' && !dest.startsWith('/auth')) {
      sessionStorage.setItem('ql_redirect', dest);
    }
    // Clear invalid token
    localStorage.removeItem(TOKEN_KEY);
    // Redirect to login — use window.location so React Router resets cleanly
    window.location.href = '/auth';
    throw new Error('SESSION_EXPIRED');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${response.status}`);
  }

  // 204 No Content
  if (response.status === 204) return null;
  return response.json();
}

// ── Auth ─────────────────────────────────────────────────────────────────────
const api = {
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  async getMe() {
    return request('/api/user/me');
  },

  async register(email, name, password) {
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, displayName: name, password }),
    });
    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async login(email, password) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // ── Progress sync ──────────────────────────────────────────────────────────
  async getProgress() {
    return request('/api/progress');
  },

  async completeLevel(stageId, levelId, meta = {}) {
    return request('/api/progress/complete', {
      method: 'POST',
      body: JSON.stringify({ stageId, levelId, ...meta }),
    });
  },

  async updateProfile(updates) {
    const data = await request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  // ── Notifications ──────────────────────────────────────────────────────────
  async subscribeNotification(email, pathName, nextStage) {
    return request('/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, pathName, nextStage }),
    });
  },

  // ── Draft answers — localStorage persistence for mid-level refresh ─────────
  // Key: ql_draft_{levelKey}  Value: {vals:{}, ts:timestamp}
  saveDraft(levelKey, vals) {
    try {
      localStorage.setItem(
        `ql_draft_${levelKey}`,
        JSON.stringify({ vals, ts: Date.now() })
      );
    } catch (_) {} // storage quota exceeded — fail silently
  },

  loadDraft(levelKey) {
    try {
      const raw = localStorage.getItem(`ql_draft_${levelKey}`);
      if (!raw) return null;
      const { vals, ts } = JSON.parse(raw);
      // Expire drafts older than 7 days
      if (Date.now() - ts > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(`ql_draft_${levelKey}`);
        return null;
      }
      return vals;
    } catch (_) {
      return null;
    }
  },

  clearDraft(levelKey) {
    try { localStorage.removeItem(`ql_draft_${levelKey}`); } catch (_) {}
  },
};

export default api;
