// src/screens/stage7/Level7_3.jsx — Docker Compose (FILL)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'VER',     answer: "version: '3.8'",                                      placeholder: 'compose file version',    hint: 'Docker Compose file format version 3.8.' },
  { id: 'DBIMG',   answer: 'image: mysql:8.0',                                    placeholder: 'MySQL image',             hint: 'Official MySQL 8.0 image from Docker Hub.' },
  { id: 'DBENV',   answer: 'MYSQL_DATABASE: questlearn',                          placeholder: 'database name env var',   hint: 'MySQL creates this database automatically on first start.' },
  { id: 'DEPHEAL', answer: 'condition: service_healthy',                          placeholder: 'wait for healthy db',     hint: 'API container waits until MySQL passes its healthcheck.' },
  { id: 'APIENV',  answer: 'SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/questlearn', placeholder: 'DB URL env var',      hint: 'Use the service name "db" as the hostname — Docker networking resolves it.' },
  { id: 'APIDEP',  answer: 'depends_on',                                          placeholder: 'declare dependency',      hint: 'Ensures db starts before the api container.' },
  { id: 'NETW',    answer: 'networks:\n      - questlearn-net',                   placeholder: 'join the network',        hint: 'All services must be on the same network to reach each other.' },
];

const TEMPLATE = `[VER]

services:

  # ── MySQL Database ─────────────────────────────────────────────────────────
  db:
    [DBIMG]
    environment:
      [DBENV]
      MYSQL_ROOT_PASSWORD: rootpassword
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    [NETW]

  # ── Spring Boot API ────────────────────────────────────────────────────────
  api:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      [APIENV]
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    [APIDEP]:
      db:
        [DEPHEAL]
    [NETW]

  # ── React Frontend ─────────────────────────────────────────────────────────
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api
    [NETW]

# ── Shared Network ─────────────────────────────────────────────────────────
networks:
  questlearn-net:
    driver: bridge`;

export default function Level7_3() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage7Shell levelId={3} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Service Names as Hostnames', detail: 'Inside Docker Compose, each service name is a hostname on the shared network. The api container reaches MySQL at db:3306 — not localhost:3306. localhost inside a container refers to that container itself, not other containers.' },
        { label: 'Healthcheck + depends_on', detail: 'depends_on alone only waits for the container to start — not for MySQL to be ready. The healthcheck polls mysqladmin ping until MySQL accepts connections. condition: service_healthy means the api container waits for that to pass.' },
        { label: 'Running Compose', detail: 'docker compose up --build starts all three services. docker compose down stops them. docker compose logs api tails the Spring Boot logs. One command boots the entire stack.' },
      ]}
    >
      <div className="s7-intro">
        <h1>Docker Compose</h1>
        <p className="s7-tagline">🐙 One command boots React + Spring Boot + MySQL together.</p>
        <p className="s7-why">Managing three containers manually with docker run is error-prone. Docker Compose defines all services in one file, handles startup order, networking, and environment variables automatically.</p>
      </div>

      <table className="s7-table">
        <thead><tr><th>Command</th><th>What it does</th></tr></thead>
        <tbody>
          {[
            ['docker compose up --build', 'Build images and start all services'],
            ['docker compose down', 'Stop and remove all containers'],
            ['docker compose logs api', 'Tail logs for the api service'],
            ['docker compose ps', 'Show running containers and their status'],
            ['docker compose exec api bash', 'Open a shell inside the running api container'],
          ].map(([k,v],i) => <tr key={i}><td><code style={{color:'#ef4444',fontSize:12}}>{k}</code></td><td style={{color:'#94a3b8'}}>{v}</td></tr>)}
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage7Shell>
  );
}
