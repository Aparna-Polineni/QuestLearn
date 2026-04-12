// src/screens/cyber-security/stage2/CY2_Level13.jsx — Server Hardening Capstone (BUILD)
import { useState } from 'react';
import CY2Shell from './CY2Shell';
import { RubricValidator } from '../../../components/BuildValidator';

const RUBRIC = [
  {
    label: 'SSH hardening: disable root login, require key auth, change default port',
    check: (_,u) => u.includes('PERMITROOTLOGIN NO') && u.includes('PASSWORDAUTHENTICATION NO') && (u.includes('PORT') || u.includes('2222') || u.includes('PUBKEYAUTHENTICATION')),
    hint: 'In /etc/ssh/sshd_config: PermitRootLogin no, PasswordAuthentication no, PubkeyAuthentication yes. Optionally Port 2222.',
  },
  {
    label: 'Firewall rules: allow only ports 22 (or custom SSH), 80, 443 — deny everything else',
    check: (_,u) => (u.includes('UFW') || u.includes('IPTABLES') || u.includes('FIREWALL')) && u.includes('DENY') && (u.includes('80') || u.includes('443')),
    hint: 'ufw default deny incoming; ufw allow 80; ufw allow 443; ufw allow 2222/tcp; ufw enable',
  },
  {
    label: 'fail2ban configured to ban IPs after 5 failed SSH attempts',
    check: (_,u) => u.includes('FAIL2BAN') && (u.includes('MAXRETRY') || u.includes('5') || u.includes('BANTIME')),
    hint: 'In /etc/fail2ban/jail.local: [sshd] enabled=true, maxretry=5, bantime=3600',
  },
  {
    label: 'Automatic security updates enabled',
    check: (_,u) => u.includes('UNATTENDED') || u.includes('AUTOMATIC') || u.includes('UPDATES') || u.includes('APT-GET UPDATE'),
    hint: 'apt install unattended-upgrades; dpkg-reconfigure -plow unattended-upgrades',
  },
  {
    label: 'Disable unused services: list running services and justify each one kept',
    check: (_,u) => (u.includes('SYSTEMCTL') || u.includes('SERVICE')) && (u.includes('DISABLE') || u.includes('STOP') || u.includes('STATUS')),
    hint: 'systemctl list-units --type=service --state=running — then systemctl disable <unused>',
  },
  {
    label: 'Audit user accounts: remove or lock unused accounts, check /etc/passwd',
    check: (_,u) => (u.includes('PASSWD') || u.includes('USER') || u.includes('ACCOUNT')) && (u.includes('LOCK') || u.includes('DELETE') || u.includes('USERMOD') || u.includes('USERDEL')),
    hint: 'cat /etc/passwd | grep -v nologin — then usermod -L <account> to lock, userdel to remove',
  },
  {
    label: 'File integrity monitoring or audit logging configured',
    check: (_,u) => u.includes('AIDE') || u.includes('AUDITD') || u.includes('TRIPWIRE') || u.includes('INOTIFY') || u.includes('INTEGRITY'),
    hint: 'apt install aide; aide --init; aide --check — or auditd for syscall-level logging',
  },
];

const SOLUTION = `# Server Hardening Checklist — Ubuntu 22.04

## 1. SSH Hardening
nano /etc/ssh/sshd_config
# Set:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222
MaxAuthTries 3
ClientAliveInterval 300
systemctl restart sshd

## 2. Firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow 2222/tcp   # SSH (custom port)
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw enable
ufw status verbose

## 3. fail2ban
apt install fail2ban -y
cat > /etc/fail2ban/jail.local << 'CONF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 2222
CONF
systemctl enable fail2ban && systemctl restart fail2ban

## 4. Automatic Security Updates
apt install unattended-upgrades -y
dpkg-reconfigure -plow unattended-upgrades
# Verify:
cat /etc/apt/apt.conf.d/20auto-upgrades

## 5. Disable Unused Services
systemctl list-units --type=service --state=running
# Disable anything not needed for the server's role:
systemctl disable cups bluetooth avahi-daemon
systemctl stop cups bluetooth avahi-daemon

## 6. Audit User Accounts
cat /etc/passwd | grep -v '/sbin/nologin' | grep -v '/bin/false'
# For each unexpected account:
usermod -L suspicious_user   # lock
# Or remove: userdel -r suspicious_user

## 7. File Integrity Monitoring
apt install aide -y
aide --init
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
# Run checks:
aide --check
# Schedule weekly:
echo "0 3 * * 0 root /usr/bin/aide --check" >> /etc/crontab`;

export default function CY2_Level13() {
  const [passed, setPassed] = useState(false);

  return (
    <CY2Shell levelId={13} canProceed={passed}
      prevLevelContext="In the last level you investigated a complete intrusion — SSH brute force, cron backdoor, DNS exfiltration. Now you will harden the server so none of those attacks can succeed."
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
        'Produced a complete server hardening plan: SSH, firewall, fail2ban, updates, auditing',
      ]}
      conceptReveal={[
        { label: 'Defence in Depth', detail: 'No single security control stops all attacks. SSH hardening stops brute force. fail2ban rate-limits automated tools. Firewall rules reduce attack surface. Updates patch known vulnerabilities. File integrity monitoring catches changes. Audit logging provides evidence. Each layer assumes the previous one has been bypassed. This is defence in depth — the real security model.' },
        { label: 'Minimum Necessary Access', detail: 'Every service running is an attack surface. Every account with a shell is a lateral movement path. Every open port is a potential entry point. Hardening is mostly subtraction: disable what you do not need. A server with 3 services running is harder to attack than one with 30.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>Server Hardening Capstone</h1>
        <p className="cy2-tagline">🔒 Harden the hospital server. Make the intrusion from Level 12 impossible.</p>
        <p className="cy2-why">
          You investigated the attack. Now prevent it. Write a complete hardening procedure
          covering SSH, firewall, brute-force protection, updates, service minimisation,
          user auditing, and integrity monitoring. Each criterion maps to one control.
        </p>
      </div>

      <div className="cy2-panel" style={{ marginBottom:14 }}>
        <div className="cy2-panel-hdr">🎯 The attack surface you are closing</div>
        <pre className="cy2-panel-body" style={{ fontSize:12, color:'#64748b' }}>
{`What the attacker exploited:
  ✗ Root SSH login with password auth — allowed brute force
  ✗ No rate limiting — 847 attempts in 4 minutes, unblocked
  ✗ No outbound filtering — cron job could reach C2 server
  ✗ DNS unrestricted — exfiltration via DNS tunnelling
  ✗ No integrity monitoring — crontab modified silently
Your hardening plan must address each of these.`}
        </pre>
      </div>

      <RubricValidator
        language="Bash / Linux"
        rubric={RUBRIC}
        solutionCode={SOLUTION}
        onAllPassed={() => setPassed(true)}
      />
    </CY2Shell>
  );
}
