// src/screens/stage4/Level4_3.jsx — The Patient Model (@Entity)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_3.css';

const SUPPORT = {
  intro: {
    concept: 'The Patient Model — @Entity',
    tagline: 'One annotation turns a Java class into a database table.',
    whatYouWillDo: 'Add the JPA annotations that map the Patient class to the patients table — @Entity, @Id, @GeneratedValue, and the column constraints.',
    whyItMatters: 'The model is the foundation of the entire backend. Every API endpoint, every service method, and every database query works with the Patient model. Get this right and everything else flows from it.',
  },
  hints: [
    '@Entity marks the class as a JPA entity — Spring will create a "patient" table for it automatically. @Table(name="patients") lets you customise the table name.',
    '@Id marks the primary key field. @GeneratedValue(strategy=GenerationType.IDENTITY) tells the database to auto-increment it.',
    '@Column(nullable=false) adds a NOT NULL constraint. @Column(length=100) sets the max varchar length.',
  ],
  reveal: {
    concept: 'JPA Entities & Column Mapping',
    whatYouLearned: '@Entity = database table. @Id = primary key. @GeneratedValue = auto-increment. @Column = column constraints. Spring Boot + Hibernate reads these annotations at startup and creates the schema. You write Java — Hibernate writes SQL.',
    realWorldUse: 'Every row in the patients table is one Patient object. Spring Data JPA can generate all the SQL you need — findAll(), findById(), save(), delete() — with zero SQL code from you. The annotations are the contract between your Java code and your database.',
    developerSays: 'Start simple — @Entity, @Id, @GeneratedValue, and String fields. Add @Column constraints once the basic model works. Premature schema optimisation wastes time when requirements change.',
  },
};

const TEMPLATE = `import jakarta.persistence.*;

// FILL 1: Mark this class as a JPA entity (maps to a database table)
___ENTITY___
// FILL 2: Customise the table name to "patients"
___TABLE___
public class Patient {

    // FILL 3: Mark this as the primary key
    ___ID___
    // FILL 4: Auto-increment the ID using database identity strategy
    ___GENERATED_VALUE___
    private Long id;

    // FILL 5: Make name NOT NULL with max length 100
    ___COLUMN_NAME___
    private String name;

    private String ward;

    // FILL 6: Make priority NOT NULL with default "NORMAL"
    ___COLUMN_PRIORITY___
    private String priority = "NORMAL";

    // Getters and setters omitted for brevity
}`;

const BLANKS = [
  { id: 'ENTITY',           answer: '@Entity',                                                    placeholder: 'annotation', hint: 'Marks this class as a JPA entity. Spring Boot creates a table for it.' },
  { id: 'TABLE',            answer: '@Table(name="patients")',                                    placeholder: 'annotation', hint: 'Customises the database table name. Without it, table name = class name.' },
  { id: 'ID',               answer: '@Id',                                                        placeholder: 'annotation', hint: 'Marks the primary key field — every entity must have exactly one.' },
  { id: 'GENERATED_VALUE',  answer: '@GeneratedValue(strategy=GenerationType.IDENTITY)',          placeholder: 'annotation', hint: 'Tells the DB to auto-increment the ID. IDENTITY uses the DB\'s own sequence.' },
  { id: 'COLUMN_NAME',      answer: '@Column(nullable=false, length=100)',                        placeholder: 'annotation', hint: 'Adds NOT NULL and varchar(100) constraints to this column.' },
  { id: 'COLUMN_PRIORITY',  answer: '@Column(nullable=false)',                                    placeholder: 'annotation', hint: 'NOT NULL only — no length needed for short strings like priority.' },
];

const ANATOMY = [
  { ann: '@Entity',                      role: 'class → database table' },
  { ann: '@Table(name="patients")',       role: 'customise table name' },
  { ann: '@Id',                          role: 'primary key field' },
  { ann: '@GeneratedValue(...IDENTITY)',  role: 'auto-increment' },
  { ann: '@Column(nullable=false)',       role: 'NOT NULL constraint' },
  { ann: '@Column(length=100)',          role: 'varchar length' },
];

export default function Level4_3() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={3} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l43-container">
          <div className="l43-brief">
            <div className="l43-brief-tag">// Fill Mission — JPA Entity</div>
            <h2>Map the Patient class to the <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> database.</h2>
            <p>Six annotations. They tell Hibernate how to create the patients table and enforce constraints.</p>
          </div>

          <div className="l43-anatomy">
            <div className="l43-anatomy-title">// JPA Annotation Reference</div>
            <div className="l43-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.ann} className="l43-anat-row">
                  <span className="l43-anat-annotation">{a.ann}</span>
                  <span className="l43-anat-desc">— {a.role}</span>
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