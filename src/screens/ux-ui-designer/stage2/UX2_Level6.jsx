// src/screens/ux-ui-designer/stage2/UX2_Level6.jsx — Dev Mode & Handoff (CONCEPTS)
import { useState } from 'react';
import UX2Shell from './UX2Shell';

const CARDS = [
  { id:'A', title:'Dev Mode Basics', body:'Toggle Dev Mode (keyboard: Shift+D in browser Figma). Click any layer to see: exact CSS values, spacing, dimensions, colour in HEX/RGB/HSL, font properties, applied styles. Export assets as SVG, PNG, or PDF. Copy CSS snippets for text styles, shadows, and border-radius. A developer should find everything they need here without asking.' },
    { id:'B', title:'Annotations', body:'Add annotations (Dev Mode → Add annotation) to explain behaviour that CSS cannot express: "This dropdown closes on outside click", "This input validates on blur not on change", "Animation: 200ms ease-out". Annotations are developer notes embedded in the design file. Use them for interactions, accessibility requirements, and edge cases.' },
    { id:'C', title:'Ready for Dev Checklist', body:'Every frame is named. Every layer is named. Auto-layout is used for spacing (not manual positioning). Styles are applied (not one-off values). Components are used (not duplicated frames). Prototype connections show every possible state. Edge cases are designed: empty state, error state, loading state, long text state.' },
    { id:'D', title:'Redline & Spacing', body:'When you hover over a layer in Dev Mode while holding Alt, Figma shows the distance to every adjacent layer. This is "redlining" — the spacing documentation developers need. Consistent spacing via styles means these numbers will be multiples of your base unit (8px grid). If they are not, the design has inconsistencies to fix.' },
];

export default function UX2_Level6() {
  const [seen, setSeen] = useState(new Set());

  return (
    <UX2Shell levelId={6} canProceed={seen.size >= CARDS.length}
      prevLevelContext="In the last level you made the design interactive with prototype connections. Now you'll prepare it for handoff — ensuring developers can implement every screen without guessing."
      cumulativeSkills={[
        "Set up Figma and navigated Files, Pages, and Frames",
        "Created frames at correct dimensions with proper constraints",
        "Applied auto-layout: direction, spacing, padding, resize behaviour",
        "Created master components and instances across screens",
        "Defined colour, text, and effect styles for the booking system",
        "Connected screens with prototype interactions and overlays",
        "Prepared a design file for developer handoff using Dev Mode",
      ]}
      conceptReveal={[
        { label:'Figma Mastery is Practice', detail:'Reading about auto-layout and actually using it are different skills. After each concept level, open Figma and build a small component using what you just read. The muscle memory of keyboard shortcuts (A for frame, C for component, P for prototype) matters as much as conceptual understanding.' },
      ]}
    >
      <div className="ux2-intro">
        <h1>Dev Mode & Handoff</h1>
        <p className="ux2-tagline">👩‍💻 A design is only finished when a developer can build it.</p>
        <p className="ux2-why">Dev Mode is the bridge between design and engineering. A developer should be able to open Dev Mode and implement every screen without asking the designer a single question. Ambiguous designs cost developer time. Well-structured handoff files save it.</p>
      </div>
      <div className="ux2-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`ux2-card ${seen.has(c.id) ? 'seen' : ''}`}
            onClick={() => setSeen(prev => { const n=new Set(prev); n.add(c.id); return n; })}>
            <div className="ux2-card-top">
              <span className="ux2-card-title">{c.title}</span>
              <span>{seen.has(c.id) ? '✓' : '▸'}</span>
            </div>
            {seen.has(c.id) && <p className="ux2-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
    </UX2Shell>
  );
}
