// src/screens/ux-ui-designer/stage2/UX2_Level7.jsx — Design Systems in Practice (CONCEPTS)
import { useState } from 'react';
import UX2Shell from './UX2Shell';

const CARDS = [
  { id:'A', title:'Design Tokens', body:'Tokens are the atomic values of a design system: color/primary/500 = #1A73E8, spacing/4 = 16px, radius/md = 8px. Tokens have semantic names (color/error) not colour names (red). Tokens map to CSS variables, Swift constants, or Android resources. A change to a token propagates everywhere the token is used — in design and in code.' },
    { id:'B', title:'Component Documentation', body:'Each component in the system needs: usage guidelines (when to use it, when not to), variants documented (all states shown), properties documented (what designers can override), accessibility notes (aria labels, keyboard behaviour, colour contrast). Without documentation, components are used incorrectly and the system loses coherence.' },
    { id:'C', title:'Versioning & Governance', body:'Design systems need owners. Who approves new components? How are breaking changes communicated? When is it safe to update a component that is used in 200 screens? Teams with answers to these questions have working design systems. Teams without them have a shared Figma file that everyone is afraid to touch.' },
    { id:'D', title:'Hospital Booking System Design Tokens', body:'For this project: Primary = #DB2777 (pink), Success = #059669 (green), Error = #DC2626 (red), Warning = #D97706 (amber), Neutral-900 = #0F172A, Neutral-600 = #475569. Base spacing unit = 4px. Border radius: sm = 4px, md = 8px, lg = 12px. These are your tokens — every component and screen should reference them.' },
];

export default function UX2_Level7() {
  const [seen, setSeen] = useState(new Set());

  return (
    <UX2Shell levelId={7} canProceed={seen.size >= CARDS.length}
      prevLevelContext="In the last level you prepared designs for developer handoff. Now you'll look at how large teams keep every screen consistent — the design system."
      cumulativeSkills={[
        "Set up Figma and navigated Files, Pages, and Frames",
        "Created frames at correct dimensions with proper constraints",
        "Applied auto-layout: direction, spacing, padding, resize behaviour",
        "Created master components and instances across screens",
        "Defined colour, text, and effect styles for the booking system",
        "Connected screens with prototype interactions and overlays",
        "Prepared a design file for developer handoff using Dev Mode",
        "Documented a design system: tokens, components, usage guidelines",
      ]}
      conceptReveal={[
        { label:'Figma Mastery is Practice', detail:'Reading about auto-layout and actually using it are different skills. After each concept level, open Figma and build a small component using what you just read. The muscle memory of keyboard shortcuts (A for frame, C for component, P for prototype) matters as much as conceptual understanding.' },
      ]}
    >
      <div className="ux2-intro">
        <h1>Design Systems in Practice</h1>
        <p className="ux2-tagline">🏗️ One library. Every designer. Every screen. Consistent.</p>
        <p className="ux2-why">A design system is not a Figma file — it is the agreement a design team makes about how things should look and behave. The Figma file is just where that agreement is documented. Poorly maintained design systems are worse than none — they create false confidence in consistency that does not exist.</p>
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
