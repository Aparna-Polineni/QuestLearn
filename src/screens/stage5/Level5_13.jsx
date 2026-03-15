// src/screens/stage5/Level5_13.jsx — @ManyToOne & @OneToMany (FILL, Java)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'MTO',      answer: '@ManyToOne',                               placeholder: 'many patients → one ward', hint: 'Puts the foreign key column on this side (patient table).' },
  { id: 'FETCH',    answer: 'FetchType.LAZY',                           placeholder: 'load ward only when accessed', hint: 'Don\'t load the Ward until patient.getWard() is called.' },
  { id: 'JCOL',     answer: '@JoinColumn(name = "ward_id")',            placeholder: '@JoinColumn', hint: 'Names the foreign key column ward_id in the patient table.' },
  { id: 'OTM',      answer: '@OneToMany(mappedBy = "ward")',            placeholder: 'one ward → many patients', hint: 'mappedBy must match the field name in Patient that owns the FK.' },
  { id: 'LIST',     answer: 'List<Patient>',                            placeholder: 'collection type', hint: 'The ward has many patients — store them in a List.' },
  { id: 'CASCADE',  answer: 'CascadeType.ALL',                          placeholder: 'cascade operations', hint: 'Saving/deleting a Ward also saves/deletes its Patients.' },
];

const TEMPLATE = `import jakarta.persistence.*;
import java.util.List;

// The PATIENT side — owns the foreign key
@Entity
@Table(name = "patients")
public class Patient {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // Many patients → one ward (FK lives here: ward_id column)
    [MTO](fetch = [FETCH])
    [JCOL]
    private Ward ward;
}

// The WARD side — inverse side, no extra column
@Entity
@Table(name = "wards")
public class Ward {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // One ward → many patients
    [OTM](cascade = [CASCADE])
    private [LIST] patients;
}`;

export default function Level5_13() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={13} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Who Owns the FK?', detail: '@ManyToOne always goes on the side that has the foreign key column in its table. Patient has ward_id → Patient owns the relationship. Ward has mappedBy="ward" → Ward is the inverse side, no extra column.' },
        { label: 'FetchType.LAZY vs EAGER', detail: 'LAZY: load the related entity only when accessed — default for @OneToMany. EAGER: load immediately with a JOIN — default for @ManyToOne. Always prefer LAZY for @OneToMany to avoid loading thousands of patients when you just need a ward name.' },
        { label: 'CascadeType.ALL', detail: 'ALL means: save/delete/persist/merge/refresh all cascade to the children. Useful when patients are owned by a ward and should be deleted with it. Avoid on @ManyToOne — you don\'t want deleting a patient to delete the ward.' },
      ]}
    >
      <div className="s5-intro">
        <h1>@ManyToOne & @OneToMany</h1>
        <p className="s5-tagline">🔗 The most common JPA relationship. Patient → Ward.</p>
        <p className="s5-why">Every foreign key in your schema becomes a @ManyToOne in Java. Understanding which side owns the FK prevents duplicate columns and N+1 bugs.</p>
      </div>

      <div className="s5-info">
        <p>
          <strong style={{color:'#818cf8'}}>Rule:</strong> The table with the foreign key column gets @ManyToOne.
          The other side gets @OneToMany(mappedBy). Only ONE side can own the relationship.
        </p>
      </div>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage5Shell>
  );
}
