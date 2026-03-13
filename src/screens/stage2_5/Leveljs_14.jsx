// LevelJS_14.jsx — ES6+ Modules
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_14.css';

const SUPPORT = {
  intro:{concept:'ES6+ Modules',tagline:"Modules split code across files. import/export is how every React component connects to every other.",whatYouWillDo:"Use named exports, default exports, and import them — simulating the exact module system React uses.",whyItMatters:"Every React file is a module. import React from 'react'. import { useState } from 'react'. import PatientCard from './PatientCard'. You write these dozens of times per day. Understanding named vs default export prevents import bugs."},
  hints:["Named export: export const formatName = (n) => n.toUpperCase(); — import with braces: import { formatName } from './utils'. Name must match exactly.","Default export: export default function PatientCard() {}. Import without braces and any name: import Card from './PatientCard'. Only one default export per file.","You can mix: a file can have one default export and many named exports. import PatientCard, { formatName } from './PatientCard' imports both."],
  reveal:{concept:'ES6 Modules — import/export',whatYouLearned:"Named export: export const x = ...; or export { x, y }. Named import: import { x, y } from './file'. Rename: import { x as myX }. Default export: export default value. Default import: import anything from './file'. Re-export: export { x } from './other'. Index barrel: index.js re-exports everything.",realWorldUse:"Every React project: import React, { useState, useEffect } from 'react'. Your own components: export default function Card({}) {}. Your utilities: export const formatDate = d => .... Your constants: export const API_URL = '/api'. The entire React codebase is ES modules.",developerSays:"One pattern I always use: an index.js (barrel file) in each component folder that re-exports everything. import { PatientCard, PatientList } from './components' instead of deep paths. Keeps imports clean as the project grows."},
};

const INITIAL = `// In a real project these would be separate files.
// Here we simulate module exports as objects.

// ── Simulated "utils.js" module ──────────────────────────────
// TASK 1: Create a 'utils' object that simulates named exports:
//   formatName: (name) => name.toUpperCase()
//   formatWard: (ward) => "Ward: " + ward
//   RISK_THRESHOLD: 50

// TODO: const utils = { ... }

// ── Simulated "PatientCard" module ───────────────────────────
// TASK 2: Create a function 'PatientCard' that takes { name, ward }
// Returns: name + " — " + ward
// Simulate a default export by assigning: const defaultExport = PatientCard

// TODO

// ── TASK 3: Use the "imports" ─────────────────────────────────
// Destructure formatName, formatWard, RISK_THRESHOLD from utils
// Print: formatName("alice smith")       → "ALICE SMITH"
// Print: formatWard("Cardiology")        → "Ward: Cardiology"
// Print: "Threshold: " + RISK_THRESHOLD  → "Threshold: 50"
// Print: defaultExport({ name:"Alice Smith", ward:"Cardiology" })

// TODO`;

const EXPECTED = `ALICE SMITH\nWard: Cardiology\nThreshold: 50\nAlice Smith — Cardiology`;

export default function LevelJS_14() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={14} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs14-container">
          <div className="ljs14-brief">
            <div className="ljs14-brief-tag">// Build Mission</div>
            <h2>Organise code into modules for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Three tasks. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs14-expected-box">
              <div className="ljs14-expected-label">Expected output</div>
              <pre className="ljs14-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs14-anatomy">
            <div className="ljs14-anat-header">// Named export vs Default export — side by side</div>
            <div className="ljs14-compare">
              <div className="ljs14-col named-col">
                <div className="ljs14-col-title">Named export</div>
                <pre className="ljs14-code-block">{`// utils.js
export const formatName = n => n.toUpperCase();
export const THRESHOLD  = 50;
export function validate(age) { ... }

// Anywhere else:
import { formatName, THRESHOLD } from './utils';
import { formatName as fn } from './utils'; // rename`}</pre>
                <div className="ljs14-col-note">Many per file. Import name must match. Use braces { }.</div>
              </div>
              <div className="ljs14-col default-col">
                <div className="ljs14-col-title">Default export</div>
                <pre className="ljs14-code-block">{`// PatientCard.jsx
export default function PatientCard({ name }) {
  return name;
}

// Anywhere else:
import PatientCard from './PatientCard';
import Card from './PatientCard'; // any name works`}</pre>
                <div className="ljs14-col-note">One per file. Import name can be anything. No braces.</div>
              </div>
            </div>

            <div className="ljs14-anat-header" style={{marginTop:18}}>// Real React import patterns</div>
            <div className="ljs14-method-grid">
              {[
                {sig:"import React, { useState } from 'react'",           note:'React = default, useState = named'},
                {sig:"import PatientCard from './PatientCard'",           note:'default import — component files'},
                {sig:"import { formatDate, API_URL } from './utils'",     note:'named imports from a utility file'},
                {sig:"import * as utils from './utils'",                  note:'import all named exports as utils.formatDate, utils.API_URL'},
                {sig:"export { PatientCard, PatientList } from './comps'",note:'barrel re-export — clean index.js pattern'},
              ].map(r => (
                <div key={r.sig} className="ljs14-method-row">
                  <code className="ljs14-msig">{r.sig}</code>
                  <span className="ljs14-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs14-mistake">
              <div className="ljs14-mistake-label">⚠ Braces for named, no braces for default</div>
              <div className="ljs14-mrows">
                <div className="ljs14-mrow bad"><span className="ljs14-mtag bad-tag">✗</span><code>{"import { PatientCard } from './PatientCard'"}</code><span className="ljs14-mnote">PatientCard is a default export — braces cause "does not provide an export named PatientCard"</span></div>
                <div className="ljs14-mrow good"><span className="ljs14-mtag good-tag">✓</span><code>{"import PatientCard from './PatientCard'"}</code><span className="ljs14-mnote">no braces for default exports</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={290} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}