// src/screens/stage7/Level7_9.jsx — Environment Variables & Spring Profiles (FILL)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'ACTIVE',  answer: 'spring.profiles.active=dev',                   placeholder: 'activate dev profile',    hint: 'application.properties — sets the active profile to "dev".' },
  { id: 'DEVDB',   answer: 'spring.datasource.url=jdbc:mysql://localhost:3306/questlearn', placeholder: 'dev DB URL', hint: 'Dev profile uses localhost MySQL.' },
  { id: 'PRODDB',  answer: 'spring.datasource.url=${SPRING_DATASOURCE_URL}', placeholder: 'prod DB URL from env var', hint: 'Prod reads from environment variable — never hardcoded.' },
  { id: 'PRODCORS','answer': 'spring.web.cors.allowed-origins=${CORS_ORIGIN}', placeholder: 'prod CORS origin',     hint: 'Prod CORS origin from env var — e.g. https://myapp.com.' },
  { id: 'ENVPROD', answer: 'SPRING_PROFILES_ACTIVE=prod',                  placeholder: 'activate prod in Docker',  hint: 'Set this env var in docker-compose.yml to activate the prod profile.' },
  { id: 'JWTENV',  answer: 'JWT_SECRET=${JWT_SECRET}',                     placeholder: 'JWT secret from env',      hint: 'JWT secret must never be hardcoded — always from environment.' },
];

const TEMPLATE = `# ── application.properties (shared — loaded always) ──────────────────────
[ACTIVE]      # default to dev locally
spring.application.name=questlearn

# ── application-dev.properties (dev profile) ─────────────────────────────
[DEVDB]
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update   # auto-update schema in dev
logging.level.org.hibernate.SQL=DEBUG  # show SQL queries in dev

# ── application-prod.properties (prod profile) ───────────────────────────
[PRODDB]
spring.datasource.username=\${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=\${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate # never modify schema in prod
[PRODCORS]
app.jwt.secret=[JWTENV]
logging.level.root=WARN                # quiet logs in prod

# ── docker-compose.yml — inject prod env vars ─────────────────────────────
services:
  api:
    environment:
      [ENVPROD]
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/questlearn
      SPRING_DATASOURCE_USERNAME: \${DB_USER}
      SPRING_DATASOURCE_PASSWORD: \${DB_PASS}
      JWT_SECRET: \${JWT_SECRET}
      CORS_ORIGIN: \${CORS_ORIGIN}`;

export default function Level7_9() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage7Shell levelId={9} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Profile-Based Config', detail: 'application-dev.properties is loaded when spring.profiles.active=dev. application-prod.properties when active=prod. Properties in the active profile override the shared application.properties. This means one codebase, multiple environments — no if-statements in Java code.' },
        { label: 'Twelve-Factor App', detail: 'The industry standard: never store config (passwords, URLs, keys) in code. Store in environment variables. This means the same Docker image runs in staging and production — only the env vars differ. Secrets are never committed to git.' },
        { label: 'React Environment', detail: 'React uses .env files: REACT_APP_API_URL=http://localhost:8080 for dev. For prod, set REACT_APP_API_URL=https://api.myapp.com before npm run build — it gets baked into the static files. Rename .env to .env.local (git-ignored) for local overrides.' },
      ]}
    >
      <div className="s7-intro">
        <h1>Environment Variables & Spring Profiles</h1>
        <p className="s7-tagline">🔐 Dev uses localhost. Prod uses real servers. Same code, different config.</p>
        <p className="s7-why">Hardcoding database URLs and passwords in application.properties is a security disaster — they end up in git. Spring profiles + environment variables keep secrets out of code and make switching environments a one-line change.</p>
      </div>

      <table className="s7-table">
        <thead><tr><th>File</th><th>When loaded</th><th>Used for</th></tr></thead>
        <tbody>
          {[
            ['application.properties', 'Always', 'Shared config, default profile'],
            ['application-dev.properties', 'profile=dev', 'localhost DB, debug logging, schema updates'],
            ['application-prod.properties', 'profile=prod', 'RDS URL from env, validate schema, quiet logs'],
            ['.env (Compose)', 'docker compose up', 'Inject secrets into containers'],
          ].map(([f,w,u],i) => <tr key={i}><td><code style={{fontSize:12,color:'#ef4444'}}>{f}</code></td><td style={{color:'#94a3b8'}}>{w}</td><td style={{color:'#94a3b8'}}>{u}</td></tr>)}
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage7Shell>
  );
}
