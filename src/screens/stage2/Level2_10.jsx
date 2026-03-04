// src/screens/stage2/Level2_10.jsx
// Rebuilt: annotated bug comments explain WHAT is wrong and WHY
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';
import './Level2_10.css';

const SUPPORT = {
  intro: {
    concept: "Inheritance — extends & super",
    tagline: "Child classes inherit everything from the parent. super calls the parent constructor.",
    whatYouWillDo: "Fix 3 bugs in an inheritance hierarchy — a class missing extends, a super() call in the wrong position, and a missing @Override annotation.",
    whyItMatters: "Inheritance is how you model real-world hierarchies without repeating code. In Spring Boot, BaseEntity gives every entity an id and timestamps — all entities extend it and get those fields for free.",
  },
  hints: [
    "The 'extends' keyword creates the inheritance link: class Patient extends Person. Without it, Patient is a completely separate class with no access to Person's fields or methods.",
    "super() calls the PARENT constructor and must be the VERY FIRST line in the child constructor. Java enforces this strictly — if super() is not first, you get a compile error.",
    "@Override tells the compiler you intend to override a parent method. Without it the code still works, but if you misspell the method name Java silently creates a NEW method instead of overriding — a subtle bug."
  ],
  reveal: {
    concept: "Inheritance — extends & super",
    whatYouLearned: "extends creates an is-a relationship. Patient extends Person means every Patient is a Person and inherits all accessible fields and methods. super() calls the parent constructor and must be first. @Override signals intentional overriding and lets the compiler catch typos.",
    realWorldUse: "Spring Boot's BaseEntity pattern: abstract class BaseEntity has @Id Long id, LocalDateTime createdAt, LocalDateTime updatedAt. Every entity extends BaseEntity. Zero duplication of audit fields. Hibernate handles the rest via @MappedSuperclass.",
    developerSays: "Do not overuse inheritance. Use it only for genuine is-a relationships. Patient is-a Person — correct. Do not use it just to share methods — that is what interfaces are for. When in doubt, favour composition over inheritance.",
  },
};

const BROKEN_CODE = `public class Main {

    static class Person {
        String name;
        int age;

        public Person(String name, int age) {
            this.name = name;
            this.age  = age;
        }

        public String getInfo() {
            return name + " (age " + age + ")";
        }
    }

    // BUG 1: Missing 'extends Person' — Patient does not inherit from Person
    // Without it, Patient has no access to name, age, or getInfo()
    // Fix: add 'extends Person' after 'Patient'
    static class Patient {
        String ward;

        public Patient(String name, int age, String ward) {

            // BUG 2: super() must be the FIRST line — it is currently after the assignment
            // Java requires the parent to be initialised before the child sets anything
            // Fix: move super(name, age) to be the first line
            this.ward = ward;
            super(name, age);
        }

        // BUG 3: @Override is missing — without it Java does not know this overrides getInfo
        // If you ever mistype the method name, Java silently creates a new method instead
        // Fix: add @Override on the line above this method
        public String getInfo() {
            return super.getInfo() + " | Ward: " + ward;
        }
    }

    public static void main(String[] args) {
        Patient p = new Patient("Bob", 45, "Oncology");
        System.out.println(p.getInfo());
    }
}`;

const SOLUTION = `public class Main {

    static class Person {
        String name;
        int age;

        public Person(String name, int age) {
            this.name = name;
            this.age  = age;
        }

        public String getInfo() {
            return name + " (age " + age + ")";
        }
    }

    static class Patient extends Person {
        String ward;

        public Patient(String name, int age, String ward) {
            super(name, age);
            this.ward = ward;
        }

        @Override
        public String getInfo() {
            return super.getInfo() + " | Ward: " + ward;
        }
    }

    public static void main(String[] args) {
        Patient p = new Patient("Bob", 45, "Oncology");
        System.out.println(p.getInfo());
    }
}`;

const BUGS = [
  { id: 1, line: 19, description: "Missing 'extends Person' — Patient has no connection to Person", fix: "Add 'extends Person' after 'Patient'" },
  { id: 2, line: 26, description: "super() is not first — Java requires parent init before child setup", fix: "Move super(name, age) to be the first line of the constructor" },
  { id: 3, line: 31, description: "Missing @Override — compiler cannot verify the override is correct", fix: "Add @Override on the line above the getInfo method" }
];

export default function Level2_10() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={10} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l210-container">
          <div className="l210-brief">
            <div className="l210-brief-tag">// Debug Mission</div>
            <h2>Fix the broken code for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Each bug is marked with a comment explaining what is wrong and why. Read the comment above each bug, understand it, then fix the line.</p>
          </div>
          <DebugEditor
            brokenCode={BROKEN_CODE}
            solution={SOLUTION}
            bugs={BUGS}
            expectedOutput="Bob (age 45) | Ward: Oncology"
            onAllFixed={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}