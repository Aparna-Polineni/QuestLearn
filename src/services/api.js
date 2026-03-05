// src/services/api.js
// Drop this into your React project — handles all calls to the Spring Boot backend.
//
// Usage:
//   import api from './services/api';
//   const data = await api.login(email, password);

const BASE_URL = 'http://localhost:8080/api';

// ── Token helpers ──────────────────────────────────────────────────────────
// Store the JWT in localStorage so it survives page refresh
function getToken()        { return localStorage.getItem('ql_token'); }
function setToken(token)   { localStorage.setItem('ql_token', token); }
function clearToken()      { localStorage.removeItem('ql_token'); }

// ── Base fetch wrapper ─────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

// ── Auth ───────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Stores the returned JWT automatically.
 * @returns AuthResponse { token, userId, email, displayName, careerPath, ... }
 */
async function register(email, displayName, password) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, displayName, password }),
  });
  setToken(data.token);
  return data;
}

/**
 * Log in an existing user.
 * Stores the returned JWT automatically.
 * @returns AuthResponse
 */
async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

/** Clear token — call on logout */
function logout() {
  clearToken();
}

/** Returns true if a JWT is present (doesn't validate expiry client-side) */
function isLoggedIn() {
  return !!getToken();
}

// ── User / Profile ─────────────────────────────────────────────────────────

/**
 * Get current user profile.
 * @returns AuthResponse
 */
async function getMe() {
  return request('/user/me');
}

/**
 * Update career path, domain selection, display name.
 * All fields optional — only sends what you provide.
 * @returns AuthResponse with fresh token — store it.
 */
async function updateProfile({ displayName, careerPath, domainName, domainColor }) {
  const data = await request('/user/profile', {
    method: 'PUT',
    body: JSON.stringify({ displayName, careerPath, domainName, domainColor }),
  });
  // Server returns a fresh token with updated claims — replace the stored one
  if (data.token) setToken(data.token);
  return data;
}

// ── Progress ───────────────────────────────────────────────────────────────

/**
 * Load all progress for the current user.
 * Call this on app startup to hydrate GameContext from the database.
 * @returns ProgressResponse { totalXp, currentStage, completedLevels: [...] }
 */
async function getProgress() {
  return request('/progress');
}

/**
 * Mark a level as complete.
 * Safe to call multiple times — idempotent server-side.
 * @returns ProgressResponse with updated totals
 */
async function completeLevel(stage, levelId, { timeTakenSeconds, attempts } = {}) {
  return request('/progress/complete', {
    method: 'POST',
    body: JSON.stringify({ stage, levelId, timeTakenSeconds, attempts }),
  });
}

// ── Leaderboard ────────────────────────────────────────────────────────────

/**
 * Fetch the leaderboard. Public — no auth required.
 * @returns Array of { rank, displayName, totalXp, currentStage }
 */
async function getLeaderboard(limit = 20) {
  return request(`/leaderboard?limit=${limit}`);
}

// ── Export ─────────────────────────────────────────────────────────────────
const api = {
  register, login, logout, isLoggedIn,
  getMe, updateProfile,
  getProgress, completeLevel,
  getLeaderboard,
};

export default api;
