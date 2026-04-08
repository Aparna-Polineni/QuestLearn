// src/screens/cyber-security/stage1/CY1_Level4.jsx — Common Attack Types (DEBUG)
import { useState } from 'react';
import CY1Shell from './CY1Shell';

const BUGS = [
  {
    id:1, label:'Vulnerability 1 — SQL Injection',
    bad:`# Login endpoint — NEVER do this
username = request.form['username']
password = request.form['password']
query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
# Attacker enters: username = admin'--
# Query becomes: SELECT * FROM users WHERE username='admin'--' AND password='...'
# The -- comments out the password check — instant admin access`,
    good:`# Always use parameterised queries
import sqlite3
conn = sqlite3.connect('app.db')
cursor = conn.cursor()
cursor.execute(
    "SELECT * FROM users WHERE username=? AND password=?",
    (username, hashed_password)  # Parameters, never string interpolation
)`,
    why:'SQL injection occurs when user input is embedded directly in SQL queries. The fix is parameterised queries — the database treats parameters as data, never as SQL commands. OWASP rates SQLi as the #1 web application risk for good reason.',
    hint:'Never put user input directly into a SQL string.',
  },
  {
    id:2, label:'Vulnerability 2 — Hardcoded Credentials',
    bad:`# database.py — NEVER commit this
def get_connection():
    return mysql.connector.connect(
        host="prod-db.company.com",
        user="admin",
        password="SuperSecret123!",   # ← hardcoded in source code
        database="customers"
    )
# Now this password is in git history forever, even after "fixing" it`,
    good:`import os
def get_connection():
    return mysql.connector.connect(
        host=os.environ['DB_HOST'],
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD'],   # from environment
        database=os.environ['DB_NAME']
    )
# Rotate the env var — old password is immediately invalid`,
    why:'Credentials in source code end up in git history, log files, and error messages. Even after "deleting" them from the code, they remain in git history. Use environment variables or a secrets manager (AWS Secrets Manager, HashiCorp Vault). Treat a committed secret as permanently compromised.',
    hint:'Any credential in source code is compromised — use environment variables.',
  },
  {
    id:3, label:'Vulnerability 3 — Missing Rate Limiting',
    bad:`# Login endpoint — no rate limiting
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        return jsonify({'token': generate_token(user)})
    return jsonify({'error': 'Invalid credentials'}), 401
# Attacker can try 10,000 passwords/second — no protection`,
    good:`from flask_limiter import Limiter
limiter = Limiter(app, key_func=get_remote_address)

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")   # 5 attempts per IP per minute
def login():
    # ... same logic
    # After 5 failures, attacker gets 429 Too Many Requests
    # With account lockout after 10 failures: brute force impractical`,
    why:'Without rate limiting, an attacker can try millions of passwords against a login endpoint. Rate limiting doesn\'t make passwords unguessable — it makes brute force infeasible by throttling attempts. Always combine with account lockout and MFA.',
    hint:'No rate limiting = unlimited password guessing attempts.',
  },
];

export default function CY1_Level4() {
  const [found, setFound] = useState(new Set());

  return (
    <CY1Shell levelId={4} canProceed={found.size >= BUGS.length}
      prevLevelContext="In the last level you studied attacks that target people. Now you'll harden the authentication layer — the gate every attacker tries to bypass first."
      cumulativeSkills={[
        "Applied the CIA triad to evaluate a hospital system's security posture",
        "Built a STRIDE threat model identifying spoofing, tampering, and escalation risks",
        "Mapped the full attack surface: network boundaries, API endpoints, user inputs",
        "Identified social engineering attacks targeting hospital staff",
        "Designed an authentication system resistant to credential stuffing and brute force",
      ]}

      conceptReveal={[
        { label:'OWASP Top 10', detail:'The Open Web Application Security Project publishes the 10 most critical web security risks. SQL injection, broken authentication, and security misconfiguration are perennial top entries. Every developer should know OWASP Top 10 — it covers the vulnerabilities that cause 90% of real breaches.' },
      ]}
    >
      <div className="cy1-intro">
        <h1>Common Attack Types</h1>
        <p className="cy1-tagline">🐛 Three vulnerabilities from real applications. Find what\'s wrong.</p>
        <p className="cy1-why">SQL injection, hardcoded credentials, and missing rate limiting are responsible for thousands of real breaches every year. Recognise them instantly.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {BUGS.map(bug => (
          <div key={bug.id} style={{background:'#1e293b',borderRadius:10,padding:'16px 20px',border:`1px solid ${found.has(bug.id)?'#4ade8060':'#334155'}`,borderLeft:`3px solid ${found.has(bug.id)?'#4ade80':'#f87171'}`}}>
            <h3 style={{color:found.has(bug.id)?'#4ade80':'#f87171',margin:'0 0 10px',fontSize:14}}>{bug.label}</h3>
            <div className="cy1-panel" style={{margin:'0 0 8px'}}>
              <div className="cy1-panel-hdr" style={{color:'#f87171'}}>❌ Vulnerable Code</div>
              <pre className="cy1-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#cbd5e1'}}>{bug.bad}</pre>
            </div>
            <p style={{color:'#64748b',fontSize:13,margin:'8px 0'}}>💡 {bug.hint}</p>
            {!found.has(bug.id) ? (
              <button className="cy1-check-btn" style={{background:'#334155',color:'#94a3b8',fontSize:13,padding:'7px 16px'}}
                onClick={() => setFound(p=>{const n=new Set(p);n.add(bug.id);return n;})}>Reveal Fix</button>
            ) : (
              <>
                <div className="cy1-panel" style={{margin:'8px 0 6px'}}>
                  <div className="cy1-panel-hdr" style={{color:'#4ade80'}}>✅ Secure Code</div>
                  <pre className="cy1-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#94a3b8'}}>{bug.good}</pre>
                </div>
                <p style={{color:'#94a3b8',fontSize:13,lineHeight:1.6,margin:'6px 0'}}>{bug.why}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {found.size >= BUGS.length && <div className="cy1-feedback success" style={{marginTop:20}}>✅ Three classic vulnerabilities identified and fixed.</div>}
    </CY1Shell>
  );
}
