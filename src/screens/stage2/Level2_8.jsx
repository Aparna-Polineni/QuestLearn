// src/screens/stage2/Level2_8.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';
import './Level2_8.css';

const SUPPORT = {
  intro: {
    concept: "Constructors & this Keyword",
    tagline: "A constructor initialises an object's state the moment it is created. The this keyword distinguishes the object's fields from the method's parameters.",
    whatYouWillDo: "Debug a class with broken constructors — a missing this keyword causing wrong assignments, a constructor with the wrong return type, and constructor overloading done incorrectly.",
    whyItMatters: "Constructors are called every time you create an object. If the constructor is wrong, every object your system creates starts with bad data. In Spring Boot, JPA entities rely on a default no-args constructor — get this wrong and Hibernate cannot instantiate your entity.",
  },
  hints: [
    "Constructors look like methods but have NO return type — not even void. They have the same name as the class. If you write void Constructor() you have written a method, not a constructor.",
    "this.fieldName refers to the object's field. Without this, if a parameter has the same name as a field, the parameter shadows the field and the assignment does nothing useful.",
    "Constructors can be overloaded — same name, different parameters. Java picks the right one based on what arguments you pass. A no-args constructor (no parameters) is required by Hibernate/JPA.",
  ],
  reveal: {
    concept: "Constructors, this & Overloading",
    whatYouLearned: "Constructors initialise objects and have no return type. this.field refers to the object's own field when a parameter name clashes. Constructors can be overloaded with different parameter lists. A no-args constructor is required for frameworks like Hibernate that create objects by reflection.",
    realWorldUse: "In Spring Boot JPA entities, Hibernate requires a no-args constructor to instantiate objects when loading from the database. You typically have two constructors: one empty (for Hibernate) and one with all required fields (for your code to create new records). Forgetting the no-args constructor causes a HibernateException at runtime.",
    developerSays: "The this keyword trips up every new Java developer. Draw it on paper: the object is a box with labelled compartments (fields). this.name = name; says 'put the parameter value into MY name compartment'. Without this, you are just assigning the parameter to itself.",
  },
};

const BROKEN_CODE = `public class Main {

    static class Doctor {
        String name;
        String specialty;
        int yearsExp;

        // BUG 1: Constructor has a return type — constructors have NO return type
        public void Doctor(String name, String specialty, int yearsExp) {
            // BUG 2: Missing 'this.' — parameter shadows the field, nothing is assigned
            name      = name;
            specialty = specialty;
            yearsExp  = yearsExp;
        }

        // BUG 3: Overloaded constructor — wrong class name (lowercase 'd')
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
  {
    id: 'return-type',
    description: 'Bug 1: Constructor has "void" return type — constructors have none',
    check: code => !/public\s+void\s+Doctor/.test(code) && /public\s+Doctor\s*\(String name, String specialty, int yearsExp\)/.test(code),
  },
  {
    id: 'missing-this',
    description: 'Bug 2: Missing "this." — fields not assigned from parameters',
    check: code => /this\.name\s*=\s*name/.test(code) && /this\.specialty\s*=\s*specialty/.test(code) && /this\.yearsExp\s*=\s*yearsExp/.test(code),
  },
  {
    id: 'wrong-constructor-name',
    description: 'Bug 3: Overloaded constructor named "doctor" (lowercase) — must be "Doctor"',
    check: code => !/public\s+doctor\s*\(/.test(code) && /public\s+Doctor\s*\(String name, String specialty\)/.test(code),
  },
];

function simulateOutput(code) {
  const hasThis = /this\.name\s*=\s*name/.test(code);
  const noVoid  = !/public\s+void\s+Doctor/.test(code);
  const fixedOverload = !/public\s+doctor\s*\(/.test(code);
  if (hasThis && noVoid && fixedOverload) {
    return 'Dr. Sharma (Cardiology) — 12 yrs exp\nDr. Khan (Neurology) — 0 yrs exp';
  }
  return '[Fix all bugs to see output]';
}

export default function Level2_8() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={8} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l28-container">
          <div className="l28-brief">
            <div className="l28-brief-tag">// Debug Mission</div>
            <h2>Fix the broken <span style={{ color: selectedDomain?.color }}>Doctor</span> constructors.</h2>
            <p>3 bugs, 3 different constructor mistakes. Each one breaks objects at the moment of creation — before any code runs.</p>
          </div>
          <DebugEditor
            brokenCode={BROKEN_CODE}
            bugs={BUGS}
            solution={SOLUTION}
            expectedOutput={"Dr. Sharma (Cardiology) — 12 yrs exp\nDr. Khan (Neurology) — 0 yrs exp"}
            simulateOutput={simulateOutput}
            onAllFixed={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}