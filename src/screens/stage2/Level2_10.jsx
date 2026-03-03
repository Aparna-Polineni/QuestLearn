// src/screens/stage2/Level2_9.jsx — Encapsulation
import { useState } from 'react';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';

const SUPPORT = {
  intro: {
    concept: "Encapsulation — private fields, getters & setters",
    tagline: "Hide the data. Control access. Never let outside code break your object's state.",
    whatYouWillDo: "Debug a broken Account class where fields are public (exposing them to accidental corruption), setters are missing validation, and a getter returns the wrong field.",
    whyItMatters: "Encapsulation is the reason your banking app does not let you set your balance directly from the front end. Private fields + validated setters = controlled, safe state changes. This pattern is everywhere in Spring Boot entity design.",
  },
  hints: [
    "Private fields: declare fields as private so they cannot be accessed directly from outside the class. Use public getters (getFieldName()) and setters (setFieldName(value)) to control access.",
    "Getters return the field value. The convention is getFieldName() returning the field type. Setters accept a new value and optionally validate it before assigning.",
    "Validation in setters: check the new value before assigning it. If invalid (negative balance, null name), either ignore it, throw an exception, or assign a default.",
  ],
  reveal: {
    concept: "Encapsulation & Access Control",
    whatYouLearned: "Private fields hide data from outside classes. Getters provide read access, setters provide validated write access. This is the standard Java Bean pattern — every Spring Boot model follows it. Lombok's @Getter and @Setter annotations auto-generate these methods so you do not have to write them manually.",
    realWorldUse: "In a banking entity, the balance field is private. The only way to change it is through deposit() and withdraw() methods that check for sufficient funds and log transactions. If balance were public, any code anywhere could set it to any value — including negative.",
    developerSays: "Make everything private by default. Only expose what must be public. This is not just style — it is the only way to reason about complex systems. If any code anywhere can change any field at any time, you cannot guarantee your object's state is valid.",
  },
};

const BROKEN = `public class Main {

    static class BankAccount {
        // BUG 1: Fields should be private, not public
        public String owner;
        public double balance;

        public BankAccount(String owner, double initialBalance) {
            this.owner   = owner;
            this.balance = initialBalance;
        }

        // BUG 2: Getter returns wrong field (returns owner instead of balance)
        public double getBalance() {
            return owner;
        }

        public String getOwner() { return owner; }

        // BUG 3: Setter has no validation — allows negative balance
        public void setBalance(double balance) {
            this.balance = balance;
        }
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Alice", 1000.0);
        acc.setBalance(1500.0);
        System.out.println(acc.getOwner() + ": £" + acc.getBalance());
    }
}`;

const SOLUTION = `public class Main {

    static class BankAccount {
        private String owner;
        private double balance;

        public BankAccount(String owner, double initialBalance) {
            this.owner   = owner;
            this.balance = initialBalance;
        }

        public double getBalance() {
            return balance;
        }

        public String getOwner() { return owner; }

        public void setBalance(double balance) {
            if (balance >= 0) {
                this.balance = balance;
            }
        }
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Alice", 1000.0);
        acc.setBalance(1500.0);
        System.out.println(acc.getOwner() + ": £" + acc.getBalance());
    }
}`;

const BUGS = [
  { id: 'public-fields', description: 'Bug 1: Fields are public — should be private', check: code => /private\s+String\s+owner/.test(code) && /private\s+double\s+balance/.test(code) },
  { id: 'wrong-getter',  description: 'Bug 2: getBalance() returns owner instead of balance', check: code => /public\s+double\s+getBalance\(\)[\s\S]*?return\s+balance/.test(code) },
  { id: 'no-validation', description: 'Bug 3: setBalance() allows negative values — add validation', check: code => /if\s*\(\s*balance\s*>=\s*0\s*\)/.test(code) || /if\s*\(\s*balance\s*>\s*0\s*\)/.test(code) },
];

const simulate = code => {
  if (/private\s+double\s+balance/.test(code) && /return\s+balance/.test(code) && (/if.*balance.*>=.*0/.test(code) || /if.*balance.*>.*0/.test(code))) return 'Alice: £1500.0';
  return '[Fix all bugs to see output]';
};

export default function Level2_9() {
  const [isCorrect, setIsCorrect] = useState(false);
  return (
    <Stage2Shell levelId={9} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#38bdf8', letterSpacing:3, marginBottom:10 }}>// Debug Mission</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>Fix the BankAccount encapsulation.</h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>3 bugs: exposed fields, wrong getter, missing validation. Every bug lets outside code corrupt the account state.</p>
          </div>
          <DebugEditor brokenCode={BROKEN} bugs={BUGS} solution={SOLUTION} expectedOutput="Alice: £1500.0" simulateOutput={simulate} onAllFixed={() => setIsCorrect(true)} />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}