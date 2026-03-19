// src/screens/cyber-security/stage2/CY2_Level2.jsx — File Permissions (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'chmod',  hint:'Change file permissions' },
  { id:'B2', answer:'chown',  hint:'Change file owner and group' },
  { id:'B3', answer:'644',    hint:'Owner rw-, Group r--, Others r-- (typical file)' },
  { id:'B4', answer:'755',    hint:'Owner rwx, Group r-x, Others r-x (typical script)' },
  { id:'B5', answer:'600',    hint:'Owner rw-, Group ---, Others --- (private key)' },
  { id:'B6', answer:'777',    hint:'Everyone can read, write, execute — dangerous!' },
  { id:'B7', answer:'4755',   hint:'SUID + 755 — runs as file owner regardless of caller' },
];

const LINES = [
  '# Permission string: -rwxr-xr-x',
  '# [-]  [rwx]  [r-x]  [r-x]',
  '#  type  owner  group  others',
  '',
  '# Octal calculation: r=4, w=2, x=1',
  '# owner=6(rw), group=4(r), others=4(r) → [B3]',
  '# owner=7(rwx), group=5(rx), others=5(rx) → [B4]',
  '# owner=6(rw), group=0, others=0 → [B5] (SSH key)',
  '',
  '# Set permissions',
  '[B1] [B3] /var/www/html/index.html',
  '[B1] [B4] /usr/local/bin/script.sh',
  '[B1] [B5] ~/.ssh/id_rsa            # SSH key must be 600',
  '',
  '# DANGEROUS — world writable',
  '# chmod [B6] /etc/passwd  ← NEVER do this!',
  '',
  '# Change owner',
  '[B2] www-data:www-data /var/www/html',
  '',
  '# SUID bit — security risk if abused',
  '[B1] [B7] /usr/bin/tool',
  '# Anyone running tool executes as the file\'s owner',
  '',
  '# Audit: find world-writable files',
  'find / -perm -[B6] -type f 2>/dev/null',
];

export default function CY2_Level2() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim()===b.answer; });
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
          return <input key={i} className={`cy2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:60,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY2Shell levelId={2} canProceed={allCorrect}
      conceptReveal={[
        { label:'SSH Key Must Be 600', detail:'If your SSH private key (~/.ssh/id_rsa) has permissions wider than 600, SSH refuses to use it: "Permissions are too open". This is a security feature — a world-readable private key could be stolen by any local user. Always chmod 600 ~/.ssh/id_rsa after creating it.' },
        { label:'SUID Privilege Escalation', detail:'An SUID binary runs as its owner regardless of who executes it. /bin/bash with SUID owned by root = instant root shell for anyone. Penetration testers look for custom SUID binaries with: find / -perm -4000 2>/dev/null. Never set SUID on shell interpreters.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>File Permissions</h1>
        <p className="cy2-tagline">🔒 Misconfigured permissions are a critical vulnerability. Understand them completely.</p>
        <p className="cy2-why">World-writable /etc/passwd, readable SSH private key, SUID shell — all permission misconfigurations that have caused real breaches. Getting permissions right is the baseline of Linux security.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">🔒 File Permissions — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Permissions mastered. You can audit any system.':'❌ Check your answers — exact octal numbers required.'}</div>}
    </CY2Shell>
  );
}
