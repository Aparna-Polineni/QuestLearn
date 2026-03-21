// src/screens/LandingPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// ─── The 6-layer experience per role ─────────────────────────────────────────
// Layer 1: Scenario   — real, urgent, no jargon
// Layer 2: Question   — one MCQ, reason not recall
// Layer 3: Response   — explain the why, not just correct/wrong
// Layer 4: Confidence — "you didn't need prior knowledge"
// Layer 5: Identity   — "you might enjoy this if..."
// Layer 6: Choice     — explore this path OR try another role

const ROLES = [
  {
    id: 'de',
    emoji: '🛢️',
    name: 'Data Engineer',
    tagline: 'You make sure the right data reaches the right people.',
    pathId: 'data-engineer',
    color: '#06b6d4',
    // Layer 1
    scenario: {
      headline: 'Two patients with the same name got merged into one record.',
      detail: 'One of them is about to receive the wrong medication. The system has duplicate entries — and no one knows which one is correct. You are asked to fix it.',
      button: 'What would you check first?',
    },
    // Layer 2
    question: 'What is the first thing you check?',
    options: [
      { id:'A', text:'Delete one of the records randomly',           right:false },
      { id:'B', text:'Check timestamps and recent updates',          right:true  },
      { id:'C', text:'Ask the doctors which record is correct',      right:false },
      { id:'D', text:'Leave it for now and flag it for later',       right:false },
    ],
    // Layer 3
    correct_response: 'That\'s right. You looked for the most recent and reliable data instead of guessing. Data engineers solve problems like this every day — cleaning messy, conflicting data so systems can be trusted.',
    wrong_response: 'Not quite — but this is how most people think at first. The key is: don\'t guess or delete blindly. You need a reliable way to decide which data is correct. That\'s why checking timestamps matters.',
    // Layer 4
    confidence_headline: 'You just thought like a Data Engineer.',
    confidence_body: 'You didn\'t need prior knowledge — just logic and reasoning. This is exactly how real-world problems are approached in this role.',
    // Layer 5
    identity: ['Solving messy, real-world problems', 'Finding patterns in data', 'Working with logic and structure'],
  },
  {
    id: 'ml',
    emoji: '🤖',
    name: 'ML / AI Engineer',
    tagline: 'You teach computers to make decisions from patterns.',
    pathId: 'ml-ai-engineer',
    color: '#8b5cf6',
    scenario: {
      headline: 'Your fraud detection model worked fine yesterday. Today it flagged zero suspicious transactions.',
      detail: 'Fraud doesn\'t just stop overnight. Something broke — but the model shows no errors. The bank is exposed right now and nobody knows why.',
      button: 'What would you investigate first?',
    },
    question: 'What is the most likely cause of the model going silent?',
    options: [
      { id:'A', text:'The model needs to be retrained on newer data',          right:false },
      { id:'B', text:'The data feeding the model changed format without warning', right:true  },
      { id:'C', text:'Fraud genuinely stopped overnight',                      right:false },
      { id:'D', text:'The server is running too slowly',                        right:false },
    ],
    correct_response: 'Exactly right. When a model suddenly goes silent, look at the inputs first — not the model itself. A pipeline change upstream broke the data format the model expects. ML engineers spend more time diagnosing data than tuning algorithms.',
    wrong_response: 'Close — but the model itself is usually fine. When output changes dramatically overnight, the cause is almost always the data feeding into it. A format change upstream can make a perfect model produce nothing.',
    confidence_headline: 'You just thought like an ML Engineer.',
    confidence_body: 'You didn\'t need to know machine learning — you used logical elimination. That diagnostic instinct is exactly what this role requires every day.',
    identity: ['Figuring out why something that should work doesn\'t', 'Thinking in systems and cause-and-effect', 'Working at the edge of what computers can do'],
  },
  {
    id: 'cy',
    emoji: '🔐',
    name: 'Cyber Security Analyst',
    tagline: 'You find the holes before the attackers do.',
    pathId: 'cyber-security',
    color: '#10b981',
    scenario: {
      headline: 'A nurse\'s account just logged in at 3am from Romania.',
      detail: 'She is asleep in Manchester. Her password was leaked in a breach six months ago — but nobody noticed. Someone has been reading patient records ever since.',
      button: 'What do you do first?',
    },
    question: 'What is your immediate first action?',
    options: [
      { id:'A', text:'Email the nurse and ask if she recognises the login',        right:false },
      { id:'B', text:'Disable the account immediately, then investigate',          right:true  },
      { id:'C', text:'Change the password and monitor for 24 hours',              right:false },
      { id:'D', text:'Wait to gather more evidence before taking action',          right:false },
    ],
    correct_response: 'Right. Stop the bleeding first, ask questions second. Disabling the account cuts off the attacker instantly. Investigation comes after containment — not before. Security analysts call this "contain first, understand later".',
    wrong_response: 'Not quite. Every second of delay gives the attacker more time inside. When a breach is confirmed, containment comes before everything — including investigation. Disable first, then trace what happened.',
    confidence_headline: 'You just thought like a Cyber Security Analyst.',
    confidence_body: 'You didn\'t need technical knowledge — you prioritised correctly under pressure. That instinct to act decisively is what separates good analysts from great ones.',
    identity: ['Thinking like an attacker to defend systems', 'Staying calm when something is actively going wrong', 'Protecting things that really matter'],
  },
  {
    id: 'ux',
    emoji: '🎨',
    name: 'UX / UI Designer',
    tagline: 'You make products feel effortless to use.',
    pathId: 'ux-ui-designer',
    color: '#ec4899',
    scenario: {
      headline: 'Maria, 58, has tried to book her mother\'s appointment four times. She keeps giving up.',
      detail: 'The form has a required mobile number field — but it looks optional. She presses Submit. Nothing happens. No error message. She doesn\'t know why it\'s failing. This happens 200 times a day.',
      button: 'What would you do first?',
    },
    question: 'What is the first thing you do to fix this?',
    options: [
      { id:'A', text:'Make the Submit button bigger and change it to red',               right:false },
      { id:'B', text:'Watch five people like Maria attempt the form without helping them', right:true  },
      { id:'C', text:'Add a long explanation paragraph above the form',                  right:false },
      { id:'D', text:'Remove the mobile number field entirely',                          right:false },
    ],
    correct_response: 'Exactly right. Any change without watching users first is a guess. Observing five real people reveals the exact moment they get stuck — which is almost always a surprise. This is usability testing and it is the foundation of UX design.',
    wrong_response: 'Not quite. Making changes without evidence is designing in the dark. Watching five real users attempt the form will show you precisely where they stop — and it is almost never where the team assumed.',
    confidence_headline: 'You just thought like a UX Designer.',
    confidence_body: 'You chose observation over assumption. That single instinct — understand before you change — is the foundation of every great product ever made.',
    identity: ['Noticing when something feels harder than it should', 'Understanding people, not just systems', 'Making the complex feel simple'],
  },
];

