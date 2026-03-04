// src/screens/stage2/Level2_18.jsx — String Manipulation
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';
import './Level2_18.css';

const SUPPORT = {
  intro: {
    concept: "String Manipulation",
    tagline: "Strings are immutable. Every method returns a NEW string — the original never changes.",
    whatYouWillDo: "Write the TODO sections — clean a patient name using trim(), split a CSV medication string, and check/transform a patient code string.",
    whyItMatters: "APIs send raw strings — names with spaces, CSV data to split, codes to format. Every backend developer processes string data constantly. Understanding immutability prevents bugs where you call trim() but forget to assign the result.",
  },
  hints: [
    "Strings are IMMUTABLE — methods return new strings, they do not change the original. Always assign: String cleaned = raw.trim(); Just calling raw.trim() alone does NOTHING — the result is thrown away.",
    "split(\",\") returns a String array. String[] parts = csv.split(\",\"); Then loop: for (String part : parts) { ... }. parts.length gives the count.",
    "contains(\"text\") returns boolean. replace(\"old\", \"new\") returns a new String with replacements. Chain methods: code.replace(\"pat-\", \"PATIENT-\").toUpperCase() — each call returns a new String.",
  ],
  reveal: {
    concept: "String Immutability & Key Methods",
    whatYouLearned: "Strings are immutable — every transformation returns a new String. Key methods: trim(), split(), toUpperCase(), toLowerCase(), contains(), replace(), substring(), length(), equals(). Always assign the result. For building strings in a loop use StringBuilder — concatenating with + in a loop is O(n²).",
    realWorldUse: "In Spring Boot you constantly process String inputs — trimming user form fields, splitting comma-separated tags, formatting output. @RequestParam String name comes in as raw text. Your service layer cleans and validates it using these exact String methods.",
    developerSays: "Production bug I have seen: someone calls name.trim() in a service method and wonders why the database still has trailing spaces. Always assign: name = name.trim(). If you build strings in a loop, use StringBuilder — string concatenation in a loop is O(n²) due to immutability.",
  },
};

const INITIAL_CODE = `public class Main {
    public static void main(String[] args) {

        // ── TASK 1: Clean a patient name ─────────────────────────────
        // rawName has leading and trailing spaces
        // Step 1: trim() the whitespace
        // Step 2: make it title case — first letter upper, rest lower
        // Expected: "Name: Alice smith"
        String rawName = "  alice smith  ";

        // TODO: trim rawName, then use substring(0,1).toUpperCase() + substring(1).toLowerCase()
        // Print: "Name: " + your result

        // ── TASK 2: Split a CSV string ───────────────────────────────
        // Split by "," to get individual medication names
        // Print: "Medications: " + count
        // Then print each one on its own line
        String medications = "Aspirin,Metformin,Lisinopril";

        // TODO: split by "," into String[], print count, then for-each print each drug

        // ── TASK 3: Check and transform a code string ────────────────
        // Check if code contains "00042" and print the boolean
        // Replace "pat-" with "PATIENT-" then toUpperCase and print
        String code = "pat-00042";

        // TODO: print code.contains("00042"), then print code.replace(...).toUpperCase()

    }
}`;

const EXPECTED = `Name: Alice smith\nMedications: 3\nAspirin\nMetformin\nLisinopril\nContains 00042: true\nPATIENT-00042`;

export default function Level2_18() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={18} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="l218-container">
          <div className="l218-brief">
            <div className="l218-brief-tag">// Build Mission</div>
            <h2>Process string data for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Three tasks. The variables are declared and locked. Write only in the <code style={{color:'#38bdf8'}}>// TODO</code> lines.</p>
            <div className="l218-expected-box">
              <div className="l218-expected-label">Expected output</div>
              <pre className="l218-expected-output">{EXPECTED}</pre>
            </div>
          </div>
          <CodeEditor
            initialCode={INITIAL_CODE}
            expectedOutput={EXPECTED}
            onOutputChange={(_, correct) => setOk(correct)}
            hints={SUPPORT.hints}
            height={380}
            writableMarker="// TODO"
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}