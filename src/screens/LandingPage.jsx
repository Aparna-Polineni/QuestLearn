// src/screens/LandingPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// ─── Job data ─────────────────────────────────────────────────────────────────

const JOBS = [
  {
    id: 'de', emoji: '🛢️', role: 'Data Engineer',
    tagline: 'You make sure the right data reaches the right people.',
    day: 'Two patients named James Okafor are in the system. One is 34, one is 67. The 67-year-old needs warfarin. The 34-year-old does not. The wrong record is attached to the wrong patient. A nurse is about to act on it.',
    task: 'You find the duplicate, trace which record is original using the timestamp, remove the copy, and link the correct record to the correct patient. Then you write a rule that flags future duplicates before they enter the system.',
    feeling: 'It feels like finding a landmine before anyone steps on it. The work is invisible when it goes right — and catastrophic when it goes wrong.',
    who: 'People who enjoy this tend to like patterns, systems, and the satisfaction of something running quietly in the background keeping everything clean.',
    tags: ['Structured thinking', 'Patterns & logic', 'Behind the scenes'],
    color: '#06b6d4', pathId: 'data-engineer',
  },
  {
    id: 'ml', emoji: '🤖', role: 'ML / AI Engineer',
    tagline: 'You teach computers to make decisions from patterns.',
    day: 'Your fraud model flagged 847 suspicious transactions yesterday. Today it flagged zero. Nothing changed in the real world. Your manager asks: did fraud stop — or did your model break?',
    task: 'You check the model inputs. A pipeline change overnight shifted one column format. The model cannot read it and defaults to safe. You fix the pipeline, restore the data, and add a monitoring alert so a silent failure like this never goes unnoticed again.',
    feeling: 'It feels like being a doctor for a system that cannot tell you what is wrong. You diagnose it from symptoms.',
    who: 'People who enjoy this tend to be comfortable with uncertainty and like figuring out why something that should work does not.',
    tags: ['Diagnostic thinking', 'Patterns in data', 'Systems that learn'],
    color: '#8b5cf6', pathId: 'ml-ai-engineer',
  },
  {
    id: 'cy', emoji: '🔐', role: 'Cyber Security Analyst',
    tagline: 'You find the holes before the attackers do.',
    day: "A nurse's account logs into the system at 3am from Romania. She is asleep in Manchester. Her credentials were in a data breach six months ago — her password was leaked. Nobody noticed. An attacker has been quietly reading patient records ever since.",
    task: 'You disable the account, trace every file accessed over six months, identify what data was exposed, notify the affected patients, patch the entry point, and write a detection rule that would have caught this on day one.',
    feeling: 'Finding the breach is a gut-drop moment. The investigation that follows — containing it, tracing it, preventing the next one — is methodical and deeply satisfying.',
    who: 'People who enjoy this tend to think adversarially — they naturally ask "how could someone break this?" before anyone else does.',
    tags: ['Adversarial thinking', 'Investigation', 'Prevention'],
    color: '#10b981', pathId: 'cyber-security',
  },
  {
    id: 'ux', emoji: '🎨', role: 'UX / UI Designer',
    tagline: 'You make products feel effortless to use.',
    day: "Maria, 58, is trying to book her mother's hospital appointment online. She has tried four times. She keeps pressing Submit and nothing happens. The mobile field looks optional but is required. She gives up and calls. This happens 200 times a day.",
    task: 'You watch five people like Maria attempt the form without helping them. All five stop at the same field. You move it to the top, mark it required, add one line of copy. Completion goes from 40% to 91%.',
    feeling: 'When a frustrated person becomes a confident one because you understood them, it feels quietly powerful. One word changed 200 phone calls into 200 completed bookings.',
    who: 'People who enjoy this tend to notice when something feels harder than it should — and feel genuinely bothered until they fix it.',
    tags: ['Human behaviour', 'Visual clarity', 'Empathy-driven'],
    color: '#ec4899', pathId: 'ux-ui-designer',
  },
];

// ─── Reflection responses ─────────────────────────────────────────────────────

