// src/screens/ux-ui-designer/stage1/UX1_Level2.jsx — Define: Problem Statement (FILL)
import { useState } from 'react';
import UX1Shell from './UX1Shell';

const BLANKS = [
  { id:'B1', answer:'HMW',         hint:'How Might We — reframes problems as opportunities' },
  { id:'B2', answer:'POV',         hint:'Point of View — user + need + insight combined' },
  { id:'B3', answer:'insight',     hint:'A non-obvious truth discovered through research' },
  { id:'B4', answer:'root cause',  hint:'The underlying reason behind a symptom' },
  { id:'B5', answer:'scope',       hint:'Define the boundary — what\'s in and out of the solution' },
  { id:'B6', answer:'success metric', hint:'How you\'ll know the solution worked' },
];

const LINES = [
  '# Define — turn research into a sharp problem statement',
  '',
  '# [B2] Statement formula:',
  '# "[User] needs a way to [need] because [insight]"',
  '# "Sarah, an ER nurse, needs to log in instantly during emergencies',
  '#  because delays cause her to skip logins — creating audit gaps"',
  '',
  '# [B1] questions reframe problems as opportunities:',
  '# Problem: "Login is too slow"',
  '# [B1] we make authentication invisible during critical moments?',
  '# [B1] we pre-authenticate nurses as they enter the ward?',
  '',
  '# Always find the [B4]:',
  '# Symptom: "Users abandon checkout"',
  '# [B4]: promo code field is buried — users assume it doesn\'t exist',
  '',
  '# An [B3] is non-obvious:',
  '# Obvious: "Users want things to be fast"',
  '# Insight: "Nurses skip login because they feel morally wrong',
  '#  making patients wait — speed is not the core issue"',
  '',
  '# Define the [B5] of the solution:',
  '# In scope: login flow, session management',
  '# Out of scope: EHR content, admin dashboard',
  '',
  '# Define [B6]s before ideating:',
  '# "Login time reduced from 8s to 2s" — measurable, not vague',
];

export default function UX1_Level2() {
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
    <UX1Shell levelId={2} canProceed={allCorrect}
      conceptReveal={[
        { label:'HMW Questions', detail:'"How Might We" questions open the door to ideation without prescribing solutions. "HMW reduce login time" is too narrow. "HMW make authentication feel invisible" opens up facial recognition, badge tap, pre-auth. The right HMW question unlocks a hundred solutions.' },
        { label:'Define Success Before Ideating', detail:'If you don\'t define what success looks like before designing, you can\'t evaluate solutions objectively. "Faster" is not a metric. "Login time < 3 seconds for 95th percentile users" is. Define your success metric before the first sketch.' },
      ]}
      prevLevelContext="In the last level you defined the problem. Now you\'ll go deeper into the Empathise phase — writing an interview guide and synthesising findings into a patient persona."
      cumulativeSkills={[
        "Defined UX vs UI and mapped the five phases of Design Thinking",
        "Applied Design Thinking: empathised and defined the booking problem",
        "Conducted user research: interview guide, synthesis, and patient persona",
      ]}
    >
      <div className="ux1-intro">
        <h1>Define — The Problem Statement</h1>
        <p className="ux1-tagline">📝 A sharp problem statement is worth more than a hundred features.</p>
        <p className="ux1-why">Teams that skip the Define phase build solutions looking for problems. A POV statement and HMW questions focus the entire team on the same target before a single pixel is pushed.</p>
      </div>
      <div className="ux1-panel">
        <div className="ux1-panel-hdr">📝 Problem Definition — fill the blanks</div>
        <div className="ux1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ux1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ux1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Problem definition mastered.':'❌ Check your answers.'}</div>}
    </UX1Shell>
  );
}
