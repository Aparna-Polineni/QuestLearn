// src/screens/stage2_5/LevelJS_16.jsx — Classes & OOP
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_16.css';

const SUPPORT = {
  intro: {
    concept: 'Classes & OOP',
    tagline: "JS classes are syntactic sugar over prototypes. If you know Java OOP, the syntax just shifts slightly.",
    whatYouWillDo: "Write a Patient class with a constructor, methods, and a Ward subclass that extends it using super().",
    whyItMatters: "React class components (still found in legacy codebases), custom Error subclasses, and many third-party libraries use ES6 classes. Understanding extends and super is essential for reading any production JS codebase.",
  },
  hints: [
    "class Patient { constructor(name, ward) { this.name = name; this.ward = ward; } }. Create: const p = new Patient('Alice', 'Cardiology'). Access: p.name.",
    "Methods go directly in the class body — no function keyword: describe() { return this.name + ' — ' + this.ward; }. Call: p.describe().",
    "Extend: class InPatient extends Patient { constructor(name, ward, days) { super(name, ward); this.days = days; } }. super() calls the parent constructor — must be called before using this.",
  ],
  reveal: {
    concept: 'ES6 Classes, extends & super',
    whatYouLearned: "class X { constructor() {} method() {} }. new X() creates an instance. this refers to the instance. extends for inheritance. super() calls parent constructor — required before this in a subclass constructor. static for class-level methods. instanceof to check type.",
    realWorldUse: "Custom errors: class ValidationError extends Error { constructor(msg, field) { super(msg); this.field = field; } }. React class components: class MyComponent extends React.Component { render() { return <div/> } }. Many Node.js event emitters and streams use class inheritance.",
    developerSays: "In modern React you almost never write class components — hooks replaced them. But you will see them in older codebases and interviews. And custom error classes are still very useful: throw new ValidationError('Required', 'email') gives you structured error data.",
  },
};

const INITIAL = `// ── TASK 1: Define the Patient class ────────────────────────
// Write class Patient with:
//   constructor(name, ward, age)
//   method: describe() — returns "NAME (AGE) — WARD"
// Create: const p1 = new Patient("Alice Smith", "Cardiology", 34)
// Print: p1.describe()
// Print: "Is Patient: " + (p1 instanceof Patient)

// TODO

// ── TASK 2: Subclass with extends + super ─────────────────────
// Write class InPatient extends Patient with:
//   constructor(name, ward, age, daysAdmitted)
//   Override describe() to return parent describe() + " [" + daysAdmitted + " days]"
// Create: const p2 = new InPatient("Bob Jones", "Oncology", 52, 7)
// Print: p2.describe()
// Print: "Is InPatient: " + (p2 instanceof InPatient)
// Print: "Is Patient: " + (p2 instanceof Patient)

// TODO`;

const EXPECTED = `Alice Smith (34) — Cardiology\nIs Patient: true\nBob Jones (52) — Oncology [7 days]\nIs InPatient: true\nIs Patient: true`;

export default function LevelJS_16() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={16} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs16-container">
          <div className="ljs16-brief">
            <div className="ljs16-brief-tag">// Build Mission</div>
            <h2>Model patients as classes for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Two tasks. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs16-expected-box">
              <div className="ljs16-expected-label">Expected output</div>
              <pre className="ljs16-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs16-anatomy">
            <div className="ljs16-anat-header">// Java class vs JavaScript class — side by side</div>
            <div className="ljs16-compare">
              <div className="ljs16-col java-col">
                <div className="ljs16-col-title">Java</div>
                <pre className="ljs16-code-block">{`public class Patient {
  private String name;
  private String ward;

  public Patient(String name, String ward) {
    this.name = name;
    this.ward = ward;
  }

  public String describe() {
    return name + " — " + ward;
  }
}
// Subclass:
public class InPatient extends Patient {
  public InPatient(String n, String w) {
    super(n, w);
  }
}`}</pre>
              </div>
              <div className="ljs16-col js-col">
                <div className="ljs16-col-title">JavaScript</div>
                <pre className="ljs16-code-block">{`class Patient {
  // no access modifiers — all public by default
  constructor(name, ward) {
    this.name = name;  // property on the instance
    this.ward = ward;
  }

  describe() {  // no 'function' keyword inside class
    return this.name + " — " + this.ward;
  }
}
// Subclass:
class InPatient extends Patient {
  constructor(name, ward, days) {
    super(name, ward); // MUST call before 'this'
    this.days = days;
  }
}`}</pre>
              </div>
            </div>

            <div className="ljs16-anat-header" style={{ marginTop: 18 }}>// Key class features reference</div>
            <div className="ljs16-method-grid">
              {[
                { sig: 'constructor(params)',         note: 'called automatically by new — set up instance properties here' },
                { sig: 'this.property = value',       note: 'instance property — unique to each object created' },
                { sig: 'methodName() { }',            note: 'instance method — shared via prototype, no function keyword' },
                { sig: 'static methodName() { }',    note: 'called on the class itself, not instances: Patient.count()' },
                { sig: 'extends ParentClass',         note: 'inherits all parent methods and properties' },
                { sig: 'super(args)',                 note: 'calls parent constructor — must come before any this. usage' },
                { sig: 'super.method()',              note: 'calls parent version of an overridden method' },
                { sig: 'obj instanceof ClassName',   note: 'true if obj was created from ClassName or a subclass' },
              ].map(r => (
                <div key={r.sig} className="ljs16-method-row">
                  <code className="ljs16-msig">{r.sig}</code>
                  <span className="ljs16-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs16-mistake">
              <div className="ljs16-mistake-label">⚠ Forgetting super() in a subclass constructor crashes immediately</div>
              <div className="ljs16-mrows">
                <div className="ljs16-mrow bad">
                  <span className="ljs16-mtag bad-tag">✗</span>
                  <code>{'class InPatient extends Patient { constructor(n,w,d) { this.days = d; } }'}</code>
                  <span className="ljs16-mnote">ReferenceError: Must call super constructor before accessing 'this'</span>
                </div>
                <div className="ljs16-mrow good">
                  <span className="ljs16-mtag good-tag">✓</span>
                  <code>{'class InPatient extends Patient { constructor(n,w,d) { super(n,w); this.days = d; } }'}</code>
                  <span className="ljs16-mnote">super() first — then this is available</span>
                </div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_, c) => setOk(c)} height={280} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}