const REFLECTIONS = {
  de: {
    yes:    "That instinct — finding order in messy data — is what data engineers use every day. The work is detail-oriented, systematic, and deeply satisfying when the numbers line up.",
    unsure: "That is a fair response. Data engineering is methodical by nature. If you like the idea of building things that work reliably in the background, it is worth exploring further.",
    no:     "Useful to know. Data engineering rewards patience and precision. If you found it dry, try a role with more investigation or more human interaction — Cyber Security or UX might suit you better.",
  },
  ml: {
    yes:    "That diagnostic instinct — figuring out why a system fails — is exactly what ML engineers need. The job is less about building models and more about understanding why they behave the way they do.",
    unsure: "Reasonable. ML engineering is ambiguous by nature — problems rarely have obvious answers. If you like the idea of solving puzzles with imperfect information, it gets more interesting the deeper you go.",
    no:     "Good to know. ML requires comfort with uncertainty and incomplete answers. If you prefer clearer cause-and-effect, Data Engineering or Cyber Security might feel more grounded.",
  },
  cy: {
    yes:    "That adversarial instinct — spotting the breach, tracing the attacker — is exactly the security mindset. The role rewards people who think about what could go wrong before anyone else does.",
    unsure: "A reasonable reaction. Security work swings between routine monitoring and high-stakes incidents. If the investigation side appeals more than the day-to-day monitoring, that is a useful signal.",
    no:     "That is helpful feedback. Cyber security requires a comfort with adversarial thinking and a lot of log analysis. If you preferred the human angle, UX might be a better fit.",
  },
  ux: {
    yes:    "That empathy — noticing what Maria experienced and caring enough to fix it — is the whole foundation of UX. The best designers are not artists. They are patient observers who trust what they see.",
    unsure: "A fair response. UX is deceptively deep — it starts with observation but grows into research, systems thinking, and visual design. Worth spending more time with before deciding.",
    no:     "Useful to know. UX rewards patience with people and their confusion. If you preferred the logic-driven or investigative roles, Data Engineering or Cyber Security might suit you better.",
  },
};

// ─── Task data ────────────────────────────────────────────────────────────────

