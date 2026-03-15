// src/screens/stage5/Level5_11.jsx — @Entity Deep Dive (FILL, Java)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'ENTITY',      answer: '@Entity',                          placeholder: 'marks class as DB table', hint: 'Tells JPA this class maps to a database table.' },
  { id: 'TABLE',       answer: '@Table(name="patients")',          placeholder: '@Table annotation',        hint: 'Specifies the exact table name. Without it, JPA uses the class name.' },
  { id: 'ID',          answer: '@Id',                              placeholder: 'primary key annotation',   hint: 'Marks the field as the primary key column.' },
  { id: 'GENVAL',      answer: '@GeneratedValue(strategy = GenerationType.IDENTITY)', placeholder: '@GeneratedValue', hint: 'Database auto-increments the ID. Use IDENTITY for MySQL.' },
  { id: 'COLNAME',     answer: '@Column(name = "full_name", nullable = false, length = 100)', placeholder: '@Column', hint: 'Maps field to column "full_name", NOT NULL, VARCHAR(100).' },
  { id: 'COLDATE',     answer: '@Column(name = "admitted_at")',    placeholder: '@Column for date',         hint: 'Maps the field to the admitted_at column.' },
];

const TEMPLATE = `import jakarta.persistence.*;
import java.time.LocalDate;

[ENTITY]
[TABLE]
public class Patient {

    [ID]
    [GENVAL]
    private Long id;

    [COLNAME]
    private String name;

    [COLDATE]
    private LocalDate admittedAt;

    private boolean confirmed;  // maps to confirmed column automatically

    // Getters & setters omitted for brevity
}`;

export default function Level5_11() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={11} canProceed={isCorrect}
      conceptReveal={[
        { label: '@Entity vs @Table', detail: '@Entity marks the class as a JPA entity. @Table(name=...) overrides the table name. Without @Table, JPA uses the class name lowercased — Patient → patient. Explicit is always better.' },
        { label: '@Column options', detail: 'name: override column name. nullable=false: adds NOT NULL. length=100: VARCHAR(100). unique=true: UNIQUE INDEX. insertable=false: read-only column. precision/scale for DECIMAL.' },
        { label: '@GeneratedValue strategies', detail: 'IDENTITY: database auto-increments (MySQL, PostgreSQL). SEQUENCE: uses a DB sequence object (PostgreSQL preferred). AUTO: JPA picks — avoid this, be explicit. TABLE: uses a separate table — slow, avoid.' },
      ]}
    >
      <div className="s5-intro">
        <h1>@Entity Deep Dive</h1>
        <p className="s5-tagline">🗃️ The full mapping from Java class to database table.</p>
        <p className="s5-why">In Stage 4 you used @Entity quickly. Here you learn every annotation and option — so you can control exactly what Hibernate generates.</p>
      </div>

      <table className="s5-table">
        <thead><tr><th>Annotation</th><th>SQL Equivalent</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>@Entity</code></td><td><code>CREATE TABLE patient</code></td><td style={{color:'#94a3b8'}}>Maps class to table</td></tr>
          <tr><td><code>@Table(name="patients")</code></td><td><code>CREATE TABLE patients</code></td><td style={{color:'#94a3b8'}}>Custom table name</td></tr>
          <tr><td><code>@Id</code></td><td><code>PRIMARY KEY</code></td><td style={{color:'#94a3b8'}}>Primary key column</td></tr>
          <tr><td><code>@GeneratedValue(IDENTITY)</code></td><td><code>AUTO_INCREMENT</code></td><td style={{color:'#94a3b8'}}>DB assigns the id</td></tr>
          <tr><td><code>@Column(nullable=false)</code></td><td><code>NOT NULL</code></td><td style={{color:'#94a3b8'}}>Required field</td></tr>
          <tr><td><code>@Column(length=100)</code></td><td><code>VARCHAR(100)</code></td><td style={{color:'#94a3b8'}}>Max string length</td></tr>
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage5Shell>
  );
}
