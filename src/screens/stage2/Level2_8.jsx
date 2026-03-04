// src/screens/stage2/Level2_8.jsx
// Rebuilt: annotated bug comments explain WHAT is wrong and WHY
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';
import './Level2_8.css';

const SUPPORT = {
  intro: {
    concept: "Constructors & this Keyword",
    tagline: "A constructor initialises an object the moment it is created. this distinguishes the object's fields from the method's parameters.",
    whatYouWillDo: "Fix 3 bugs in a broken Doctor class. The bugs cover: a constructor with a return type, missing this keywords, and a wrongly named overloaded constructor.",
    whyItMatters: "Constructors are called every time an object is created. If wrong, every object starts with bad data. JPA entities need a no-args constructor — get this wrong and Hibernate cannot load your database records.",
  },
  hints: [
    "Constructors have NO return type — not even void. public Doctor(...) is correct. public void Doctor(...) makes it a regular method, not a constructor, and Java cannot use it to create objects.",
    "this.fieldName refers to the OBJECT'S field. Without this, if a parameter has the same name as a field, the assignment name = name just assigns the parameter to itself — the field stays empty.",
    "Overloaded constructors have the same name as the class (matching capitalisation) but different parameters. They let you create objects with different amounts of information."
  ],
  reveal: {
    concept: "Constructors & this Keyword",
    whatYouLearned: "Constructors initialise objects and have no return type. this.field distinguishes the object's field from a same-named parameter. Constructors can be overloaded with different parameter lists. A no-args constructor is required for Hibernate/JPA to load objects from the database.",
    realWorldUse: "In Spring Boot JPA entities, Hibernate requires a no-args constructor to instantiate objects when loading from the database. You typically have two: one empty (for Hibernate) and one with all required fields (for creating new records). Forgetting the no-args constructor causes a HibernateException at runtime.",
    developerSays: "Draw it on paper. The object is a box with named compartments (fields). this.name = name means: put the PARAMETER value into MY name compartment. Without this, you are assigning the parameter to itself — nothing goes into the box.",
  },
};

const BROKEN_CODE = `public class Main {

    static class Doctor {
        String name;
        String specialty;
        int yearsExp;

        // BUG 1: Constructor has a return type — constructors must have NO return type
        // 'void' makes this a regular method called Doctor, not a constructor
        // Java cannot find a real constructor and the code fails to compile
        // Fix: remove 'void'
        public void Doctor(String name, String specialty, int yearsExp) {

            // BUG 2: Missing 'this.' — parameter names shadow the field names
            // 'name = name' just assigns the parameter to itself — the field stays null
            // Fix: add 'this.' before each field name on the LEFT side
            name      = name;
            specialty = specialty;
            yearsExp  = yearsExp;
        }

        // BUG 3: Overloaded constructor has wrong name — 'doctor' not 'Doctor'
        // Java is case-sensitive. 'doctor' is a different name from 'Doctor'
        // This makes it a regular method, not a constructor — Java cannot use it
        // Fix: capitalise to 'Doctor'
        public doctor(String name, String specialty) {
            this.name      = name;
            this.specialty = specialty;
            this.yearsExp  = 0;
        }

        public String getProfile() {
            return name + " (" + specialty + ") — " + yearsExp + " yrs exp";
        }
    }

    public static void main(String[] args) {
        Doctor d1 = new Doctor("Dr. Sharma", "Cardiology", 12);
        Doctor d2 = new Doctor("Dr. Khan", "Neurology");
        System.out.println(d1.getProfile());
        System.out.println(d2.getProfile());
    }
}`;

const SOLUTION = `public class Main {

    static class Doctor {
        String name;
        String specialty;
        int yearsExp;

        public Doctor(String name, String specialty, int yearsExp) {
            this.name      = name;
            this.specialty = specialty;
            this.yearsExp  = yearsExp;
        }

        public Doctor(String name, String specialty) {
            this.name      = name;
            this.specialty = specialty;
            this.yearsExp  = 0;
        }

        public String getProfile() {
            return name + " (" + specialty + ") — " + yearsExp + " yrs exp";
        }
    }

    public static void main(String[] args) {
        Doctor d1 = new Doctor("Dr. Sharma", "Cardiology", 12);
        Doctor d2 = new Doctor("Dr. Khan", "Neurology");
        System.out.println(d1.getProfile());
        System.out.println(d2.getProfile());
    }
}`;

const BUGS = [
  { id: 1, line: 10, description: "Constructor has 'void' return type — constructors must have NO return type", fix: "Remove 'void'" },
  { id: 2, line: 16, description: "Missing 'this.' — fields are never assigned, they stay null", fix: "Add 'this.' before name, specialty, yearsExp on the left side" },
  { id: 3, line: 27, description: "Overloaded constructor named 'doctor' (lowercase) — must be 'Doctor'", fix: "Capitalise to 'Doctor'" }
];

export default function Level2_8() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={8} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l28-container">
          <div className="l28-brief">
            <div className="l28-brief-tag">// Debug Mission</div>
            <h2>Fix the broken code for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Each bug is marked with a comment explaining what is wrong and why. Read the comment above each bug, understand it, then fix the line.</p>
          </div>
          <DebugEditor
            brokenCode={BROKEN_CODE}
            solution={SOLUTION}
            bugs={BUGS}
            expectedOutput="Dr. Sharma (Cardiology) — 12 yrs exp
Dr. Khan (Neurology) — 0 yrs exp"
            onAllFixed={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}