// src/components/SaveProgressModal.jsx
// Shown when a guest completes Level 0 and tries to continue.
// Framing: "save your progress" not "create an account"

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SaveProgressModal.css';

export default function SaveProgressModal({ pathId, stageId, levelId, nextUrl, onClose }) {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const [mode,     setMode]     = useState('signup'); // signup | signin
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (mode === 'signup') {
      if (!name.trim())        { setError('Please enter your name');              setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
      result = await signUp(email, password, name);
    } else {
      result = await signIn(email, password);
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    // Clear any guest progress from localStorage — it's now saved to the backend
    try {
      const key = `ql_guest_${pathId}`;
      localStorage.removeItem(key);
    } catch (_) {}

    // Go to the next level
    navigate(nextUrl, { replace: true });
  }

  return (
    <div className="spm-overlay" onClick={onClose}>
      <div className="spm-modal" onClick={e => e.stopPropagation()}>

        {/* Progress indicator */}
        <div className="spm-progress">
          <div className="spm-progress-bar">
            <div className="spm-progress-fill" />
          </div>
          <span className="spm-progress-label">Level 0 complete ✓</span>
        </div>

        <div className="spm-icon">🎯</div>

        <h2 className="spm-title">Save your progress</h2>
        <p className="spm-sub">
          You completed Level 0. Create a free account so your progress
          is waiting for you next time — on any device.
        </p>
        <p className="spm-nudge">Free. Takes 30 seconds. No credit card.</p>

        <form className="spm-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input
              className="spm-input"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input
            className="spm-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="spm-input"
            type="password"
            placeholder={mode === 'signup' ? 'Choose a password (6+ chars)' : 'Password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <div className="spm-error">⚠️ {error}</div>}

          <button className="spm-submit" type="submit" disabled={loading}>
            {loading ? '...' : mode === 'signup' ? 'Save & continue →' : 'Sign in & continue →'}
          </button>
        </form>

        <div className="spm-switch">
          {mode === 'signup' ? (
            <>Already have an account?{' '}
              <button className="spm-switch-btn" onClick={() => { setMode('signin'); setError(''); }}>
                Sign in
              </button>
            </>
          ) : (
            <>New here?{' '}
              <button className="spm-switch-btn" onClick={() => { setMode('signup'); setError(''); }}>
                Create account
              </button>
            </>
          )}
        </div>

        <button className="spm-skip" onClick={onClose}>
          Continue without saving (progress will be lost)
        </button>

      </div>
    </div>
  );
}