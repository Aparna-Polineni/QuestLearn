// src/screens/stage2/Level2_9.jsx
// Rebuilt: annotated bug comments explain WHAT is wrong and WHY
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_9.css';

const SUPPORT = {
  intro: {
    concept: "Encapsulation — private fields, getters & setters",
    tagline: "Hide the data. Control access. Never let outside code corrupt your object's state.",
    whatYouWillDo: "Fix 3 bugs in a BankAccount class — public fields that should be private, a getter returning the wrong field, and a setter with no validation.",
    whyItMatters: "Encapsulation is why a banking app does not let you set your balance directly. Private fields plus validated setters means every state change goes through controlled logic.",
  },
  hints: [
    "Private fields: declare fields as 'private' so they cannot be read or changed directly from outside the class. Use public getters (getBalance()) and setters (setBalance(v)) to control access.",
    "A getter returns the field value. The convention is getFieldName() returning the field type. Check: does getBalance() actually return balance, or is it returning the wrong field?",
    "Validation in setters: check the new value before assigning it. A balance should never go negative. If the new value is invalid, ignore it or throw an exception."
  ],
  reveal: {
    concept: "Encapsulation — private fields, getters & setters",
    whatYouLearned: "Private fields hide data. Getters provide read access, setters provide validated write access. This is the Java Bean pattern — every Spring Boot model uses it. Lombok's @Getter and @Setter annotations generate these methods automatically so you do not have to write them by hand.",
    realWorldUse: "In a banking entity, balance is private. The only way to change it is through deposit() and withdraw() methods that check funds and log transactions. If balance were public, any code could set it to any value — including negative. That is the risk encapsulation prevents.",
    developerSays: "Make everything private by default. Only expose what must be public. If any code anywhere can change any field at any time, you cannot guarantee your object's state is valid. That makes debugging impossible in large systems.",
  },
};

const BROKEN_CODE = `public class Main {

    static class BankAccount {

        // BUG 1: Fields must be private — change the access modifier on both
        ___PRIVATE___ String owner;
        ___PRIVATE2___ double balance;

        public BankAccount(String owner, double initialBalance) {
            this.owner   = owner;
            this.balance = initialBalance;
        }

        // BUG 2: getBalance() is returning the wrong field — fix the return value
        public double getBalance() {
            return ___BALANCE___;
        }

        public String getOwner() { return owner; }

        // BUG 3: Add a validation check — only assign if the new balance is >= 0
        public void setBalance(double balance) {
            if (balance ___GTE___ 0) {
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
  { id: 'PRIVATE',  answer: 'private', placeholder: 'modifier', hint: "Access modifier that hides the field from outside the class." },
  { id: 'PRIVATE2', answer: 'private', placeholder: 'modifier', hint: "Same modifier — both fields should be private." },
  { id: 'BALANCE',  answer: 'balance', placeholder: 'field',    hint: "This getter should return the balance field, not the owner field." },
  { id: 'GTE',      answer: '>=',      placeholder: 'operator', hint: "Greater-than-or-equal operator. Only allow non-negative balances." },
];

export default function Level2_9() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={9} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l29-container">
          <div className="l29-brief">
            <div className="l29-brief-tag">// Debug Mission</div>
            <h2>Fix the broken code for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Each bug is marked with a comment explaining what is wrong and why. Read the comment above each bug, understand it, then fix the line.</p>
          </div>
          {/* Anatomy reference */}
          <div className="l29-anatomy">
            <div className="l29-anatomy-title">// Encapsulation Pattern</div>
            <div className="l29-anatomy-grid">
              <div className="l29-anat-row">
                <span className="l29-anat-keyword">private</span>
                <span className="l29-anat-type">double</span>
                <span className="l29-anat-name">balance</span><span className="l29-anat-plain">;</span>
                <span className="l29-anat-desc">← private hides the field</span>
              </div>
              <div className="l29-anat-row">
                <span className="l29-anat-keyword">public</span>
                <span className="l29-anat-type">double</span>
                <span className="l29-anat-name">getBalance</span>
                <span className="l29-anat-plain">() {'{'} </span>
                <span className="l29-anat-keyword">return</span>
                <span className="l29-anat-name"> balance</span>
                <span className="l29-anat-plain">; {'}'}</span>
                <span className="l29-anat-desc">← getter returns the correct field</span>
              </div>
              <div className="l29-anat-row">
                <span className="l29-anat-keyword">if</span>
                <span className="l29-anat-plain">(balance</span>
                <span className="l29-anat-name"> &gt;= </span>
                <span className="l29-anat-plain">0) {'{ this.balance = balance; }'}</span>
                <span className="l29-anat-desc">← setter validates before assigning</span>
              </div>
            </div>
          </div>

          <FillEditor
            template={BROKEN_CODE}
            blanks={BUGS}
            onAllCorrect={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}