const TASKS = {
  de: {
    q: 'Two records exist for the same patient with different medication doses. Record A was created at 14:32. Record B at 14:33. Which do you remove?',
    opts: [
      { id:'A', text:'Remove Record A — older records can be outdated', right:false },
      { id:'B', text:'Remove Record B — created one minute later, it is the duplicate', right:true },
      { id:'C', text:'Keep both and let the doctor decide', right:false },
      { id:'D', text:'Merge them into one combined record', right:false },
    ],
    good: 'Right. The earlier timestamp is the original. Data engineers call this deduplication — finding and removing copies while keeping the source record.',
    miss: 'The earlier timestamp is the original. Record B was created 60 seconds later — a sign of a system glitch or double-entry. The first record is almost always the source of truth.',
    micro_q: 'The duplicate is removed. What prevents this from happening again?',
    micro_opts: [
      { id:'A', text:'Check the database manually every morning', right:false },
      { id:'B', text:'Write a validation rule that rejects any new record matching an existing patient ID and timestamp', right:true },
      { id:'C', text:'Train the team to be more careful when entering data', right:false },
    ],
    micro_good: 'Exactly. A manual check is a patch. A validation rule is engineering — it prevents the problem automatically, at scale, without anyone needing to remember to do it.',
    micro_miss: 'Manual processes fail. The engineering answer is a rule that runs automatically — one that makes the problem structurally impossible rather than relying on human care.',
    confidence: 'You just thought like a Data Engineer.',
    confidence_sub: 'You identified the source record, removed the duplicate, then thought about prevention — not just the fix. That forward-thinking is what separates data engineers from data entry.',
  },
  ml: {
    q: 'Your model flagged 847 fraud cases yesterday and zero today. The real world has not changed. What is the most likely cause?',
    opts: [
      { id:'A', text:'Fraud genuinely stopped overnight', right:false },
      { id:'B', text:'Something in the data pipeline changed and the model cannot read its inputs correctly', right:true },
      { id:'C', text:'The model needs retraining on newer data', right:false },
      { id:'D', text:'The server is running slowly', right:false },
    ],
    good: 'Correct. When output drops sharply overnight, the inputs changed — not the model. A pipeline shift, a format change, a missing column. The model is not broken. It just cannot see what it needs.',
    miss: 'When a model goes silent overnight, look at the inputs first. A pipeline change upstream is the most common cause. The model itself is almost never the problem.',
    micro_q: 'What prevents this silent failure from going unnoticed again?',
    micro_opts: [
      { id:'A', text:'Retrain the model more frequently', right:false },
      { id:'B', text:'Add a monitoring alert that fires when daily flag count drops below a threshold', right:true },
      { id:'C', text:'Have the team check the model output manually each morning', right:false },
    ],
    micro_good: 'Right. A threshold alert catches the anomaly the moment it happens — not the next morning when someone notices. MLOps is largely about this: making failures visible before they cause damage.',
    micro_miss: 'Retraining does not help here — the model was fine. An automated alert on output volume would have caught this within hours. Monitoring is as important as the model itself.',
    confidence: 'You just thought like an ML Engineer.',
    confidence_sub: 'You diagnosed a system failure from symptoms, identified the cause without seeing the code, then built in prevention. That is the diagnostic loop ML engineers run every day.',
  },
  cy: {
    q: 'An account logs in at 3am from Romania. The account belongs to a day-shift nurse in Manchester. What is almost certainly happening?',
    opts: [
      { id:'A', text:'The nurse is travelling and forgot to use a VPN', right:false },
      { id:'B', text:'The credentials were stolen — someone else is logged in', right:true },
      { id:'C', text:'The location data is a system error', right:false },
      { id:'D', text:'A colleague is using her account with permission', right:false },
    ],
    good: "Right. Impossible geography plus unusual hours equals compromised credentials. Security analysts call the gap between initial access and discovery the dwell time — here it was six months.",
    miss: "3am, foreign country, day-shift nurse — the combination is not explainable by travel or bugs. Stolen credentials is the correct assumption until proven otherwise.",
    micro_q: 'What would have caught this breach on day one?',
    micro_opts: [
      { id:'A', text:'A stronger password policy', right:false },
      { id:'B', text:'An alert that fires whenever a login comes from a country the user has never logged in from before', right:true },
      { id:'C', text:'Regular security awareness training for staff', right:false },
    ],
    micro_good: 'Exactly. A geo-anomaly alert would have fired on the first login from Romania and flagged it for review immediately — stopping six months of undetected access at day one.',
    micro_miss: 'Password strength does not help once credentials are stolen. The detection mechanism — an alert on anomalous login location — is what catches the attacker after the credentials are compromised.',
    confidence: 'You just thought like a Cyber Security Analyst.',
    confidence_sub: 'You read the attack pattern correctly, then asked the right prevention question. No technical background was needed — just the instinct to ask "how do we stop this from happening again?"',
  },
  ux: {
    q: 'Maria keeps pressing Submit and nothing happens. The mobile field is required but looks optional. What is your first move?',
    opts: [
      { id:'A', text:'Make the Submit button bigger and change it to red', right:false },
      { id:'B', text:'Watch five people like Maria try to complete the form without helping them', right:true },
      { id:'C', text:'Add explanatory text to every field', right:false },
      { id:'D', text:'Remove the mobile number field entirely', right:false },
    ],
    good: 'Right. Any change without watching users first is a guess. Five observations reveal exactly where people stop — which is almost always a surprise to the team who built it.',
    miss: 'Design changes without evidence are guesses. Five observations will show you the exact moment Maria gets stuck — which is almost always different from where the team assumed the problem was.',
    micro_q: 'You watched five users. All five stopped at the mobile field. What prevents this from happening again?',
    micro_opts: [
      { id:'A', text:'Add a long paragraph explaining why the mobile number is needed', right:false },
      { id:'B', text:'Mark the field as required, move it higher, and add one line: "We use this to send your confirmation"', right:true },
      { id:'C', text:'Make the field flash red when Submit is pressed without it filled in', right:false },
    ],
    micro_good: 'Exactly. One clear label, placed early, with a reason. No paragraph. No flashing. The best UX changes are invisible — users just stop getting stuck without knowing why.',
    micro_miss: 'More text adds more to read, which most users skip. A single clear label at the right moment — with a reason — is what actually changes behaviour.',
    confidence: 'You just thought like a UX Designer.',
    confidence_sub: 'You chose observation over assumption, then made the smallest change that solved the real problem. That two-step discipline is the whole practice of UX.',
  },
};

// ─── Path grid data ───────────────────────────────────────────────────────────

