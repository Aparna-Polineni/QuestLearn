// src/screens/ux-ui-designer/stage1/UX1_Level3.jsx — Ideate (BUILD)
import { useState } from 'react';
import UX1Shell from './UX1Shell';

const TECHNIQUES = [
  { id:'brain', name:'Brainstorming', rule:'No criticism during generation. Quantity over quality. Wild ideas welcome. Build on others\'s ideas.' },
  { id:'crazy', name:'Crazy 8s', rule:'Fold paper into 8 squares. Sketch 8 different solutions in 8 minutes. Forces divergent thinking.' },
  { id:'scamper', name:'SCAMPER', rule:'Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse. Apply each to your current solution.' },
  { id:'worst', name:'Worst Possible Idea', rule:'Generate the most terrible, offensive, impractical ideas first. Then reverse them — often the best ideas hide inside bad ones.' },
  { id:'how', name:'How Might We (HMW)', rule:'Turn each problem and constraint into a HMW question, then answer it with as many ideas as possible.' },
];

const REQS = [
  { id:'r1', label:'State the HMW question being answered' },
  { id:'r2', label:'Generate at least 5 distinct solution ideas' },
  { id:'r3', label:'At least one "wild" or unconventional idea' },
  { id:'r4', label:'Select 2 ideas to develop further with brief justification' },
  { id:'r5', label:'Identify the biggest assumption in your top idea' },
];

const CHECK = {
  r1: c => c.includes('HOW MIGHT WE') || c.includes('HMW'),
  r2: c => {
    const ideas = (c.match(/\d\.|IDEA|SOLUTION|OPTION|-\s/g) || []).length;
    return ideas >= 5;
  },
  r3: c => c.includes('WILD') || c.includes('UNCONVENTIONAL') || c.includes('CRAZY') || c.includes('UNUSUAL') || c.includes('BOLD'),
  r4: c => (c.includes('SELECT') || c.includes('DEVELOP') || c.includes('CHOOSE') || c.includes('PURSUE')) && (c.includes('BECAUSE') || c.includes('SINCE') || c.includes('JUSTIFY')),
  r5: c => c.includes('ASSUMPTION'),
};

export default function UX1_Level3() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id,fn]) => { r[id]=fn(c); });
    setResults(r); setChecked(true);
  }

  const passCount = Object.values(results).filter(Boolean).length;
  const allPass = checked && passCount === REQS.length;

  const SOLUTION = `HMW: How Might We make login invisible for nurses during emergencies?

Ideas (brainstorm — no filtering):
1. Badge tap login — tap RFID badge to authenticate instantly
2. Facial recognition — camera at workstation recognises nurse
3. Persistent session — once logged in on a device, stay logged in for 8-hour shift
4. Shared emergency account — single click, auto-logs to anonymous session (audit tracks device)
5. PIN-only mode during active emergency — reduces from 8-field login to 4 digits
6. (Wild idea) Eye tracking + biometrics — nurse just looks at screen
7. Wearable auth — smartwatch token auto-syncs when near workstation
8. Pre-auth on mobile — nurse authenticates on phone in hallway, desktop auto-signs in

Selecting 2 to develop:
A) Badge tap login — already have RFID infrastructure, minimal training needed, low risk
B) Persistent session (8-hour) — zero new hardware, immediate to implement, high impact

Biggest assumption in badge tap login:
"All nurses have and carry their badge during emergencies"
→ Need to verify: do nurses ever leave badges at the desk? What's the fallback?`;

  return (
    <UX1Shell levelId={3} canProceed={allPass}
      conceptReveal={[
        { label:'Diverge Before You Converge', detail:'Ideation has two phases: divergent (generate as many ideas as possible — no criticism) and convergent (select and refine). Most teams skip divergence and jump to refining the first reasonable idea. The best solution is almost never the first one you think of.' },
        { label:'The Worst Idea Technique', detail:'Ask "what\'s the worst possible solution?" to this problem. "Force nurses to complete a 20-field form with CAPTCHA every login." Now reverse it: "zero-field authentication." Terrible ideas point to great ones — they reveal assumptions you were afraid to challenge.' },
      ]}
      prevLevelContext="In the last level you built a persona representing the patient. Now you\'ll Ideate and Prototype — sketching three wireframes for the mobile booking flow that persona will use."
      cumulativeSkills={[
        "Defined UX vs UI and mapped the five phases of Design Thinking",
        "Applied Design Thinking: empathised and defined the booking problem",
        "Conducted user research: interview guide, synthesis, and patient persona",
        "Sketched three wireframes for the mobile patient booking flow",
      ]}
    >
      <div className="ux1-intro">
        <h1>Ideate — Generate Solutions</h1>
        <p className="ux1-tagline">💡 Quantity beats quality. Generate 20 ideas to find the 1 great one.</p>
        <p className="ux1-why">Most teams anchor on the first reasonable idea and refine it. The best solution is often the 15th idea — the one nobody would have thought of without exhausting the obvious ones first.</p>
      </div>

      <div style={{display:'grid',gap:10,marginBottom:20}}>
        {TECHNIQUES.map(t => (
          <div key={t.id} style={{background:'#1e293b',borderRadius:8,padding:'12px 16px',borderLeft:'3px solid #ec4899'}}>
            <div style={{color:'#ec4899',fontWeight:600,fontSize:14,marginBottom:4}}>{t.name}</div>
            <div style={{color:'#94a3b8',fontSize:13}}>{t.rule}</div>
          </div>
        ))}
      </div>

      <div style={{marginBottom:14}}>
        {REQS.map(r => (
          <div className="ux1-req" key={r.id}>
            <span style={{color:!checked?'#475569':results[r.id]?'#4ade80':'#f87171',fontSize:14,width:18}}>
              {!checked?'○':results[r.id]?'✓':'✗'}
            </span>
            <span style={{color:'#cbd5e1',fontSize:13}}>{r.label}</span>
          </div>
        ))}
      </div>

      <textarea className="ux1-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="HMW: How Might We...&#10;&#10;Ideas:&#10;1. ..." style={{minHeight:260}} />

      <div style={{display:'flex',gap:10,marginTop:10}}>
        <button className="ux1-check-btn" onClick={check}>Check Ideas</button>
        <button className="ux1-check-btn" style={{background:'#334155',color:'#94a3b8'}} onClick={() => setShowSolution(s=>!s)}>
          {showSolution?'Hide':'Show'} Example
        </button>
      </div>

      {showSolution && (
        <div className="ux1-panel" style={{marginTop:12}}>
          <div className="ux1-panel-hdr">✅ Example Solution</div>
          <pre className="ux1-panel-body" style={{color:'#94a3b8',overflowX:'auto',margin:0,fontSize:12}}>{SOLUTION}</pre>
        </div>
      )}

      {checked && (
        <div className={`ux1-feedback ${allPass?'success':'error'}`}>
          {allPass?'✅ Ideation session complete.': `❌ ${passCount}/${REQS.length} requirements met.`}
        </div>
      )}
    </UX1Shell>
  );
}
