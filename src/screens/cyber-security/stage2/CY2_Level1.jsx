// src/screens/cyber-security/stage2/CY2_Level1.jsx — Navigation & File System (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'ls -la',   hint:'List all files including hidden, with permissions' },
  { id:'B2', answer:'cat',      hint:'Print file contents to terminal' },
  { id:'B3', answer:'less',     hint:'Page through large files — q=quit, /=search' },
  { id:'B4', answer:'find',     hint:'Search for files by name, time, permissions' },
  { id:'B5', answer:'grep',     hint:'Search for patterns inside file contents' },
  { id:'B6', answer:'tail -f',  hint:'Stream a log file live as new lines are added' },
  { id:'B7', answer:'pwd',      hint:'Print working directory — where am I?' },
];

const LINES = [
  '# Navigate the Linux file system',
  '[B7]                             # where am I?',
  'cd /var/log                      # move to logs directory',
  '[B1]                             # all files + permissions',
  '',
  '# Read files',
  '[B2] /etc/passwd                 # dump file to terminal',
  '[B3] /var/log/syslog             # paginate large file',
  '',
  '# Find files (critical for forensics)',
  '[B4] / -name "*.conf" 2>/dev/null',
  '[B4] /tmp -newer /etc/passwd     # recently modified',
  '[B4] / -perm -4000 2>/dev/null   # SUID files (privesc)',
  '',
  '# Search inside files',
  '[B5] "Failed password" /var/log/auth.log',
  '[B5] -r "password" /etc/         # recursive search',
  '[B5] -i "error" /var/log/syslog  # case-insensitive',
  '',
  '# Live log monitoring (incident response)',
  '[B6] /var/log/auth.log           # stream new entries',
];

export default function CY2_Level1() {
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
          return <input key={i} className={`cy2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:90,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY2Shell levelId={1} canProceed={allCorrect}
      conceptReveal={[
        { label:'Critical Security Directories', detail:'/etc: all system configuration — passwords, SSH config, cron jobs. /var/log: all logs — auth.log, syslog, apache access.log. /tmp: world-writable — malware often lives here. /proc: running processes as files. Know these and you can investigate any Linux incident.' },
        { label:'find for Forensics', detail:'find / -perm -4000 discovers SUID binaries — executables that run as their owner (often root) regardless of who runs them. Attackers plant SUID shells for persistence. find /tmp -newer /etc/passwd finds files created after a reference time — useful for timeline analysis.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>Navigation & File System</h1>
        <p className="cy2-tagline">🗂️ Navigate any Linux system confidently — without a GUI.</p>
        <p className="cy2-why">Every security task starts here. Finding log files, reading configs, searching for malware artefacts — all on the command line. These commands are your daily toolkit.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">🗂️ Linux Navigation — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Navigation commands locked in.':'❌ Check your answers — include flags like -la, -f.'}</div>}
    </CY2Shell>
  );
}
