// src/screens/stage7/Level7_7.jsx — AWS EC2 (FILL)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'CHMOD',   answer: 'chmod 400 questlearn-key.pem',                placeholder: 'fix key permissions',     hint: 'SSH requires the private key to be owner-read-only. 400 = rw-------.' },
  { id: 'SSHCMD',  answer: 'ssh -i questlearn-key.pem ubuntu@<EC2_PUBLIC_IP>', placeholder: 'SSH into EC2',       hint: 'Ubuntu is the default user for Ubuntu EC2 instances.' },
  { id: 'APTUPD',  answer: 'sudo apt update && sudo apt upgrade -y',       placeholder: 'update packages',         hint: 'Always update first on a fresh server.' },
  { id: 'DOCKGET', answer: 'curl -fsSL https://get.docker.com | sh',      placeholder: 'install Docker',          hint: 'Official one-liner to install Docker Engine on Ubuntu.' },
  { id: 'USERGRP', answer: 'sudo usermod -aG docker ubuntu',              placeholder: 'add user to docker group', hint: 'Allows running docker without sudo. Re-login required after.' },
  { id: 'DCVER',   answer: 'docker compose version',                       placeholder: 'verify compose installed', hint: 'Docker Compose v2 is included with Docker Engine.' },
  { id: 'PULL',    answer: 'docker compose pull',                          placeholder: 'pull latest images',      hint: 'Pull all images defined in docker-compose.yml from Docker Hub.' },
  { id: 'UP',      answer: 'docker compose up -d',                        placeholder: 'start all services',      hint: '-d = detached mode (runs in background).' },
];

const TEMPLATE = `# ── On your LOCAL machine — SSH into EC2 ─────────────────────────────────
[CHMOD]          # Fix key file permissions (required by SSH)
[SSHCMD]         # Connect to your EC2 instance

# ── On EC2 — First-time setup ─────────────────────────────────────────────
[APTUPD]
[DOCKGET]
[USERGRP]
newgrp docker                # apply group change without re-login

# Verify Docker installed
docker --version
[DCVER]

# ── On EC2 — Deploy QuestLearn ────────────────────────────────────────────
# Upload docker-compose.yml (from local machine):
# scp -i questlearn-key.pem docker-compose.yml ubuntu@<EC2_IP>:~/

# Pull images and start
[PULL]
[UP]

# Check everything is running
docker compose ps
docker compose logs api --tail=50`;

export default function Level7_7() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage7Shell levelId={7} canProceed={isCorrect}
      conceptReveal={[
        { label: 'EC2 Security Group', detail: 'In the AWS console, the EC2 security group controls which ports are open. You must add inbound rules for: port 22 (SSH — your IP only), port 80 (HTTP — anywhere), port 443 (HTTPS — anywhere), port 8080 (API — anywhere or just your IP). Without this, connections are blocked even if Docker is running.' },
        { label: 't2.micro Free Tier', detail: 'AWS Free Tier includes 750 hours/month of t2.micro for 12 months. That\'s one always-on instance for free. t2.micro has 1 vCPU and 1GB RAM — enough for QuestLearn. For a production app with real users, upgrade to t3.small or larger.' },
        { label: 'Elastic IP', detail: 'EC2 instances get a new public IP every time they restart. Add an Elastic IP (free while attached to a running instance) to get a permanent IP. Then point your domain\'s DNS A record to the Elastic IP.' },
      ]}
    >
      <div className="s7-intro">
        <h1>AWS EC2</h1>
        <p className="s7-tagline">☁️ A virtual server in the cloud running your Docker containers.</p>
        <p className="s7-why">EC2 is a Linux server in AWS's data centre. You SSH in, install Docker, and run your docker-compose.yml — exactly like your local machine but always online.</p>
      </div>

      <table className="s7-table">
        <thead><tr><th>Step</th><th>AWS Console Action</th></tr></thead>
        <tbody>
          {[
            ['1. Launch instance', 'EC2 → Launch Instance → Ubuntu 22.04 → t2.micro → Create key pair'],
            ['2. Security group', 'Add inbound: SSH (22), HTTP (80), HTTPS (443), Custom (8080)'],
            ['3. Elastic IP', 'EC2 → Elastic IPs → Allocate → Associate with instance'],
            ['4. SSH key', 'Download .pem file → chmod 400 → ssh -i key.pem ubuntu@IP'],
          ].map(([s,a],i) => <tr key={i}><td style={{color:'#ef4444',fontWeight:600}}>{s}</td><td style={{color:'#94a3b8'}}>{a}</td></tr>)}
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage7Shell>
  );
}
