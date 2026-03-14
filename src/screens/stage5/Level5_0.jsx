// src/screens/stage5/Level5_0.jsx — Database Concepts (CONCEPTS)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_0.css';

const SUPPORT = {
  reveal: {
    concept: 'Relational Databases',
    whatYouLearned: 'Data lives in tables (rows + columns). SQL is the language to talk to them. MySQL is the engine Spring Boot uses by default. Every @Entity in your Java code becomes a table here.',
    realWorldUse: 'Every major app — Instagram, Spotify, banking — stores its core data in a relational database. Spring Boot + MySQL is one of the most common production stacks in the world.',
    developerSays: 'Learn SQL properly. Even with JPA hiding it, you will debug slow queries, read execution plans, and write raw SQL in production at some point. This stage makes that moment painless.',
  },
};

const CONCEPTS = [
  { id:'db',    icon:'🗄️', title:'What is a Database?',       body:'A structured place to store, retrieve, and update data. Unlike a file or spreadsheet, a database enforces rules, handles concurrent users, and can store millions of rows efficiently.' },
  { id:'rdb',   icon:'📋', title:'Relational = Tables',        body:'Data is stored in tables — rows and columns, like a spreadsheet. Each table represents one thing (patients, doctors, wards). Tables link to each other via keys.' },
  { id:'sql',   icon:'💬', title:'SQL — the language',         body:'Structured Query Language. Four core commands: SELECT (read), INSERT (add), UPDATE (change), DELETE (remove). Everything in this stage is SQL.' },
  { id:'mysql', icon:'🐬', title:'MySQL — the engine',         body:'MySQL is the database server Spring Boot connects to. It stores data on disk, handles queries, and enforces constraints. Your application never writes files — it talks to MySQL.' },
  { id:'jpa',   icon:'🔗', title:'How JPA fits in',            body:'JPA (Java Persistence API) is a Java layer that sits on top of SQL. When you write @Entity in Stage 4, JPA translates your Java objects into SQL tables — automatically. This stage shows you what it generates.' },
  { id:'nosql', icon:'📦', title:'SQL vs NoSQL',               body:'NoSQL databases (MongoDB, Redis) store documents or key-value pairs instead of tables. Good for unstructured or rapidly changing data. Relational SQL is better when your data has clear relationships — like a hospital system.' },
];

const LAYER_DIAGRAM = [
  { label: 'Your Java Code',      color: '#818cf8', note: '@Entity, @Repository, Service' },
  { label: 'JPA / Hibernate',     color: '#60a5fa', note: 'Translates Java → SQL automatically' },
  { label: 'JDBC Driver',         color: '#34d399', note: 'Sends SQL over the network' },
  { label: 'MySQL Server',        color: '#f59e0b', note: 'Executes SQL, stores data on disk' },
];

export default function Level5_0() {
  const [seen, setSeen] = useState(new Set());
  const allSeen = CONCEPTS.every(c => seen.has(c.id));

  return (
    <Stage5Shell levelId={0} canProceed={allSeen} conceptReveal={SUPPORT.reveal}>
      <div className="l50-container">

        <div className="l50-brief">
          <div className="l50-brief-tag">🐘 Stage 5 · Level 5.0 · Concepts</div>
          <h2>Databases: Where Your Data Actually Lives</h2>
          <p>Stage 4 gave you Spring Boot — the server. Stage 5 gives you MySQL — the database. Every <code>save()</code>, <code>findAll()</code>, and <code>@Entity</code> you wrote in Stage 4 is backed by SQL running here. Click each card to explore the foundations.</p>
        </div>

        <div className="l50-grid">
          {CONCEPTS.map(c => (
            <button
              key={c.id}
              className={`l50-card ${seen.has(c.id) ? 'l50-card--seen' : ''}`}
              onClick={() => setSeen(prev => new Set([...prev, c.id]))}
            >
              <span className="l50-card-icon">{c.icon}</span>
              <div className="l50-card-title">{c.title}</div>
              <div className="l50-card-body">{c.body}</div>
              {seen.has(c.id) && <div className="l50-card-check">✓</div>}
            </button>
          ))}
        </div>

        <div className="l50-diagram-section">
          <div className="l50-diagram-label">How Your Java App Talks to MySQL</div>
          <div className="l50-diagram">
            {LAYER_DIAGRAM.map((layer, i) => (
              <div key={i} className="l50-layer" style={{ borderLeftColor: layer.color }}>
                <span className="l50-layer-name" style={{ color: layer.color }}>{layer.label}</span>
                <span className="l50-layer-note">{layer.note}</span>
                {i < LAYER_DIAGRAM.length - 1 && <div className="l50-layer-arrow">↓</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="l50-info">
          <strong>Your goal this stage:</strong> understand the SQL that JPA is generating for you — then write it yourself. By level 5.21 you'll design a full hospital database schema from scratch.
        </div>

        {!allSeen && (
          <p className="l50-prompt">Read all {CONCEPTS.length} cards to continue →</p>
        )}
      </div>
    </Stage5Shell>
  );
}
