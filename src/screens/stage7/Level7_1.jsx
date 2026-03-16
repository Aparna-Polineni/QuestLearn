// src/screens/stage7/Level7_1.jsx — Dockerise Spring Boot (FILL)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'FROM1',   answer: 'FROM eclipse-temurin:17-jdk-alpine AS build', placeholder: 'base build image',       hint: 'Use Java 17 JDK Alpine for the build stage. Name it "build".' },
  { id: 'WORKDIR', answer: 'WORKDIR /app',                                  placeholder: 'set working directory', hint: 'All subsequent commands run inside /app.' },
  { id: 'COPY',    answer: 'COPY . .',                                       placeholder: 'copy source code',      hint: 'Copy everything from host into the container\'s /app.' },
  { id: 'BUILD',   answer: 'RUN ./mvnw package -DskipTests',                 placeholder: 'build the JAR',         hint: 'Run Maven wrapper to build. Skip tests — CI handles those.' },
  { id: 'FROM2',   answer: 'FROM eclipse-temurin:17-jre-alpine',            placeholder: 'runtime base image',    hint: 'JRE only — smaller than JDK. No compiler needed at runtime.' },
  { id: 'JARCP',   answer: 'COPY --from=build /app/target/*.jar app.jar',   placeholder: 'copy JAR from build',   hint: 'Multi-stage: copy only the JAR from the build stage.' },
  { id: 'EXPOSE',  answer: 'EXPOSE 8080',                                    placeholder: 'expose port',           hint: 'Spring Boot runs on 8080 by default.' },
  { id: 'ENTRY',   answer: 'ENTRYPOINT ["java", "-jar", "app.jar"]',        placeholder: 'run the JAR',           hint: 'Start the Spring Boot app when the container launches.' },
];

const TEMPLATE = `# ── Stage 1: Build the JAR ────────────────────────────────────────────────
[FROM1]
[WORKDIR]
[COPY]
[BUILD]

# ── Stage 2: Run the JAR (smaller image — no JDK) ─────────────────────────
[FROM2]
WORKDIR /app
[JARCP]
[EXPOSE]
[ENTRY]`;

export default function Level7_1() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage7Shell levelId={1} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Multi-Stage Build', detail: 'Stage 1 uses the full JDK to compile and package. Stage 2 uses only the JRE to run the JAR. The final image is ~200MB instead of ~600MB because it doesn\'t contain Maven, source code, or the compiler — only what\'s needed to run.' },
        { label: '-DskipTests', detail: 'Skipping tests in the Docker build is correct — tests should run in CI (GitHub Actions) before the image is built. Running them inside Docker would double your build time with no benefit.' },
        { label: 'docker run command', detail: 'After building: docker build -t questlearn-api . then docker run -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:mysql://host:3306/questlearn questlearn-api. The -e flag injects environment variables.' },
      ]}
    >
      <div className="s7-intro">
        <h1>Dockerise Spring Boot</h1>
        <p className="s7-tagline">🐳 Package your API so it runs identically everywhere.</p>
        <p className="s7-why">A Docker container bundles your JAR + Java runtime into one unit. Deploy it on any machine — your teammate's laptop, a staging server, AWS EC2 — with the exact same behaviour.</p>
      </div>

      <table className="s7-table">
        <thead><tr><th>Dockerfile Instruction</th><th>Purpose</th></tr></thead>
        <tbody>
          {[
            ['FROM image', 'Base image — operating system + runtime to start from'],
            ['WORKDIR /path', 'Set the working directory for all following commands'],
            ['COPY src dest', 'Copy files from host into the container'],
            ['RUN command', 'Execute a command during build (install, compile, etc.)'],
            ['EXPOSE port', 'Document which port the container listens on'],
            ['ENTRYPOINT [...]', 'Command to run when the container starts'],
          ].map(([k,v],i) => <tr key={i}><td><code style={{color:'#ef4444'}}>{k}</code></td><td style={{color:'#94a3b8'}}>{v}</td></tr>)}
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage7Shell>
  );
}
