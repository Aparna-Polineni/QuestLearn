// src/screens/cyber-security/stage1/CY1_Level0.jsx — CONCEPTS
import { useState } from 'react';
import CY1Shell from './CY1Shell';

const CARDS = [
  { id:'mindset', title:'Think Like an Attacker', body:'Security is about anticipating what could go wrong before it does. An attacker only needs to find one way in. A defender must protect all paths. To defend well, you must first learn to think offensively — what would you attack if you wanted to break this system?' },
  { id:'cia', title:'The CIA Triad', body:'Confidentiality: data is only seen by authorised people. Integrity: data hasn\'t been tampered with. Availability: systems are accessible when needed. Every security control maps to one or more of these. A DDoS attack violates Availability. A data breach violates Confidentiality.' },
  { id:'threat', title:'Threat Modelling', body:'Structured way to identify what could go wrong before building. Who are the attackers? What do they want? How might they attack? What are the consequences? Teams who threat model before building ship more secure products.' },
  { id:'surface', title:'Attack Surface', body:'Everything an attacker could potentially interact with: login pages, APIs, open ports, physical devices, employees (social engineering). Reducing the attack surface (fewer open ports, fewer admin accounts) is the cheapest security control.' },
  { id:'depth', title:'Defence in Depth', body:'Never rely on a single control. Assume each layer will fail and design the next layer accordingly. Firewall fails → IDS detects → EDR blocks → SIEM alerts → IR team responds. Multiple layers = attacker must defeat all of them.' },
  { id:'job', title:'What Security Analysts Do', body:'SOC Analysts monitor alerts and investigate incidents. Penetration Testers find vulnerabilities before attackers do. Threat Hunters proactively search for attackers already inside. IR Specialists respond to active breaches. All roles appear in this path.' },
];

export default function CY1_Level0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <CY1Shell levelId={0} canProceed={seen.size >= CARDS.length}
      cumulativeSkills={[
        "Applied the CIA triad to evaluate a hospital system's security posture",
      ]}
    >
      <div className="cy1-intro">
        <h1>The Security Mindset</h1>
        <p className="cy1-tagline">🔐 Think like an attacker. Defend like an architect.</p>
        <p className="cy1-why">Security is not a product you buy — it's a way of thinking. Every developer, every system designer, every analyst should understand how attackers think. That's where this path starts.</p>
      </div>
      <div className="cy1-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`cy1-card ${seen.has(c.id)?'seen':''}`} onClick={() => toggle(c.id)}>
            <div className="cy1-card-top">
              <span className="cy1-card-title">{c.title}</span>
              <span style={{color:'#10b981',fontSize:11}}>{seen.has(c.id)?'▲':'▼'}</span>
            </div>
            {seen.has(c.id) && <p className="cy1-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Open all {CARDS.length} cards to continue →</p>}
      {seen.size >= CARDS.length && <div className="cy1-feedback success">✅ Security mindset established. Next: the CIA Triad in practice.</div>}
    </CY1Shell>
  );
}
