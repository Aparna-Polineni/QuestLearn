// src/screens/stage2/Level2_7.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';
import './Level2_7.css';

const SUPPORT = {
  intro: {
    concept: "Classes & Objects",
    tagline: "A class is a blueprint. An object is a real thing built from that blueprint.",
    whatYouWillDo: "You will debug a broken Patient class that has 4 deliberate mistakes — missing keywords, wrong syntax, incorrect access. Fix them and see the object come to life.",
    whyItMatters: "Every entity in your system — Patient, Doctor, Order, Product — will become a Java class. Understanding class structure is the gateway to all of OOP, Spring Boot models, database entities, and REST responses.",
  },
  hints: [
    "A class declaration: public class ClassName { fields; methods; }. The class name must match the filename exactly (case-sensitive).",
    "Fields (instance variables) are declared inside the class but outside methods. They belong to each object. Methods belong to the class definition but operate on each object's data.",
    "To create an object from a class: ClassName variable = new ClassName(); The new keyword allocates memory. The constructor (a method with the same name as the class) initialises the object.",
  ],
  reveal: {
    concept: "Classes, Objects & the new Keyword",
    whatYouLearned: "A class is a template: it defines fields (data) and methods (behaviour). An object is an instance — a specific copy of the class with its own values. The new keyword creates an object in memory and calls the constructor to initialise it. Every object you create has its own copy of the fields.",
    realWorldUse: "In Spring Boot, every database table maps to a Java class called an Entity. @Entity Patient class maps to a patients table. Each row in the table becomes a Patient object in memory. When your API returns JSON, Spring converts the object's fields to JSON keys automatically.",
    developerSays: "The mental shift from procedural to object-oriented thinking is the hardest thing for new Java developers. Stop thinking about steps. Start thinking about things — what data does this thing have, and what can it do? That is the class.",
  },
};

const BROKEN_CODE = `public class Main {

    // BUG 1: Missing 'class' keyword in Patient declaration
    public Patient {
        String name;
        int age;
        String ward;

        // BUG 2: Constructor name must match class name exactly
        public patient(String name, int age, String ward) {
            this.name = name;
            this.age  = age;
            this.ward = ward;
        }

        // BUG 3: Missing return type
        public getInfo() {
            return name + " | Age: " + age + " | Ward: " + ward;
        }
    }

    public static void main(String[] args) {
        // BUG 4: Missing 'new' keyword
        Patient p = Patient("Alice", 34, "Cardiology");
        System.out.println(p.getInfo());
    }
}`;

const SOLUTION = `public class Main {

    public static class Patient {
        String name;
        int age;
        String ward;

        public Patient(String name, int age, String ward) {
            this.name = name;
            this.age  = age;
            this.ward = ward;
        }

        public String getInfo() {
            return name + " | Age: " + age + " | Ward: " + ward;
        }
    }

    public static void main(String[] args) {
        Patient p = new Patient("Alice", 34, "Cardiology");
        System.out.println(p.getInfo());
    }
}`;

const BUGS = [
  {
    id: 'missing-class',
    description: 'Bug 1: Patient declaration missing "class" keyword',
    check: code => /public\s+(static\s+)?class\s+Patient/.test(code),
  },
  {
    id: 'wrong-constructor',
    description: 'Bug 2: Constructor name is "patient" — must match class "Patient"',
    check: code => /public\s+Patient\s*\(/.test(code),
  },
  {
    id: 'missing-return-type',
    description: 'Bug 3: getInfo() method missing return type "String"',
    check: code => /public\s+String\s+getInfo\s*\(/.test(code),
  },
  {
    id: 'missing-new',
    description: 'Bug 4: Object creation missing "new" keyword',
    check: code => /new\s+Patient\s*\(/.test(code),
  },
];

function simulateOutput(code) {
  const hasNew = /new\s+Patient\s*\(/.test(code);
  if (hasNew && /public\s+String\s+getInfo/.test(code)) {
    return 'Alice | Age: 34 | Ward: Cardiology';
  }
  return '[Fix all bugs to see output]';
}

export default function Level2_7() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={7} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l27-container">

          <div className="l27-brief">
            <div className="l27-brief-tag">// Debug Mission</div>
            <h2>Fix the broken <span style={{ color: selectedDomain?.color }}>{selectedDomain?.id === 'hospital' ? 'Patient' : 'Entity'}</span> class.</h2>
            <p>This Patient class has 4 deliberate bugs. Each bug breaks a core rule of Java class syntax. Find and fix all 4 — the bug chips at the top turn green as you fix each one.</p>
          </div>

          <DebugEditor
            brokenCode={BROKEN_CODE}
            bugs={BUGS}
            solution={SOLUTION}
            expectedOutput="Alice | Age: 34 | Ward: Cardiology"
            simulateOutput={simulateOutput}
            onAllFixed={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}