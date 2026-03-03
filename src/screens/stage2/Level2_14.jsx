// src/screens/stage2/Level2_14.jsx
import { useState } from 'react';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';

const SUPPORT = {
  intro: {
    concept: "Static vs Instance Members",
    tagline: "Static belongs to the class. Instance belongs to each object. Mixing them up is one of the most common Java bugs.",
    whatYouWillDo: "Debug a class where a counter should be static (shared across all objects) but is instance (each object gets its own), and a utility method is instance when it should be static.",
    whyItMatters: "In Spring Boot, @Bean methods are effectively static-like — one instance shared across the application. Instance fields hold per-request data. Mixing these up causes data corruption in production: one user seeing another user's data.",
  },
  hints: [
    "static fields belong to the class — one copy shared by all instances. Instance fields belong to each object — each object has its own copy. A patient counter should be static: one count for the whole system.",
    "static methods can only access static fields and other static methods directly. They cannot use this because there is no object context. Instance methods can access both static and instance members.",
    "You call static methods on the class: ClassName.methodName(). You call instance methods on an object: object.methodName(). Calling a static method on an instance works but is bad practice — it hides the fact it is static.",
  ],
  reveal: {
    concept: "Static vs Instance: Class vs Object Scope",
    whatYouLearned: "static = one copy for the whole class. instance = one copy per object. Static methods cannot access instance fields (no object context). Common statics: counters, constants, utility/factory methods. Common instances: every field that describes a specific object.",
    realWorldUse: "In Spring Boot, @Service classes are singletons by default — one instance shared across all requests. Their fields should be stateless (no instance data that changes per request). If you accidentally store request data in a service field, request A's data leaks into request B. That is a static-vs-instance bug at the framework level.",
    developerSays: "The classic mistake: int count = 0 as an instance field when you wanted a shared counter. Every new object starts at 0 and counts independently. Make it static int count = 0 and there is one counter for all objects. I have seen this bug in production systems counting things that should never be zero.",
  },
};

const BROKEN = `public class Main {

    static class Hospital {
        String name;

        // BUG 1: patientCount should be static — shared across all Hospital instances
        int patientCount = 0;

        Hospital(String name) {
            this.name = name;
        }

        void admitPatient() {
            patientCount++;
        }

        // BUG 2: This is a utility method with no instance data — should be static
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

        // Should print 3 — total patients across both hospitals
        // But with instance field it prints 2 and 1 separately
        System.out.println("Total patients: " + Hospital.patientCount);

        // Should call as Hospital.formatBedNumber(2, 5) — no object needed
        System.out.println("Bed: " + Hospital.formatBedNumber(2, 5));
    }
}`;

const SOLUTION = `public class Main {

    static class Hospital {
        String name;

        static int patientCount = 0;

        Hospital(String name) {
            this.name = name;
        }

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
  {
    id: 'instance-counter',
    description: 'Bug 1: patientCount is instance — should be static (shared across all hospitals)',
    check: code => /static\s+int\s+patientCount/.test(code),
  },
  {
    id: 'instance-utility',
    description: 'Bug 2: formatBedNumber() is instance — should be static (no instance data used)',
    check: code => /static\s+String\s+formatBedNumber/.test(code),
  },
];

const simulate = code => {
  if (/static\s+int\s+patientCount/.test(code) && /static\s+String\s+formatBedNumber/.test(code)) {
    return 'Total patients: 3\nBed: W2-B5';
  }
  return '[Fix both bugs to see output]';
};

export default function Level2_14() {
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={14} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#f97316', letterSpacing:3, marginBottom:10 }}>// Debug Mission</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>Fix the static vs instance confusion.</h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>2 bugs — each member is in the wrong scope. Fix them and the total patient count jumps from 2 to 3.</p>
          </div>
          <DebugEditor
            brokenCode={BROKEN} bugs={BUGS} solution={SOLUTION}
            expectedOutput={"Total patients: 3\nBed: W2-B5"}
            simulateOutput={simulate} onAllFixed={() => setOk(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}