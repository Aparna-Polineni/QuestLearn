// src/components/StageCelebration.jsx
// Full-screen "moment of pride" shown when a user completes an entire stage.
// Three sections: what they achieved, what they can now do (3 bullets), shareable card + CTA.

import { useState, useEffect, useRef } from 'react';
import './StageCelebration.css';

// ── Stage completion data ─────────────────────────────────────────────────────
// "You can now..." bullets per path + stage
const STAGE_KNOWLEDGE = {
  'data-engineer': {
    '1': {
      headline: 'You now think like a Data Engineer.',
      bullets: [
        'Explain what a data pipeline is and why it exists',
        'Identify and fix data quality issues: NULLs, duplicates, schema mismatches',
        'Design a pipeline from scratch — ETL steps, batch vs streaming, format choices',
      ],
      next: 'Stage 2 — SQL & Databases',
    },
    '2': {
      headline: 'You can query and design any database.',
      bullets: [
        'Write complex SQL: JOINs, CTEs, window functions, subqueries',
        'Design normalised schemas and understand when to denormalise',
        'Optimise slow queries using indexes and EXPLAIN',
      ],
      next: 'Stage 3 — Python for Data',
    },
  },
  'ml-ai-engineer': {
    '1': {
      headline: 'You now think like an ML Engineer.',
      bullets: [
        'Identify when ML is the right tool — and when it is not',
        'Frame any ML problem: inputs, outputs, success metrics, data requirements',
        'Explain the 8-step ML workflow from problem to production',
      ],
      next: 'Stage 2 — Python & Math for ML',
    },
    '2': {
      headline: 'You can prepare data for any ML model.',
      bullets: [
        'Clean and transform real datasets using NumPy and Pandas',
        'Spot class imbalance, leakage, and distribution issues before they hurt your model',
        'Build a reusable data preparation pipeline from raw CSV to model-ready arrays',
      ],
      next: 'Stage 3 — Classical ML',
    },
  },
  'cyber-security': {
    '1': {
      headline: 'You now have the security mindset.',
      bullets: [
        'Apply the CIA triad to evaluate any system\'s security posture',
        'Build a STRIDE threat model for a real application',
        'Think like an attacker — identify attack surfaces before exploiting them',
      ],
      next: 'Stage 2 — Linux & Networking',
    },
    '2': {
      headline: 'You can investigate any Linux server.',
      bullets: [
        'Navigate, search, and analyse logs on any Linux system',
        'Detect attacks from network patterns: port scans, credential stuffing, C2 beacons',
        'Harden a server: SSH config, firewall rules, file permissions, log integrity',
      ],
      next: 'Stage 3 — Threat Analysis',
    },
  },
  'ux-ui-designer': {
    '1': {
      headline: 'You now think like a UX Designer.',
      bullets: [
        'Apply the Design Thinking framework to any user problem',
        'Run an empathy interview and synthesise findings into a persona',
        'Build a prototype and test it — without writing a line of code',
      ],
      next: 'Stage 2 — Figma Foundations',
    },
    '2': {
      headline: 'You can design in Figma.',
      bullets: [
        'Build responsive layouts using Auto Layout and component systems',
        'Create interactive prototypes with connections, triggers, and transitions',
        'Hand off designs to developers using Dev Mode and annotated specs',
      ],
      next: 'Stage 3 — UX Research',
    },
  },
  'java-fullstack': {
    '1': {
      headline: 'You\'ve designed a real software system.',
      bullets: [
        'Write a complete problem statement and map system boundaries',
        'Design wireframes, data models, and REST API contracts',
        'Choose a tech stack with justification — not just what\'s popular',
      ],
      next: 'Stage 2 — Java Core',
    },
    '2': {
      headline: 'You can write Java professionally.',
      bullets: [
        'Use OOP, collections, exceptions, and lambdas fluently',
        'Read and write clean, idiomatic Java that passes code review',
        'Understand the JVM well enough to debug real runtime errors',
      ],
      next: 'Stage 2.5 — JavaScript Fundamentals',
    },
  },
};

