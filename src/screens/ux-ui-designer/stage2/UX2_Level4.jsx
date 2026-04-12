// src/screens/ux-ui-designer/stage2/UX2_Level4.jsx — Styles — Enforcing Consistency (FILL)
import { useState } from 'react';
import UX2Shell from './UX2Shell';

const BLANKS = [
  { id:'B1', answer:'Colour', hint:'What type of style defines brand and semantic palette values' },
    { id:'B2', answer:'Text', hint:'What type of style defines typeface, size, weight, and line height' },
    { id:'B3', answer:'Effect', hint:'What type of style defines shadows, blurs, and glows' },
    { id:'B4', answer:'local styles', hint:'Where styles defined in a file are stored by default' },
    { id:'B5', answer:'Detach', hint:'What you do to a style link to override it on one instance only' },
];

const LINES = ['// Three style types in Figma:', '[B1] styles:  brand palette + semantic colours (primary, error, success)', '[B2] styles:  typeface, size, weight, line height — applied to text layers', '[B3] styles:  drop shadows, inner shadows, background blur', '', '// Styles live in:', '// File panel → [B4] (private to this file)', '// Team library → published (shared across the team)', '', '// To override a style on one element without breaking the system:', '// Right-click the style link → [B5] style', '// Now this instance is free to deviate'];

export default function UX2_Level4() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});
  const [wrongAttempts, setWrongAttempts] = useState(0);

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toLowerCase()===b.answer.toLowerCase(); });
    setCorrect(r); setChecked(true);
    if (!BLANKS.every(b => r[b.id])) setWrongAttempts(n => n+1);
  }

  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, li) {
    if (line.startsWith('//')) return <div key={li} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    if (!line.trim()) return <div key={li} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={li} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p,pi) => {
          const m = p.match(/^\[B(\d)\]$/);
          if (!m) return <span key={pi}>{p}</span>;
          const bid = 'B'+m[1];
          const bl = BLANKS.find(b=>b.id===bid);
          const st = !checked?'':correct[bid]?'correct':'incorrect';
          return <input key={pi} className={`ux2-blank ${st}`} value={vals[bid]||''}
            onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))}
            placeholder={bl?.hint} style={{minWidth:90}}/>;
        })}
      </div>
    );
  }

  return (
    <UX2Shell levelId={4} canProceed={allCorrect} wrongAttempts={wrongAttempts}
      prevLevelContext="In the last level you built a component system. Now you'll add styles — the layer that keeps every component's colour, type, and shadow consistent across the entire file."
      cumulativeSkills={[
        "Set up Figma and navigated Files, Pages, and Frames",
        "Created frames at correct dimensions with proper constraints",
        "Applied auto-layout: direction, spacing, padding, resize behaviour",
        "Created master components and instances across screens",
        "Defined colour, text, and effect styles for the booking system",
      ]}
      conceptReveal={[
        { label:'Styles vs One-Off Values', detail:'A designer who applies colour styles consistently can rename "Primary Blue" to "Primary Indigo" and update every screen in seconds. A designer who uses hex values directly must find and replace every instance manually — and will miss some. Styles are not optional in a professional workflow.' },
      ]}
    >
      <div className="ux2-intro">
        <h1>Styles — Enforcing Consistency</h1>
        <p className="ux2-tagline">🎨 Colour styles, text styles, effect styles. Change one, update everything.</p>
        <p className="ux2-why">Without styles, a "blue" button might be #1A73E8 in one screen and #1B74E9 in another. Multiply across 40 screens built over 6 months by 3 designers and you have a visual consistency disaster. Styles are the design equivalent of CSS variables — single source of truth.</p>
      </div>
      <div className="ux2-panel">
        <div className="ux2-panel-hdr">🎨 Figma styles — fill the blanks</div>
        <div className="ux2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ux2-check-btn" onClick={check}>Check Answers</button>
      {checked && allCorrect && <div className="ux2-feedback success">✅ Styles understood. Your files will stay consistent.</div>}
    </UX2Shell>
  );
}
