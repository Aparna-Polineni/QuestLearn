// src/screens/stage2/Level2_0.jsx
// Concept-only level — no coding required
// Covers: JVM, JDK, JRE, how Java compiles and runs, platform independence
// Player reads through each concept card and marks it understood

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import './Level2_0.css';

// ── All concept cards ──────────────────────────────────────────────────────
const CONCEPTS = [
  {
    id: 'problem',
    icon: '🌍',
    title: 'The Problem Java Solved',
    color: '#f97316',
    story: `Before Java (early 1990s), if you wrote a program on a Windows computer, it would not run on a Mac. If you wrote it on a Mac, it would not run on Linux. Every operating system spoke a different language at the machine level.

This was a real nightmare. Companies had to hire separate teams to build the same app for Windows, Mac, and Linux. The code was written three times, bugs were fixed three times, and costs were three times higher.

Java's creators at Sun Microsystems set out to solve this with one motto:`,
    highlight: '"Write Once, Run Anywhere."',
    highlightSub: 'One codebase. Every operating system. No rewrites.',
  },
  {
    id: 'jvm',
    icon: '⚙️',
    title: 'The JVM — Java Virtual Machine',
    color: '#38bdf8',
    story: `The solution was a clever piece of software called the JVM — the Java Virtual Machine.

Think of it like a universal translator. Your Java code does not get translated directly into Windows-language or Mac-language. Instead it gets translated into a neutral middle language called bytecode.

Every operating system has its own JVM installed — and every JVM knows how to run bytecode. So:`,
    steps: [
      { icon: '📝', label: 'You write Java code', sub: 'Main.java — readable by humans' },
      { icon: '🔨', label: 'Java compiler translates it', sub: 'Main.class — bytecode, not machine code' },
      { icon: '⚙️', label: 'JVM reads the bytecode', sub: 'The JVM on any OS runs it identically' },
      { icon: '💻', label: 'Program runs on any machine', sub: 'Windows, Mac, Linux — same result' },
    ],
    callout: 'The JVM is why your Spring Boot hospital app can be developed on a MacBook and deployed to a Linux server without changing a single line of code.',
  },
  {
    id: 'jdk-jre',
    icon: '🧰',
    title: 'JDK vs JRE — What You Install',
    color: '#4ade80',
    story: `When someone says "install Java", they usually mean install the JDK. Here is the difference:`,
    comparison: [
      {
        name: 'JRE',
        full: 'Java Runtime Environment',
        icon: '▶️',
        color: '#64748b',
        desc: 'Just enough to RUN Java programs. If you only want to use an app someone else built — this is all you need. No tools for building.',
        analogy: 'Like having a DVD player. You can watch movies, but you cannot make them.',
      },
      {
        name: 'JDK',
        full: 'Java Development Kit',
        icon: '🔨',
        color: '#4ade80',
        desc: 'Everything in the JRE, PLUS the compiler (javac), debugger, and tools for BUILDING Java programs. This is what you need as a developer.',
        analogy: 'Like having a film studio. You can make movies AND watch them.',
      },
    ],
    callout: 'When you install Java to build a Spring Boot app, you always install the JDK — not just the JRE.',
  },
  {
    id: 'compile',
    icon: '🔨',
    title: 'How Java Compiles and Runs',
    color: '#818cf8',
    story: `Here is exactly what happens from the moment you press Run to the moment text appears on screen.`,
    timeline: [
      {
        step: '1',
        action: 'You write code',
        detail: 'You type in Main.java. This is plain text — nothing special yet.',
        code: 'System.out.println("Hello!");',
        color: '#38bdf8',
      },
      {
        step: '2',
        action: 'The compiler checks your code',
        detail: 'javac reads your file and checks every line for mistakes — wrong spelling, missing semicolons, wrong types. If anything is wrong, it tells you NOW, before the program ever runs.',
        code: 'javac Main.java  →  Main.class',
        color: '#f97316',
      },
      {
        step: '3',
        action: 'Bytecode is created',
        detail: 'If no errors, the compiler outputs Main.class — a file of bytecode. This is NOT machine code. No CPU can run it directly. It is instructions written for the JVM.',
        code: 'Main.class (bytecode — not human readable)',
        color: '#818cf8',
      },
      {
        step: '4',
        action: 'The JVM runs the bytecode',
        detail: 'You run: java Main. The JVM loads Main.class, translates each bytecode instruction into real CPU instructions for YOUR specific machine, and executes it.',
        code: 'java Main  →  "Hello!" appears on screen',
        color: '#4ade80',
      },
    ],
    callout: 'This two-step process (compile then run) is why Java catches so many bugs before your program ever executes. The compiler is your first line of defence.',
  },
  {
    id: 'why-java',
    icon: '🏆',
    title: 'Why Java for Backend Development?',
    color: '#fbbf24',
    story: `Java has been the most popular language for enterprise backend development for over 25 years. Here is why companies like Google, Netflix, Amazon, and every major hospital system still use it:`,
    reasons: [
      { icon: '🔒', title: 'Strongly Typed', desc: 'Java catches type errors at compile time. If you pass a String where an int is expected, the code will not compile. This prevents entire categories of bugs that would only appear in production at 3am.' },
      { icon: '⚡', title: 'Performance', desc: "The JVM has had 30 years of optimisation. Modern Java applications are extremely fast — close to C++ performance for most server workloads. Netflix streams to 200 million users using Java." },
      { icon: '📦', title: 'Massive Ecosystem', desc: 'Spring Boot, Hibernate, Maven, Gradle — thousands of battle-tested libraries for every problem. You rarely build from scratch. You assemble proven components.' },
      { icon: '🏥', title: 'Enterprise Trust', desc: 'Banks, hospitals, and governments require software that has been running reliably for decades. Java has that track record. The NHS, most US hospital systems, and major banks all run Java backends.' },
      { icon: '🧵', title: 'Concurrency', desc: 'Java handles thousands of simultaneous requests — each patient record request, each API call — using threads. The JVM manages this reliably at scale.' },
    ],
  },
];

