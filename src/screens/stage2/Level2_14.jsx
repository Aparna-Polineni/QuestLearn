// src/screens/stage2/Level2_14.jsx — Static vs Instance
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';
import './Level2_14.css';

const SUPPORT = {
  intro: {
    concept: "Static vs Instance Members",
    tagline: "static belongs to the class — one copy shared by all. Instance belongs to each object — every object has its own.",
    whatYouWillDo: "Fix 2 bugs — a counter that should be static (shared across all Hospital objects) but is instance (each object starts its own count), and a utility method that should be static but is not.",
    whyItMatters: "In Spring Boot, @Service classes are singletons — one instance shared across all requests. Their fields must be stateless. Accidentally storing request data in an instance field causes one user to see another user's data in production.",
  },
  hints: [
    "static fields belong to the CLASS — one copy shared by all instances. Without static, patientCount is per-object: h1 has its own count, h2 has its own. They never add up. With static there is one shared count.",
    "static methods can only access static fields and other static methods. They have no 'this' reference — no object context. A utility method that uses no instance data should be static.",
    "Call static methods on the class, not an object: Hospital.formatBedNumber(2, 5) not h1.formatBedNumber(2, 5). Calling on an instance works but is misleading — it hides the fact that no object is needed.",
  ],
  reveal: {
    concept: "Static vs Instance: Class vs Object Scope",
    whatYouLearned: "static = one copy for the entire class, shared by all objects. instance = one copy per object, each object has its own. Static methods cannot use 'this' — no object exists in that context. Common statics: counters, constants, utility/factory methods.",
    realWorldUse: "In Spring Boot, @Service classes are singletons — one instance handles all requests. Their fields should be stateless. If you store request data in a service field, request A's data leaks into request B. That is a static-vs-instance scoping bug at the framework level.",
    developerSays: "Classic mistake: int count = 0 as an instance field when you wanted a shared counter. Every new object starts at 0 and counts independently. Make it static int count = 0 and there is one counter for all objects. I have seen this bug in production systems counting things that were never supposed to be zero.",
  },
};

const BROKEN_CODE = `public class Main {

    static class Hospital {
        String name;

        // BUG 1: patientCount is an instance field — each Hospital gets its own count
        // h1.admitPatient() increments h1's count. h2.admitPatient() increments h2's count
        // They are completely separate — they never add up to a total
        // With our test: h1 count = 2, h2 count = 1. Hospital.patientCount does not exist
        // Fix: add 'static' before 'int patientCount'
        int patientCount = 0;

        Hospital(String name) { this.name = name; }

        void admitPatient() {
            patientCount++;
        }

        // BUG 2: formatBedNumber uses no instance data — it should be static
        // Without static, you need a Hospital object to call it even though
        // the method has nothing to do with any specific hospital
        // Hospital.formatBedNumber(2, 5) won't work without static
        // Fix: add 'static' before 'String formatBedNumber'
        String formatBedNumber(int ward, int bed) {
            return "W" + ward + "-B" + bed;
        }
    }

    public static void main(String[] args) {
        Hospital h1 = new Hospital("City Hospital");
        Hospital h2 = new Hospital("St. Mary's");

        h1.admitPatient();
        h1.admitPatient();
        h2.admitPatient();

        // After fixing bug 1: patientCount is shared, total = 3
        System.out.println("Total patients: " + Hospital.patientCount);

        // After fixing bug 2: can call without an object
        System.out.println("Bed: " + Hospital.formatBedNumber(2, 5));
    }
}`;

const SOLUTION = `public class Main {

    static class Hospital {
        String name;

        static int patientCount = 0;

        Hospital(String name) { this.name = name; }

        void admitPatient() {
            patientCount++;
        }

        static String formatBedNumber(int ward, int bed) {
            return "W" + ward + "-B" + bed;
        }
    }

    public static void main(String[] args) {
        Hospital h1 = new Hospital("City Hospital");
        Hospital h2 = new Hospital("St. Mary's");

        h1.admitPatient();
        h1.admitPatient();
        h2.admitPatient();

        System.out.println("Total patients: " + Hospital.patientCount);
        System.out.println("Bed: " + Hospital.formatBedNumber(2, 5));
    }
}`;

const BUGS = [
  { id: 1, line: 10, description: "patientCount is instance — each Hospital has its own count, they never add up", fix: "Add 'static' before 'int patientCount = 0'" },
  { id: 2, line: 21, description: "formatBedNumber uses no instance data but is not static — cannot call without an object", fix: "Add 'static' before 'String formatBedNumber'" },
];

export default function Level2_14() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);
  return (
    <Stage2Shell levelId={14} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l214-container">
          <div className="l214-brief">
            <div className="l214-brief-tag">// Debug Mission</div>
            <h2>Fix the static vs instance bugs for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>2 bugs — both fixed by adding the 'static' keyword in the right place. Read the comments to understand what changes when a field or method becomes static.</p>
          </div>
          <DebugEditor
            brokenCode={BROKEN_CODE}
            solution={SOLUTION}
            bugs={BUGS}
            expectedOutput={"Total patients: 3\nBed: W2-B5"}
            onAllFixed={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}