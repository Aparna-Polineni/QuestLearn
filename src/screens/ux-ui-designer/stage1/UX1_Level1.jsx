import { useState } from 'react';
import UX1Shell from './UX1Shell';
export default function UX1_Level1() {
  const [done, setDone] = useState(false);
  return (
    <UX1Shell levelId={1} canProceed={done}>
      <div className="ux1-intro"><h1>Level 1.1</h1><p className="ux1-why">Content coming in next build session.</p></div>
      <button className="ux1-btn" style={{background:'#ec4899',marginTop:20}} onClick={() => setDone(true)}>Mark Complete</button>
    </UX1Shell>
  );
}