// ── Single concept card ────────────────────────────────────────────────────
function ConceptCard({ concept, isRead, onMarkRead }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`c0-card ${isRead ? 'c0-card-read' : ''}`}
      style={{ '--card-color': concept.color }}
    >
      {/* Header — always visible */}
      <button className="c0-card-header" onClick={() => setExpanded(e => !e)}>
        <div className="c0-card-header-left">
          <span className="c0-card-icon">{concept.icon}</span>
          <div>
            <div className="c0-card-title" style={{ color: concept.color }}>{concept.title}</div>
            {isRead && <div className="c0-card-done-tag">✓ Read</div>}
          </div>
        </div>
        <span className="c0-card-chevron">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Body — expands */}
      {expanded && (
        <div className="c0-card-body">

          {/* Story text */}
          <p className="c0-story">{concept.story}</p>

          {/* Highlight quote */}
          {concept.highlight && (
            <div className="c0-highlight" style={{ borderColor: concept.color }}>
              <div className="c0-highlight-text" style={{ color: concept.color }}>{concept.highlight}</div>
              {concept.highlightSub && <div className="c0-highlight-sub">{concept.highlightSub}</div>}
            </div>
          )}

          {/* Step flow */}
          {concept.steps && (
            <div className="c0-steps">
              {concept.steps.map((s, i) => (
                <div key={i} className="c0-step">
                  <div className="c0-step-icon">{s.icon}</div>
                  <div className="c0-step-content">
                    <div className="c0-step-label">{s.label}</div>
                    <div className="c0-step-sub">{s.sub}</div>
                  </div>
                  {i < concept.steps.length - 1 && <div className="c0-step-arrow">→</div>}
                </div>
              ))}
            </div>
          )}

          {/* JDK vs JRE comparison */}
          {concept.comparison && (
            <div className="c0-compare">
              {concept.comparison.map(c => (
                <div key={c.name} className="c0-compare-box" style={{ borderColor: c.color }}>
                  <div className="c0-compare-header">
                    <span className="c0-compare-icon">{c.icon}</span>
                    <div>
                      <span className="c0-compare-name" style={{ color: c.color }}>{c.name}</span>
                      <span className="c0-compare-full"> — {c.full}</span>
                    </div>
                  </div>
                  <p className="c0-compare-desc">{c.desc}</p>
                  <div className="c0-compare-analogy">💬 {c.analogy}</div>
                </div>
              ))}
            </div>
          )}

          {/* Compile timeline */}
          {concept.timeline && (
            <div className="c0-timeline">
              {concept.timeline.map((t, i) => (
                <div key={i} className="c0-timeline-item">
                  <div className="c0-timeline-step" style={{ background: t.color }}>{t.step}</div>
                  <div className="c0-timeline-content">
                    <div className="c0-timeline-action" style={{ color: t.color }}>{t.action}</div>
                    <p className="c0-timeline-detail">{t.detail}</p>
                    <code className="c0-timeline-code">{t.code}</code>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Why Java reasons */}
          {concept.reasons && (
            <div className="c0-reasons">
              {concept.reasons.map((r, i) => (
                <div key={i} className="c0-reason">
                  <span className="c0-reason-icon">{r.icon}</span>
                  <div>
                    <div className="c0-reason-title">{r.title}</div>
                    <p className="c0-reason-desc">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Callout box */}
          {concept.callout && (
            <div className="c0-callout" style={{ borderColor: concept.color }}>
              <span className="c0-callout-icon">💡</span>
              <p className="c0-callout-text">{concept.callout}</p>
            </div>
          )}

          {/* Mark as read */}
          {!isRead && (
            <button
              className="c0-read-btn"
              style={{ '--btn-color': concept.color }}
              onClick={() => { onMarkRead(concept.id); setExpanded(false); }}
            >
              ✓ Got it — mark as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main level component ───────────────────────────────────────────────────
export default function Level2_0() {
  const { selectedDomain } = useGame();
  const [readIds, setReadIds] = useState(new Set());

  const allRead = readIds.size >= CONCEPTS.length;

  function markRead(id) {
    setReadIds(prev => new Set([...prev, id]));
  }

  return (
    <Stage2Shell levelId={0} canProceed={allRead} conceptReveal={{
      concept: 'How Java Works Under the Hood',
      whatYouLearned: 'Java code compiles to bytecode, not machine code. The JVM runs that bytecode on any operating system. The JDK is the developer toolkit including the compiler. This two-step process (compile then run) lets Java catch bugs before your program ever executes.',
      realWorldUse: `Your ${selectedDomain?.name || 'system'} backend will be a Spring Boot application. When you deploy it to a server, the JDK compiles your code to bytecode, and the JVM on the server runs it. The server can be any OS — the code does not change.`,
      developerSays: 'Understanding the JVM is what separates Java developers from Java syntax typists. When your Spring Boot app runs out of memory, you tune the JVM. When it is slow, you profile the JVM. The JVM is the engine — you need to know your engine.',
    }}>
      <div className="c0-container">

        {/* Header */}
        <div className="c0-header">
          <div className="c0-header-tag">// Before You Code</div>
          <h2 className="c0-header-title">
            Understanding Java — the platform, not just the language
          </h2>
          <p className="c0-header-desc">
            Most tutorials throw you into syntax immediately. Here you will first understand
            <em> why</em> Java exists, <em>how</em> it actually runs your code, and
            <em> what</em> the JVM, JDK and JRE actually are. This takes 10 minutes and makes
            everything that follows make sense.
          </p>

          {/* Progress */}
          <div className="c0-progress-row">
            <div className="c0-progress-bar">
              <div
                className="c0-progress-fill"
                style={{ width: `${(readIds.size / CONCEPTS.length) * 100}%` }}
              />
            </div>
            <span className="c0-progress-label">{readIds.size} / {CONCEPTS.length} concepts read</span>
          </div>
        </div>

        {/* Concept cards */}
        <div className="c0-cards">
          {CONCEPTS.map(concept => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              isRead={readIds.has(concept.id)}
              onMarkRead={markRead}
            />
          ))}
        </div>

        {/* Completion */}
        {allRead && (
          <div className="c0-complete">
            <div className="c0-complete-icon">🎓</div>
            <div className="c0-complete-title">You understand how Java works.</div>
            <div className="c0-complete-sub">
              Now when you write <code>public static void main</code> — you will know exactly
              what each word does and why the JVM needs it written that way.
              Click <strong>Complete Level</strong> below to start coding.
            </div>
          </div>
        )}

      </div>
    </Stage2Shell>
  );
}