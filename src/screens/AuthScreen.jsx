// src/screens/AuthScreen.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import './AuthScreen.css';

export default function AuthScreen() {
  const navigate = useNavigate();
  const { signUp, signIn, user, loading } = useAuth();
  const { allPaths } = useGame();

  const [mode,     setMode]     = useState('signin');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [busy,     setBusy]     = useState(false);

  // Already logged in — redirect appropriately
  useEffect(() => {
    if (loading) return;
    if (user) {
      const hasProgress = Object.keys(allPaths).length > 0;
      navigate(hasProgress ? '/home' : '/career-select', { replace: true });
    }
  }, [user, loading, allPaths, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    let result;
    if (mode === 'signup') {
      if (!name.trim()) { setError('Please enter your name'); setBusy(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); setBusy(false); return; }
      result = await signUp(email, password, name);
    } else {
      result = await signIn(email, password);
    }

    setBusy(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      // Redirect based on whether user has existing progress
      const hasProgress = Object.keys(allPaths).length > 0;
      navigate(hasProgress ? '/home' : '/career-select', { replace: true });
    }
  }

  if (loading) return null;

  return (
    <div className="auth-screen">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      <div className="auth-box">
        <div className="auth-logo" onClick={() => navigate('/')}>◈ QuestLearn</div>

        <h1 className="auth-title">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="auth-subtitle">
          {mode === 'signin'
            ? 'Sign in to continue your learning journey.'
            : 'Your progress will be saved across all devices.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="auth-field">
              <label className="auth-label">Your name</label>
              <input className="auth-input" type="text" placeholder="Alex Chen"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input className="auth-input" type="email" placeholder="alex@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? '...' : mode === 'signin' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'signin' ? <>Don't have an account?{' '}
            <button className="auth-switch-btn" onClick={() => { setMode('signup'); setError(''); }}>Sign up free</button>
          </> : <>Already have an account?{' '}
            <button className="auth-switch-btn" onClick={() => { setMode('signin'); setError(''); }}>Sign in</button>
          </>}
        </div>

        <div className="auth-note">🔒 No credit card. No spam. Progress saved automatically.</div>
      </div>
    </div>
  );
}