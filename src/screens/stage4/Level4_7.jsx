// src/screens/stage4/Level4_7.jsx — Validation
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_7.css';

const SUPPORT = {
  intro: {
    concept: 'Bean Validation — @Valid & Constraints',
    tagline: 'Annotate your model. Spring validates automatically before your method runs.',
    whatYouWillDo: 'Add validation annotations to the Patient model and @Valid to the POST endpoint, so Spring rejects invalid data with a 400 Bad Request before it reaches your service.',
    whyItMatters: 'Never trust input. A patient with no name, or a ward of "HACK", should never reach the database. Validation at the API boundary stops bad data before it corrupts anything.',
  },
  hints: [
    '@NotBlank ensures a String field is not null, empty, or whitespace. @NotNull ensures the field is not null. Use @NotBlank for String fields.',
    '@Min(1) and @Max(4) set numeric bounds. @Size(min=1, max=100) constrains String length. @Pattern(regexp="...") validates with regex.',
    'Add @Valid before the @RequestBody parameter in the controller. Without @Valid, the constraints are ignored — Spring does not validate unless you tell it to.',
  ],
  reveal: {
    concept: 'Bean Validation with @Valid',
    whatYouLearned: '@NotBlank, @NotNull, @Min, @Max, @Size, @Pattern — these annotations on your entity fields define the rules. @Valid on the controller parameter triggers Spring to check them. If validation fails, Spring automatically returns 400 Bad Request with details of which fields failed.',
    realWorldUse: 'In a real hospital system: patient name is @NotBlank, ward is @Min(1) @Max(4), priority must match a @Pattern of NORMAL|HIGH|CRITICAL. Every API receives untrusted input. Validation is the first line of defence.',
    developerSays: 'Validate at the boundary — the controller. Do not rely on database constraints alone (they throw cryptic errors). Validation annotations give human-readable error messages and stop bad data before it goes anywhere.',
  },
};

const TEMPLATE = `import jakarta.validation.constraints.*;

public class Patient {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FILL 1: Name must not be blank (not null, not empty, not whitespace)
    ___NOT_BLANK___
    // FILL 2: Name must be between 2 and 100 characters
    ___SIZE___
    private String name;

    // FILL 3: Ward must not be null
    ___NOT_NULL_WARD___
    // FILL 4: Ward number must be at least 1
    ___MIN_WARD___
    // FILL 5: Ward number must be at most 4
    ___MAX_WARD___
    private Integer ward;

    private String priority = "NORMAL";

    // Getters & setters
}

// In the controller:
@PostMapping
public ResponseEntity<Patient> createPatient(
    // FILL 6: Trigger validation on the incoming Patient object
    ___VALID___ @RequestBody Patient patient
) {
    return ResponseEntity.status(201).body(patientService.admitPatient(patient));
}`;

const BLANKS = [
  { id: 'NOT_BLANK',   answer: '@NotBlank',              placeholder: 'annotation', hint: 'Fails if the string is null, empty, or whitespace only.' },
  { id: 'SIZE',        answer: '@Size(min=2, max=100)',   placeholder: 'annotation', hint: '@Size constrains string length. min and max are inclusive.' },
  { id: 'NOT_NULL_WARD', answer: '@NotNull',             placeholder: 'annotation', hint: 'Fails if the value is null. Use @NotBlank for Strings, @NotNull for other types.' },
  { id: 'MIN_WARD',    answer: '@Min(1)',                 placeholder: 'annotation', hint: '@Min sets the lowest allowed numeric value (inclusive).' },
  { id: 'MAX_WARD',    answer: '@Max(4)',                 placeholder: 'annotation', hint: '@Max sets the highest allowed numeric value (inclusive).' },
  { id: 'VALID',       answer: '@Valid',                  placeholder: 'annotation', hint: 'Triggers Bean Validation on this parameter. Without it, all constraints are ignored.' },
];

const ANATOMY = [
  { ann: '@NotBlank',           applies: 'String',  rule: 'not null, not empty, not whitespace' },
  { ann: '@NotNull',            applies: 'Any',     rule: 'not null' },
  { ann: '@Size(min, max)',     applies: 'String',  rule: 'length between min and max' },
  { ann: '@Min(n)',             applies: 'Number',  rule: 'value ≥ n' },
  { ann: '@Max(n)',             applies: 'Number',  rule: 'value ≤ n' },
  { ann: '@Pattern(regexp)',   applies: 'String',  rule: 'matches regular expression' },
  { ann: '@Valid',              applies: 'Param',   rule: 'triggers constraint checking' },
];

export default function Level4_7() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={7} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l47-container">
          <div className="l47-brief">
            <div className="l47-brief-tag">// Fill Mission — Validation</div>
            <h2>Protect the <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> API from invalid patient data.</h2>
            <p>Six annotations. Constrain name and ward on the model, then trigger validation in the controller.</p>
          </div>

          <div className="l47-anatomy">
            <div className="l47-anatomy-title">// Bean Validation Annotations</div>
            <div className="l47-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.ann} className="l47-anat-row">
                  <span className="l47-anat-annotation">{a.ann}</span>
                  <span className="l47-anat-type">{a.applies}</span>
                  <span className="l47-anat-desc">— {a.rule}</span>
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