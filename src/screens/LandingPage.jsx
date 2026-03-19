// src/screens/LandingPage.jsx
// Marketing homepage — shown to unauthenticated visitors at /
// Headline: "From 'I don't know where to start' → to 'I've already started.'"
// Two user type cards: Career Switcher / Fresher
// Embedded sample level → then funnels to /auth

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// ─── Embedded Sample Level ────────────────────────────────────────────────────
// A real interactive level, no auth required
// Teaches: what a data engineer does, 3 fill-in-the-blanks

const SAMPLE_BLANKS = [
  { id:'B1', answer:'Extract',   hint:'Pull raw data from the source system' },
  { id:'B2', answer:'Transform', hint:'Clean, validate, reshape the data' },
  { id:'B3', answer:'Load',      hint:'Write processed data to the destination' },
];

const SAMPLE_LINES = [
  { type:'comment', text:'# A data engineer builds pipelines.' },
  { type:'comment', text:'# Every pipeline has 3 steps — fill them in:' },
  { type:'blank',   pre:'step_1 = "', bid:'B1', post:'"   # pull from source' },
  { type:'blank',   pre:'step_2 = "', bid:'B2', post:'"   # clean & reshape' },
  { type:'blank',   pre:'step_3 = "', bid:'B3', post:'"   # write to warehouse' },
];

function SampleLevel({ onComplete }) {
  const [vals, setVals]     = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});
  const [allRight, setAllRight] = useState(false);

  function check() {
    const r = {};
    SAMPLE_BLANKS.forEach(b => {
      r[b.id] = (vals[b.id] || '').trim().toLowerCase() === b.answer.toLowerCase();
    });
    setCorrect(r);
    setChecked(true);
    if (SAMPLE_BLANKS.every(b => r[b.id])) {
      setAllRight(true);
      setTimeout(onComplete, 1200);
    }
  }

  return (
    <div className="sample-level">
      <div className="sample-header">
        <span className="sample-badge">🛢️ Data Engineer</span>
        <span className="sample-badge sample-badge--mode">FILL</span>
        <span className="sample-level-title">What is a pipeline?</span>
      </div>

      <div className="sample-code">
        {SAMPLE_LINES.map((line, i) => {
          if (line.type === 'comment') {
            return <div key={i} className="sample-line sample-comment">{line.text}</div>;
          }
          const bl = SAMPLE_BLANKS.find(b => b.id === line.bid);
          const st = !checked ? '' : correct[line.bid] ? 'correct' : 'incorrect';
          return (
            <div key={i} className="sample-line">
              <span className="sample-code-text">{line.pre}</span>
              <input
                className={`sample-blank ${st}`}
                value={vals[line.bid] || ''}
                onChange={e => setVals(v => ({ ...v, [line.bid]: e.target.value }))}
                placeholder={bl?.hint}
                spellCheck={false}
              />
              <span className="sample-code-text">{line.post}</span>
            </div>
          );
        })}
      </div>

      {!allRight ? (
        <button className="sample-check-btn" onClick={check}>
          Check Answers →
        </button>
      ) : (
        <div className="sample-success">
          ✅ Exactly right. That's what data engineers do — all day, at scale.
        </div>
      )}

      {checked && !allRight && (
        <p className="sample-hint-text">
          {SAMPLE_BLANKS.filter(b => !correct[b.id]).map(b => `"${b.answer}"`).join(', ')} — try again
        </p>
      )}
    </div>
  );
}

// ─── User Type Cards ──────────────────────────────────────────────────────────

function UserTypeCard({ type, icon, headline, sub, bullets, cta, color, onSelect, selected }) {
  return (
    <button
      className={`usertype-card ${selected ? 'usertype-card--selected' : ''}`}
      style={{ '--card-color': color }}
      onClick={onSelect}
    >
      <div className="usertype-icon">{icon}</div>
      <div className="usertype-label">{type}</div>
      <h3 className="usertype-headline">{headline}</h3>
      <p className="usertype-sub">{sub}</p>
      <ul className="usertype-bullets">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <div className="usertype-cta">{selected ? '✓ This is me' : cta}</div>
    </button>
  );
}

// ─── Path Pills ───────────────────────────────────────────────────────────────
const PATHS = [
  { id:'data-engineer',  emoji:'🛢️', title:'Data Engineer',        color:'#06b6d4' },
  { id:'ml-ai-engineer', emoji:'🤖', title:'ML / AI Engineer',     color:'#8b5cf6' },
  { id:'cyber-security', emoji:'🔐', title:'Cyber Security',       color:'#10b981' },
  { id:'ux-ui-designer', emoji:'🎨', title:'UX / UI Designer',     color:'#ec4899' },
  { id:'java-fullstack', emoji:'☕', title:'Java Full Stack',       color:'#f97316' },
  { id:'frontend-react', emoji:'⚛️', title:'Frontend Developer',   color:'#38bdf8' },
];

