// src/screens/ux-ui-designer/stage2/UX2_Level6.jsx
import { useState } from 'react';
import UX2Shell from './UX2Shell';

export default function UX2_Level6() {
  const [done, setDone] = useState(false);
  return (
    <UX2Shell levelId={6} canProceed={done}>
      <div className="ux2-intro">
        <h1>Broken Figma File Hunt</h1>
        <p className="ux2-why">Full interactive level — coming in the next build session.</p>
      </div>
      <button
        className="ux2-btn"
        style={{background:'#f97316', marginTop:20}}
        onClick={() => setDone(true)}
      >
        Mark Complete (placeholder)
      </button>
    </UX2Shell>
  );
}
