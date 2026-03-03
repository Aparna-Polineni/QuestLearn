// src/screens/stage2/Level2_20.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';

const SUPPORT = {
  intro: {
    concept: "Java 8 Lambdas & Streams",
    tagline: "Lambdas turn multi-line anonymous classes into one-liners. Streams process collections declaratively.",
    whatYouWillDo: "Use lambdas with ArrayList's forEach and sort, then chain stream operations (filter, map, collect) to process a patient list in a way that would have taken 20 lines before Java 8.",
    whyItMatters: "Modern Spring Boot code is full of lambdas and streams. Every .map(), .filter(), .collect() in your service layer is a lambda. If you cannot read them, you cannot read Spring Boot code. This is the gateway to functional-style Java.",
  },
  hints: [
    "Lambda syntax: (parameter) -> expression or (parameter) -> { statements; }. Example: (String s) -> s.toUpperCase() or just s -> s.toUpperCase() when type is inferred.",
    "Stream pipeline: list.stream().filter(x -> x > 5).map(x -> x * 2).collect(Collectors.toList()). filter keeps elements matching the predicate. map transforms each element. collect gathers results into a list.",
    "List.sort with lambda: patients.sort((a, b) -> a.compareTo(b)) or use Comparator.comparing(). forEach: list.forEach(item -> System.out.println(item)) or method reference: list.forEach(System.out::println).",
  ],
  reveal: {
    concept: "Lambdas, Streams & Functional Java",
    whatYouLearned: "Lambdas are anonymous functions: (params) -> body. Stream API chains operations: filter (keep matching), map (transform), sorted, distinct, limit, collect. Functional interfaces (Predicate, Function, Consumer, Supplier) are the types that accept lambdas. Java 8 streams are lazy — no computation until terminal operation (collect, forEach, count).",
    realWorldUse: "In Spring Boot services: List<PatientDto> dtos = patients.stream().filter(p -> p.isActive()).map(p -> toDto(p)).collect(Collectors.toList()). That is the exact pattern for converting database entities to API response objects. Before Java 8, this was a for loop with a manual list. Streams make it readable and composable.",
    developerSays: "When I review code, streams and lambdas are how I distinguish Java 7 developers from Java 8+ developers. If I see a for loop building a new list with an if inside, I rewrite it as a stream. Not because it is shorter — because the intent is clearer. filter+map+collect reads like English: filter active patients, map to DTO, collect into list.",
  },
};

const INITIAL = `import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {

        List<String> patients = new ArrayList<>();
        patients.add("Charlie");
        patients.add("Alice");
        patients.add("Bob");
        patients.add("Diana");
        patients.add("Alice"); // duplicate

        // TASK 1: Print all patients using forEach + lambda
        System.out.println("All patients:");
        patients.forEach(name -> System.out.println("  " + name));

        // TASK 2: Sort alphabetically and print first 3 using stream
        System.out.println("First 3 alphabetically:");
        patients.stream()
                .sorted()
                .distinct()
                .limit(3)
                .forEach(name -> System.out.println("  " + name));

        // TASK 3: Filter names longer than 4 chars, uppercase, collect to list
        List<String> longNames = patients.stream()
                .distinct()
                .filter(name -> name.length() > 4)
                .map(String::toUpperCase)
                .collect(Collectors.toList());
        System.out.println("Long names: " + longNames);
    }
}`;

const EXPECTED = `All patients:\n  Charlie\n  Alice\n  Bob\n  Diana\n  Alice\nFirst 3 alphabetically:\n  Alice\n  Bob\n  Charlie\nLong names: [CHARLIE, DIANA]`;

export default function Level2_20() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);

  return (
    <Stage2Shell levelId={20} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          {/* Stage boss header */}
          <div style={{ background:'linear-gradient(135deg,rgba(249,115,22,0.08),rgba(56,189,248,0.05))', border:'1px solid rgba(249,115,22,0.25)', borderRadius:16, padding:28, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🏆</div>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#f97316', letterSpacing:4, marginBottom:8 }}>STAGE 2 FINAL LEVEL</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>Java 8 Lambdas & Streams</h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6, maxWidth:480, margin:'0 auto' }}>
              The code is written — run it, understand each stream operation, then verify the output. Completing this level means you have covered all 20 Java Core fundamentals.
            </p>
          </div>

          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#38bdf8', letterSpacing:3, marginBottom:10 }}>// Build Mission</div>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>
              Read each stream chain. Trace through what filter(), sorted(), distinct(), limit(), map() and forEach() do to the patient list. Run it and verify the output matches exactly.
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