// Fallback for paths/stages without specific data
function getStageKnowledge(pathId, stageId) {
  return STAGE_KNOWLEDGE[pathId]?.[String(stageId)] || {
    headline: `Stage ${stageId} complete.`,
    bullets: [
      'Completed all levels in this stage',
      'Built real skills through active challenges',
      'Ready to advance to the next stage',
    ],
    next: 'Next Stage',
  };
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 80 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * -canvas.height,
      w:     6 + Math.random() * 8,
      h:     3 + Math.random() * 4,
      color: ['#6366f1','#34d399','#fbbf24','#f472b6','#38bdf8','#818cf8'][Math.floor(Math.random()*6)],
      speed: 2 + Math.random() * 3,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.1,
      drift: (Math.random() - 0.5) * 1.5,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y    += p.speed;
        p.x    += p.drift;
        p.angle += p.spin;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    // Stop after 4 seconds
    const stop = setTimeout(() => cancelAnimationFrame(raf), 4000);
    return () => { cancelAnimationFrame(raf); clearTimeout(stop); };
  }, []);

  return <canvas ref={canvasRef} className="sc-confetti" />;
}

// ── Share Card ────────────────────────────────────────────────────────────────
function ShareCard({ pathName, stageId, stageTitle, color }) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just completed ${pathName} — Stage ${stageId}: ${stageTitle} on QuestLearn. Built real skills through 8 interactive levels. Starting Stage ${Number(stageId)+1} next. questlearn.io`;

  function copyToClipboard() {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function shareTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  }

  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://questlearn.io')}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=500');
  }

  return (
    <div className="sc-share-section">
      <div className="sc-share-label">Share your achievement</div>

      {/* Visual card preview */}
      <div className="sc-share-card" style={{ '--card-color': color }}>
        <div className="sc-share-card-logo">◈ QuestLearn</div>
        <div className="sc-share-card-badge">Stage {stageId} Complete</div>
        <div className="sc-share-card-path">{pathName}</div>
        <div className="sc-share-card-stage">{stageTitle}</div>
        <div className="sc-share-card-foot">questlearn.io</div>
      </div>

      <div className="sc-share-buttons">
        <button className="sc-share-btn sc-share-copy" onClick={copyToClipboard}>
          {copied ? '✓ Copied!' : '📋 Copy text'}
        </button>
        <button className="sc-share-btn sc-share-twitter" onClick={shareTwitter}>
          𝕏 Share on X
        </button>
        <button className="sc-share-btn sc-share-linkedin" onClick={shareLinkedIn}>
          in Share on LinkedIn
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function StageCelebration({
  pathId,
  pathName,
  stageId,
  stageTitle,
  stageEmoji,
  stageColor,
  onContinue,
}) {
  const [phase, setPhase] = useState('enter'); // enter | main | share
  const knowledge = getStageKnowledge(pathId, stageId);

  useEffect(() => {
    const t = setTimeout(() => setPhase('main'), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="sc-overlay">
      <Confetti />

      <div className={`sc-modal ${phase === 'main' ? 'sc-modal--in' : ''}`}>

        {/* Top — achievement */}
        <div className="sc-top" style={{ '--stage-color': stageColor }}>
          <div className="sc-emoji">{stageEmoji}</div>
          <div className="sc-stage-label">Stage {stageId} Complete</div>
          <h1 className="sc-headline">{knowledge.headline}</h1>
          <div className="sc-path-name">{pathName}</div>
        </div>

        {/* Middle — what you can now do */}
        <div className="sc-skills">
          <div className="sc-skills-label">You can now:</div>
          <ul className="sc-bullets">
            {knowledge.bullets.map((b, i) => (
              <li key={i} className="sc-bullet" style={{ animationDelay: `${0.6 + i * 0.15}s` }}>
                <span className="sc-bullet-check" style={{ color: stageColor }}>✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Share card */}
        {phase === 'main' && (
          <ShareCard
            pathName={pathName}
            stageId={stageId}
            stageTitle={stageTitle}
            color={stageColor}
          />
        )}

        {/* CTA */}
        <div className="sc-cta">
          <button
            className="sc-continue-btn"
            style={{ background: stageColor }}
            onClick={onContinue}
          >
            Continue to {knowledge.next} →
          </button>
        </div>

      </div>
    </div>
  );
}