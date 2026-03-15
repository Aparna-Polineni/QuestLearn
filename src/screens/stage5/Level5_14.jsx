// src/screens/stage5/Level5_14.jsx — @ManyToMany (FILL, Java)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'MTM1',   answer: '@ManyToMany',                               placeholder: 'doctors ↔ patients annotation', hint: 'Both sides can have many of the other.' },
  { id: 'JT',     answer: '@JoinTable(name = "doctor_patient", joinColumns = @JoinColumn(name = "doctor_id"), inverseJoinColumns = @JoinColumn(name = "patient_id"))', placeholder: '@JoinTable', hint: 'Creates the junction table with both foreign keys.' },
  { id: 'MTM2',   answer: '@ManyToMany(mappedBy = "patients")',        placeholder: 'inverse side annotation', hint: 'Patient is the inverse side — no JoinTable here.' },
  { id: 'SET',    answer: 'Set<Patient>',                              placeholder: 'collection without duplicates', hint: 'Use Set to prevent the same patient appearing twice.' },
];

const TEMPLATE = `import jakarta.persistence.*;
import java.util.Set;

@Entity
public class Doctor {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // Doctor can treat many patients; patient can have many doctors
    [MTM1]
    [JT]
    private [SET] patients;
}

@Entity
public class Patient {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // Inverse side — mappedBy the field name in Doctor
    [MTM2]
    private Set<Doctor> doctors;
}`;

export default function Level5_14() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={14} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Junction Table', detail: '@JoinTable creates a third table (doctor_patient) with two FK columns: doctor_id and patient_id. In SQL: CREATE TABLE doctor_patient (doctor_id INT, patient_id INT, PRIMARY KEY (doctor_id, patient_id)). JPA manages this table automatically.' },
        { label: 'Who Owns @ManyToMany?', detail: 'The side with @JoinTable owns the relationship. The other side uses mappedBy. Only one side manages the join table — adding to the inverse side\'s collection alone does NOT save to DB. Always add through the owning side.' },
        { label: 'Set vs List', detail: 'Use Set for @ManyToMany to prevent duplicate entries and avoid Hibernate\'s "bag" fetch issues. With List and bidirectional @ManyToMany, Hibernate can generate duplicate rows.' },
      ]}
    >
      <div className="s5-intro">
        <h1>@ManyToMany</h1>
        <p className="s5-tagline">👨‍⚕️ Doctors treat many patients. Patients see many doctors.</p>
        <p className="s5-why">@ManyToMany needs a junction table in SQL. JPA creates and manages it via @JoinTable. The owning side controls what gets saved.</p>
      </div>
      <div className="s5-info">
        <p>
          <strong style={{color:'#818cf8'}}>SQL equivalent:</strong><br/>
          <code style={{color:'#94a3b8',fontSize:13}}>CREATE TABLE doctor_patient (doctor_id INT, patient_id INT, FOREIGN KEY (doctor_id) REFERENCES doctors(id), FOREIGN KEY (patient_id) REFERENCES patients(id));</code>
        </p>
      </div>
      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage5Shell>
  );
}
