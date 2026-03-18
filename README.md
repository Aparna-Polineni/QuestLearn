
◈ QuestLearn
Career Transformation Learning Platform
Project README — March 2026
168 routes  ·  7 active career paths  ·  200+ levels built
React 18  +  Spring Boot 3  +  MySQL  +  JWT Auth
 
1.  What is QuestLearn?

Overview
QuestLearn is a career transformation platform that takes learners from zero experience to job-ready through structured, interactive curricula. Unlike video courses, every level requires the learner to actively write, debug, or design — there is no passive watching.

The platform currently supports 7 active career paths with 200+ built levels, a Spring Boot + MySQL backend with JWT authentication, and a React 18 frontend with real-time progress tracking.

Core Design Principles
•	Learn-by-doing — every level requires writing code, debugging, or making decisions. No passive content.
•	Three learning modes — FILL (fill blanks in working code), BUILD (write from scratch), DEBUG (find and fix bugs).
•	Anatomy-first — every concept gets a visual reference card before the exercise begins.
•	Real-world context — all examples use a consistent hospital domain (patients, wards, doctors) so skills transfer to real jobs.
•	Instant feedback — check buttons validate answers immediately with specific error messages per blank.
•	Progressive unlocking — stages unlock at 80% completion of the previous stage, avoiding hard blockers.
 
2.  Tech Stack

Layer	Technology
Frontend	React 18, React Router v6, CSS (no framework), Context API
Backend	Spring Boot 3, Spring Data JPA, Spring Security, JWT
Database	MySQL (production), H2 (tests), Flyway migrations
Auth	JWT tokens, BCrypt password hashing, AuthContext + GameContext
Progress	localStorage (instant) + MySQL backend (persistent) + backend sync on login
Build	Create React App, Maven Wrapper (mvnw)
Deployment	Docker + Docker Compose (Stage 7 curriculum built, pending deploy)
 
3.  Project Structure

Frontend — src/
src/
  App.js                          168 routes (all stages + new paths)
  context/
    AuthContext.js                JWT auth, login/logout, session restore
    GameContext.js                Progress, path-aware routing, level keys
  data/
    careerPaths.js                12 career paths (7 active, 5 coming soon)
  screens/
    CareerPathSelect.jsx          Path selection screen
    DomainSelect.jsx              Domain picker (hospital/banking/etc)
    Home.jsx                      Dashboard — started paths, resume
    Roadmap.jsx                   Dynamic stage/level progress map
    stage1/                       Design & Thinking (8 levels)
    stage2/                       Java Core (20 levels)
    stage2_5/                     JavaScript Fundamentals (20 levels)
    stage3/                       React Frontend (16 levels)
    stage4/                       Spring Boot Backend (16 levels)
    stage5/                       Database & SQL (22 levels)
    stage6/                       Full Stack Integration (14 levels)
    stage7/                       Deployment & DevOps (12 levels)
    data-engineer/stage1/         Data Engineer Stage 1 (8 levels)
    ml-ai-engineer/stage1/        ML/AI Engineer Stage 1 (8 levels)
    cyber-security/stage1/        Cyber Security Stage 1 (8 levels)
    ux-ui-designer/stage1/        UX/UI Designer Stage 1 (8 levels)
  components/
    LevelSupport.jsx              ConceptReveal, HintPanel, ConceptIntro

Backend — src/main/java/com/questlearn/
  QuestLearnApplication.java
  config/    SecurityConfig.java  (JWT filter, CORS, route rules)
  controller/ AuthController.java, ProgressController.java
  service/    UserService.java, ProgressService.java
  repository/ UserRepository.java, ProgressRepository.java
  model/      User.java, Progress.java
  security/   JwtUtil.java, JwtFilter.java
 
4.  Career Paths

Active Paths (selectable now)
Path	Scale	Level / Duration
☕ Java Full Stack Developer	139 levels · 8 stages	Beginner → Job Ready · 6–9 months
⛛️ Frontend Developer	89 levels · 6 stages	Beginner → Job Ready · 4–6 months
🔢 Math for Students	84 levels · 6 stages	Ages 13–19 · Own pace
🗂️ Data Engineer	84 levels · 7 stages	Beginner → Job Ready · 6–8 months
🤖 ML/AI Engineer	112 levels · 8 stages	Intermediate · 8–10 months
🔐 Cyber Security Analyst	84 levels · 7 stages	Beginner → Job Ready · 6–8 months
🎨 UX/UI Designer	70 levels · 7 stages	Beginner → Job Ready · 5–7 months

Coming Soon
Path	Scale	Tech Stack
📊 Data Analytics	95 levels · 7 stages	Python, SQL, Pandas, Tableau
🔮 AI & Machine Learning	128 levels · 8 stages	TensorFlow, PyTorch, MLOps
🐍 Backend Developer (Python)	102 levels · 7 stages	FastAPI, Django, PostgreSQL
🚀 DevOps & Cloud Engineer	110 levels · 8 stages	Docker, K8s, AWS, Terraform
📱 Mobile Developer	96 levels · 7 stages	React Native, Expo, Firebase
 
5.  Java Full Stack — Complete Curriculum

