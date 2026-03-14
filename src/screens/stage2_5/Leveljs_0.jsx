// src/screens/stage2_5/LevelJS_0.jsx — JavaScript Concepts
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import './LevelJS_0.css';

const CONCEPTS = [
  {
    icon: '🌐',
    title: 'What is JavaScript?',
    body: 'JavaScript is the only programming language that runs natively in every web browser. It makes web pages interactive — responding to clicks, fetching data, updating the UI without page reloads. It also runs on servers via Node.js.',
    analogy: 'Java controls the hospital database. JavaScript controls what nurses see on the screen.',
  },
  {
    icon: '⚖️',
    title: 'JavaScript vs Java',
    body: 'Despite the similar name, they are completely different languages. Java is statically typed, compiled, and runs in the JVM. JavaScript is dynamically typed, interpreted, and runs in the browser or Node.js. Different syntax, different ecosystems, different purposes.',
    analogy: 'Java = the backend engine room. JavaScript = the frontend cockpit.',
  },
  {
    icon: '🖥️',
    title: 'Browser vs Node.js',
    body: 'In the browser, JavaScript can access the DOM (document, window). In Node.js, it can access files and the network. The core language is the same — only the available APIs differ. React apps run in the browser. Spring Boot talks to Node tools at build time.',
    analogy: 'Same language, different superpowers depending on where it runs.',
  },
  {
    icon: '🔀',
    title: 'Dynamic Typing',
    body: 'JavaScript variables have no declared type. A variable can hold a number, then a string, then an object. This is flexible but can cause bugs if you are not careful. You check types at runtime with typeof. TypeScript adds static types on top.',
    analogy: 'In Java: String name = "Alice". In JS: let name = "Alice" — then name = 42 is perfectly legal.',
  },
  {
    icon: '⚡',
    title: 'Asynchronous by Default',
    body: 'JavaScript is single-threaded but handles async operations via callbacks, Promises, and async/await. When you fetch data from an API, the rest of the page keeps running while waiting for the response. This is the event loop.',
    analogy: 'Java uses threads. JS uses the event loop — one thread, never blocked, always responsive.',
  },
  {
    icon: '📦',
    title: 'ES6+ Modern JavaScript',
    body: 'ES6 (2015) modernised JavaScript dramatically: arrow functions, destructuring, template literals, modules, classes, Promises. React is written in ES6+. Everything in this stage is ES6+ syntax — the same features you will use every day in React.',
    analogy: 'Think of ES6+ as Java 8 — the version that added lambdas and streams and changed how everyone writes code.',
  },
];

export default function LevelJS_0() {
  const { selectedDomain } = useGame();
  const [seen, setSeen] = useState(new Set());
  const color = '#f59e0b';
  const allSeen = seen.size >= CONCEPTS.length;

  return (
    <Stage2_5Shell levelId={0} canProceed={allSeen}>
      <div className="ljs0-container">
        <div className="ljs0-brief">
          <div className="ljs0-brief-tag">// Stage 2.5 — JavaScript Foundations</div>
          <h2>Before React, you need to <span style={{ color }}>feel JavaScript</span>.</h2>
          <p>Click all 6 cards to unlock the first level. These concepts will make every exercise make sense.</p>
        </div>
        <div className="ljs0-grid">
          {CONCEPTS.map((c, i) => (
            <div
              key={i}
              className={`ljs0-card ${seen.has(i) ? 'ljs0-seen' : ''}`}
              onClick={() => setSeen(prev => new Set([...prev, i]))}
            >
              <div className="ljs0-card-top">
                <span className="ljs0-icon">{c.icon}</span>
                <span className="ljs0-title">{c.title}</span>
                {seen.has(i) && <span className="ljs0-check">✓</span>}
              </div>
              <p className="ljs0-body">{c.body}</p>
              <div className="ljs0-analogy">
                <span className="ljs0-analogy-label">💡 Mental model</span>
                {c.analogy}
              </div>
            </div>
          ))}
        </div>
        <div className="ljs0-progress">
          <div className="ljs0-progress-bar">
            <div className="ljs0-progress-fill" style={{ width: `${(seen.size / CONCEPTS.length) * 100}%`, background: color }} />
          </div>
          <span className="ljs0-progress-text">{seen.size} / {CONCEPTS.length} concepts explored</span>
        </div>
      </div>
    </Stage2_5Shell>
  );
}
