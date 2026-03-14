// src/screens/stage5/Level5_13.jsx — @Column, @Id, @GeneratedValue (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../../components/FillEditor';
import './Level5_13.css';

const SUPPORT = {
  reveal: {
    concept: '@Column Mapping',
    whatYouLearned: '@Column gives you fine-grained control over how a field maps to a database column — name, nullability, length, uniqueness. Without @Column, JPA uses the field name as the column name.',
    realWorldUse: 'When your DB column name differs from your Java field name, @Column(name=) bridges the gap. @Column(unique=true) creates a UNIQUE INDEX. @Column(length=) sets VARCHAR length.',
    developerSays: 'Always set nullable=false on required fields. It enforces NOT NULL at the DB level — a second line of defence after your @NotNull Bean Validation.',
  },
};

const CODE_TEMPLATE = `@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Column name differs from field name
    @Column(name = "full_name", nullable = [[false]], length = [[100]])
    private String name;

    // Must be unique across all rows
    @Column(name = "license_number", unique = [[true]], nullable = false)
    private String licenseNumber;

    // Optional — column can be null
    @Column(name = "department", [[nullable = true]])
    private String department;

    // Maps to INT DEFAULT 0
    @Column(name = "patient_count",
            columnDefinition = [[\"INT DEFAULT 0\"]])
    private int patientCount;
}`;

const ANSWERS = ['false', '100', 'true', 'nullable = true', '"INT DEFAULT 0"'];

export default function Level5_13() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={13} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="jpa-container">
        <div className="jpa-brief">
          <div className="jpa-brief-tag">🐘 Stage 5 · Level 5.13 · FILL</div>
          <h2>@Column — Fine-Grained Column Control</h2>
          <p>Without <code>@Column</code>, JPA uses the field name directly. With <code>@Column</code>, you control the name, nullability, length, and uniqueness — matching your SQL schema exactly.</p>
        </div>

        <div className="jpa-ref">
          <div className="jpa-ref-label">@Column attributes</div>
          <div className="jpa-ref-grid">
            {[
              ['name = "col_name"',          'Override the column name'],
              ['nullable = false',            'Generates NOT NULL constraint'],
              ['unique = true',              'Generates UNIQUE INDEX'],
              ['length = 100',              'Sets VARCHAR(100) — default 255'],
              ['columnDefinition = "..."',   'Raw SQL for the column type'],
              ['insertable / updatable',     'Control whether JPA includes in INSERT/UPDATE'],
            ].map(([sig,note])=>(
              <div key={sig} className="jpa-ref-row"><code className="jpa-sig">{sig}</code><span className="jpa-note">{note}</span></div>
            ))}
          </div>
        </div>

        <FillEditor template={CODE_TEMPLATE} answers={ANSWERS} language="java" onCorrect={() => setIsCorrect(true)} />

        <div className="jpa-bridge">
          <strong>Rule of thumb:</strong> if a field MUST have a value in your domain, add <code>nullable = false</code>. This creates NOT NULL in SQL and pairs with <code>@NotNull</code> in your DTO validation for a double layer of protection.
        </div>
      </div>
    </Stage5Shell>
  );
}