const ALL_PATHS = [
  { id:'data-engineer',  emoji:'🛢️', title:'Data Engineer',      color:'#06b6d4', levels:84  },
  { id:'ml-ai-engineer', emoji:'🤖', title:'ML / AI Engineer',   color:'#8b5cf6', levels:112 },
  { id:'cyber-security', emoji:'🔐', title:'Cyber Security',     color:'#10b981', levels:84  },
  { id:'ux-ui-designer', emoji:'🎨', title:'UX / UI Designer',   color:'#ec4899', levels:70  },
  { id:'java-fullstack', emoji:'☕', title:'Java Full Stack Dev', color:'#f97316', levels:139 },
  { id:'frontend-react', emoji:'⚛️', title:'Frontend Developer', color:'#38bdf8', levels:89  },
];

const STEP_LABELS = {
  q1:         { n:'Step 1 of 2', label:'Understand the problem' },
  q2:         { n:'Step 2 of 2', label:'Think like the role' },
  confidence: { n:'',           label:'' },
  reflection: { n:'',           label:'' },
};

// ─── TryIt widget ─────────────────────────────────────────────────────────────

function TryIt({ job, onDone, onCompare }) {
  const t  = TASKS[job.id];
  const rf = REFLECTIONS[job.id];
  const [step, setStep]       = useState('q1');
  const [pick1, setPick1]     = useState(null);
  const [pick2, setPick2]     = useState(null);
  const [feeling, setFeeling] = useState(null);  // yes | unsure | no

  function chooseQ1(opt) {
    if (pick1) return;
    setPick1(opt);
    if (opt.right) setTimeout(() => setStep('q2'), 1200);
  }

  function chooseQ2(opt) {
    if (pick2) return;
    setPick2(opt);
    if (opt.right) setTimeout(() => setStep('confidence'), 1200);
  }

  function chooseFeeling(f) {
    setFeeling(f);
  }

  const stepInfo = STEP_LABELS[step];

  return (
    <div className="tryit" style={{'--jc': job.color}}>

      {/* Progress bar */}
      {(step === 'q1' || step === 'q2') && (
        <div className="tryit-progress">
          <div className="tryit-progress-bar">
            <div className="tryit-progress-fill" style={{width: step === 'q1' ? '50%' : '100%'}} />
          </div>
          <div className="tryit-progress-label">
            {step === 'q1'
              ? <span>Step 1 of 2 — <span>Understand the problem</span></span>
              : <span>Step 2 of 2 — <span>Think like the {job.role}</span></span>
            }
          </div>
        </div>
      )}

      {/* Q1 */}
      {step === 'q1' && (
        <div className="tryit-block">
          <p className="tryit-q">{t.q}</p>
          <div className="tryit-opts">
            {t.opts.map(o => (
              <button key={o.id} disabled={!!pick1} onClick={() => chooseQ1(o)}
                className={`tryit-opt ${pick1?.id===o.id && o.right ? 'opt--right':''} ${pick1?.id===o.id && !o.right ? 'opt--wrong':''} ${pick1 && pick1.id!==o.id ? 'opt--faded':''}`}>
                <span className="opt-ltr">{o.id}</span>
                <span className="opt-txt">{o.text}</span>
              </button>
            ))}
          </div>
          {pick1 && (
            <div className={`tryit-explain ${pick1.right ? 'exp--good':'exp--miss'}`}>
              {pick1.right ? t.good : <>{t.miss}<button className="tryit-retry" onClick={()=>setPick1(null)}>Try again →</button></>}
            </div>
          )}
          {pick1?.right && <p className="tryit-next-hint">One more question →</p>}
        </div>
      )}

      {/* Q2 */}
      {step === 'q2' && (
        <div className="tryit-block" style={{animation:'fadeUp .35s ease'}}>
          <p className="tryit-q">{t.micro_q}</p>
          <div className="tryit-opts">
            {t.micro_opts.map(o => (
              <button key={o.id} disabled={!!pick2} onClick={() => chooseQ2(o)}
                className={`tryit-opt ${pick2?.id===o.id && o.right ? 'opt--right':''} ${pick2?.id===o.id && !o.right ? 'opt--wrong':''} ${pick2 && pick2.id!==o.id ? 'opt--faded':''}`}>
                <span className="opt-ltr">{o.id}</span>
                <span className="opt-txt">{o.text}</span>
              </button>
            ))}
          </div>
          {pick2 && (
            <div className={`tryit-explain ${pick2.right ? 'exp--good':'exp--miss'}`}>
              {pick2.right ? t.micro_good : <>{t.micro_miss}<button className="tryit-retry" onClick={()=>setPick2(null)}>Try again →</button></>}
            </div>
          )}
        </div>
      )}

      {/* Confidence */}
      {step === 'confidence' && (
        <div className="confidence-block" style={{animation:'fadeUp .4s ease', '--jc': job.color}}>
          <div className="conf-check">✓</div>
          <h3 className="conf-title">{t.confidence}</h3>
          <p className="conf-sub">{t.confidence_sub}</p>
          <button className="conf-reflect-btn" onClick={() => setStep('reflection')}>
            One quick question →
          </button>
        </div>
      )}

      {/* Reflection */}
      {step === 'reflection' && (
        <div className="reflection-block" style={{animation:'fadeUp .4s ease', '--jc': job.color}}>
          <p className="refl-q">Did you enjoy solving this kind of problem?</p>

          {!feeling && (
            <div className="refl-btns">
              <button className="refl-btn refl-yes"   onClick={() => chooseFeeling('yes')}>
                <span>✨</span> Yes, I liked this
              </button>
              <button className="refl-btn refl-unsure" onClick={() => chooseFeeling('unsure')}>
                <span>🤔</span> Not sure
              </button>
              <button className="refl-btn refl-no"    onClick={() => chooseFeeling('no')}>
                <span>🔄</span> Not really
              </button>
            </div>
          )}

          {feeling && (
            <div className="refl-response" style={{animation:'fadeUp .3s ease'}}>
              <p className="refl-text">{rf[feeling]}</p>
              <div className="refl-actions">
                <button className="conf-primary" style={{background: job.color}} onClick={onDone}>
                  Start {job.role} path →
                </button>
                <button className="conf-secondary" onClick={onCompare}>
                  Compare with another role
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// ─── Comparison panel ─────────────────────────────────────────────────────────

function ComparisonPanel({ jobs }) {
  if (jobs.length < 2) return null;
  return (
    <div className="compare-panel">
      <div className="compare-header">
        You have explored {jobs.length} roles — here is how they compare:
      </div>
      <div className="compare-grid">
        {jobs.map(j => (
          <div key={j.id} className="compare-card" style={{'--jc': j.color}}>
            <div className="compare-card-top">
              <span className="compare-emoji">{j.emoji}</span>
              <span className="compare-role">{j.role}</span>
            </div>
            <div className="compare-tags">
              {j.tags.map(tag => (
                <span key={tag} className="compare-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="compare-hint">
        Which set of traits sounds more like you?
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();
  const [active, setActive]           = useState(JOBS[0]);
  const [phase, setPhase]             = useState('browse');
  const [scrolled, setScrolled]       = useState(false);
  const [completedJobs, setCompleted] = useState([]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function selectJob(j) {
    setActive(j);
    setPhase('browse');
  }

  function handleDone() {
    // Add to completed if not already there
    setCompleted(prev =>
      prev.find(j => j.id === active.id) ? prev : [...prev, active]
    );
    setPhase('done');
    setTimeout(() =>
      document.getElementById('choose')?.scrollIntoView({ behavior:'smooth', block:'start' })
    , 300);
  }

  function handleCompare() {
    // Add current to completed, reset to browse, scroll to explore
    setCompleted(prev =>
      prev.find(j => j.id === active.id) ? prev : [...prev, active]
    );
    setPhase('browse');
    document.getElementById('explore')?.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  function startPath(id) {
    navigate(`/auth?next=/path/${id}/stage/1/level/0`);
  }

  return (
    <div className="landing">

      {/* NAV */}
      <nav className={`landing-nav ${scrolled ? 'landing-nav--scrolled':''}`}>
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
        <div className="hero-eyebrow">Free to try · No account needed · 2 minutes to start</div>
        <h1 className="hero-headline">
          <span className="hero-hl--before">"I don't know<br />where to start"</span>
          <span className="hero-arrow">→</span>
          <span className="hero-hl--after">"I've already<br />started."</span>
        </h1>
        <p className="hero-sub">
          Don't read about tech careers. Experience what each one actually feels like — then choose the one that clicks.
        </p>
        <button className="hero-btn-primary"
          onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior:'smooth' })}>
          See what these jobs actually do →
        </button>
      </section>

      {/* EXPLORE */}
      <section className="exp-section" id="explore">
        <div className="exp-wrap">

          <div className="exp-tabs">
            <p className="exp-tabs-label">Pick a role to explore</p>
            {JOBS.map(j => (
              <button key={j.id}
                className={`exp-tab ${active.id===j.id ? 'exp-tab--on':''} ${completedJobs.find(c=>c.id===j.id) ? 'exp-tab--done':''}`}
                style={{'--jc': j.color}}
                onClick={() => selectJob(j)}>
                <span>{j.emoji}</span>
                <span>{j.role}</span>
                {completedJobs.find(c => c.id === j.id) && <span className="tab-check">✓</span>}
              </button>
            ))}
            <p className="exp-tabs-hint">Click any role to see a real day in that job</p>
          </div>

          <div className="exp-panel">
            <div className="exp-panel-role" style={{'--jc': active.color}}>
              <span className="exp-role-emoji">{active.emoji}</span>
              <div>
                <div className="exp-role-name">{active.role}</div>
                <div className="exp-role-tag">{active.tagline}</div>
              </div>
            </div>

            <div className="exp-block">
              <div className="exp-block-hdr">🌍 A real situation this role deals with</div>
              <p className="exp-block-txt">{active.day}</p>
            </div>

            <div className="exp-block exp-block--hi" style={{'--jc': active.color}}>
              <div className="exp-block-hdr">⚡ What you actually do</div>
              <p className="exp-block-txt">{active.task}</p>
            </div>

            <div className="exp-block exp-block--feel">
              <div className="exp-block-hdr">💬 What it feels like</div>
              <p className="exp-block-txt exp-block-txt--em">{active.feeling}</p>
              <p className="exp-block-who">{active.who}</p>
            </div>

            {phase === 'browse' && (
              <button className="exp-try-btn" style={{background: active.color}}
                onClick={() => setPhase('tryit')}>
                Think like a {active.role}
                <span className="exp-try-btn-arrow">→</span>
              </button>
            )}

            {phase === 'tryit' && (
              <TryIt key={active.id} job={active} onDone={handleDone} onCompare={handleCompare} />
            )}

            {phase === 'done' && (
              <div className="exp-done">
                ✓ Path matched. Scroll down to start or compare with another role.
                <button className="exp-done-compare" onClick={handleCompare}>
                  Compare with another role
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CHOOSE PATH */}
      <section className="choose-section" id="choose">
        <div className="choose-wrap">

          {/* Comparison panel — appears after 2+ roles explored */}
          <ComparisonPanel jobs={completedJobs} />

          <div className="choose-eyebrow">Choose your path</div>
          <h2 className="choose-title">
            {phase === 'done'
              ? `You matched ${active.role} — or explore all 6 paths`
              : 'Which direction pulls you?'}
          </h2>
          <p className="choose-sub">Every path is a complete curriculum — from zero to job ready. Pick one and start.</p>

          <div className="choose-grid">
            {ALL_PATHS.map(p => (
              <button key={p.id}
                className={`choose-card ${p.id===active.pathId && phase==='done' ? 'choose-card--rec':''}`}
                style={{'--pc': p.color}}
                onClick={() => startPath(p.id)}>
                {p.id === active.pathId && phase === 'done' && (
                  <div className="choose-rec-badge">Matches what you just did</div>
                )}
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

          <p className="choose-note">Free to start. Progress saves when you create an account — takes 30 seconds.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-wrap">
          <h2 className="how-title">How QuestLearn works</h2>
          <div className="how-grid">
            {[
              {n:'1',icon:'🎯',t:'Pick a path',         b:'Choose a career direction. Each path goes from zero to job-ready.'},
              {n:'2',icon:'⚡',t:'Do real work',         b:'Every level is active — write code, solve real problems, make decisions. No passive watching.'},
              {n:'3',icon:'🔓',t:'Unlock stages',        b:'Complete levels to unlock the next stage. You stay in flow, never get stuck.'},
              {n:'4',icon:'🏆',t:'Build your portfolio', b:'Every capstone level produces a real deliverable you can show to employers.'},
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
        <p className="final-cta-sub">You just tried one. 200+ more are waiting.</p>
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