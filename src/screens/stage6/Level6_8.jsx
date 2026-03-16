// src/screens/stage6/Level6_8.jsx — Full CRUD Integration (BUILD)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';

const REQUIREMENTS = [
  { id: 'r1', label: 'useEffect fetches patients on mount with api.get()' },
  { id: 'r2', label: 'Form state with useState for name and wardId' },
  { id: 'r3', label: 'handleCreate POSTs to /api/patients and updates list' },
  { id: 'r4', label: 'handleDelete calls api.delete() and removes from list' },
  { id: 'r5', label: 'handleUpdate uses api.put() with the patient id' },
  { id: 'r6', label: 'Loading and error states handled in UI' },
];

const SOLUTION = `import { useState, useEffect } from 'react';
import api from '../services/api';

export default function PatientManager() {
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [form,     setForm]     = useState({ name: '', wardId: '' });
  const [editId,   setEditId]   = useState(null);

  // ── READ ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/api/patients')
      .then(res => setPatients(res.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  // ── CREATE ────────────────────────────────────────────────────────────────
  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await api.post('/api/patients', form);
      setPatients(prev => [...prev, res.data]);   // optimistic update
      setForm({ name: '', wardId: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Create failed');
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async function handleUpdate(id) {
    try {
      const res = await api.put(\`/api/patients/\${id}\`, form);
      setPatients(prev => prev.map(p => p.id === id ? res.data : p));
      setEditId(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    try {
      await api.delete(\`/api/patients/\${id}\`);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  }

  if (loading) return <p>Loading patients...</p>;

  return (
    <div>
      {error && <div className="error-toast">{error}</div>}

      {/* Create form */}
      <form onSubmit={handleCreate}>
        <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
          placeholder="Patient name" required />
        <input value={form.wardId} onChange={e => setForm(f => ({...f, wardId: e.target.value}))}
          placeholder="Ward ID" type="number" />
        <button type="submit">Add Patient</button>
      </form>

      {/* Patient list */}
      {patients.map(p => (
        <div key={p.id}>
          {editId === p.id ? (
            <>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              <button onClick={() => handleUpdate(p.id)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <span>{p.name}</span>
              <button onClick={() => { setEditId(p.id); setForm({ name: p.name, wardId: p.wardId }); }}>Edit</button>
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}`;

export default function Level6_8() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    setResults({
      r1: c.includes('USEEFFECT') && c.includes('API.GET') && c.includes('/API/PATIENTS'),
      r2: c.includes('USESTATE') && c.includes('NAME') && (c.includes('WARDID') || c.includes('WARD')),
      r3: c.includes('API.POST') && (c.includes('SETPATIENTS') || c.includes('SET_PATIENTS')),
      r4: c.includes('API.DELETE') && c.includes('FILTER'),
      r5: c.includes('API.PUT') && (c.includes('MAP') || c.includes('.MAP(')),
      r6: c.includes('LOADING') && c.includes('ERROR'),
    });
    setChecked(true);
  }

  const allPass = checked && Object.values(results).every(Boolean);

  return (
    <Stage6Shell levelId={8} canProceed={allPass}
      conceptReveal={[
        { label: 'Optimistic Updates', detail: 'After POST, don\'t refetch all patients — append the new one to state directly. After DELETE, filter it out. After PUT, map and replace. This makes the UI feel instant. Only refetch if the backend transforms the data significantly.' },
        { label: 'Error Handling Per Operation', detail: 'Each CRUD operation has its own try/catch. A delete failing should show a delete error, not clear the whole form. Keep error state granular — or use a toast library (react-hot-toast) to show operation-specific messages.' },
        { label: 'e.preventDefault()', detail: 'Always call e.preventDefault() in form onSubmit handlers. Without it, the browser performs a full page reload, losing all React state. This is the most common React form beginner bug.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Full CRUD Integration</h1>
        <p className="s6-tagline">⚡ React form → Axios → Spring → DB → UI updates. All four operations.</p>
        <p className="s6-why">This is the core loop of every real web app: create, read, update, delete — with the React UI staying in sync with the Spring Boot database without full page reloads.</p>
      </div>

      <div style={{ marginBottom:14 }}>
        {REQUIREMENTS.map(r => (
          <div className="s6-req" key={r.id}>
            <span className="s6-req-icon" style={{ color: !checked ? '#475569' : results[r.id] ? '#4ade80' : '#f87171' }}>
              {!checked ? '○' : results[r.id] ? '✓' : '✗'}
            </span>
            <span className="s6-req-text">{r.label}</span>
          </div>
        ))}
      </div>

      <textarea className="s6-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="// Build PatientManager — full CRUD with React + Axios..." style={{ minHeight:320 }} />

      <div style={{ display:'flex', gap:10, marginTop:10 }}>
        <button className="s6-btn" onClick={check}>Check Requirements</button>
        <button className="s6-btn secondary" onClick={() => setShowSolution(s => !s)}>
          {showSolution ? 'Hide' : 'Show'} Solution
        </button>
      </div>

      {showSolution && (
        <div className="s6-panel" style={{ marginTop:12 }}>
          <div className="s6-panel-header">✅ Reference Solution</div>
          <pre className="s6-panel-body" style={{ color:'#94a3b8', overflowX:'auto', margin:0, fontSize:12 }}>{SOLUTION}</pre>
        </div>
      )}

      {checked && (
        <div className={`s6-feedback ${allPass ? 'success' : 'error'}`}>
          {allPass ? '✅ Full CRUD integration complete. This pattern powers every real app.' : `❌ ${Object.values(results).filter(Boolean).length}/${REQUIREMENTS.length} requirements met.`}
        </div>
      )}
    </Stage6Shell>
  );
}
