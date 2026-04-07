// src/screens/ux-ui-designer/stage1/UX1_Level1.jsx — Empathy (FILL)
import { useState } from 'react';
import UX1Shell from './UX1Shell';

const BLANKS = [
  { id:'B1', answer:'empathy map',   hint:'Visual tool: what users Say, Think, Do, Feel' },
  { id:'B2', answer:'interview',     hint:'One-on-one conversation to understand user needs and context' },
  { id:'B3', answer:'observation',   hint:'Watch users do the task without guiding them' },
  { id:'B4', answer:'assumption',    hint:'What you believe about users without evidence' },
  { id:'B5', answer:'persona',       hint:'Fictional representative user based on research' },
  { id:'B6', answer:'pain point',    hint:'A frustration, obstacle, or difficulty the user experiences' },
  { id:'B7', answer:'Jobs to Be Done', hint:'Framework: users "hire" products to accomplish goals' },
];

const LINES = [
  '# Empathy — understand before you design',
  '',
  '# Tool 1: [B1]',
  '# 4 quadrants: what users Say / Think / Do / Feel',
  '# Reveals gaps between stated and actual behaviour',
  '',
  '# Tool 2: User [B2]s',
  '# 5-7 interviews surface patterns',
  '# Ask "why" 5 times to reach the root need',
  '# Bad question: "Would you use this feature?"',
  '# Good question: "Tell me about the last time you..."',
  '',
  '# Tool 3: [B3]',
  '# Watch users do the task in their real environment',
  '# What they do ≠ what they say they do',
  '',
  '# What to look for:',
  '# [B4]s: what you think you know without evidence — test these',
  '# [B6]s: frustrations that become your design opportunities',
  '',
  '# Synthesise into a [B5]:',
  '# "Sarah, 34, nurse, frustrated by slow logins during emergencies"',
  '',
  '# [B7] framework:',
  '# "When I am [situation], I want to [motivation], so I can [outcome]"',
  '# Focus on the job, not the feature',
];

export default function UX1_Level1() {
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
          return <input key={i} className={`ux1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:120,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <UX1Shell levelId={1} canProceed={allCorrect}
      conceptReveal={[
        { label:'5 Whys', detail:'"Why is checkout abandonment high?" → "Users can\'t find the promo code field." → "Why?" → "It\'s below the fold." → "Why?" → "We added upsells above it." → "Why?" → "Marketing A/B tested it." The 5 Whys reveal root causes, not symptoms. Always go deeper than the first answer.' },
        { label:'Users Lie (Not Intentionally)', detail:'What users say in interviews often differs from what they do. They want to seem positive, they forget, they tell you what they think you want to hear. Observation reveals truth. "I always check prices first" vs watching them immediately click "Add to Cart".' },
      ]}
      prevLevelContext="In the last level you learned the Design Thinking framework. Now you\'ll apply it — specifically the Empathise and Define phases — to a real broken booking form."
      cumulativeSkills={[
        "Defined UX vs UI and mapped the five phases of Design Thinking",
        "Applied Design Thinking to the hospital booking problem: empathised, defined the problem statement",
      ]}
    >
      <div className="ux1-intro">
        <h1>Empathy — Understanding Users</h1>
        <p className="ux1-tagline">👥 Design for real people, not imaginary ones.</p>
        <p className="ux1-why">The biggest waste in product development is building something nobody wants because nobody talked to users first. Five user interviews before building saves months of rework after launch.</p>
      </div>
      <div className="ux1-panel">
        <div className="ux1-panel-hdr">👥 Empathy Tools — fill the blanks</div>
        <div className="ux1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ux1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ux1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Empathy toolkit ready. You\'ll design for real users.':'❌ Check your answers.'}</div>}
    </UX1Shell>
  );
}
