// src/screens/stage4/Level4_0.jsx — Backend Concepts
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import { ConceptIntro } from '../../components/LevelSupport';
import './Level4_0.css';

const CONCEPTS = [
  {
    id: 'why',
    icon: '🌐',
    title: 'What is a Backend?',
    body: 'The frontend (Stage 3) is what users see. The backend is everything they cannot see: the code that runs on a server, stores data in a database, enforces rules, and sends responses. When you click "Admit Patient", a REST API on the backend receives that request, validates it, saves it to a database, and sends back a result.',
    analogy: 'The frontend is the restaurant menu. The backend is the kitchen — hidden, but where everything actually happens.',
  },
  {
    id: 'spring',
    icon: '🍃',
    title: 'Why Spring Boot?',
    body: 'Spring Boot is the most widely-used Java backend framework. It handles web requests, connects to databases, manages security, and runs as a standalone server. Companies like Netflix, Amazon, and Revolut use Spring Boot. It is the default choice for Java full-stack development.',
    analogy: 'Spring Boot is like a fully-equipped kitchen. You bring the recipes (your code). It provides the stoves, ovens, and storage.',
  },
  {
    id: 'rest',
    icon: '🔗',
    title: 'REST APIs',
    body: 'A REST API is a set of URLs (endpoints) your server exposes. Each URL handles a specific action. GET /api/patients returns all patients. POST /api/patients creates one. PUT /api/patients/1 updates patient 1. DELETE /api/patients/1 removes it. These four operations — Create, Read, Update, Delete — are called CRUD.',
    analogy: 'A REST API is a menu of actions your server can perform. Each endpoint is one dish.',
  },
  {
    id: 'layers',
    icon: '🏗️',
    title: 'The Three Layers',
    body: 'Spring Boot apps are split into three layers. The Controller (@RestController) receives HTTP requests and returns responses. The Service (@Service) contains business logic — validation, calculations, rules. The Repository (@Repository) talks to the database. This separation makes code easier to test and change.',
    analogy: 'Controller = waiter (takes the order). Service = chef (decides what to cook). Repository = storage room (fetches ingredients).',
  },
  {
    id: 'json',
    icon: '📦',
    title: 'JSON — How Data Travels',
    body: 'Data travels between frontend and backend as JSON. When your React app fetches patients, Spring Boot automatically converts Java objects to JSON. When your form submits a new patient, Spring Boot converts the incoming JSON back to a Java object. This conversion is handled by Jackson — no extra code needed.',
    analogy: 'JSON is the universal language frontend and backend both speak. Spring Boot is the translator.',
  },
  {
    id: 'annotations',
    icon: '🏷️',
    title: 'Annotations — Spring\'s Magic',
    body: 'Spring Boot uses annotations to configure everything. @RestController marks a class as a web controller. @GetMapping("/patients") maps a method to a GET request. @Entity marks a class as a database table. @Autowired injects dependencies automatically. You write the logic — Spring Boot wires everything together.',
    analogy: 'Annotations are sticky notes you put on your code. Spring Boot reads them and sets everything up for you.',
  },
];

export default function Level4_0() {
  const { selectedDomain } = useGame();
  const [seen, setSeen] = useState(new Set());
  const allSeen = seen.size === CONCEPTS.length;

  return (
    <Stage4Shell levelId={0} canProceed={allSeen} conceptReveal={null}>
      <div className="l40-container">
        <div className="l40-brief">
          <div className="l40-brief-tag">// Stage 4 — Spring Boot Backend</div>
          <h2>Before you write a single line of Spring Boot, understand <span style={{ color: selectedDomain?.color || '#f97316' }}>what it does and why</span>.</h2>
          <p>Stage 3 built what users see. Stage 4 builds everything behind it — the server that stores data, enforces rules, and powers the frontend. Read all 6 concepts to unlock Level 4.1.</p>
        </div>

        <div className="l40-concepts-grid">
          {CONCEPTS.map(c => (
            <div
              key={c.id}
              className={`l40-concept-card ${seen.has(c.id) ? 'l40-seen' : ''}`}
              onClick={() => setSeen(prev => new Set([...prev, c.id]))}
            >
              <div className="l40-concept-top">
                <span className="l40-concept-icon">{c.icon}</span>
                <span className="l40-concept-title">{c.title}</span>
                {seen.has(c.id) && <span className="l40-concept-check">✓</span>}
              </div>
              <p className="l40-concept-body">{c.body}</p>
              <div className="l40-concept-analogy">
                <span className="l40-analogy-label">Analogy</span>
                <span>{c.analogy}</span>
              </div>
            </div>
          ))}
        </div>

        {!allSeen && (
          <div className="l40-progress">
            <div className="l40-progress-bar">
              <div className="l40-progress-fill" style={{ width: `${(seen.size / CONCEPTS.length) * 100}%`, background: selectedDomain?.color || '#f97316' }} />
            </div>
            <span className="l40-progress-text">{seen.size}/{CONCEPTS.length} concepts read</span>
          </div>
        )}
      </div>
    </Stage4Shell>
  );
}