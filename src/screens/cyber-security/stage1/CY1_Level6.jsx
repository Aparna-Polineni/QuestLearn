// src/screens/cyber-security/stage1/CY1_Level6.jsx — Security Careers (CONCEPTS)
import { useState } from 'react';
import CY1Shell from './CY1Shell';

const CARDS = [
  { id:'soc',  title:'SOC Analyst (Tier 1–3)',      body:'Security Operations Centre analysts monitor alerts 24/7, investigate incidents, and escalate threats. Tier 1: triage alerts. Tier 2: deeper investigation. Tier 3: threat hunting and incident response. Entry point for most security careers. Uses SIEM, EDR, ticketing systems.' },
  { id:'pen',  title:'Penetration Tester',           body:'Paid to break into systems before criminals do. Red team (attacker) vs blue team (defender) exercises. Requires deep technical knowledge: network protocols, web vulnerabilities, exploitation techniques. Certifications: OSCP, CEH. High demand, high pay.' },
  { id:'appsec', title:'Application Security Engineer', body:'Embeds security into the development process. Code reviews, SAST/DAST scanning, threat modelling with dev teams, secure coding standards. The bridge between security and engineering. Growing rapidly as companies shift-left on security.' },
  { id:'cloud', title:'Cloud Security Engineer',    body:'Secures AWS/Azure/GCP environments. IAM policies, S3 bucket misconfigurations, network security groups, compliance (SOC2, ISO27001). Cloud misconfigurations caused 45% of 2023 breaches. Fastest-growing security role.' },
  { id:'ir',    title:'Incident Responder',          body:'Called when a breach is confirmed. Contain the damage, eradicate the attacker, recover systems, and write the post-incident report. High-pressure, varied work. Often consultants at firms like CrowdStrike, Mandiant. Requires forensics skills.' },
  { id:'grc',   title:'GRC Analyst',                body:'Governance, Risk, and Compliance. Manages security policies, risk assessments, audits, and regulatory compliance (GDPR, HIPAA, PCI-DSS). Less technical, more process-oriented. Often the fastest path into security from a non-technical background.' },
];

export default function CY1_Level6() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <CY1Shell levelId={6} canProceed={seen.size >= CARDS.length}
      prevLevelContext="In the last level you encrypted the data. Now you'll step into the attacker's shoes — enumerate, scan, exploit, and persist — to find what you missed from the defender's side."
      cumulativeSkills={[
        "Applied the CIA triad to evaluate a hospital system's security posture",
        "Built a STRIDE threat model identifying spoofing, tampering, and escalation risks",
        "Mapped the full attack surface: network boundaries, API endpoints, user inputs",
        "Identified social engineering attacks targeting hospital staff",
        "Designed an authentication system resistant to credential stuffing and brute force",
        "Selected and applied encryption for data at rest and in transit",
        "Conducted an attacker-perspective review: reconnaissance, exploitation, and persistence",
      ]}
    >
      <div className="cy1-intro">
        <h1>Security Careers</h1>
        <p className="cy1-tagline">💼 3.4 million unfilled security jobs globally. Which role fits you?</p>
        <p className="cy1-why">Cyber security isn't one job — it's a family of specialisations. This path covers skills that apply across all of them: threat analysis, Linux, ethical hacking, SIEM, and incident response.</p>
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
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Explore all {CARDS.length} roles to continue →</p>}
      {seen.size >= CARDS.length && <div className="cy1-feedback success">✅ Security landscape mapped. Capstone next.</div>}
    </CY1Shell>
  );
}
