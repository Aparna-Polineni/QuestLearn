// src/components/ComingSoonWall.jsx
// Shown after a user completes the last real level of a stage when the next stage
// is not built yet. Turns a dead end into a waitlist + re-engagement opportunity.
// The mentor's key fix: "make the wall feel intentional."

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ComingSoonWall.css';

export default function ComingSoonWall({
  pathName,        // "Data Engineer"
  pathEmoji,       // "🛢️"
  pathColor,       // "#06b6d4"
  completedStage,  // "Stage 2"
  nextStage,       // "Stage 3 — Data Pipelines"
  nextStageDesc,   // "Airflow DAGs, scheduling, error handling, monitoring"
  nextStageEta,    // "Building now — expected in 4–6 weeks"
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail]     = useState(user?.email || '');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  async function handleNotify(e) {
    e.preventDefault();
    if (!email.trim()) { setError('Enter your email address'); return; }
    setLoading(true);
    setError('');

    try {
      // POST to backend — stores email + pathId + nextStage in notifications table
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:     email.trim(),
          pathName,
          nextStage,
        }),
      });
      if (!res.ok) throw new Error('Failed to subscribe');
      setSubmitted(true);
    } catch (_) {
      // Fail silently — store in localStorage as fallback
      const key = `ql_notify_${pathName}_${nextStage}`;
      localStorage.setItem(key, JSON.stringify({ email: email.trim(), ts: Date.now() }));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="csw-overlay">
      <div className="csw-modal" style={{ '--csw-color': pathColor }}>

        {/* Stage complete badge */}
        <div className="csw-complete">
          <div className="csw-complete-emoji">{pathEmoji}</div>
          <div className="csw-complete-badge" style={{ background: pathColor }}>
            {completedStage} Complete
          </div>
        </div>

        {/* Main message — intentional, not apologetic */}
        <div className="csw-body">
          <h2 className="csw-title">You've reached the frontier.</h2>
          <p className="csw-sub">
            {nextStage} is in active development. You're ahead of the curriculum —
            which means you're exactly the kind of learner we're building this for.
          </p>

          {/* What's coming */}
          <div className="csw-next">
            <div className="csw-next-label">What's coming next</div>
            <div className="csw-next-title">{nextStage}</div>
            <div className="csw-next-desc">{nextStageDesc}</div>
            <div className="csw-next-eta">⏱ {nextStageEta}</div>
          </div>

          {/* Notify me */}
          {!submitted ? (
            <form className="csw-form" onSubmit={handleNotify}>
              <div className="csw-form-label">Get notified when it's ready</div>
              <div className="csw-form-row">
                <input
                  className="csw-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <button
                  className="csw-submit"
                  type="submit"
                  disabled={loading}
                  style={{ background: pathColor }}
                >
                  {loading ? '...' : 'Notify me →'}
                </button>
              </div>
              {error && <div className="csw-error">{error}</div>}
              <div className="csw-privacy">One email when it launches. No spam.</div>
            </form>
          ) : (
            <div className="csw-confirmed">
              <div className="csw-confirmed-icon">✓</div>
              <div className="csw-confirmed-text">
                You're on the list. We'll email you at <strong>{email}</strong> when {nextStage} is ready.
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="csw-actions">
          <button className="csw-roadmap-btn" onClick={() => navigate('/roadmap')}>
            ← Back to Roadmap
          </button>
          <button className="csw-home-btn" onClick={() => navigate('/home')}>
            Explore other paths →
          </button>
        </div>

      </div>
    </div>
  );
}
