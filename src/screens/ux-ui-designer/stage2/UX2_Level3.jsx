// src/screens/ux-ui-designer/stage2/UX2_Level3.jsx — Components — Design Once, Use Everywhere (CONCEPTS)
import { useState } from 'react';
import UX2Shell from './UX2Shell';

const CARDS = [
  { id:'A', title:'Master & Instance', body:'Create a component (Cmd+Alt+K or right-click → Create component). Every copy you place is an instance. Edit the master → all instances update. Edit an instance → only that instance changes (override). Right-click → Reset to master component to undo overrides. This is the core workflow.' },
    { id:'B', title:'Variants', body:'A component set groups related variants: Button/Primary/Default, Button/Primary/Hover, Button/Primary/Disabled. Figma shows them as a grid. When you use an instance, you can switch between variants in the properties panel. Variants replace the old pattern of hiding layers with yes/no toggles.' },
    { id:'C', title:'Component Properties', body:'Text properties (override a text layer from the instance panel), boolean properties (show/hide a layer), instance swap properties (swap one component for another). Expose what designers need to customise. Hide what should stay consistent. A well-propertied component is faster to use than a loosely structured group.' },
    { id:'D', title:'Local vs Published', body:'Components in a local file are only available there. Components published to a Team Library are available in every file in your team. The hospital booking project should have a shared library: buttons, form fields, navigation, badges. Every designer uses the same source.' },
];

export default function UX2_Level3() {
  const [seen, setSeen] = useState(new Set());

  return (
    <UX2Shell levelId={3} canProceed={seen.size >= CARDS.length}
      prevLevelContext="In the last level you built responsive layouts with auto-layout. Now you'll turn repeating elements into components — the mechanism that keeps every screen consistent."
      cumulativeSkills={[
        "Set up Figma and navigated Files, Pages, and Frames",
        "Created frames at correct mobile and desktop dimensions with proper constraints",
        "Applied auto-layout: direction, spacing, padding, resize behaviour",
        "Created master components and placed instances across screens",
      ]}
      conceptReveal={[
        { label:'Figma Mastery is Practice', detail:'Reading about auto-layout and actually using it are different skills. After each concept level, open Figma and build a small component using what you just read. The muscle memory of keyboard shortcuts (A for frame, C for component, P for prototype) matters as much as conceptual understanding.' },
      ]}
    >
      <div className="ux2-intro">
        <h1>Components — Design Once, Use Everywhere</h1>
        <p className="ux2-tagline">🧩 One definition. Infinite consistent instances.</p>
        <p className="ux2-why">Components are the difference between a design file and a design system. Every button in every screen comes from one source. Change the source — every instance updates. This is how large teams maintain visual consistency across dozens of screens built over months.</p>
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
