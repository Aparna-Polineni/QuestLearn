// src/screens/ux-ui-designer/stage2/UX2_Level1.jsx — Frames & Layout (CONCEPTS)
import { useState } from 'react';
import UX2Shell from './UX2Shell';

const CARDS = [
  { id:'A', title:'Frame vs Group', body:'A frame has its own coordinate system, clips content to its bounds, and can have auto-layout. A group is just a named collection — it has no independent behaviour. Use frames for screens, sections, and components. Use groups sparingly, only when you need to move things together temporarily.' },
    { id:'B', title:'Clip Content', body:'When "Clip content" is on (default for frames), anything outside the frame boundary is hidden. This is how scroll areas work — a fixed-height frame with clip content, containing a taller inner frame that scrolls. Turn it off for dropdowns or tooltips that need to overflow their container.' },
    { id:'C', title:'Constraints', body:'Constraints define how a layer behaves when its parent frame resizes. Left+Top: stays pinned to top-left corner. Center: stays centered. Left+Right (stretch): grows with the frame. Scale: resizes proportionally. Wrong constraints are why designs break at different screen sizes.' },
    { id:'D', title:'Responsive Frames', body:'Set the frame width to fill the viewport, then use constraints and auto-layout to make the content respond. A card with Left+Right constraint stretches to fill whatever width is available. Test by dragging the frame wider — if everything stays in the right place, your constraints are correct.' },
];

export default function UX2_Level1() {
  const [seen, setSeen] = useState(new Set());

  return (
    <UX2Shell levelId={1} canProceed={seen.size >= CARDS.length}
      prevLevelContext="In the last level you learned what Figma is and why it became the industry standard. Now you'll work with its foundational building block — the frame."
      cumulativeSkills={[
        "Set up Figma and navigated Files, Pages, and Frames",
        "Created frames at correct mobile (375×812) and desktop (1440×900) dimensions",
      ]}
      conceptReveal={[
        { label:'Figma Mastery is Practice', detail:'Reading about auto-layout and actually using it are different skills. After each concept level, open Figma and build a small component using what you just read. The muscle memory of keyboard shortcuts (A for frame, C for component, P for prototype) matters as much as conceptual understanding.' },
      ]}
    >
      <div className="ux2-intro">
        <h1>Frames & Layout</h1>
        <p className="ux2-tagline">🖼️ Every screen starts with a frame. Master the container before the content.</p>
        <p className="ux2-why">Figma frames are not just rectangles — they define clipping, auto-layout behaviour, export boundaries, and prototype connections. A designer who understands frames builds screens that scale. One who doesn't rebuilds everything when the content changes.</p>
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
