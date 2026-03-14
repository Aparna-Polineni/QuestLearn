// src/screens/stage5/Level5_18.jsx — @ManyToMany (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../../components/FillEditor';
import './Level5_18.css';

const SUPPORT = {
  reveal: {
    concept: '@ManyToMany',
    whatYouLearned: 'ManyToMany creates a join table — a third table with two FK columns linking both sides. Doctors can have many specialties, specialties belong to many doctors. Neither FK lives on the main tables.',
    realWorldUse: 'Doctor–Specialty, Patient–Treatment, Appointment–Resource — all many-to-many. JPA creates the join table automatically with @ManyToMany @JoinTable.',
    developerSays: 'If the join table needs extra columns (like "assigned date"), model it as an entity with two @ManyToOne relationships instead of using @ManyToMany. @ManyToMany works only for pure link tables.',
  },
};

const CODE_TEMPLATE = `@Entity
public class Doctor {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Generates: doctor_specialties(doctor_id, specialty_id) join table
    @[[ManyToMany]]
    @JoinTable(
        name = [[\"doctor_specialties\"]],
        joinColumns = @JoinColumn(name = [[\"doctor_id\"]]),
        inverseJoinColumns = @JoinColumn(name = "specialty_id")
    )
    private Set<Specialty> specialties;
}

@Entity
public class Specialty {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(mappedBy = [[\"specialties\"]])
    private Set<Doctor> doctors;
}`;

const ANSWERS = ['ManyToMany', '"doctor_specialties"', '"doctor_id"', '"specialties"'];

export default function Level5_18() {
  const [isCorrect, setIsCorrect] = useState(false);
  return (
    <Stage5Shell levelId={18} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="jpa-container">
        <div className="jpa-brief">
          <div className="jpa-brief-tag">🐘 Stage 5 · Level 5.18 · FILL</div>
          <h2>@ManyToMany — Join Tables in JPA</h2>
          <p>Many doctors can have many specialties. Many specialties can belong to many doctors. Neither table holds the FK — a third join table holds both.</p>
        </div>

        <div className="jpa-ref">
          <div className="jpa-ref-label">The join table JPA generates</div>
          <div className="jpa-ref-grid">
            {[
              ['doctor_specialties','Auto-created join table'],
              ['doctor_id BIGINT FK','References doctors(id)'],
              ['specialty_id BIGINT FK','References specialties(id)'],
              ['PRIMARY KEY (doctor_id, specialty_id)','Composite PK prevents duplicate links'],
            ].map(([sig,note])=>(
              <div key={sig} className="jpa-ref-row"><code className="jpa-sig">{sig}</code><span className="jpa-note">{note}</span></div>
            ))}
          </div>
        </div>

        <FillEditor template={CODE_TEMPLATE} answers={ANSWERS} language="java" onCorrect={() => setIsCorrect(true)} />
      </div>
    </Stage5Shell>
  );
}
