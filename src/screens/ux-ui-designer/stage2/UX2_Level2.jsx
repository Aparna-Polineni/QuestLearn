// src/screens/ux-ui-designer/stage2/UX2_Level2.jsx — Auto-Layout — The Game Changer (CONCEPTS)
import { useState } from 'react';
import UX2Shell from './UX2Shell';

const CARDS = [
  { id:'A', title:'Direction & Spacing', body:'Auto-layout can flow horizontally (like a button row) or vertically (like a list). Gap controls space between items. Padding controls space from the frame edge. Change the gap — all items reflow. Add an item — everything adjusts. This is what makes auto-layout worth learning.' },
    { id:'B', title:'Hug vs Fill vs Fixed', body:'Hug: the frame shrinks to fit its content. A button with hug width grows when its label text grows. Fill: the item expands to fill its parent. A nav item with fill width takes an equal share of the nav bar. Fixed: explicit pixel size, ignores content. Know which to use and why — this is the source of most auto-layout confusion.' },
    { id:'C', title:'Nested Auto-Layout', body:'Real UIs are nested. A card is a vertical auto-layout (title, body, footer). The card header is a horizontal auto-layout (icon, text, badge). The badge is another frame. Nesting auto-layout mirrors how CSS flexbox nests in HTML. Build from the inside out: smallest components first, then composite them.' },
    { id:'D', title:'Absolute Position', body:'Sometimes a child should float above the auto-layout flow — a notification badge on an avatar, a tooltip. Set the child to "absolute position" in the auto-layout context. It leaves the flow but stays within the frame. This is the equivalent of position: absolute in CSS.' },
];

export default function UX2_Level2() {
  const [seen, setSeen] = useState(new Set());

  return (
    <UX2Shell levelId={2} canProceed={seen.size >= CARDS.length}
      prevLevelContext="In the last level you mastered frames and constraints. Now you'll apply auto-layout — the feature that makes frames respond to content like CSS flexbox."
      cumulativeSkills={[
        "Set up Figma and navigated Files, Pages, and Frames",
        "Created frames at correct mobile and desktop dimensions with proper constraints",
        "Applied auto-layout: direction, spacing, padding, resize behaviour",
      ]}
      conceptReveal={[
        { label:'Figma Mastery is Practice', detail:'Reading about auto-layout and actually using it are different skills. After each concept level, open Figma and build a small component using what you just read. The muscle memory of keyboard shortcuts (A for frame, C for component, P for prototype) matters as much as conceptual understanding.' },
      ]}
    >
      <div className="ux2-intro">
        <h1>Auto-Layout — The Game Changer</h1>
        <p className="ux2-tagline">⚡ Auto-layout makes frames behave like CSS flexbox.</p>
        <p className="ux2-why">Auto-layout is the single feature that separates professional Figma files from amateur ones. Without it, every spacing adjustment is manual. With it, your designs respond to content changes automatically — exactly like a real coded interface.</p>
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
