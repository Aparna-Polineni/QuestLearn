// src/screens/stage7/Level7_8.jsx — AWS RDS (FILL)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'URL',     answer: 'SPRING_DATASOURCE_URL=jdbc:mysql://${RDS_ENDPOINT}:3306/questlearn', placeholder: 'RDS datasource URL',     hint: 'Use the RDS endpoint hostname — not localhost.' },
  { id: 'USER',    answer: 'SPRING_DATASOURCE_USERNAME=${RDS_USERNAME}',    placeholder: 'datasource username',     hint: 'The master username you set when creating the RDS instance.' },
  { id: 'PASS',    answer: 'SPRING_DATASOURCE_PASSWORD=${RDS_PASSWORD}',    placeholder: 'datasource password',     hint: 'The master password — store in GitHub Secrets, never in code.' },
  { id: 'DDL',     answer: 'SPRING_JPA_HIBERNATE_DDL_AUTO=validate',        placeholder: 'DDL auto setting',        hint: 'validate checks schema matches entities but never modifies. Safe for production.' },
  { id: 'FLY',     answer: 'SPRING_FLYWAY_ENABLED=true',                    placeholder: 'enable Flyway',           hint: 'Flyway runs migrations automatically on startup.' },
  { id: 'SGPORT',  answer: '3306',                                           placeholder: 'MySQL port to allow',     hint: 'MySQL default port — allow inbound from EC2 security group only.' },
];

const TEMPLATE = `# ── Spring Boot — Production environment variables ────────────────────────
# Set these in docker-compose.yml or GitHub Secrets (never hardcode)

# application-prod.properties (Spring "prod" profile)
[URL]
[USER]
[PASS]
[DDL]
[FLY]

# ── RDS Security Group Rule ───────────────────────────────────────────────
# In AWS Console → RDS Security Group → Inbound Rules:
# Type: MySQL/Aurora
# Port: [SGPORT]
# Source: EC2 security group ID  ← only EC2 can connect, not the internet

# ── Test connection from EC2 ──────────────────────────────────────────────
# ssh into EC2, then:
mysql -h <RDS_ENDPOINT> -u admin -p questlearn
# If this works, Spring Boot will connect too`;

export default function Level7_8() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage7Shell levelId={8} canProceed={isCorrect}
      conceptReveal={[
        { label: 'RDS vs Docker MySQL', detail: 'Docker MySQL on EC2 stores data in a container volume — if the container is deleted, data is gone. RDS is a managed database service: automated backups, multi-AZ failover, point-in-time recovery. For any real app, use RDS. Free tier: db.t3.micro, 20GB storage.' },
        { label: 'ddl-auto=validate', detail: 'Never use create or create-drop in production — it wipes your database on every restart. validate checks your @Entity classes match the database schema. If they don\'t match, Spring Boot fails to start (better than silently corrupting data).' },
        { label: 'RDS Security Group', detail: 'The RDS security group should only allow inbound port 3306 from the EC2 instance\'s security group — not from 0.0.0.0/0 (the internet). This means only your EC2 server can reach the database. External access is blocked even if someone knows the password.' },
      ]}
    >
      <div className="s7-intro">
        <h1>AWS RDS</h1>
        <p className="s7-tagline">🗄️ Managed MySQL in the cloud — backups, failover, no maintenance.</p>
        <p className="s7-why">Running MySQL in a Docker container on EC2 risks data loss if the container is deleted. RDS is a fully managed database service — automated backups, scaling, and high availability without any server management.</p>
      </div>

      <table className="s7-table">
        <thead><tr><th>Setting</th><th>Value</th></tr></thead>
        <tbody>
          {[
            ['Engine', 'MySQL 8.0'],
            ['Template', 'Free tier'],
            ['Instance class', 'db.t3.micro'],
            ['Storage', '20 GB gp2'],
            ['Public access', 'No — only accessible from EC2'],
            ['Database name', 'questlearn'],
          ].map(([k,v],i) => <tr key={i}><td style={{color:'#ef4444'}}>{k}</td><td style={{color:'#94a3b8'}}>{v}</td></tr>)}
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage7Shell>
  );
}
