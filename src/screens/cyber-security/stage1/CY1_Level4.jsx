import { useState } from 'react';
import CY1Shell from './CY1Shell';
export default function CY1_Level4() {
  const [done, setDone] = useState(false);
  return (
    <CY1Shell levelId={4} canProceed={done}>
      <div className="cy1-intro"><h1>Level 1.4</h1><p className="cy1-why">Content coming in next build session.</p></div>
      <button className="cy1-btn" style={{background:'#10b981',marginTop:20}} onClick={() => setDone(true)}>Mark Complete</button>
    </CY1Shell>
  );
}
