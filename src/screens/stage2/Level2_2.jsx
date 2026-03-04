// src/screens/stage2/Level2_2.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_2.css';

// ── What this level teaches ───────────────────────────────────────────────
// Variables & Data Types — the 5 core types in Java
// Fill mode: student fills in the TYPE keywords, not the values
// All other code (comments, structure, println) is pre-written and locked
// ─────────────────────────────────────────────────────────────────────────

const SUPPORT = {
  intro: {
    concept: "Variables & Data Types",
    tagline: "A variable is a named box. The type tells Java what can go inside.",
    whatYouWillDo: "Fill in the 6 type keywords for each variable. The values and println statements are already written — your job is to tell Java what TYPE each variable holds.",
    whyItMatters: "Java is statically typed — every variable must declare its type before it can hold a value. The compiler reads your types and catches mismatches before your program ever runs. This prevents entire categories of bugs that only appear in production at 3am.",
  },
  hints: [
    "Java's primitive types: int (whole numbers like 42), double (decimals like 98.6), boolean (only true or false), char (single character in single quotes like 'A'). String is NOT a primitive — it is a class, which is why it starts with a capital S.",
    "Declaration syntax is always: type name = value; — for example int age = 25; or String name = \"Alex\"; The type always comes first, then the variable name, then = and the value.",
    "boolean variables can only hold true or false (lowercase, no quotes). char holds exactly one character in single quotes: 'A' not \"A\". String holds any text in double quotes.",
  ],
  reveal: {
    concept: "Static Typing in Java",
    whatYouLearned: "Java requires every variable to declare its type. int for whole numbers, double for decimals, boolean for true/false, char for single characters, String for text. Each type tells Java how much memory to allocate and what operations are legal on that variable.",
    realWorldUse: "In Spring Boot REST APIs every field in a data model is explicitly typed. When JSON arrives from a client, Spring's Jackson library uses your declared types to validate and convert the data. Wrong type — exception thrown immediately. Correct type — object created cleanly. Static typing is your first defence against bad data.",
    developerSays: "Every junior developer underestimates static typing. Then they use a dynamically typed language and a bug appears in production at 3am because someone passed a String where an int was expected. Java's type system catches that at compile time. The verbosity is the point.",
  },
};

// ── Type reference cards shown above the editor ───────────────────────────
// Real-world explanation of WHEN and WHY you use each type
const TYPE_CARDS = [
  { type: 'int',     example: '42',      desc: 'Whole numbers — patient count, age, room number, quantity' },
  { type: 'double',  example: '98.6',    desc: 'Decimal numbers — temperature, weight, price, BMI' },
  { type: 'boolean', example: 'true',    desc: 'True or false — isActive, isAdult, hasInsurance' },
  { type: 'char',    example: "'A'",     desc: 'Single character — blood type, grade, initial' },
  { type: 'String',  example: '"hello"', desc: 'Text — name, address, diagnosis, any words' },
];

// ── Template: locked code with blanks for TYPE keywords only ──────────────
// Comments explain what each variable stores and why that type fits
const TEMPLATE = `public class ___CLASS___ {
    public static void main(String[] args) {

        // int: whole numbers — no decimal point
        // Use for: counts, ages, room numbers, quantities
        ___INT_TYPE___ patientCount = 42;

        // double: numbers with a decimal point
        // Use for: temperatures, weights, prices, measurements
        ___DOUBLE_TYPE___ temperature = 98.6;

        // boolean: exactly two values — true or false, nothing else
        // Use for: flags, status checks, on/off switches
        ___BOOL_TYPE___ isActive = true;

        // char: a single character — always in single quotes
        // Use for: blood types, grades, initials
        ___CHAR_TYPE___ bloodType = 'A';

        // String: text of any length — always in double quotes
        // Capital S because String is a class, not a primitive
        ___STRING_TYPE___ doctorName = "Dr. Patel";

        System.out.println("Patients: " + patientCount);
        System.out.println("Temp: " + temperature);
        System.out.println("Active: " + isActive);
        System.out.println("Blood: " + bloodType);
        System.out.println("Doctor: " + doctorName);
    }
}`;

const BLANKS = [
  { id: 'CLASS',       answer: 'Main',    placeholder: 'ClassName', hint: 'The class name. Must match filename Main.java exactly.' },
  { id: 'INT_TYPE',    answer: 'int',     placeholder: 'type',      hint: 'Whole numbers. 4 bytes. Use for counts, ages, IDs.' },
  { id: 'DOUBLE_TYPE', answer: 'double',  placeholder: 'type',      hint: 'Decimal numbers. 8 bytes. More precise than float.' },
  { id: 'BOOL_TYPE',   answer: 'boolean', placeholder: 'type',      hint: 'True or false only. Used in every if statement.' },
  { id: 'CHAR_TYPE',   answer: 'char',    placeholder: 'type',      hint: 'Single character. Always in single quotes like \'A\'.' },
  { id: 'STRING_TYPE', answer: 'String',  placeholder: 'type',      hint: 'Text. Capital S — it is a class, not a primitive type.' },
];

export default function Level2_2() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={2} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l22-container">

          {/* Mission brief */}
          <div className="l22-brief">
            <div className="l22-brief-tag">// Mission Brief</div>
            <h2 className="l22-brief-title">
              Declare the data for your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.
            </h2>
            <p className="l22-brief-text">
              Every system stores data — patient counts, temperatures, doctor names.
              Before you can store anything in Java, you must declare what <em>type</em> it is.
              The variables and values are already written. Fill in the 6 type keywords.
            </p>

            {/* Type reference — real-world use cases, not just definitions */}
            <div className="l22-type-ref">
              {TYPE_CARDS.map(t => (
                <div key={t.type} className="l22-type-card">
                  <span className="l22-type-name">{t.type}</span>
                  <span className="l22-type-example">{t.example}</span>
                  <span className="l22-type-desc">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fill editor — only the type keyword blanks are editable */}
          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="Patients: 42\nTemp: 98.6\nActive: true\nBlood: A\nDoctor: Dr. Patel"
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}