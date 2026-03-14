// src/screens/stage5/Level5_17.jsx — @ManyToOne & @OneToMany (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../../components/FillEditor';
import './Level5_17.css';

const SUPPORT = {
  reveal: {
    concept: '@ManyToOne & @OneToMany',
    whatYouLearned: '@ManyToOne creates a foreign key column. @OneToMany maps the reverse side. The FK column lives on the "many" side. @JoinColumn names the FK column. Together they model a parent-child relationship.',
    realWorldUse: 'Patient→Ward is the core relationship in your hospital app. Many patients, one ward. Stage 4 Level 4.11 built this — now you see the exact SQL it generates.',
    developerSays: '@OneToMany is LAZY by default — it won\'t load the collection until you access it. @ManyToOne is EAGER by default. This asymmetry causes the N+1 problem covered in Level 5.19.',
  },
};

const CODE_TEMPLATE = `@Entity
public class Patient {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many patients → One ward
    // Creates: ward_id BIGINT FOREIGN KEY REFERENCES wards(id)
    @[[ManyToOne]]
    @JoinColumn(name = [[\"ward_id\"]])
    private Ward ward;
}

@Entity
public class Ward {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One ward → Many patients (reverse side)
    @[[OneToMany]](mappedBy = [[\"ward\"]])
    private List<Patient> patients;
}`;

const ANSWERS = ['ManyToOne', '"ward_id"', 'OneToMany', '"ward"'];

export default function Level5_17() {
  const [isCorrect, setIsCorrect] = useState(false);
  return (
    <Stage5Shell levelId={17} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="jpa-container">
        <div className="jpa-brief">
          <div className="jpa-brief-tag">🐘 Stage 5 · Level 5.17 · FILL</div>
          <h2>@ManyToOne & @OneToMany — Foreign Keys in Java</h2>
          <p>A foreign key in SQL becomes an object reference in Java. <code>@ManyToOne</code> on Patient means "patient holds the FK". <code>@OneToMany</code> on Ward means "ward has a collection of patients".</p>
        </div>

        <div className="jpa-ref">
          <div className="jpa-ref-label">SQL ↔ JPA mapping</div>
          <div className="jpa-ref-grid">
            {[
              ['ward_id BIGINT FK','@ManyToOne + @JoinColumn(name="ward_id")'],
              ['REFERENCES wards(id)','Spring infers from the Ward entity'],
              ['mappedBy = "ward"','The field name in Patient that owns the FK'],
              ['LAZY loading','@OneToMany default — load collection on demand'],
              ['EAGER loading','@ManyToOne default — load parent with child'],
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
