// src/screens/ux-ui-designer/stage2/UX2_Level0.jsx — CONCEPTS
import { useState } from 'react';
import UX2Shell from './UX2Shell';

const CARDS = [
  { id:'figma',  title:'What is Figma?',                body:'Figma is a browser-based design tool — no install needed, real-time collaboration, version history built in. It\'s become the industry standard for UI design. Sketch (Mac-only), Adobe XD (discontinued), and InVision (prototype only) have all lost to Figma\'s collaborative workflow.' },
  { id:'struct', title:'Files, Pages & Frames',         body:'A Figma file contains pages (like tabs). Each page contains frames (like artboards). A frame is the container for a screen — mobile frame is 375×812, desktop is 1440×900. Everything you design lives inside a frame. Name everything — unnamed layers are a nightmare for developers.' },
  { id:'al',     title:'Auto-Layout — The Game Changer', body:'Auto-layout makes frames behave like CSS flexbox. Add padding, set gap between items, choose direction (horizontal/vertical), set resize behaviour. A button with auto-layout grows with its text. A list with auto-layout reflows when items are added. It\'s the difference between a design that scales and one that breaks.' },
  { id:'comp',   title:'Components — Design Once, Use Everywhere', body:'A component is a reusable design element. Create a button component. Use instances of it everywhere. Change the master component — every instance updates. This is how large design systems work: one button definition, used 500 times across 50 screens, all consistent.' },
  { id:'styles', title:'Styles — Enforcing Consistency',body:'Colour styles, text styles, effect styles. Define "Primary Blue" as a colour style — every button, every link, every accent uses it. Change the style → everything updates. Without styles, a "blue" button might be #1A73E8 in one place and #1B74E9 in another. Styles prevent this.' },
  { id:'dev',    title:'Dev Mode & Handoff',            body:'Figma\'s Dev Mode lets developers inspect designs: exact CSS values, spacing, colours, typography. Export assets as SVG/PNG/PDF. View component variants. Copy CSS snippets. A well-structured Figma file means developers can implement it without guessing.' },
];

export default function UX2_Level0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <UX2Shell levelId={0} canProceed={seen.size >= CARDS.length}>
      <div className="ux2-intro">
        <h1>Figma Foundations</h1>
        <p className="ux2-tagline">🖼️ The tool the entire design industry uses. Learn it properly.</p>
        <p className="ux2-why">Design Thinking (Stage 1) told you what to design. Figma (Stage 2) is how you design it. Auto-layout, components, and styles are what separate professional Figma files from amateur ones.</p>
      </div>
      <div className="ux2-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`ux2-card ${seen.has(c.id)?'seen':''}`} onClick={() => toggle(c.id)}>
            <div className="ux2-card-top">
              <span className="ux2-card-title">{c.title}</span>
              <span style={{color:'#f97316',fontSize:11}}>{seen.has(c.id)?'▲':'▼'}</span>
            </div>
            {seen.has(c.id) && <p className="ux2-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Open all {CARDS.length} cards to continue →</p>}
      {seen.size >= CARDS.length && <div className="ux2-feedback success">✅ Figma landscape mapped. Let's start designing.</div>}
    </UX2Shell>
  );
}
