// src/screens/cyber-security/stage1/CY1_Level2.jsx — Threat Modelling (FILL)
import { useState } from 'react';
import CY1Shell from './CY1Shell';

const BLANKS = [
  { id:'B1', answer:'assets',      hint:'What are we protecting? Data, systems, reputation' },
  { id:'B2', answer:'threats',     hint:'Who wants to attack us and why?' },
  { id:'B3', answer:'STRIDE',      hint:'Microsoft\'s threat framework: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation' },
  { id:'B4', answer:'attack surface', hint:'All the ways an attacker can interact with the system' },
  { id:'B5', answer:'mitigate',    hint:'Reduce the likelihood or impact of the threat' },
  { id:'B6', answer:'risk',        hint:'Likelihood × Impact — prioritises what to fix first' },
  { id:'B7', answer:'DREAD',       hint:'Damage, Reproducibility, Exploitability, Affected users, Discoverability' },
];

const LINES = [
  '# Threat Modelling — 4 Questions',
  '',
  '# 1. What are we protecting? (identify [B1])',
  '# Patient records, admin credentials, payment data, source code',
  '',
  '# 2. Who would attack us? (identify [B2])',
  '# Nation-state, cybercriminal, disgruntled employee, script kiddie',
  '',
  '# 3. How could they attack? (map the [B4])',
  '# Login page, API endpoints, open ports, phishing, supply chain',
  '',
  '# 4. What do we do about it? ([B5], accept, or transfer)',
  '',
  '# [B3] Framework — 6 threat categories:',
  '# S: Spoofing identity (pretend to be someone else)',
  '# T: Tampering with data',
  '# R: Repudiation (deny doing something)',
  '# I: Information disclosure',
  '# D: Denial of Service',
  '# E: Elevation of privilege',
  '',
  '# [B6] = Likelihood × Impact',
  '# [B7] scores each threat: 1-10 per dimension',
  '# Fix highest-score threats first',
];

export default function CY1_Level2() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toLowerCase()===b.answer.toLowerCase(); });
    setCorrect(r); setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, idx) {
    if (line.startsWith('#')) return <div key={idx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    if (!line.trim()) return <div key={idx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p,i)=>{
          const m=p.match(/^\[B(\d)\]$/); if(!m) return <span key={i}>{p}</span>;
          const bid='B'+m[1]; const bl=BLANKS.find(b=>b.id===bid);
          const st=!checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`cy1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:110,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY1Shell levelId={2} canProceed={allCorrect}
      conceptReveal={[
        { label:'Threat Modelling Before Building', detail:'Teams that threat model during design find security issues at 1/10th the cost of finding them in production. The question "what could an attacker do with this feature?" should be asked at every design review. It takes 30 minutes and saves weeks of incident response.' },
        { label:'STRIDE in Practice', detail:'For every component in your system, apply STRIDE. Login page: Spoofing (brute force), Information Disclosure (error messages leak usernames). API: Tampering (modify request body), Elevation of privilege (access other users\' data). STRIDE is a checklist, not a framework you need to memorise perfectly.' },
      ]}
      prevLevelContext="In the last level you categorised threats. Now you'll map attack surfaces — every door, window, and vent an attacker could enter through the hospital booking system."
      cumulativeSkills={[
        "Applied the CIA triad to evaluate a hospital system's security posture",
        "Built a STRIDE threat model identifying spoofing, tampering, and escalation risks",
        "Mapped the full attack surface: network boundaries, API endpoints, user inputs",
      ]}
    >
      <div className="cy1-intro">
        <h1>Threat Modelling</h1>
        <p className="cy1-tagline">🗺️ Find what could go wrong before attackers find it first.</p>
        <p className="cy1-why">Threat modelling is the most cost-effective security activity — it prevents vulnerabilities from being built in the first place rather than patching them after a breach.</p>
      </div>
      <div className="cy1-panel">
        <div className="cy1-panel-hdr">🗺️ Threat Modelling — fill the blanks</div>
        <div className="cy1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Threat modelling framework locked in.':'❌ Check your answers.'}</div>}
    </CY1Shell>
  );
}
