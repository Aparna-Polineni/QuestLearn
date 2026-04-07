// src/screens/cyber-security/stage1/CY1_Level7.jsx — Capstone: Threat Model (BUILD)
import { useState } from 'react';
import CY1Shell from './CY1Shell';

const REQS = [
  { id:'r1', label:'Identify assets to protect' },
  { id:'r2', label:'Identify threat actors and their motivations' },
  { id:'r3', label:'Map at least 4 attack vectors (use STRIDE)' },
  { id:'r4', label:'Assign risk level (High/Medium/Low) to each threat' },
  { id:'r5', label:'Propose a mitigation for each High-risk threat' },
  { id:'r6', label:'List at least 2 detection controls' },
];

const CHECK = {
  r1: c => c.includes('ASSET') || c.includes('DATA') || c.includes('PROTECT') || c.includes('CREDENTIAL'),
  r2: c => (c.includes('ATTACKER') || c.includes('THREAT ACTOR') || c.includes('INSIDER') || c.includes('CRIMINAL') || c.includes('NATION')) && (c.includes('MOTIVATION') || c.includes('GOAL') || c.includes('WANT')),
  r3: c => {
    const stride = ['SPOOFING','TAMPERING','REPUDIATION','DISCLOSURE','DENIAL','ELEVATION'];
    const found = stride.filter(s => c.includes(s)).length;
    return found >= 2 || (c.includes('ATTACK VECTOR') && c.includes('SQL') || c.includes('PHISHING') || c.includes('BRUTE'));
  },
  r4: c => (c.includes('HIGH') || c.includes('MEDIUM') || c.includes('LOW')) && (c.includes('RISK') || c.includes('SEVERITY')),
  r5: c => c.includes('MITIGAT') || c.includes('CONTROL') || c.includes('FIX') || c.includes('PATCH') || c.includes('ENCRYPT'),
  r6: c => (c.includes('SIEM') || c.includes('LOG') || c.includes('MONITOR') || c.includes('ALERT') || c.includes('DETECT')) && c.includes('CONTROL'),
};

const SOLUTION = `# Threat Model: Hospital Patient Portal

## Assets
- Patient medical records (PII + PHI — HIPAA regulated)
- Doctor credentials (admin access to all records)
- Appointment booking system (availability)
- Payment information (PCI-DSS regulated)

## Threat Actors
- Cybercriminals: financial motivation — sell PHI on dark web ($250/record)
- Nation-state: intelligence gathering on government officials treated here
- Insider: disgruntled employee with database access
- Script kiddies: opportunistic exploitation of known CVEs

## Attack Vectors (STRIDE)
| Threat | Category | Risk |
|--------|----------|------|
| Credential stuffing on login page | Spoofing | HIGH |
| SQL injection on search form | Tampering + Disclosure | HIGH |
| Doctor accessing other doctor's patients | Elevation of Privilege | HIGH |
| Patient portal DDoS during emergency | Denial of Service | MEDIUM |
| Missing audit log on record access | Repudiation | MEDIUM |
| Error messages leaking DB schema | Information Disclosure | LOW |

## Mitigations (High-risk threats)
- Credential stuffing: MFA + rate limiting (5 attempts/min) + account lockout
- SQL injection: parameterised queries + WAF + DAST scanning in CI/CD
- Privilege escalation: RBAC — doctors only see their assigned patients + audit log

## Detection Controls
- SIEM: alert on >3 failed logins from same IP (brute force indicator)
- Monitoring control: alert on record access volume anomaly (insider threat)
- Log control: immutable audit log of every record access (who, when, from where)`;

export default function CY1_Level7() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id,fn]) => { r[id]=fn(c); });
    setResults(r); setChecked(true);
  }

  const passCount = Object.values(results).filter(Boolean).length;
  const allPass = checked && passCount === REQS.length;

  return (
    <CY1Shell levelId={7} canProceed={allPass}
      conceptReveal={[
        { label:'Stage 1 Complete', detail:'You now understand the security mindset, CIA triad, threat modelling with STRIDE, attack surfaces, common vulnerabilities, defence in depth, and security career paths. Stage 2 builds the technical foundation: Linux, networking, and the command line tools every security analyst uses daily.' },
      ]}
      prevLevelContext="You have assessed, modelled, mapped, and attacked the hospital system. This capstone asks you to produce a complete threat model and security recommendation report."
      cumulativeSkills={[
        "Applied the CIA triad to evaluate a hospital system's security posture",
        "Built a STRIDE threat model identifying spoofing, tampering, and escalation risks",
        "Mapped the full attack surface: network boundaries, API endpoints, user inputs",
        "Identified social engineering attacks targeting hospital staff",
        "Designed an authentication system resistant to credential stuffing and brute force",
        "Selected and applied encryption for data at rest and in transit",
        "Conducted an attacker-perspective review: reconnaissance, exploitation, and persistence",
        "Produced a complete security assessment with prioritised remediation recommendations",
      ]}
    >
      <div className="cy1-intro">
        <h1>Capstone — Threat Model</h1>
        <p className="cy1-tagline">🏆 Build a complete threat model for a hospital patient portal.</p>
        <p className="cy1-why">A threat model is the deliverable every security team produces before a system goes live. Write one that covers assets, actors, attack vectors, risk levels, mitigations, and detection.</p>
      </div>

      <div style={{marginBottom:14}}>
        {REQS.map(r => (
          <div className="cy1-req" key={r.id}>
            <span style={{color:!checked?'#475569':results[r.id]?'#4ade80':'#f87171',fontSize:14,width:18}}>
              {!checked?'○':results[r.id]?'✓':'✗'}
            </span>
            <span style={{color:'#cbd5e1',fontSize:13}}>{r.label}</span>
          </div>
        ))}
      </div>

      <textarea className="cy1-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="# Build your threat model...&#10;# Cover: assets, threat actors, attack vectors (STRIDE), risk levels, mitigations, detection"
        style={{minHeight:300}} />

      <div style={{display:'flex',gap:10,marginTop:10}}>
        <button className="cy1-check-btn" onClick={check}>Check Threat Model</button>
        <button className="cy1-check-btn" style={{background:'#334155',color:'#94a3b8'}} onClick={() => setShowSolution(s=>!s)}>
          {showSolution?'Hide':'Show'} Example Solution
        </button>
      </div>

      {showSolution && (
        <div className="cy1-panel" style={{marginTop:12}}>
          <div className="cy1-panel-hdr">✅ Example Solution</div>
          <pre className="cy1-panel-body" style={{color:'#94a3b8',overflowX:'auto',margin:0,fontSize:12}}>{SOLUTION}</pre>
        </div>
      )}

      {checked && (
        <div className={`cy1-feedback ${allPass?'success':'error'}`}>
          {allPass?'🎓 Stage 1 Complete! You think like a security analyst.':`❌ ${passCount}/${REQS.length} requirements met.`}
        </div>
      )}
    </CY1Shell>
  );
}
