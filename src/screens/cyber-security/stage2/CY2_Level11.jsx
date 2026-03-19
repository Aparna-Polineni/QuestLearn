// src/screens/cyber-security/stage2/CY2_Level11.jsx — Log Analysis (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'/var/log/auth.log',   hint:'SSH logins, sudo usage, su attempts' },
  { id:'B2', answer:'/var/log/syslog',     hint:'General system events — services, kernel, daemons' },
  { id:'B3', answer:'grep',                hint:'Search for pattern in log file' },
  { id:'B4', answer:'awk',                 hint:'Extract specific fields from structured log lines' },
  { id:'B5', answer:'journalctl',          hint:'Read systemd logs — modern replacement for syslog' },
  { id:'B6', answer:'last',               hint:'Show history of user logins and reboots' },
  { id:'B7', answer:'ausearch',            hint:'Search Linux audit log for specific events' },
];

const LINES = [
  '# Key log files',
  '# [B1]    — authentication events',
  '# [B2]          — system events',
  '# /var/log/apache2/access.log — web requests',
  '# /var/log/kern.log           — kernel messages',
  '',
  '# Find brute force attempts',
  '[B3] "Failed password" [B1] | wc -l',
  '[B3] "Failed password for" [B1] | [B4] \'{print $9}\' | sort | uniq -c | sort -rn',
  '# → shows: 2847 root, 156 admin, 43 ubuntu',
  '',
  '# Find successful logins after failures (compromise indicator)',
  '[B3] "Accepted password" [B1]',
  '',
  '# sudo usage (privilege escalation)',
  '[B3] "sudo" [B1] | [B3] "COMMAND"',
  '',
  '# Read systemd service logs',
  '[B5] -u nginx --since "1 hour ago"',
  '[B5] -f                          # follow live',
  '',
  '# Login history',
  '[B6]                              # all logins',
  '[B6] analyst                     # specific user',
  '',
  '# Audit log — if auditd is running',
  '[B7] -f /var/log/audit/audit.log -x execve | head -20',
];

export default function CY2_Level11() {
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
          return <input key={i} className={`cy2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:bid.includes('B1')||bid.includes('B2')?160:80,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY2Shell levelId={11} canProceed={allCorrect}
      conceptReveal={[
        { label:'Brute Force Pattern', detail:'2847 "Failed password for root" + 1 "Accepted password for root" = successful brute force. The pattern: many failures then a success. grep "Failed password" auth.log | awk \'{print $11}\' | sort | uniq -c | sort -rn shows attacking IPs. Block the top offenders with ufw deny from IP.' },
        { label:'Log Correlation', detail:'A real attacker investigation requires correlating multiple logs: auth.log (login time) + apache access.log (requests from that IP) + syslog (commands run) + cron (persistence). Timeline reconstruction — ordering events across logs — tells you exactly what the attacker did and when.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>Log Analysis</h1>
        <p className="cy2-tagline">📋 Logs are the evidence. grep, awk, and pattern recognition are the tools.</p>
        <p className="cy2-why">Every security incident leaves a trail in logs — if you know where to look and what patterns mean. SOC analysts spend 50% of their time in logs. These commands are the starting point for every investigation.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">📋 Log Analysis — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Log analysis skills ready.':'❌ Check your answers — include full paths.'}</div>}
    </CY2Shell>
  );
}