Stage	Levels	Topics Covered
Stage 1 — Design & Thinking	8 levels	MoSCoW, architecture canvas, wireframing, data modelling, API design, tech stack, project structure, roadmap
Stage 2 — Java Core	20 levels	Variables, OOP, collections, exceptions, generics, streams, lambdas, Optional
Stage 2.5 — JavaScript Fundamentals	20 levels	Arrow functions, destructuring, array methods, async/await, closures, DOM, modules
Stage 3 — React Fundamentals	16 levels	Components, props, hooks, routing, API integration, Context, custom hooks, auth
Stage 4 — Spring Boot Backend	16 levels	REST API, JPA, validation, exception handling, security, JWT, testing
Stage 5 — Database & SQL	22 levels	SQL, JOINs, aggregates, Hibernate, @Transactional, N+1, Flyway migrations
Stage 6 — Full Stack Integration	14 levels	CORS, Axios, auth flow, protected routes, file upload, CRUD, WebSockets
Stage 7 — Deployment & DevOps	12 levels	Docker, Compose, GitHub Actions CI/CD, AWS EC2/RDS, Spring profiles

Total: 128 levels across 8 stages. Every stage ends with a BUILD capstone combining all concepts. Stages unlock at 80% completion of the previous stage.
 
6.  New Paths — Stage 1 Built

All 4 new paths have complete Stage 1 (8 levels each)

Data Engineer Stage 1 — The Data Problem
Lvl	Mode	Content
Level 0	CONCEPTS	What is Data Engineering? ETL, pipelines, data engineer vs analyst vs scientist
Level 1	DEBUG	3 real data quality bugs: NULL crashes, duplicate transactions, timezone mismatch
Level 2	FILL	Anatomy of an ETL pipeline — Extract, Transform, Load in Python
Level 3	FILL	Schema design — fact tables, dimension tables, surrogate keys, star schema
Level 4	FILL	Batch vs streaming — Airflow, Kafka, when to use each
Level 5	FILL	Data formats — CSV, JSON, Parquet (columnar), Avro
Level 6	CONCEPTS	The modern data stack — 6 layers from source to visualisation
Level 7	BUILD	Capstone: design a complete pipeline (source, ETL, schema, quality, orchestration)

ML/AI Engineer Stage 1 — AI Problem Framing
Lvl	Mode	Content
Level 0	CONCEPTS	What is ML? ML vs rules, 3 types of learning, data is everything
Level 1	DEBUG	3 wrong ML choices: rule works better, too little data, black box in regulated context
Level 2	FILL	Types of learning — supervised/unsupervised/RL, classification vs regression, features vs label
Level 3	FILL	The 8-step ML workflow — problem definition to production monitoring
Level 4	FILL	Data quality — imbalanced classes, data leakage, imputation, normalisation
Level 5	FILL	Evaluation metrics — accuracy, precision, recall, F1, ROC-AUC, RMSE
Level 6	CONCEPTS	ML in production — serving, drift, monitoring, A/B testing, MLOps
Level 7	BUILD	Capstone: frame an ML problem with business metric, features, risks, serving strategy

Cyber Security Stage 1 — Security Mindset
Lvl	Mode	Content
Level 0	CONCEPTS	Security mindset, CIA triad, threat modelling, attack surfaces, defence in depth
Level 1	FILL	CIA Triad in practice — threats, controls, encryption, hashing, DDoS, MFA
Level 2	FILL	Threat modelling — STRIDE framework, risk = likelihood × impact, DREAD scoring
Level 3	FILL	Attack surfaces — network ports, nmap, social engineering, supply chain, patching
Level 4	DEBUG	3 real vulnerabilities: SQL injection, hardcoded credentials, missing rate limiting
Level 5	FILL	Defence in depth — perimeter, segmentation, EDR, backups, SIEM, zero trust
Level 6	CONCEPTS	Security careers — SOC analyst, pen tester, AppSec, cloud security, IR, GRC
Level 7	BUILD	Capstone: complete threat model for hospital portal (assets, actors, STRIDE, mitigations)

UX/UI Designer Stage 1 — Design Thinking
Lvl	Mode	Content
Level 0	CONCEPTS	Design Thinking — 5 stages, human-centred design, UX vs UI, prototype early
Level 1	FILL	Empathy — empathy map, user interviews, observation, personas, Jobs to Be Done
Level 2	FILL	Define — POV statement, HMW questions, root cause, scope, success metrics
Level 3	BUILD	Ideate — brainstorming rules, Crazy 8s, SCAMPER, worst idea technique
Level 4	FILL	Prototype — fidelity spectrum, paper sketch, wireframe, interactive prototype, affordances
Level 5	FILL	Test — usability testing, think-aloud, facilitator rules, affinity mapping, SUS score
Level 6	CONCEPTS	UX vs UI vs IA vs Interaction Design, accessibility (WCAG), designer tool stack
Level 7	BUILD	Capstone: full design challenge (empathy + POV + HMW + ideation + prototype + test tasks)
 
7.  Key Components

