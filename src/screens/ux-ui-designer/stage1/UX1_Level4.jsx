// src/screens/ux-ui-designer/stage1/UX1_Level4.jsx — Prototype (FILL)
import { useState } from 'react';
import UX1Shell from './UX1Shell';

const BLANKS = [
  { id:'B1', answer:'fidelity',      hint:'How detailed and polished a prototype is (low vs high)' },
  { id:'B2', answer:'paper',         hint:'Sketch on paper — cheapest prototype possible' },
  { id:'B3', answer:'wireframe',     hint:'Grey-box layout without visual design — structure only' },
  { id:'B4', answer:'prototype',     hint:'Interactive mockup — clickable but not coded' },
  { id:'B5', answer:'flow',          hint:'The sequence of screens a user navigates through' },
  { id:'B6', answer:'hotspot',       hint:'Clickable area in Figma that links to another frame' },
  { id:'B7', answer:'affordance',    hint:'Visual cue that suggests how an element should be used' },
];

const LINES = [
  '# Prototype — make it tangible before you build it',
  '',
  '# [B1] spectrum:',
  '# Low [B1]: quick, cheap, throwaway — good for testing concepts',
  '# High [B1]: polished, detailed — good for stakeholder sign-off',
  '',
  '# Stage 1: [B2] prototype (10 minutes)',
  '# Sketch screens on paper, cut out, simulate clicking',
  '# Test with 1-2 users immediately',
  '# Find fundamental navigation issues before Figma',
  '',
  '# Stage 2: [B3] (Figma, 2-4 hours)',
  '# Greyscale boxes and placeholder text',
  '# No colours, no fonts, no final copy',
  '# Focus on layout and [B5]',
  '',
  '# Stage 3: Interactive [B4] (Figma, 4-8 hours)',
  '# Add [B6]s to connect frames',
  '# Simulate the real user [B5]',
  '# Test with 5 users — find 85% of usability issues',
  '',
  '# Stage 4: High-fidelity prototype',
  '# Final visual design, real copy, real [B7]s',
  '# Buttons look clickable, disabled states visible',
  '# Developer handoff ready',
];

export default function UX1_Level4() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toLowerCase()===b.answer.toLowerCase(); });
    setCorrect(r); setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, idx) {
    if (line.startsWith('#')) return <div key={idx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    if (!line.trim()) return <div key={idx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p,i)=>{
          const m=p.match(/^\[B(\d)\]$/); if(!m) return <span key={i}>{p}</span>;
          const bid='B'+m[1]; const bl=BLANKS.find(b=>b.id===bid);
          const st=!checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`ux1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:100,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <UX1Shell levelId={4} canProceed={allCorrect}
      conceptReveal={[
        { label:'Test Early, Fail Cheap', detail:'A paper sketch takes 10 minutes. A Figma wireframe takes 2 hours. A coded feature takes 2 weeks. If you discover a fundamental navigation problem after coding, it costs 2 weeks to fix. If you discover it in a paper prototype, it costs 10 minutes. Always test before building.' },
        { label:'5 Users Find 85% of Issues', detail:'Jakob Nielsen\'s research shows that 5 users uncover 85% of usability issues. You don\'t need 100 participants. Run 5 sessions, fix the issues, run 5 more. Iterating in small cycles is more efficient than one large study.' },
      ]}
      prevLevelContext="In the last level you sketched the booking flow. Now you'll structure it — organising the navigation so any patient can find what they need without getting lost."
      cumulativeSkills={[
        "Defined UX vs UI and mapped the five phases of Design Thinking",
        "Applied Design Thinking: empathised and defined the booking problem",
        "Conducted user research: interview guide, synthesis, and patient persona",
        "Sketched three wireframes for the mobile patient booking flow",
        "Restructured the information architecture: clear hierarchy, two-click navigation",
      ]}
    >
      <div className="ux1-intro">
        <h1>Prototype — Make it Tangible</h1>
        <p className="ux1-tagline">✏️ The cheapest prototype is a paper sketch. Use it before Figma.</p>
        <p className="ux1-why">A prototype is a testable approximation of your solution. The goal isn't to make it beautiful — it's to expose assumptions quickly before expensive development begins.</p>
      </div>
      <div className="ux1-panel">
        <div className="ux1-panel-hdr">✏️ Prototyping — fill the blanks</div>
        <div className="ux1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ux1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ux1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Prototype stages clear. Paper before Figma, always.':'❌ Check your answers.'}</div>}
    </UX1Shell>
  );
}