// ─── Testimonial data ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name:'Priya M.', role:'Was: HR Manager → Now: Data Analyst (6 months)', quote:'I tried 3 Udemy courses and quit all of them. QuestLearn was the first time I actually understood what I was doing.' },
  { name:'Jordan K.', role:'Final year student, Computer Science', quote:'I knew I wanted tech but didn\'t know which direction. Tried the Cyber Security path in 20 minutes and knew immediately it was for me.' },
  { name:'Sam T.', role:'Was: Retail Manager → Now: Junior Developer (8 months)', quote:'The sample level was the thing that convinced me. It felt like real work — not watching someone else do it.' },
];

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [sampleDone, setSampleDone] = useState(false);
  const [userType, setUserType]     = useState(null); // 'switcher' | 'fresher'
  const [showPaths, setShowPaths]   = useState(false);
  const [activePath, setActivePath] = useState(null);
  const [scrolled, setScrolled]     = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  function handleUserType(type) {
    setUserType(type);
    setTimeout(() => {
      document.getElementById('try-it')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function handleSampleDone() {
    setSampleDone(true);
    setTimeout(() => {
      setShowPaths(true);
      document.getElementById('choose-path')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 800);
  }

  function handlePathSelect(pathId) {
    setActivePath(pathId);
    setTimeout(() => {
      navigate(`/auth?next=/path/${pathId}/stage/1/level/0`);
    }, 400);
  }

  const tm = TESTIMONIALS[testimonialIdx];

  return (
    <div className="landing">

      {/* ── Sticky nav ── */}
      <nav className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`}>
        <div className="landing-nav-logo">◈ QuestLearn</div>
        <div className="landing-nav-actions">
          <button className="landing-nav-link" onClick={() => navigate('/auth')}>Sign in</button>
          <button className="landing-nav-cta" onClick={() => navigate('/auth?mode=signup')}>Get started free →</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="hero-orb hero-orb--a" />
        <div className="hero-orb hero-orb--b" />
        <div className="hero-orb hero-orb--c" />

        <div className="hero-eyebrow">Free to try · No credit card · Starts in 2 minutes</div>

        <h1 className="hero-headline">
          From{' '}
          <span className="hero-hl hero-hl--before">"I don't know<br />where to start"</span>
          <span className="hero-arrow">→</span>
          <span className="hero-hl hero-hl--after">to "I've already<br />started."</span>
        </h1>

        <p className="hero-sub">
          Pick a career path. Do real work. Know if it's for you — in 20 minutes.
          <br />No theory, no videos, no waiting. Just you and the actual job.
        </p>

        <div className="hero-actions">
          <button className="hero-btn-primary" onClick={() => document.getElementById('who-are-you')?.scrollIntoView({ behavior:'smooth' })}>
            Try it free — no account needed
          </button>
          <button className="hero-btn-ghost" onClick={() => navigate('/auth')}>
            Sign in →
          </button>
        </div>

        <div className="hero-proof">
          <span className="hero-proof-dot" />
          <span>7 career paths · 200+ levels · completely free to start</span>
        </div>
      </section>

      {/* ── Testimonial ticker ── */}
      <section className="testimonial-strip">
        <div className="testimonial-card" key={testimonialIdx}>
          <div className="testimonial-quote">"{tm.quote}"</div>
          <div className="testimonial-who">
            <strong>{tm.name}</strong> — {tm.role}
          </div>
        </div>
      </section>

      {/* ── Who are you ── */}
      <section className="landing-section" id="who-are-you">
        <div className="section-eyebrow">Step 1 of 3</div>
        <h2 className="section-title">Who are you right now?</h2>
        <p className="section-sub">We'll show you what matters to you — not a generic pitch.</p>

        <div className="usertype-grid">
          <UserTypeCard
            type="Career Switcher"
            icon="🔄"
            headline="You're employed. You want out."
            sub="You've googled 'how to switch careers into tech' at midnight. You're scared of wasting 2 years on the wrong thing."
            bullets={[
              'You need to know it\'s worth it before you commit',
              'You want to see if you can actually do this',
              'You don\'t have time to take a 40-hour course to find out',
            ]}
            cta="This is me →"
            color="#818cf8"
            selected={userType === 'switcher'}
            onSelect={() => handleUserType('switcher')}
          />
          <UserTypeCard
            type="Starting Fresh"
            icon="🚀"
            headline="You're starting out. Everything looks overwhelming."
            sub="Everyone says 'learn Python' or 'do bootcamp'. You don't know what any of it actually means day-to-day."
            bullets={[
              'You need clarity — what does this job actually feel like?',
              'You want confidence before you tell anyone your plan',
              'You learn by doing, not by reading about doing',
            ]}
            cta="This is me →"
            color="#34d399"
            selected={userType === 'fresher'}
            onSelect={() => handleUserType('fresher')}
          />
        </div>
      </section>

      {/* ── Try it ── */}
      <section className="landing-section landing-section--dark" id="try-it">
        <div className="section-eyebrow">Step 2 of 3</div>
        <h2 className="section-title">
          {userType === 'switcher'
            ? 'Before you commit — try the actual job.'
            : 'Before you pick a path — try one level.'}
        </h2>
        <p className="section-sub">
          {userType === 'switcher'
            ? 'This is a real Data Engineer task. Not a quiz. Not a video. The actual thinking the job requires.'
            : 'This is what learning on QuestLearn feels like. Complete it, then choose your path.'}
        </p>

        {!sampleDone ? (
          <div className="sample-wrapper">
            <SampleLevel onComplete={handleSampleDone} />
            <p className="sample-nudge">
              💡 This is one level. There are 200+ more — across 7 career paths.
            </p>
          </div>
        ) : (
          <div className="sample-done-card">
            <div className="sample-done-icon">🎯</div>
            <h3 className="sample-done-title">You just did data engineering.</h3>
            <p className="sample-done-sub">
              {userType === 'switcher'
                ? 'That felt manageable, right? It gets deeper — but the feeling stays the same. Now pick your path.'
                : 'That\'s the whole platform in miniature. Every level builds on the last. Now pick your path.'}
            </p>
          </div>
        )}
      </section>

      {/* ── Choose path ── */}
      {showPaths && (
        <section className="landing-section" id="choose-path">
          <div className="section-eyebrow">Step 3 of 3</div>
          <h2 className="section-title">Which direction pulls you?</h2>
          <p className="section-sub">
            {userType === 'switcher'
              ? 'Each path is a complete curriculum — designed around what the job actually requires. Not what\'s trendy.'
              : 'Don\'t overthink it. Pick what sounds interesting. You can explore all of them.'}
          </p>

          <div className="path-grid">
            {PATHS.map(p => (
              <button
                key={p.id}
                className={`path-pill ${activePath === p.id ? 'path-pill--selected' : ''}`}
                style={{ '--pill-color': p.color }}
                onClick={() => handlePathSelect(p.id)}
              >
                <span className="pill-emoji">{p.emoji}</span>
                <span className="pill-title">{p.title}</span>
                <span className="pill-arrow">→</span>
              </button>
            ))}
          </div>

          <p className="path-nudge">
            Your progress is saved automatically once you create a free account.
            Takes 30 seconds.
          </p>
        </section>
      )}

      {/* ── How it works ── */}
      <section className="landing-section landing-section--dark">
        <h2 className="section-title">How QuestLearn works</h2>
        <div className="how-grid">
          {[
            { n:'1', icon:'🎯', title:'Pick a path', body:'Choose from 7 career paths. Each one is a complete curriculum — from total beginner to job-ready.' },
            { n:'2', icon:'⚡', title:'Do real work', body:'Every level is an active challenge — fill in code, debug broken programs, build real outputs. No passive watching.' },
            { n:'3', icon:'🔓', title:'Unlock stages', body:'Complete levels to unlock the next stage. Stages unlock at 80% — you stay in flow, never get stuck.' },
            { n:'4', icon:'🏆', title:'Build a portfolio', body:'Every capstone level produces a real deliverable. By Stage 7, you have portfolio projects ready to show.' },
          ].map(s => (
            <div className="how-card" key={s.n}>
              <div className="how-num">{s.n}</div>
              <div className="how-icon">{s.icon}</div>
              <h3 className="how-title">{s.title}</h3>
              <p className="how-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="landing-cta-section">
        <div className="cta-orb cta-orb--a" />
        <div className="cta-orb cta-orb--b" />
        <h2 className="cta-headline">
          The career switch starts with one level.
        </h2>
        <p className="cta-sub">
          You just did one. 200+ more are waiting.
        </p>
        <button className="cta-btn" onClick={() => navigate('/auth?mode=signup')}>
          Create your free account →
        </button>
        <p className="cta-fine">No credit card. No commitment. Cancel any time.</p>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="footer-logo">◈ QuestLearn</div>
        <div className="footer-links">
          <button onClick={() => navigate('/auth')}>Sign in</button>
          <button onClick={() => navigate('/auth?mode=signup')}>Get started</button>
        </div>
        <div className="footer-copy">Built for career switchers and fearless beginners.</div>
      </footer>
    </div>
  );
}