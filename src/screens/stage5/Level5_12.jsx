// src/screens/stage5/Level5_12.jsx — @Id Strategies (FILL, Java)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'IDENTITY', answer: 'GenerationType.IDENTITY', placeholder: 'strategy for MySQL', hint: 'Database auto-increments. Best choice for MySQL.' },
  { id: 'SEQUENCE', answer: 'GenerationType.SEQUENCE',  placeholder: 'strategy for PostgreSQL', hint: 'Uses a DB sequence. Best for PostgreSQL.' },
  { id: 'SEQNAME',  answer: '@SequenceGenerator(name="patient_seq", sequenceName="patient_sequence", allocationSize=1)', placeholder: '@SequenceGenerator', hint: 'Defines the sequence object in the DB.' },
  { id: 'UUID',     answer: '@UuidGenerator',           placeholder: 'UUID generation annotation', hint: 'Hibernate 6+ annotation for UUID primary keys.' },
  { id: 'UUIDTYPE', answer: 'UUID',                     placeholder: 'Java type for UUID id', hint: 'Use java.util.UUID as the id field type.' },
];

const TEMPLATE = `import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.UUID;

// STRATEGY 1 — IDENTITY (MySQL, recommended for most Spring Boot apps)
@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = [IDENTITY])
    private Long id;
}

// STRATEGY 2 — SEQUENCE (PostgreSQL, better for bulk inserts)
@Entity
public class Doctor {
    @Id
    [SEQNAME]
    @GeneratedValue(strategy = [SEQUENCE], generator = "patient_seq")
    private Long id;
}

// STRATEGY 3 — UUID (globally unique, no sequential IDs exposed in URLs)
@Entity
public class Appointment {
    @Id
    [UUID]
    private [UUIDTYPE] id;
}`;

export default function Level5_12() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={12} canProceed={isCorrect}
      conceptReveal={[
        { label: 'IDENTITY — MySQL', detail: 'AUTO_INCREMENT in MySQL. JPA inserts the row then asks the DB for the generated id. Simple and reliable. Cannot batch inserts efficiently — use SEQUENCE for high-throughput apps.' },
        { label: 'SEQUENCE — PostgreSQL', detail: 'PostgreSQL has a native sequence object. JPA pre-fetches IDs from the sequence (allocationSize controls how many). Faster for bulk inserts. Not supported in MySQL without manual setup.' },
        { label: 'UUID — When to Use', detail: 'UUIDs are globally unique — safe to generate in application code without hitting the DB. Useful for distributed systems, or when you don\'t want sequential IDs in URLs (prevents enumeration attacks). Downside: larger storage, slower index.' },
      ]}
    >
      <div className="s5-intro">
        <h1>@Id Strategies</h1>
        <p className="s5-tagline">🔑 Three ways to generate primary keys — each with different tradeoffs.</p>
        <p className="s5-why">In Stage 4 we used IDENTITY and moved on. Here you understand all three strategies so you can make the right choice for your database and load requirements.</p>
      </div>

      <table className="s5-table">
        <thead><tr><th>Strategy</th><th>Best For</th><th>How ID is Generated</th></tr></thead>
        <tbody>
          <tr><td><code>IDENTITY</code></td><td>MySQL</td><td style={{color:'#94a3b8'}}>DB AUTO_INCREMENT after insert</td></tr>
          <tr><td><code>SEQUENCE</code></td><td>PostgreSQL</td><td style={{color:'#94a3b8'}}>Pre-fetched from DB sequence object</td></tr>
          <tr><td><code>UUID</code></td><td>Distributed / security</td><td style={{color:'#94a3b8'}}>Generated in app before insert</td></tr>
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage5Shell>
  );
}
