// src/screens/stage2/Level2_19.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';

const SUPPORT = {
  intro: {
    concept: "File I/O — Reading and Writing Files",
    tagline: "Files persist data beyond program execution. Read patient records in. Write reports out.",
    whatYouWillDo: "Write a program using BufferedReader and PrintWriter to simulate reading patient data lines and writing a formatted report. Since the browser has no real filesystem, we simulate it with string data.",
    whyItMatters: "File I/O is the bridge between running programs and persistent storage. Log files, CSV exports, configuration files, batch processing — all use file I/O. In Spring Boot, reading application.properties and writing log files uses these exact mechanisms.",
  },
  hints: [
    "Reading: BufferedReader reader = new BufferedReader(new FileReader(\"file.txt\")); String line = reader.readLine(); — returns null at end of file. Always close in finally or use try-with-resources.",
    "Writing: PrintWriter writer = new PrintWriter(new FileWriter(\"output.txt\")); writer.println(\"line\"); — works like System.out.println but to a file. Flush and close when done.",
    "try-with-resources: try (BufferedReader r = new BufferedReader(new FileReader(\"f\"))) { ... } — automatically closes the resource when the block ends, even if an exception occurs. This is the modern Java way.",
  ],
  reveal: {
    concept: "File I/O, Streams & try-with-resources",
    whatYouLearned: "Java's java.io package handles file operations. BufferedReader for efficient line-by-line reading. PrintWriter for writing text. try-with-resources (try with declaration in parentheses) auto-closes resources — preventing resource leaks. All file operations can throw IOException — must be caught or declared.",
    realWorldUse: "Spring Boot's logging uses file I/O via Logback — every INFO, WARN, ERROR line goes through a BufferedWriter to the log file. CSV import/export in Spring Batch reads files line by line using BufferedReader. Configuration loading reads application.properties using file streams. The pattern is identical to what you learned here.",
    developerSays: "Always use try-with-resources for anything that implements Closeable — files, database connections, HTTP clients. Forgetting to close a file descriptor is a resource leak. In a server handling thousands of requests, resource leaks accumulate until the JVM crashes with 'Too many open files'. The compiler will not warn you — it is your responsibility.",
  },
};

// Simulated file I/O — in browser we cannot write real files
// Students learn the pattern; the simulation shows correct output
const INITIAL = `// NOTE: Real file I/O cannot run in a browser environment.
// This simulation shows the pattern using String data.
// In a real Java project, replace SimulatedFile with actual FileReader/FileWriter.

public class Main {

    // Simulates reading lines from a file
    static String[] simulateFileRead() {
        return new String[]{
            "P001,Alice Smith,Cardiology,Active",
            "P002,Bob Jones,Oncology,Discharged",
            "P003,Carol White,Neurology,Active"
        };
    }

    public static void main(String[] args) {

        System.out.println("=== Patient Report ===");

        // TASK: Loop through simulateFileRead()
        // Split each line by ","
        // Print only ACTIVE patients in format:
        // "[ID] [Name] - [Ward]"
        // Then print total count: "Total active: X"

        String[] lines = simulateFileRead();
        int activeCount = 0;

        for (String line : lines) {
            String[] parts = line.split(",");
            String id     = parts[0];
            String name   = parts[1];
            String ward   = parts[2];
            String status = parts[3];

            if (status.equals("Active")) {
                System.out.println(id + " " + name + " - " + ward);
                activeCount++;
            }
        }

        System.out.println("Total active: " + activeCount);
    }
}`;

const EXPECTED = `=== Patient Report ===\nP001 Alice Smith - Cardiology\nP003 Carol White - Neurology\nTotal active: 2`;

export default function Level2_19() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);

  return (
    <Stage2Shell levelId={19} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#38bdf8', letterSpacing:3, marginBottom:10 }}>// Build Mission</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>
              Process a patient records file for <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'your system'}</span>.
            </h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>
              The file reading is simulated (browsers cannot access real files). Read, parse, filter and report. The pattern is identical to real File I/O — just swap the data source.
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