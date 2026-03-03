// src/screens/stage2/Level2_18.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';

const SUPPORT = {
  intro: {
    concept: "String Manipulation",
    tagline: "Strings are immutable in Java. Every method returns a NEW string — the original never changes.",
    whatYouWillDo: "Process patient name and medication data using the key String methods: trim, split, toUpperCase, contains, replace, substring, and String.format.",
    whyItMatters: "APIs send you raw strings — names with extra spaces, CSV data to split, codes to format. Every backend developer spends real time processing string data. Understanding immutability prevents a whole class of bugs where you call trim() but forget to assign the result.",
  },
  hints: [
    "Key String methods: s.trim() removes leading/trailing whitespace. s.toUpperCase() / toLowerCase(). s.split(\",\") splits into array. s.contains(\"text\") returns boolean. s.replace(\"old\",\"new\"). s.length(). s.substring(start, end).",
    "Strings are immutable — methods return NEW strings, they do not modify the original. String result = s.trim(); — you must assign the result. Just calling s.trim() alone does nothing.",
    "String comparison: always use .equals() not ==. == compares object references. .equals() compares content. \"hello\".equals(input) is safer than input.equals(\"hello\") — avoids NullPointerException if input is null.",
  ],
  reveal: {
    concept: "String Immutability & Key Methods",
    whatYouLearned: "Strings are immutable — every transformation returns a new String. Common methods: trim(), split(), toUpperCase(), toLowerCase(), contains(), replace(), substring(), length(), equals(), startsWith(), endsWith(). For building strings in a loop use StringBuilder — it is mutable and much faster than concatenating with +.",
    realWorldUse: "In Spring Boot request handling, you constantly process String inputs — trimming user-submitted form fields, splitting comma-separated tags, formatting output for display. Spring's @RequestParam String name comes in as raw text. Your service layer cleans and validates it. String methods are the tools for that job.",
    developerSays: "I have seen production bugs caused by forgetting String immutability. Someone calls name.trim() in a service method and wonders why the database still has trailing spaces. Always assign: name = name.trim(). If you do a lot of string building in a loop, use StringBuilder — string concatenation in a loop is O(n²) due to immutability.",
  },
};

const INITIAL = `public class Main {
    public static void main(String[] args) {

        // TASK 1: Clean and format a messy patient name
        String rawName = "  alice smith  ";
        // trim whitespace, then capitalise: "Alice Smith"
        // Hint: trim() then manually capitalise or use substring
        String cleaned = rawName.trim();
        // Convert to title case: first letter upper, rest lower
        String titleCase = cleaned.substring(0, 1).toUpperCase()
                         + cleaned.substring(1).toLowerCase();
        System.out.println("Name: " + titleCase);

        // TASK 2: Split a CSV medication string into individual drugs
        String medications = "Aspirin,Metformin,Lisinopril";
        // Split by "," and print count, then each medication
        String[] drugs = medications.split(",");
        System.out.println("Medications: " + drugs.length);
        for (String drug : drugs) {
            System.out.println("  - " + drug);
        }

        // TASK 3: Check and format a patient code
        String code = "pat-00042";
        // Print whether it contains "00042"
        System.out.println("Contains 00042: " + code.contains("00042"));
        // Replace "pat-" with "PATIENT-" and print
        System.out.println(code.replace("pat-", "PATIENT-").toUpperCase());
    }
}`;

const EXPECTED = `Name: Alice smith\nMedications: 3\n  - Aspirin\n  - Metformin\n  - Lisinopril\nContains 00042: true\nPATIENT-00042`;

export default function Level2_18() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);

  return (
    <Stage2Shell levelId={18} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#38bdf8', letterSpacing:3, marginBottom:10 }}>// Build Mission</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>
              Process patient string data for <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'your system'}</span>.
            </h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>
              The code is mostly written — read it, understand what each method does, then run it. The output is pre-determined. Study the output to understand each String method's effect.
            </p>
            <div style={{ background:'#080a0f', border:'1px solid #1e293b', borderRadius:10, padding:14, marginTop:12, fontFamily:'DM Mono,monospace', fontSize:12 }}>
              <div style={{ color:'#475569', marginBottom:6, letterSpacing:1 }}>EXPECTED OUTPUT:</div>
              {EXPECTED.split('\\n').map((line, i) => <div key={i} style={{ color:'#4ade80' }}>{line}</div>)}
            </div>
          </div>
          <CodeEditor
            initialCode={INITIAL}
            expectedOutput={EXPECTED}
            onOutputChange={(_, correct) => setOk(correct)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}