// src/screens/ux-ui-designer/stage2/UX2_Level5.jsx — Prototyping & Interactions (CONCEPTS)
import { useState } from 'react';
import UX2Shell from './UX2Shell';

const CARDS = [
  { id:'A', title:'Connections', body:'Switch to Prototype mode (keyboard: P). Click a layer, drag the arrow to another frame. Set trigger (On click, On hover, After delay, On drag). Set action (Navigate to, Open overlay, Close overlay, Scroll to). Set animation (Instant, Dissolve, Move in, Smart animate). Every interaction is a trigger → action → animation triple.' },
    { id:'B', title:'Smart Animate', body:'Smart animate matches layers with the same name across two frames and interpolates between them. A button moving from left to right, a modal growing from a button — Smart animate handles this automatically. Name your layers consistently. This is the closest Figma gets to coded animation without any code.' },
    { id:'C', title:'Overlays', body:'Use Open overlay (not Navigate to) for modals, dropdowns, tooltips. The overlay sits above the current frame without replacing it. Set the overlay position (centre, top, custom). Add a background dimmer by choosing a background colour. Close it with Close overlay action on a dismiss button or by tapping outside.' },
    { id:'D', title:'Scrolling', body:'Set a frame to scroll vertically by making its height fixed and its content taller than the frame. The inner content frame overflows — Figma clips and scrolls. Use "Fix position when scrolling" on elements that should stick (navigation bars, floating action buttons). Test in presentation mode.' },
];

export default function UX2_Level5() {
  const [seen, setSeen] = useState(new Set());

  return (
    <UX2Shell levelId={5} canProceed={seen.size >= CARDS.length}
      prevLevelContext="In the last level you defined the style system that keeps every screen consistent. Now you'll add interactions — connecting screens into a testable prototype."
      cumulativeSkills={[
        "Set up Figma and navigated Files, Pages, and Frames",
        "Created frames at correct dimensions with proper constraints",
        "Applied auto-layout: direction, spacing, padding, resize behaviour",
        "Created master components and instances across screens",
        "Defined colour, text, and effect styles for the booking system",
        "Connected screens with prototype interactions and overlays",
      ]}
      conceptReveal={[
        { label:'Figma Mastery is Practice', detail:'Reading about auto-layout and actually using it are different skills. After each concept level, open Figma and build a small component using what you just read. The muscle memory of keyboard shortcuts (A for frame, C for component, P for prototype) matters as much as conceptual understanding.' },
      ]}
    >
      <div className="ux2-intro">
        <h1>Prototyping & Interactions</h1>
        <p className="ux2-tagline">▶️ Make your design feel real before a line of code is written.</p>
        <p className="ux2-why">A prototype answers questions that a static screen cannot. Does this flow feel fast? Is it obvious where to tap? Does the modal dismiss correctly? Testing a prototype with five users costs nothing. Testing a coded feature costs a week. Always prototype before you build.</p>
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
