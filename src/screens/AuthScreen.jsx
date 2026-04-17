// src/screens/AuthScreen.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthScreen.css';

export default function AuthScreen() {
  const navigate  = useNavigate();
  const { signUp, signIn } = useAuth();
  const [searchParams] = useSearchParams();

  // Handle ?mode=signup and ?next= from LandingPage
  useEffect(() => {
    if (searchParams.get('mode') === 'signup') setMode('signup');
  }, [searchParams]);

  const [mode,     setMode]     = useState('signin'); // 'signin' | 'signup'
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
      if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
      result = await signUp(email, password, name);
    } else {
      result = await signIn(email, password);
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      // Check if there's a stored destination (came through RequireAuth or Level 0 flow)
      const stored = sessionStorage.getItem('ql_redirect');
      const param  = searchParams.get('next');
      const raw    = stored || (param ? decodeURIComponent(param) : null) || null;
      sessionStorage.removeItem('ql_redirect');

      if (mode === 'signup' && !raw) {
        // Brand new signup with no destination — show the welcome screen
        // The welcome screen reads activePath from GameContext to personalise
        localStorage.setItem('ql_new_user', '1');
        navigate('/welcome', { replace: true });
      } else {
        // Returning signin OR signup coming from a specific destination
        const safe = (raw?.startsWith('/auth') || raw === '/') ? '/home' : (raw || '/home');
        navigate(safe, { replace: true });
      }
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      <div className="auth-box">
        <div className="auth-logo">◈ QuestLearn</div>

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
              <input
                className="auth-input"
                type="text"
                placeholder="Alex Chen"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input
              className="auth-input"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? '...'
              : mode === 'signin' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'signin' ? (
            <>Don't have an account?{' '}
              <button className="auth-switch-btn" onClick={() => { setMode('signup'); setError(''); }}>
                Sign up free
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button className="auth-switch-btn" onClick={() => { setMode('signin'); setError(''); }}>
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="auth-note">
          🔒 No credit card. No spam. Progress saved automatically.
        </div>
      </div>
    </div>
  );
}
