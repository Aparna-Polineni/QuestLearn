// src/screens/cyber-security/stage2/CY2_Level6.jsx — Server Misconfiguration Hunt (DEBUG)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BUGS = [
  {
    id:1, label:'Misconfiguration 1 — SSH allows root login and password auth',
    bad:`# /etc/ssh/sshd_config (default/insecure)
PermitRootLogin yes          # attacker can brute-force root directly
PasswordAuthentication yes   # no key required — vulnerable to password spraying
Port 22                      # default port — bots constantly scan this
MaxAuthTries 6               # 6 attempts before disconnect — brute force friendly`,
    good:`# /etc/ssh/sshd_config (hardened)
PermitRootLogin no            # force use of sudo after SSH
PasswordAuthentication no     # keys only — no password brute force
Port 2222                     # non-standard port reduces automated scan noise
MaxAuthTries 3                # 3 attempts then disconnect
AllowUsers analyst deploy     # whitelist: only these users can SSH
# After editing: systemctl restart sshd`,
    why:'SSH misconfiguration is responsible for thousands of server compromises monthly. Bots scan port 22 24/7 and attempt common passwords. Disabling password auth and root login completely eliminates these attacks. AllowUsers limits blast radius if a user account is compromised.',
    hint:'SSH root login + password auth = constant brute force target.',
  },
  {
    id:2, label:'Misconfiguration 2 — Web server exposes sensitive files',
    bad:`# Apache default config — exposes everything
<Directory /var/www/html>
    Options Indexes FollowSymLinks   # Indexes = directory listing!
    AllowOverride All
</Directory>
# /var/www/html/.env contains:
# DB_PASSWORD=SuperSecret123
# API_KEY=sk-prod-a1b2c3...
# Accessible at: https://hospital.nhs.uk/.env`,
    good:`# Apache hardened config
<Directory /var/www/html>
    Options -Indexes -FollowSymLinks  # disable directory listing
    AllowOverride None
</Directory>

# Block access to sensitive files
<FilesMatch "\.(env|git|sql|bak|conf)$">
    Require all denied
</FilesMatch>

# Dedicated rule for .env and .git
<DirectoryMatch "/\.">
    Require all denied
</DirectoryMatch>`,
    why:'Directory listing (Options Indexes) lets anyone browse your web server like a file manager. Combined with .env files or .git directories in the webroot, attackers can download database passwords and API keys directly. Always disable Indexes and deny access to dotfiles.',
    hint:'Options Indexes = public file browser. Never in production.',
  },
  {
    id:3, label:'Misconfiguration 3 — World-writable log directory',
    bad:`# Check permissions
ls -la /var/log/apache2/
# drwxrwxrwx 2 root root 4096 ...  ← 777! World-writable
# -rw-rw-rw- 1 root root ...        ← Log files world-writable

# Attacker can:
# 1. Truncate logs to hide activity: echo "" > /var/log/apache2/access.log
# 2. Write fake log entries to mislead investigators
# 3. Execute if log content is processed by a vulnerable parser`,
    good:`# Correct permissions for log directory
chmod 750 /var/log/apache2/           # only owner and group
chown root:adm /var/log/apache2/      # adm group for log reading
chmod 640 /var/log/apache2/*.log      # group-readable, not writable

# Protect log integrity with append-only flag (even root can't delete)
chattr +a /var/log/apache2/access.log
# Remove append-only: chattr -a (requires root)

# Centralise logs to a remote server — attackers can't tamper
# rsyslog → SIEM prevents local log manipulation`,
    why:'World-writable log files let any local user or compromised process erase evidence of an attack. Attackers who gain any shell access immediately clear logs to hide their tracks. Logs should be writable only by root/log daemon, readable by the monitoring group, and ideally shipped to a remote SIEM in real time.',
    hint:'World-writable logs = attacker erases their tracks. Always 640 or 640.',
  },
];

export default function CY2_Level6() {
  const [found, setFound] = useState(new Set());

  return (
    <CY2Shell levelId={6} canProceed={found.size >= BUGS.length}
      conceptReveal={[{ label:'Hardening Checklist', detail:'SSH: no root login, keys only, non-default port, AllowUsers. Web: no directory listing, no dotfiles accessible, no version disclosure. Files: logs are 640, no world-writable files, SUID only on necessary binaries. Services: disable everything not needed (systemctl disable cups bluetooth). These four areas cover 80% of configuration findings in penetration tests.' }]}
    >
      <div className="cy2-intro">
        <h1>Server Misconfiguration Hunt</h1>
        <p className="cy2-tagline">🔎 Three real misconfigurations. All exploitable. All fixable in minutes.</p>
        <p className="cy2-why">Configuration mistakes are responsible for 45% of cloud breaches. These aren't zero-days — they're default settings that were never changed. Recognise them and fix them before attackers find them.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {BUGS.map(bug => (
          <div key={bug.id} style={{background:'#1e293b',borderRadius:10,padding:'16px 20px',border:`1px solid ${found.has(bug.id)?'#4ade8060':'#334155'}`,borderLeft:`3px solid ${found.has(bug.id)?'#4ade80':'#f87171'}`}}>
            <h3 style={{color:found.has(bug.id)?'#4ade80':'#f87171',margin:'0 0 10px',fontSize:14}}>{bug.label}</h3>
            <div className="cy2-panel" style={{margin:'0 0 8px'}}>
              <div className="cy2-panel-hdr" style={{color:'#f87171'}}>❌ Vulnerable Config</div>
              <pre className="cy2-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#cbd5e1'}}>{bug.bad}</pre>
            </div>
            <p style={{color:'#64748b',fontSize:13,margin:'8px 0'}}>💡 {bug.hint}</p>
            {!found.has(bug.id) ? (
              <button className="cy2-check-btn" style={{background:'#334155',color:'#94a3b8',fontSize:13,padding:'7px 16px'}}
                onClick={() => setFound(p=>{const n=new Set(p);n.add(bug.id);return n;})}>Reveal Fix</button>
            ) : (
              <>
                <div className="cy2-panel" style={{margin:'8px 0 6px'}}>
                  <div className="cy2-panel-hdr" style={{color:'#4ade80'}}>✅ Hardened Config</div>
                  <pre className="cy2-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#94a3b8'}}>{bug.good}</pre>
                </div>
                <p style={{color:'#94a3b8',fontSize:13,lineHeight:1.6,margin:'6px 0'}}>{bug.why}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {found.size >= BUGS.length && <div className="cy2-feedback success" style={{marginTop:20}}>✅ Three critical misconfigurations identified and fixed.</div>}
    </CY2Shell>
  );
}
