// src/screens/ux-ui-designer/stage1/UX1_Level0.jsx — CONCEPTS
import { useState } from 'react';
import UX1Shell from './UX1Shell';

const CARDS = [
  { id:'dt', title:'Design Thinking — Not Just for Designers', body:'Design Thinking is a problem-solving framework developed at Stanford\'s d.school. It\'s used at Apple, Google, IDEO, and NASA. The 5 stages: Empathise → Define → Ideate → Prototype → Test. It\'s iterative — you go back and repeat stages as you learn.' },
  { id:'human', title:'Human-Centred Design', body:'Start with the human, not the technology. The wrong question: "How do we make this feature?" The right question: "What problem do our users have?" Great design solves real problems — not problems designers assumed users have.' },
  { id:'ux', title:'UX vs UI', body:'UX (User Experience): the overall feel — is it easy to use? Does it meet needs? Is the flow logical? UI (User Interface): the visual layer — colours, typography, buttons, layout. Both matter. Great UI with bad UX still frustrates users. Great UX with bad UI looks unprofessional.' },
  { id:'research', title:'Why Research Comes First', body:'Most products fail not because they were built badly, but because they built the wrong thing. 5 user interviews before building saves months of rework after launch. "Get out of the building" — talk to real users before designing a single screen.' },
  { id:'iterate', title:'Prototype Early, Fail Cheap', body:'A paper sketch takes 10 minutes. A clickable Figma prototype takes 2 hours. A coded feature takes 2 weeks. Test with users at the paper stage. Find the fundamental problems before they\'re expensive to fix.' },
  { id:'job', title:'What UX/UI Designers Do', body:'User research: interviews, surveys, usability testing. Information architecture: how content is organised. Wireframing: layout without visual design. Visual design: colours, type, components. Prototyping: interactive mockups. Handoff: specs for developers.' },
];

export default function UX1_Level0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <UX1Shell levelId={0} canProceed={seen.size
      cumulativeSkills={[
        "Defined UX vs UI and mapped the five phases of Design Thinking",
      ]}
    >= CARDS.length}>
      <div className="ux1-intro">
        <h1>What is Design Thinking?</h1>
        <p className="ux1-tagline">🎨 Start with people. End with products they love.</p>
        <p className="ux1-why">Good design is invisible. Bad design is everywhere. This path teaches you to see the difference — and build experiences that feel effortless because every detail was considered.</p>
      </div>
      <div className="ux1-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`ux1-card ${seen.has(c.id)?'seen':''}`} onClick={() => toggle(c.id)}>
            <div className="ux1-card-top">
              <span className="ux1-card-title">{c.title}</span>
              <span style={{color:'#ec4899',fontSize:11}}>{seen.has(c.id)?'▲':'▼'}</span>
            </div>
            {seen.has(c.id) && <p className="ux1-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Open all {CARDS.length} cards to continue →</p>}
      {seen.size >= CARDS.length && <div className="ux1-feedback success">✅ Design Thinking framing set. Next: Empathy — understanding real users.</div>}
    </UX1Shell>
  );
}
