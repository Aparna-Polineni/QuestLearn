// src/screens/stage2/Level2_7.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';
import './Level2_7.css';

// ── What this level teaches ───────────────────────────────────────────────
// Classes & Objects — class keyword, constructor naming, return type, new keyword
// Debug mode: 4 bugs pre-marked in the broken code
// Each bug comment explains WHAT is wrong and WHY it matters
// ─────────────────────────────────────────────────────────────────────────

const SUPPORT = {
  intro: {
    concept: "Classes & Objects",
    tagline: "A class is a blueprint. An object is a real thing built from that blueprint.",
    whatYouWillDo: "Fix 4 bugs in a broken Patient class. Each bug is marked with a comment explaining what is wrong. Read the explanation, understand why it breaks, then fix it.",
    whyItMatters: "Every entity in your system — Patient, Doctor, Order, Product — becomes a Java class. Getting class structure right is the gateway to Spring Boot models, database entities, and REST responses.",
  },
  hints: [
    "A class declaration must have the 'class' keyword: public class ClassName { }. Without 'class', Java does not know this is a class declaration.",
    "The constructor method must have the EXACT same name as the class — including capitalisation. Patient constructor = public Patient(...). If it is lowercase 'patient', Java treats it as a regular method with no return type.",
    "To create an object: ClassName variable = new ClassName(args). The 'new' keyword allocates memory and calls the constructor. Without 'new', Java tries to call a method named Patient — which does not exist.",
  ],
  reveal: {
    concept: "Classes, Objects & the new Keyword",
    whatYouLearned: "A class is a template defining fields (data) and methods (behaviour). An object is an instance — a specific copy with its own values. The new keyword creates an object in memory. The constructor initialises it. Class name must match filename. Constructor name must match class name exactly.",
    realWorldUse: "In Spring Boot every database table maps to a Java class annotated with @Entity. Each row in the table becomes a Patient object in memory. When your API returns JSON, Spring converts the object's fields to JSON keys automatically.",
    developerSays: "The mental shift from steps to things is the hardest part of OOP. Stop thinking about what happens. Start thinking about what things exist — what data does this thing have, and what can it do? That is the class.",
  },
};

// ── Broken code: each bug annotated with what is wrong and why ────────────
const BROKEN_CODE = `public class Main {

    // BUG 1: Missing 'class' keyword — Java cannot understand this declaration
    // Fix: add the 'class' keyword between 'public' and 'Patient'
    public Patient {
        String name;
        int age;
        String ward;

        // BUG 2: Constructor name must EXACTLY match the class name
        // 'patient' (lowercase p) makes this a regular method, not a constructor
        // Java cannot use it to create a Patient object
        // Fix: capitalise to match — public Patient(...)
        public patient(String name, int age, String ward) {
            this.name = name;
            this.age  = age;
            this.ward = ward;
        }

        // BUG 3: Methods must declare a return type — even if returning a String
        // Without 'String' here, Java does not know what getInfo() gives back
        // Fix: add 'String' return type before the method name
        public getInfo() {
            return name + " | Age: " + age + " | Ward: " + ward;
        }
    }

    public static void main(String[] args) {
        // BUG 4: Missing 'new' keyword — without it Java looks for a METHOD
        // called Patient, not a constructor call to create an object
        // Fix: add 'new' before Patient(...)
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
  { id: 1, line: 4,  description: "Missing 'class' keyword — Java cannot declare a class without it",       fix: "Add 'class' between 'public' and 'Patient'" },
  { id: 2, line: 12, description: "Constructor named 'patient' (lowercase) — must match class name exactly", fix: "Change 'patient' to 'Patient'" },
  { id: 3, line: 20, description: "Method missing return type — Java needs to know what getInfo() returns",  fix: "Add 'String' return type before 'getInfo'" },
  { id: 4, line: 30, description: "Missing 'new' keyword — without it Java cannot create an object",         fix: "Add 'new' before Patient(...)" },
];

export default function Level2_7() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={7} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l27-container">
          <div className="l27-brief">
            <div className="l27-brief-tag">// Debug Mission</div>
            <h2>Fix the broken Patient class for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>There are 4 bugs. Each one is marked with a comment explaining what is wrong and why it breaks the code. Read the comment, understand it, then fix the line below it.</p>
          </div>
          <DebugEditor
            brokenCode={BROKEN_CODE}
            solution={SOLUTION}
            bugs={BUGS}
            expectedOutput="Alice | Age: 34 | Ward: Cardiology"
            onAllFixed={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}