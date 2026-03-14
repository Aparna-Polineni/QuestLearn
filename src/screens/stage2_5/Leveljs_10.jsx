// LevelJS_10.jsx — DOM Manipulation (BUILD)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_10.css';

const SUPPORT = {
  intro:{concept:'DOM Manipulation',tagline:"The DOM is the live tree of HTML elements. JavaScript reads and writes it to make pages interactive.",whatYouWillDo:"Simulate DOM operations: selecting elements, updating content, adding classes, and responding to events — using the same API the browser exposes.",whyItMatters:"React abstracts the DOM — but understanding it makes React click. When React 're-renders', it diffs and patches the real DOM. Understanding querySelector and innerHTML explains what React is automating for you."},
  hints:["querySelector returns the first matching element: document.querySelector('#patientName') or document.querySelector('.card'). querySelectorAll returns all matches as a NodeList.","innerHTML sets the HTML content of an element: el.innerHTML = '<strong>Alice</strong>'. textContent is safer for plain text — it never interprets HTML.","classList methods: el.classList.add('active'), el.classList.remove('active'), el.classList.toggle('active'), el.classList.contains('active')."],
  reveal:{concept:'DOM API — querySelector, events, classList',whatYouLearned:"querySelector(selector): first match. querySelectorAll(selector): all matches (NodeList). element.textContent: read/write text. element.innerHTML: read/write HTML. element.setAttribute(name, val). element.classList.add/remove/toggle/contains. addEventListener(event, callback).",realWorldUse:"React replaces direct DOM manipulation for state-driven UI — but you still use the DOM API for: measuring element sizes (getBoundingClientRect), managing focus (element.focus()), integrating third-party libraries (charts, maps) that need a real DOM element via useRef.",developerSays:"Understanding the raw DOM makes you a better React developer. When React's virtual DOM diffing confuses you, go back to the real DOM: React is just doing querySelector and innerHTML, but smarter and at scale."},
};

// DOM simulation — since we run in a fake JS sandbox, we simulate the DOM
const LOCKED = `// NOTE: This runs in a simulated DOM environment.
// The DOM API works the same way in a real browser.

// We simulate document.querySelector with a simple store:
const elements = {};
const document = {
  querySelector: (sel) => elements[sel] || null,
  createElement: (tag) => ({ tag, textContent:'', innerHTML:'', classList:{classes:new Set(), add(c){this.classes.add(c)}, remove(c){this.classes.delete(c)}, toggle(c){this.classes.has(c)?this.classes.delete(c):this.classes.add(c)}, contains(c){return this.classes.has(c)}}, getAttribute(){}, setAttribute(){} })
};
elements['#nameDisplay']    = document.createElement('span');
elements['#wardDisplay']    = document.createElement('span');
elements['#statusBadge']    = document.createElement('div');
elements['#patientCard']    = document.createElement('div');`;

const INITIAL = `// NOTE: This runs in a simulated DOM environment.
// The DOM API works the same way in a real browser.

// We simulate document.querySelector with a simple store:
const elements = {};
const document = {
  querySelector: (sel) => elements[sel] || null,
  createElement: (tag) => ({ tag, textContent:'', innerHTML:'', classList:{classes:new Set(), add(c){this.classes.add(c)}, remove(c){this.classes.delete(c)}, toggle(c){this.classes.has(c)?this.classes.delete(c):this.classes.add(c)}, contains(c){return this.classes.has(c)}}, getAttribute(){}, setAttribute(){} })
};
elements['#nameDisplay']    = document.createElement('span');
elements['#wardDisplay']    = document.createElement('span');
elements['#statusBadge']    = document.createElement('div');
elements['#patientCard']    = document.createElement('div');

// ── TASK 1: Update text content ──────────────────────────────
// Select '#nameDisplay' and set its textContent to "Alice Smith"
// Select '#wardDisplay' and set its textContent to "Cardiology"
// Print: "Name: Alice Smith"
// Print: "Ward: Cardiology"

// TODO

// ── TASK 2: classList ─────────────────────────────────────────
// Select '#statusBadge', add class "active", add class "highlight"
// Print: "Has active: true"
// Remove "highlight"
// Print: "Has highlight: false"

// TODO

// ── TASK 3: innerHTML ────────────────────────────────────────
// Select '#patientCard' and set its innerHTML to:
// "<strong>Alice Smith</strong> — Cardiology"
// Print: "Card HTML: <strong>Alice Smith</strong> — Cardiology"

// TODO`;

const EXPECTED = `Name: Alice Smith\nWard: Cardiology\nHas active: true\nHas highlight: false\nCard HTML: <strong>Alice Smith</strong> — Cardiology`;

export default function LevelJS_10() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={10} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs10-container">
          <div className="ljs10-brief">
            <div className="ljs10-brief-tag">// Build Mission — DOM Manipulation</div>
            <h2>Update the patient UI with DOM methods for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Three tasks. The DOM simulator is locked. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs10-expected-box">
              <div className="ljs10-expected-label">Expected output</div>
              <pre className="ljs10-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs10-anatomy">
            <div className="ljs10-anat-header">// Core DOM API reference</div>
            <div className="ljs10-method-grid">
              {[
                {sig:'document.querySelector("#id")',          note:'first element matching CSS selector — returns null if not found'},
                {sig:'document.querySelectorAll(".class")',    note:'ALL matching elements — returns NodeList (use forEach or spread to [...list])'},
                {sig:'el.textContent = "text"',                note:'sets plain text — safe, never interprets HTML tags'},
                {sig:'el.innerHTML = "<b>text</b>"',           note:'sets HTML — only use with trusted content (XSS risk with user input)'},
                {sig:'el.classList.add("active")',             note:'adds CSS class'},
                {sig:'el.classList.remove("active")',          note:'removes CSS class'},
                {sig:'el.classList.toggle("active")',          note:'adds if absent, removes if present'},
                {sig:'el.classList.contains("active")',        note:'returns boolean — does element have this class?'},
                {sig:'el.setAttribute("data-id", "P001")',    note:'sets any HTML attribute'},
                {sig:'el.addEventListener("click", fn)',       note:'runs fn when event fires — fn receives the event object'},
              ].map(r => (
                <div key={r.sig} className="ljs10-method-row">
                  <code className="ljs10-msig">{r.sig}</code>
                  <span className="ljs10-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs10-anat-header" style={{marginTop:18}}>// DOM vs React — what React automates</div>
            <div className="ljs10-compare">
              <div className="ljs10-col dom-col">
                <div className="ljs10-col-title">Vanilla JS (manual DOM)</div>
                <pre className="ljs10-code-block">{`let count = 0;
btn.addEventListener('click', () => {
  count++;
  el.textContent = count; // manual update
});`}</pre>
                <div className="ljs10-col-note">You manually track state AND update the DOM</div>
              </div>
              <div className="ljs10-col react-col">
                <div className="ljs10-col-title">React (automated DOM)</div>
                <pre className="ljs10-code-block">{`const [count, setCount] = useState(0);
// React patches the DOM automatically
return <button onClick={() => setCount(c=>c+1)}>
  {count}
</button>;`}</pre>
                <div className="ljs10-col-note">You manage state — React handles DOM updates</div>
              </div>
            </div>
          </div>

          <JsEditor lockedCode={LOCKED}
            initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={370} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}
