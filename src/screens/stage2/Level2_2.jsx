// src/screens/stage2/Level2_2.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_2.css';

const SUPPORT = {
  intro: {
    concept: "Variables & Data Types",
    tagline: "A variable is a named box that holds a value. The type of the box decides what fits inside.",
    whatYouWillDo: "You will declare variables of every primitive type Java has — int, double, boolean, char — plus String. You will understand why Java makes you declare the type before the name.",
    whyItMatters: "Java is statically typed. This means every variable must declare its type before it can hold a value. This catches bugs at compile time before your program ever runs — a feature worth understanding deeply.",
  },
  hints: [
    "Java's primitives: int (whole numbers), double (decimals), boolean (true/false), char (single character in single quotes). String is not a primitive — it is a class, which is why it starts with a capital letter.",
    "Declaration syntax: type name = value; — for example: int age = 25; or String name = \"Alex\"; The type always comes first, then the variable name, then = and the value.",
    "boolean variables can only hold true or false (lowercase, no quotes). char holds a single character in single quotes like 'A'. String holds text in double quotes like \"Hello\".",
  ],
  reveal: {
    concept: "Static Typing in Java",
    whatYouLearned: "Java requires you to declare the type of every variable before using it. int for whole numbers, double for decimals, boolean for true/false, char for single characters, String for text. Each type tells Java how much memory to allocate and what operations are legal.",
    realWorldUse: "In Spring Boot REST APIs, every field in a data model is explicitly typed. When you receive JSON from a client, Spring's Jackson library uses the declared types to validate and convert the incoming data. Wrong type — exception thrown. Correct type — object created. Static typing is your first line of defence against bad data.",
    developerSays: "Every junior developer underestimates static typing at first. Then they use a dynamically typed language and a bug appears in production at 3am because someone passed a String where an int was expected. Java's type system would have caught that at compile time. The verbosity is the point.",
  },
};

const TEMPLATE = `public class ___CLASS___ {
    public static void main(String[] args) {

        // Integer: whole numbers
        ___INT_TYPE___ patientCount = 42;

        // Decimal: numbers with a decimal point
        ___DOUBLE_TYPE___ temperature = 98.6;

        // Boolean: true or false only
        ___BOOL_TYPE___ isActive = true;

        // Single character: always in single quotes
        ___CHAR_TYPE___ bloodType = 'A';

        // String: text in double quotes (capital S — it's a class)
        ___STRING_TYPE___ doctorName = "Dr. Patel";

        System.out.println("Patients: " + patientCount);
        System.out.println("Temp: " + temperature);
        System.out.println("Active: " + isActive);
        System.out.println("Blood: " + bloodType);
        System.out.println("Doctor: " + doctorName);
    }
}`;

const BLANKS = [
  { id: 'CLASS',       answer: 'Main',    placeholder: 'ClassName', hint: 'The class name. Must match the filename.' },
  { id: 'INT_TYPE',    answer: 'int',     placeholder: 'type',      hint: 'Whole numbers. 4 bytes. Range: -2 billion to 2 billion.' },
  { id: 'DOUBLE_TYPE', answer: 'double',  placeholder: 'type',      hint: 'Decimal numbers. 8 bytes. More precise than float.' },
  { id: 'BOOL_TYPE',   answer: 'boolean', placeholder: 'type',      hint: 'True or false. Smallest type. Used in every if statement.' },
  { id: 'CHAR_TYPE',   answer: 'char',    placeholder: 'type',      hint: 'A single character. Always in single quotes.' },
  { id: 'STRING_TYPE', answer: 'String',  placeholder: 'type',      hint: 'Text. Capital S — it is a class, not a primitive.' },
];

export default function Level2_2() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={2} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l22-container">

          <div className="l22-brief">
            <div className="l22-brief-tag">// Mission Brief</div>
            <h2 className="l22-brief-title">
              Declare the data for your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.
            </h2>
            <p className="l22-brief-text">
              Every system stores data — patient counts, temperatures, doctor names. Before you can store anything in Java, you must declare what <em>type</em> of data it is. Fill in the 6 type keywords below.
            </p>

            <div className="l22-type-ref">
              {[
                { type: 'int',     example: '42',       desc: 'Whole number' },
                { type: 'double',  example: '98.6',     desc: 'Decimal number' },
                { type: 'boolean', example: 'true',     desc: 'True or false' },
                { type: 'char',    example: "'A'",      desc: 'Single character' },
                { type: 'String',  example: '"hello"',  desc: 'Text (class)' },
              ].map(t => (
                <div key={t.type} className="l22-type-card">
                  <span className="l22-type-name">{t.type}</span>
                  <span className="l22-type-example">{t.example}</span>
                  <span className="l22-type-desc">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput={
`Patients: 42\nTemp: 98.6\nActive: true\nBlood: A\nDoctor: Dr. Patel`}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}