const ALL_PATHS = [
  { id:'data-engineer',  emoji:'🛢️', title:'Data Engineer',      color:'#06b6d4', levels:84  },
  { id:'ml-ai-engineer', emoji:'🤖', title:'ML / AI Engineer',   color:'#8b5cf6', levels:112 },
  { id:'cyber-security', emoji:'🔐', title:'Cyber Security',     color:'#10b981', levels:84  },
  { id:'ux-ui-designer', emoji:'🎨', title:'UX / UI Designer',   color:'#ec4899', levels:70  },
  { id:'java-fullstack', emoji:'☕', title:'Java Full Stack Dev', color:'#f97316', levels:139 },
  { id:'frontend-react', emoji:'⚛️', title:'Frontend Developer', color:'#38bdf8', levels:89  },
];

// ─── The 6-layer experience component ────────────────────────────────────────
function RoleExperience({ role, onStartPath, onTryAnother }) {
  // phase: scenario → question → response → confidence → choice
  const [phase, setPhase]   = useState('scenario');
  const [picked, setPicked] = useState(null);

  function choose(opt) {
    if (picked) return;
    setPicked(opt);
    // Advance to confidence after a pause whether right or wrong
    // Wrong answers show response, user can retry or advance
    if (opt.right) {
      setTimeout(() => setPhase('confidence'), 1600);
    }
  }

  function retry() {
    setPicked(null);
    setPhase('question');
  }

  return (
    <div className="rx" style={{ '--rc': role.color }}>

      {/* ── LAYER 1: SCENARIO ── */}
      {phase === 'scenario' && (
        <div className="rx-phase rx-scenario" style={{ animation: 'fadeUp .35s ease' }}>
          <div className="rx-urgency-bar" />
          <h3 className="rx-scenario-headline">{role.scenario.headline}</h3>
          <p className="rx-scenario-detail">{role.scenario.detail}</p>
          <button className="rx-scenario-btn" onClick={() => setPhase('question')}>
            {role.scenario.button}
          </button>
        </div>
      )}

      {/* ── LAYER 2 + 3: QUESTION + RESPONSE ── */}
      {(phase === 'question' || phase === 'response') && (
        <div className="rx-phase rx-question" style={{ animation: 'fadeUp .35s ease' }}>
          <div className="rx-q-label">
            <span className="rx-tag">{role.emoji} {role.name}</span>
            <span className="rx-tag rx-tag--lt">One question</span>
          </div>
          <p className="rx-q-text">{role.question}</p>

          <div className="rx-opts">
            {role.options.map(o => (
              <button
                key={o.id}
                disabled={!!picked}
                onClick={() => choose(o)}
                className={`rx-opt
                  ${picked?.id === o.id && o.right  ? 'rx-opt--right' : ''}
                  ${picked?.id === o.id && !o.right ? 'rx-opt--wrong' : ''}
                  ${picked && picked.id !== o.id    ? 'rx-opt--faded' : ''}
                `}
              >
                <span className="rx-opt-ltr">{o.id}</span>
                <span className="rx-opt-txt">{o.text}</span>
              </button>
            ))}
          </div>

          {picked && (
            <div className={`rx-response ${picked.right ? 'rx-response--right' : 'rx-response--wrong'}`}
              style={{ animation: 'fadeUp .3s ease' }}>
              <div className="rx-response-icon">{picked.right ? '✓' : '→'}</div>
              <p className="rx-response-text">
                {picked.right ? role.correct_response : role.wrong_response}
              </p>
              {!picked.right && (
                <button className="rx-retry" onClick={retry}>Try again →</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── LAYER 4 + 5 + 6: CONFIDENCE + IDENTITY + CHOICE ── */}
      {phase === 'confidence' && (
        <div className="rx-phase rx-confidence" style={{ animation: 'fadeUp .4s ease' }}>

          {/* Layer 4: Confidence */}
          <div className="rx-conf-check">✓</div>
          <h3 className="rx-conf-headline">{role.confidence_headline}</h3>
          <p className="rx-conf-body">{role.confidence_body}</p>

          <div className="rx-conf-divider" />

          {/* Layer 5: Identity */}
          <p className="rx-identity-label">You might enjoy this if you like:</p>
          <ul className="rx-identity-list">
            {role.identity.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <p className="rx-discovery-note">
            Most people only discover this after months of learning.<br />
            You just experienced it in under a minute.
          </p>

          {/* Layer 6: Choice */}
          <div className="rx-choice">
            <button className="rx-choice-primary" onClick={() => onStartPath(role.pathId)}>
              Explore {role.name} path →
            </button>
            <button className="rx-choice-secondary" onClick={onTryAnother}>
              Try another role
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [active, setActive]     = useState(ROLES[0]);
  const [expKey, setExpKey]     = useState(0);   // force remount on role change
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function selectRole(r) {
    setActive(r);
    setExpKey(k => k + 1);  // remounts RoleExperience — clean state
  }

  function handleStartPath(pathId) {
    navigate(`/auth?next=/path/${pathId}/stage/1/level/0`);
  }

  function handleTryAnother() {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="landing">

      {/* NAV */}
      <nav className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`}>
        <div className="landing-nav-logo">◈ QuestLearn</div>
        <div className="landing-nav-actions">
          <button className="landing-nav-link" onClick={() => navigate('/auth')}>Sign in</button>
          <button className="landing-nav-cta"  onClick={() => navigate('/auth?mode=signup')}>Get started free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="hero-orb hero-orb--a" />
        <div className="hero-orb hero-orb--b" />
        <div className="hero-orb hero-orb--c" />
        <div className="hero-eyebrow">Free to try · No account needed · Under a minute</div>
        <h1 className="hero-headline">
          <span className="hero-hl--before">"I don't know<br />where to start"</span>
          <span className="hero-arrow">→</span>
          <span className="hero-hl--after">"I've already<br />started."</span>
        </h1>
        <p className="hero-sub">
          Don't read about tech careers.<br />
          Experience what each one actually feels like — then choose the one that clicks.
        </p>
        <button className="hero-btn-primary"
          onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>
          See what these jobs feel like →
        </button>
      </section>

      {/* EXPLORE + EXPERIENCE */}
      <section className="exp-section" id="explore">
        <div className="exp-wrap">

          {/* Role tabs */}
          <div className="exp-tabs">
            <p className="exp-tabs-label">Choose a role to experience</p>
            {ROLES.map(r => (
              <button key={r.id}
                className={`exp-tab ${active.id === r.id ? 'exp-tab--on' : ''}`}
                style={{ '--rc': r.color }}
                onClick={() => selectRole(r)}>
                <span className="exp-tab-emoji">{r.emoji}</span>
                <span className="exp-tab-name">{r.name}</span>
              </button>
            ))}
            <p className="exp-tabs-hint">Each role takes under 60 seconds</p>
          </div>

          {/* Experience panel */}
          <div className="exp-panel">
            <div className="exp-panel-header" style={{ '--rc': active.color }}>
              <span className="exp-panel-emoji">{active.emoji}</span>
              <div>
                <div className="exp-panel-name">{active.name}</div>
                <div className="exp-panel-tagline">{active.tagline}</div>
              </div>
            </div>

            <RoleExperience
              key={expKey}
              role={active}
              onStartPath={handleStartPath}
              onTryAnother={handleTryAnother}
            />
          </div>

        </div>
      </section>

      {/* ALL PATHS */}
      <section className="choose-section" id="choose">
        <div className="choose-wrap">
          <div className="choose-eyebrow">All paths</div>
          <h2 className="choose-title">Every path. Zero to job-ready.</h2>
          <p className="choose-sub">Pick any path and start for free. You can explore all of them.</p>

          <div className="choose-grid">
            {ALL_PATHS.map(p => (
              <button key={p.id}
                className="choose-card"
                style={{ '--pc': p.color }}
                onClick={() => navigate(`/auth?next=/path/${p.id}/stage/1/level/0`)}>
                <div className="choose-card-body">
                  <span className="choose-card-emoji">{p.emoji}</span>
                  <div>
                    <div className="choose-card-name">{p.title}</div>
                    <div className="choose-card-levels">{p.levels} levels</div>
                  </div>
                </div>
                <div className="choose-card-cta">Start free →</div>
              </button>
            ))}
          </div>
          <p className="choose-note">Free to start. Progress saves when you create an account — 30 seconds.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-wrap">
          <h2 className="how-title">How QuestLearn works</h2>
          <div className="how-grid">
            {[
              { n:'1', icon:'🎯', t:'Pick a path',         b:'Choose a career. Each path goes from zero to job-ready.' },
              { n:'2', icon:'⚡', t:'Do real work',         b:'Every level is active — write code, solve problems, make decisions. No passive watching.' },
              { n:'3', icon:'🔓', t:'Unlock stages',        b:'Complete levels to unlock the next stage. You stay in flow.' },
              { n:'4', icon:'🏆', t:'Build your portfolio', b:'Every capstone level produces a real deliverable for employers.' },
            ].map(s => (
              <div className="how-card" key={s.n}>
                <div className="how-num">{s.n}</div>
                <div className="how-icon">{s.icon}</div>
                <h3 className="how-card-title">{s.t}</h3>
                <p className="how-card-body">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="cta-orb cta-orb--a" />
        <div className="cta-orb cta-orb--b" />
        <h2 className="final-cta-title">The career switch starts with one level.</h2>
        <p className="final-cta-sub">You just experienced one. 200+ more are waiting.</p>
        <button className="final-cta-btn" onClick={() => navigate('/auth?mode=signup')}>
          Create your free account →
        </button>
        <p className="final-cta-fine">No credit card. No commitment.</p>
      </section>

      {/* FOOTER */}
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