Shared Interactive Editors
Component	Purpose
FillEditor.jsx	Fill-in-the-blank Java/JSX editor. Syntax highlighting, per-blank correct/incorrect state, hint placeholders, case-insensitive matching. Used by Stages 2, 3, 4, 5 (JPA levels).
JsEditor.jsx	Browser-based JavaScript runner using eval(). lockedCode prop for read-only starter code, console.log capture, error display. Used by Stage 2.5.
DebugEditor.jsx	Read-only code display with writable answer area. Locked lines in grey, editable slots highlighted. Used by debug levels in Stages 2 and 3.
Stage Shells	Each stage has a Shell (Stage2Shell, Stage5Shell etc.) — breadcrumb nav, mode badge (FILL/BUILD/DEBUG/CONCEPTS), canProceed gate, ConceptReveal footer.
ConceptReveal	Celebration panel after level completion. Shows "what you learned", "why it matters", "real-world use". Animated appearance.
LevelSupport	Three-layer support: ConceptIntro modal (before level), HintPanel (progressive hints), ConceptReveal (after completion).

State Management
File	Responsibility
GameContext.js	Central progress store. Path-aware routing (legacy /stage/ vs new /path/{id}/stage/), prefixed level keys per path (de-1-0, ml-1-0), 80% unlock threshold, getResumeRoute(), isStageUnlocked().
AuthContext.js	JWT auth lifecycle. login(), logout(), session restore on startup (/api/auth/me), token in localStorage, 401 interceptor redirect.
Roadmap.jsx	Dynamic stage map. buildStageRoutes() generates correct URLs per active path. levelKey() generates path-aware progress keys. Stage25Banner for legacy user migration.
careerPaths.js	12 career paths with stages, level counts, colours, descriptions. Resolved live from this file on startup (prevents stale localStorage cache).
 
8.  Backend API

Endpoint	Description
POST /api/auth/register	Create account. Body: { name, email, password }. Returns: { token, user }.
POST /api/auth/login	Login. Body: { email, password }. Returns: { token, user }.
GET /api/auth/me	Verify token, return current user. Requires: Authorization: Bearer <token>.
GET /api/progress	Get all completed levels for authenticated user.
POST /api/progress	Mark level complete. Body: { levelKey, pathId, stageId, levelId }.

URL Patterns
Pattern	Format
Legacy paths (java-fullstack etc.)	/stage/{stageId}/level/{levelIndex}
New paths (data-engineer etc.)	/path/{pathId}/stage/{stageId}/level/{levelIndex}
Level key — legacy	{stageId}-{levelIndex}  e.g. "2.5-7", "3-14"
Level key — new paths	{prefix}-{stageId}-{levelIndex}  e.g. "de-1-0", "ml-1-7"
 
9.  Local Development Setup

Prerequisites
•	Node.js 18+, npm
•	Java 17 (Temurin/OpenJDK)
•	MySQL 8.0 running on localhost:3306
•	Maven (or use ./mvnw wrapper)

Frontend
cd questlearn/frontend
npm install
npm start                    # http://localhost:3000

Backend
cd questlearn/backend
# Create the database first:
mysql -u root -p -e "CREATE DATABASE questlearn;"
./mvnw spring-boot:run       # http://localhost:8080

Environment (application.properties)
spring.datasource.url=jdbc:mysql://localhost:3306/questlearn
spring.datasource.username=YOUR_USER
spring.datasource.password=YOUR_PASSWORD
app.jwt.secret=YOUR_JWT_SECRET_32_CHARS_MIN
spring.jpa.hibernate.ddl-auto=update   # dev only

Run with Docker Compose (full stack)
# Requires Docker Desktop
docker compose up --build
# React: http://localhost:80
# API:   http://localhost:8080
 
10.  Build Status

Completed
•	Java Full Stack path — all 7 stages fully built (128 levels)
•	Stage 2.5 JavaScript Fundamentals — 20 levels, browser-based JS runner
•	Stage 5 Database & SQL — 22 levels covering SQL + Hibernate + Flyway
•	Stage 6 Full Stack Integration — 14 levels: CORS, Axios, auth, WebSockets
•	Stage 7 Deployment & DevOps — 12 levels: Docker, GitHub Actions, AWS
•	4 new paths Stage 1 — 8 levels each: Data Engineer, ML/AI, Cyber Security, UX/UI
•	Spring Boot backend — JWT auth, progress API, CORS, MySQL
•	Dynamic routing — path-aware URLs and level keys for all 12 paths
•	Roadmap — dynamic stage map adapts to any active career path
•	Custom favicon and branding (QuestLearn ◈ diamond icon)

In Progress / Pending
•	New paths Stage 2+ — Data Engineer, ML/AI, Cyber Security, UX/UI need stages 2–7
•	Set B paths — Data Analytics, AI & ML, Python Backend, DevOps/Cloud (coming-soon)
•	Stage 3 levels 3.9 and 3.13 — still using old DebugEditor, needs FillEditor conversion
•	Production deployment — Docker Compose config built, needs cloud hosting (AWS EC2 + RDS)
•	Frontend-only paths — Frontend Developer and Math for Students need stage content beyond Stage 1


QuestLearn · Built with React 18 + Spring Boot 3 · March 2026
