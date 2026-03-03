// src/screens/stage2/Level2_12.jsx
import { useState } from 'react';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';

const SUPPORT = {
  intro: {
    concept: "Abstract Classes",
    tagline: "A blueprint you cannot build from directly. Forces every subclass to implement specific methods.",
    whatYouWillDo: "Debug a broken abstract class hierarchy — an abstract class being instantiated, a missing abstract method implementation, and a concrete class missing the required override.",
    whyItMatters: "Abstract classes are the foundation of framework design. Spring's AbstractController, JPA's AbstractEntity — they define the skeleton, you fill in the behaviour. Understanding abstract classes lets you understand how Spring itself is built.",
  },
  hints: [
    "abstract class cannot be instantiated with new. It can only be subclassed. If you try new AbstractClass() Java throws a compile error.",
    "abstract methods have no body — just the signature ending in semicolon: abstract String describe();. Every concrete subclass MUST implement every abstract method.",
    "A class with at least one abstract method must itself be declared abstract. A class that extends an abstract class must implement all abstract methods or also be declared abstract.",
  ],
  reveal: {
    concept: "Abstract Classes & Forced Implementation",
    whatYouLearned: "abstract classes cannot be instantiated directly. They define abstract methods — method signatures with no body that every concrete subclass must implement. This enforces a contract: any subclass of Animal must have a makeSound() method. The compiler rejects any subclass that forgets to implement it.",
    realWorldUse: "Spring's AbstractApplicationContext is abstract. You never create one directly. You use ClassPathXmlApplicationContext or AnnotationConfigApplicationContext which extend it. The abstract class does the 95% of shared setup; concrete classes handle the 5% that differs. Same pattern in JUnit's abstract test base classes.",
    developerSays: "Abstract classes vs interfaces — abstract classes are for 'is-a' relationships where you have shared implementation to provide. Use abstract when subclasses share code. Use interfaces when you just want to define a contract with no shared code. In practice: abstract class for a family of related things, interface for a capability.",
  },
};

const BROKEN = `public class Main {

    // abstract class — cannot be instantiated, forces subclasses to implement describe()
    static abstract class Animal {
        String name;

        Animal(String name) { this.name = name; }

        abstract String sound();

        // Shared method — all animals can use this
        void introduce() {
            System.out.println("I am " + name + " and I go: " + sound());
        }
    }

    static class Dog extends Animal {
        Dog(String name) { super(name); }

        @Override
        public String sound() { return "Woof"; }
    }

    // BUG 1: Cat does not implement the abstract method sound()
    static class Cat extends Animal {
        Cat(String name) { super(name); }
        // sound() missing!
    }

    public static void main(String[] args) {
        // BUG 2: Cannot instantiate abstract class directly
        Animal a = new Animal("Generic");
        a.introduce();

        Dog d = new Dog("Rex");
        d.introduce();

        Cat c = new Cat("Whiskers");
        c.introduce();
    }
}`;

const SOLUTION = `public class Main {

    static abstract class Animal {
        String name;

        Animal(String name) { this.name = name; }

        abstract String sound();

        void introduce() {
            System.out.println("I am " + name + " and I go: " + sound());
        }
    }

    static class Dog extends Animal {
        Dog(String name) { super(name); }

        @Override
        public String sound() { return "Woof"; }
    }

    static class Cat extends Animal {
        Cat(String name) { super(name); }

        @Override
        public String sound() { return "Meow"; }
    }

    public static void main(String[] args) {
        Dog d = new Dog("Rex");
        d.introduce();

        Cat c = new Cat("Whiskers");
        c.introduce();
    }
}`;

const BUGS = [
  {
    id: 'missing-sound',
    description: 'Bug 1: Cat does not implement abstract method sound()',
    check: code => /class\s+Cat[\s\S]*?sound\(\)/.test(code),
  },
  {
    id: 'instantiate-abstract',
    description: 'Bug 2: Cannot instantiate abstract class Animal with new Animal()',
    check: code => !/new\s+Animal\s*\(/.test(code),
  },
];

const simulate = code => {
  if (!/new\s+Animal\s*\(/.test(code) && /class\s+Cat[\s\S]*?sound\(\)/.test(code)) {
    return 'I am Rex and I go: Woof\nI am Whiskers and I go: Meow';
  }
  return '[Fix all bugs to see output]';
};

export default function Level2_12() {
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={12} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#f97316', letterSpacing:3, marginBottom:10 }}>// Debug Mission</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>Fix the Animal abstract class hierarchy.</h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>
              2 bugs: a missing abstract method implementation and an illegal direct instantiation of an abstract class.
            </p>
          </div>
          <DebugEditor
            brokenCode={BROKEN} bugs={BUGS} solution={SOLUTION}
            expectedOutput={"I am Rex and I go: Woof\nI am Whiskers and I go: Meow"}
            simulateOutput={simulate} onAllFixed={() => setOk(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}