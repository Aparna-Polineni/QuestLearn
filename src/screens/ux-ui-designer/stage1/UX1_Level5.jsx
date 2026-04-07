// src/screens/ux-ui-designer/stage1/UX1_Level5.jsx — Test: Validate with Users (FILL)
import { useState } from 'react';
import UX1Shell from './UX1Shell';

const BLANKS = [
  { id:'B1', answer:'usability test',  hint:'Observe real users trying to complete tasks with your design' },
  { id:'B2', answer:'task',            hint:'Specific thing you ask the user to try to do' },
  { id:'B3', answer:'think aloud',     hint:'Ask users to narrate their thoughts as they interact' },
  { id:'B4', answer:'facilitator',     hint:'Person who runs the session — stays neutral, doesn\'t help' },
  { id:'B5', answer:'affinity map',    hint:'Group observations into themes using sticky notes' },
  { id:'B6', answer:'SUS',             hint:'System Usability Scale — 10-question standardised survey' },
  { id:'B7', answer:'iterate',         hint:'Fix issues found, then test again — not a one-time activity' },
];

const LINES = [
  '# [B1] — watch real users try to use your design',
  '',
  '# Before the session:',
  '# Write [B2]s based on key user journeys',
  '# Good: "Try to book an appointment for next Tuesday"',
  '# Bad: "Click the blue button" (tells them what to do)',
  '',
  '# During the session:',
  '# [B4] stays silent — resist helping!',
  '# Ask users to [B3]: "Tell me what you\'re thinking"',
  '# Record session (with permission) — review later',
  '# Note: hesitations, wrong clicks, confusion, verbal frustration',
  '',
  '# After 5 sessions:',
  '# Create an [B5] with all observations',
  '# Group into themes: Navigation, Copy, Visual Hierarchy, etc.',
  '# Prioritise by frequency and severity',
  '',
  '# Measure satisfaction:',
  '# [B6]: 10 statements, 1-5 scale — score > 68 is "good"',
  '# NPS: "How likely to recommend 0-10?"',
  '',
  '# Most important: [B7]',
  '# Test → Learn → Fix → Test again',
  '# Good UX is never "done"',
];

export default function UX1_Level5() {
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
          return <input key={i} className={`ux1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:110,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <UX1Shell levelId={5} canProceed={allCorrect}
      conceptReveal={[
        { label:'The Hardest Part: Staying Silent', detail:'When a user is confused, every instinct says to help them. Don\'t. Say "What would you do next?" or stay silent. Their confusion is data. The moment you help, you lose the insight. The facilitator\'s job is to observe, not to teach.' },
        { label:'Severity Rating', detail:'Not all usability issues are equal. Critical: blocks task completion. Major: causes significant difficulty. Minor: frustrating but manageable. Cosmetic: users notice but easily adapt. Fix Critical and Major issues before the next test. Cosmetic issues go in the backlog.' },
      ]}
      prevLevelContext="In the last level you organised the navigation. Now you\'ll make it readable — applying visual hierarchy so the most important information catches the eye immediately."
      cumulativeSkills={[
        "Defined UX vs UI and mapped the five phases of Design Thinking",
        "Applied Design Thinking: empathised and defined the booking problem",
        "Conducted user research: interview guide, synthesis, and patient persona",
        "Sketched three wireframes for the mobile patient booking flow",
        "Restructured the information architecture: clear hierarchy, two-click navigation",
        "Applied visual hierarchy: size, weight, and colour to direct patient attention",
      ]}
    >
      <div className="ux1-intro">
        <h1>Test — Validate with Users</h1>
        <p className="ux1-tagline">🔬 5 users, 60 minutes, and you\'ll find things that would take months in analytics.</p>
        <p className="ux1-why">Watching one user struggle to find the checkout button is worth more than 10,000 rows of click data. Analytics tells you what users do. Usability testing tells you why.</p>
      </div>
      <div className="ux1-panel">
        <div className="ux1-panel-hdr">🔬 Usability Testing — fill the blanks</div>
        <div className="ux1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ux1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ux1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Testing methodology clear. You\'ll build with confidence.':'❌ Check your answers.'}</div>}
    </UX1Shell>
  );
}
