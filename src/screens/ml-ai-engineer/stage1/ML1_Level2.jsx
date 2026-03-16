// src/screens/ml-ai-engineer/stage1/ML1_Level2.jsx
import { useState } from 'react';
import ML1Shell from './ML1Shell';

export default function ML1_Level2() {
  const [done, setDone] = useState(false);
  return (
    <ML1Shell levelId={2} canProceed={done}>
      <div className="ml1-intro">
        <h1>Types of Learning</h1>
        <p className="ml1-why">Level content coming soon — placeholder for routing.</p>
      </div>
      <button className="ml1-btn" style={{background:'#8b5cf6',marginTop:20}} onClick={() => setDone(true)}>Mark Complete</button>
    </ML1Shell>
  );
}
