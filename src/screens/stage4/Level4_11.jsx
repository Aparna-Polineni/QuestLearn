// src/screens/stage4/Level4_11.jsx — Relationships (FILL)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_11.css';

const SUPPORT = {
  intro: {
    concept: 'JPA Relationships — @ManyToOne & @OneToMany',
    tagline: 'Database foreign keys become Java object references.',
    whatYouWillDo: 'Add a relationship between Patient and Ward: many patients belong to one ward. Fill in the JPA annotations that create the foreign key column and define both sides of the relationship.',
    whyItMatters: 'Real data has relationships. Patients belong to wards. Doctors work in departments. Appointments link patients to doctors. JPA relationships let you model these connections in Java and navigate them as object references instead of writing JOIN queries.',
  },
  hints: [
    '@ManyToOne means: many Patients can be in one Ward. This goes on the "many" side — the Patient class. It creates a foreign key column in the patient table.',
    '@JoinColumn(name="ward_id") specifies the foreign key column name. Without it, JPA generates a name automatically (usually ward_id anyway, but explicit is better).',
    '@OneToMany(mappedBy="ward") on the Ward class defines the other side. "mappedBy" refers to the field name in Patient that owns the relationship. No extra column is created — it uses the existing foreign key.',
  ],
  reveal: {
    concept: '@ManyToOne, @OneToMany, and @JoinColumn',
    whatYouLearned: '@ManyToOne on Patient creates the foreign key. @JoinColumn names the column. @OneToMany(mappedBy) on Ward is the inverse — no column, just navigation. FetchType.LAZY defers loading until accessed (default for @OneToMany). FetchType.EAGER loads immediately (default for @ManyToOne).',
    realWorldUse: 'Hospital system relationships: Patient @ManyToOne Ward, Patient @ManyToOne Doctor, Appointment @ManyToOne Patient + @ManyToOne Doctor. Spring Data JPA handles the JOINs. Call patient.getWard().getName() — no SQL needed.',
    developerSays: 'Be careful with EAGER fetching and @OneToMany — loading a Ward eagerly loads ALL its patients. That can be thousands of rows. Default to LAZY and load only what you need. N+1 query problems come from not thinking about this.',
  },
};

const TEMPLATE = `import jakarta.persistence.*;
import java.util.List;

@Entity
public class Ward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // One Ward has many Patients
    // FILL 1: Define the one-to-many side (inverse — no new column)
    ___ONETOMANY___(mappedBy = "ward")
    private List<Patient> patients;
}

@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // Many Patients belong to one Ward
    // FILL 2: Define the many-to-one relationship
    ___MANYTOONE___
    // FILL 3: Specify the foreign key column name in the patient table
    @JoinColumn(name = "___WARD_ID___")
    private Ward ward;
}`;

const BLANKS = [
  { id: 'ONETOMANY', answer: '@OneToMany', placeholder: 'annotation', hint: 'One Ward has many Patients. This is the inverse side — no foreign key column is created here.' },
  { id: 'MANYTOONE', answer: '@ManyToOne', placeholder: 'annotation', hint: 'Many Patients belong to one Ward. This creates the foreign key column in the patient table.' },
  { id: 'WARD_ID',   answer: 'ward_id',    placeholder: 'column name', hint: 'The foreign key column name in the patient table. Convention: entity_name + _id.' },
];

const ANATOMY = [
  { label: '@ManyToOne',                  desc: 'many of this entity → one of that entity' },
  { label: '@OneToMany(mappedBy="ward")', desc: 'one of this entity → many of that entity' },
  { label: '@JoinColumn(name="ward_id")', desc: 'names the foreign key column' },
  { label: '@ManyToMany',                 desc: 'doctors ↔ patients (junction table)' },
  { label: 'FetchType.LAZY',              desc: 'load related data only when accessed' },
  { label: 'FetchType.EAGER',             desc: 'load related data immediately' },
];

export default function Level4_11() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={11} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l411-container">
          <div className="l411-brief">
            <div className="l411-brief-tag">// Fill Mission — JPA Relationships</div>
            <h2>Link Patients to Wards in your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> database.</h2>
            <p>3 blanks. Add the annotations that model a "many patients, one ward" relationship and create the foreign key column.</p>
          </div>
          <div className="l411-anatomy">
            <div className="l411-anatomy-title">// JPA Relationship Annotations</div>
            <div className="l411-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.label} className="l411-anat-row">
                  <span className="l411-anat-annotation">{a.label}</span>
                  <span className="l411-anat-desc">— {a.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
        </div>
      </LevelSupportWrapper>
    </Stage4Shell>
  );
}