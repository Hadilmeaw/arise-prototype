import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import {
  PATIENTS, SESSIONS, FTSS_SERIES, WEEKLY,
  ERROR_TYPES, ERROR_TIMELINE, flagCount,
  sessionQuality, groupByDay, dailyQualitySeries,
  caseloadDailyQuality, patientsAtRisk, formatShortDate,
} from './data.js'

const STORAGE_KEY = 'arise.therapist.session'

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
  })

  function handleLogin(initials) {
    const u = { initials, loggedAt: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }
  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  if (!user) return <Login onLogin={handleLogin} />
  return <Shell user={user} onLogout={handleLogout} />
}

/* -------------------- Login -------------------- */

function Login({ onLogin }) {
  const [id, setId] = useState('')
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState(null)

  function submit(e) {
    e.preventDefault()
    if (!id.trim() || !pwd.trim()) {
      setErr('Enter your clinician ID and password.')
      return
    }
    // Compute initials from the ID/email for display.
    const raw = id.trim()
    const initials = raw.includes('@')
      ? raw.split('@')[0].slice(0, 2).toUpperCase()
      : raw.slice(0, 2).toUpperCase()
    onLogin(initials)
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark">ARISE</span>
          <span className="brand-sub">Therapist</span>
        </div>
        <div className="login-title">Sign in to your dashboard</div>
        <form onSubmit={submit} className="login-form">
          <label>
            <span>Clinician ID or email</span>
            <input
              type="text" value={id}
              onChange={e => setId(e.target.value)}
              placeholder="e.g. doc@arise.eu"
              autoFocus
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password" value={pwd}
              onChange={e => setPwd(e.target.value)}
              placeholder="••••"
            />
          </label>
          {err && <div className="login-err">{err}</div>}
          <button type="submit" className="btn-primary login-submit">Sign in</button>
        </form>
        <div className="login-help">
          Demo credentials: any clinician ID and any password.
        </div>
      </div>
    </div>
  )
}

/* -------------------- Shell -------------------- */

function Shell({ user, onLogout }) {
  const [view, setView] = useState('caseload')
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0].id)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [settings, setSettings] = useState({
    metricSystem: 'metric',
    emailAlerts: true,
    weeklyDigest: true,
  })

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  return (
    <div className="app">
      <Sidebar
        view={view}
        onView={setView}
        user={user}
        onLogout={onLogout}
      />
      <div className="main">
        <Topbar
          view={view}
          selectedPatient={selectedPatient}
          onNewSession={() => setModal({ kind: 'new-session' })}
          onExport={() => {
            const csv = buildExportCsv(view, selectedPatient)
            downloadCsv(`arise-${view}-${todayStr()}.csv`, csv)
            showToast('Export downloaded as CSV.')
          }}
        />
        {view === 'caseload' && (
          <CaseloadView
            onOpenPatient={(id) => {
              setSelectedPatient(id)
              setView('sessions')
            }}
          />
        )}
        {view === 'sessions' && (
          <SessionsView
            initialPatient={selectedPatient}
            user={user}
            onOpenSession={(s) => setModal({ kind: 'session-detail', payload: s })}
            onBackToCaseload={() => setView('caseload')}
          />
        )}
        {view === 'reports' && <ReportsView initialPatient={selectedPatient} />}
        {view === 'settings' && (
          <SettingsView
            user={user}
            settings={settings}
            onChange={(s) => { setSettings(s); showToast('Settings saved.') }}
          />
        )}
      </div>

      {modal?.kind === 'new-session' && (
        <NewSessionModal
          patients={PATIENTS}
          defaultPatient={selectedPatient}
          onClose={() => setModal(null)}
          onCreate={(p) => {
            setModal(null)
            showToast(`Session queued for ${p.id}.`)
          }}
        />
      )}
      {modal?.kind === 'session-detail' && (
        <SessionDetailModal
          session={modal.payload}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

/* -------------------- Sidebar -------------------- */

function Sidebar({ view, onView, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-mark">ARISE</div>
        <div className="brand-sub">Therapist</div>
      </div>

      <nav className="nav">
        <NavItem label="Caseload"  active={view === 'caseload'}  onClick={() => onView('caseload')} />
        <NavItem label="Sessions"  active={view === 'sessions'}  onClick={() => onView('sessions')} />
        <NavItem label="Reports"   active={view === 'reports'}   onClick={() => onView('reports')} />
        <NavItem label="Settings"  active={view === 'settings'}  onClick={() => onView('settings')} />
      </nav>

      <div className="sidebar-spacer" />

      <div className="user-chip" title="Click to sign out">
        <div className="avatar">{user.initials}</div>
        <div className="user-info">
          <div className="user-name">Therapist · {user.initials}</div>
          <button className="link-btn" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ label, active, onClick }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {label}
    </button>
  )
}

/* -------------------- Topbar -------------------- */

function Topbar({ view, selectedPatient, onNewSession, onExport }) {
  const labels = {
    caseload: ['Caseload', 'Patient detail'],
    sessions: ['Sessions', 'All recent'],
    reports:  ['Reports',  'Aggregate stats'],
    settings: ['Settings', 'Preferences'],
  }
  const [l1, l2] = labels[view] || ['', '']
  return (
    <header className="topbar">
      <div className="crumbs">
        {l1} <span className="sep">/</span> {l2}
        {view === 'caseload' && (
          <> <span className="sep">/</span> <strong>{selectedPatient}</strong></>
        )}
      </div>
      <div className="topbar-actions">
        <button className="btn-secondary" onClick={onExport}>Export CSV</button>
        <button className="btn-primary" onClick={onNewSession}>New session</button>
      </div>
    </header>
  )
}

/* -------------------- Caseload view -------------------- */

function CaseloadView({ onOpenPatient }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('attention')   // attention | name | sessions | adherence

  const atRisk = useMemo(() => patientsAtRisk(), [])

  const totals = useMemo(() => ({
    patients: PATIENTS.length,
    sessionsThisWeek: SESSIONS.filter(s => withinDaysFromToday(s.date, 7)).length,
    avgImprovementPct: avgImprovement(),
    openFlags: PATIENTS.reduce((sum, p) => sum + p.openFlags, 0),
  }), [])

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const filtered = PATIENTS.filter(p =>
      !needle ||
      p.id.toLowerCase().includes(needle) ||
      p.name.toLowerCase().includes(needle) ||
      (p.dx || '').toLowerCase().includes(needle)
    )
    const ranked = [...filtered]
    if (sort === 'attention') {
      ranked.sort((a, b) => attentionScore(b) - attentionScore(a))
    } else if (sort === 'name') {
      ranked.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'sessions') {
      ranked.sort((a, b) => b.sessions - a.sessions)
    } else if (sort === 'adherence') {
      ranked.sort((a, b) => a.adherence - b.adherence)
    }
    return ranked
  }, [q, sort])

  return (
    <div className="detail">
      <section className="overview-row">
        <KpiCard label="Total patients"     value={totals.patients} />
        <KpiCard label="Sessions (7 days)"  value={totals.sessionsThisWeek} tone="good" />
        <KpiCard label="Avg improvement"    value={`${totals.avgImprovementPct.toFixed(1)}%`} tone="good" />
        <KpiCard label="Open flags"         value={totals.openFlags} tone={totals.openFlags > 5 ? 'warn' : 'neutral'} />
      </section>

      <div className="two-col">
        <section className="card at-risk-card">
          <div className="card-header">
            <h3>Patients to watch</h3>
            <span className="meta-aside">{atRisk.length} flagged</span>
          </div>
          {atRisk.length === 0
            ? <div className="empty">All patients on track.</div>
            : (
              <ul className="at-risk-list">
                {atRisk.slice(0, 5).map(p => {
                  const reasons = []
                  if (p.adherence < 0.70) reasons.push(`Adherence ${Math.round(p.adherence * 100)}%`)
                  if (p.openFlags >= 2)   reasons.push(`${p.openFlags} open flags`)
                  if (p.trend === 'up')   reasons.push('FTSS worsening')
                  return (
                    <li key={p.id} onClick={() => onOpenPatient(p.id)}>
                      <div className="ar-name">
                        <span className={`trend-mini trend-${p.trend}`}>
                          {p.trend === 'down' && '▼'}
                          {p.trend === 'up' && '▲'}
                          {p.trend === 'flat' && '■'}
                        </span>
                        {p.name}
                        <span className="ar-id">{p.id}</span>
                      </div>
                      <div className="ar-reasons">
                        {reasons.map((r, i) => (
                          <span key={i} className="ar-reason">{r}</span>
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )
          }
        </section>

        <section className="card snapshot-card">
          <div className="card-header">
            <h3>Caseload snapshot</h3>
          </div>
          <div className="snapshot-grid">
            <Snapshot
              label="Active today"
              value={SESSIONS.filter(s => s.date === todayStr()).length}
              hint="sessions logged"
            />
            <Snapshot
              label="On schedule"
              value={`${PATIENTS.filter(p => p.adherence >= 0.80).length}/${PATIENTS.length}`}
              hint="≥ 80% adherence"
            />
            <Snapshot
              label="Improving"
              value={PATIENTS.filter(p => p.trend === 'down').length}
              hint="FTSS dropping"
              tone="good"
            />
            <Snapshot
              label="Worsening"
              value={PATIENTS.filter(p => p.trend === 'up').length}
              hint="FTSS rising"
              tone="warn"
            />
          </div>
        </section>
      </div>

      <section className="card patients-card">
        <div className="card-header">
          <h3>All patients ({visible.length})</h3>
          <div className="filters">
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="attention">Sort: needs attention</option>
              <option value="name">Sort: name</option>
              <option value="sessions">Sort: most sessions</option>
              <option value="adherence">Sort: lowest adherence</option>
            </select>
            <input type="search" value={q}
                   onChange={e => setQ(e.target.value)}
                   placeholder="Search name, ID, diagnosis…" />
          </div>
        </div>
        {visible.length === 0
          ? <div className="empty">No patients match the current search.</div>
          : (
            <div className="patient-grid">
              {visible.map(p => (
                <PatientCard key={p.id} patient={p}
                             onOpen={() => onOpenPatient(p.id)} />
              ))}
            </div>
          )
        }
        <div className="patient-grid-hint">
          Tap a patient to open their sessions.
        </div>
      </section>
    </div>
  )
}

function attentionScore(p) {
  // Higher = needs more attention. Worsening + low adherence + open flags rank first.
  let s = 0
  if (p.trend === 'up')   s += 30
  if (p.trend === 'flat') s += 5
  s += Math.max(0, (0.85 - p.adherence) * 100)
  s += p.openFlags * 8
  return s
}

function PatientCard({ patient, onOpen }) {
  return (
    <button className="patient-card" onClick={onOpen}>
      <div className="pc-avatar">{initials(patient.name)}</div>
      <div className="pc-name-block">
        <div className="pc-name">{patient.name}</div>
        <div className="pc-meta">{patient.id}</div>
      </div>
      <span className={`pc-trend trend-${patient.trend}`} title={`Trend: ${patient.trend}`}>
        {patient.trend === 'down' && '▼'}
        {patient.trend === 'up' && '▲'}
        {patient.trend === 'flat' && '■'}
      </span>
      <span className="pc-cta">→</span>
    </button>
  )
}

function initials(name) {
  return name.split(/\s+/).map(w => w.charAt(0).toUpperCase()).join('').slice(0, 2)
}

function PatientNotes({ patientId, author }) {
  const key = `arise.therapist.notes.${patientId}`
  const [notes, setNotes] = useState(() => loadNotes(key))
  const [draft, setDraft] = useState('')
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    setNotes(loadNotes(key))
    setDraft('')
    setJustSaved(false)
  }, [patientId, key])

  function addNote() {
    const text = draft.trim()
    if (!text) return
    const note = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text,
      author,
      createdAt: new Date().toISOString(),
    }
    const next = [note, ...notes]
    saveNotes(key, next)
    setNotes(next)
    setDraft('')
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1800)
  }

  function deleteNote(id) {
    const next = notes.filter(n => n.id !== id)
    saveNotes(key, next)
    setNotes(next)
  }

  function onKeyDown(e) {
    // Ctrl/Cmd + Enter submits the note.
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      addNote()
    }
  }

  return (
    <section className="card notes-card">
      <div className="card-header">
        <h3>Therapist notes</h3>
        <div className="notes-status">
          {notes.length} note{notes.length === 1 ? '' : 's'}
          {justSaved && <span className="just-saved"> · saved ✓</span>}
        </div>
      </div>

      <div className="notes-compose">
        <textarea
          className="notes-textarea"
          rows="3"
          placeholder="Add an observation, treatment change, or follow-up item..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="notes-compose-row">
          <div className="notes-hint">
            Signed as <strong>{author}</strong> · Ctrl+Enter to save
          </div>
          <button
            className="btn-primary"
            onClick={addNote}
            disabled={!draft.trim()}
          >
            Add note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="notes-empty">No notes yet for this patient.</div>
      ) : (
        <ul className="notes-feed">
          {notes.map(n => (
            <li key={n.id} className="note-item">
              <div className="note-head">
                <div className="note-author">
                  <span className="note-avatar">{n.author}</span>
                  <span className="note-time">{formatNoteTime(n.createdAt)}</span>
                </div>
                <button
                  className="note-delete"
                  onClick={() => deleteNote(n.id)}
                  title="Delete this note"
                >
                  ×
                </button>
              </div>
              <div className="note-text">{n.text}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function loadNotes(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

function saveNotes(key, notes) {
  try { localStorage.setItem(key, JSON.stringify(notes)) } catch {}
}

function formatNoteTime(iso) {
  const d = new Date(iso)
  const date = d.toLocaleDateString(undefined,
    { day: 'numeric', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString(undefined,
    { hour: '2-digit', minute: '2-digit' })
  return `${date}, ${time}`
}

/* -------------------- Sessions view -------------------- */

function SessionsView({ initialPatient, user, onOpenSession, onBackToCaseload }) {
  const [filterPatient, setFilterPatient] = useState(initialPatient || 'all')
  const [q, setQ] = useState('')
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    if (initialPatient) setFilterPatient(initialPatient)
  }, [initialPatient])

  const rows = useMemo(() => {
    return SESSIONS
      .filter(s => filterPatient === 'all' || s.patient === filterPatient)
      .filter(s => {
        if (!q.trim()) return true
        const needle = q.toLowerCase()
        return (
          s.id.toLowerCase().includes(needle) ||
          s.patient.toLowerCase().includes(needle) ||
          (s.notes || '').toLowerCase().includes(needle)
        )
      })
  }, [q, filterPatient])

  const days = useMemo(() => groupByDay(rows), [rows])
  const patient = PATIENTS.find(p => p.id === filterPatient)

  useEffect(() => {
    if (days.length > 0) {
      setExpanded({ [days[0].date]: true })
    }
  }, [filterPatient, q])

  function toggleDay(date) {
    setExpanded(e => ({ ...e, [date]: !e[date] }))
  }

  const isPatientFocused = filterPatient !== 'all' && patient

  return (
    <div className="detail">
      {isPatientFocused && (
        <PatientHeader patient={patient}
                       onBackToCaseload={onBackToCaseload}
                       onClearFilter={() => setFilterPatient('all')} />
      )}

      {isPatientFocused && <PatientCharts patient={patient} />}

      <section className="card">
        <div className="card-header">
          <h3>
            {filterPatient === 'all'
              ? `All sessions (${rows.length})`
              : `${patient?.name || filterPatient}: ${rows.length} sessions`}
          </h3>
          <div className="filters">
            <select value={filterPatient} onChange={e => setFilterPatient(e.target.value)}>
              <option value="all">All patients</option>
              {PATIENTS.map(p => <option key={p.id} value={p.id}>{p.id} · {p.name}</option>)}
            </select>
            <input
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search session ID or notes…"
            />
          </div>
        </div>

        {days.length === 0
          ? <div className="empty">No sessions match the current filter.</div>
          : (
            <div className="day-list">
              {days.map(d => (
                <DayCard
                  key={d.date}
                  day={d}
                  open={!!expanded[d.date]}
                  onToggle={() => toggleDay(d.date)}
                  onOpenSession={onOpenSession}
                  showPatient={filterPatient === 'all'}
                />
              ))}
            </div>
          )
        }
      </section>

      {isPatientFocused && (
        <PatientNotes patientId={patient.id} author={user.initials} />
      )}
    </div>
  )
}

function PatientHeader({ patient, onBackToCaseload, onClearFilter }) {
  return (
    <div className="patient-head">
      <div>
        <button className="link back-link" onClick={onBackToCaseload}>
          ← All patients
        </button>
        <div className="patient-name">{patient.name}</div>
        <div className="patient-meta">
          {patient.id} · {patient.age} y · {patient.dx}
        </div>
      </div>
      <div className="head-stats">
        <KpiCard label="Sessions"   value={patient.sessions} />
        <KpiCard label="Last FTSS"  value={`${patient.lastFTSS}s`} tone="good" />
        <KpiCard label="Adherence"  value={`${Math.round(patient.adherence * 100)}%`}
                 tone={patient.adherence > 0.7 ? 'good' : 'warn'} />
        <KpiCard label="Open flags" value={patient.openFlags}
                 tone={patient.openFlags === 0 ? 'good' : patient.openFlags > 2 ? 'bad' : 'warn'} />
      </div>
    </div>
  )
}

function PatientCharts({ patient }) {
  const dailyQuality = useMemo(() => dailyQualitySeries(patient.id, 14), [patient.id])
  return (
    <>
      <section className="card chart-card">
        <div className="card-header">
          <h3>{patient.name}: quality per day</h3>
          <div className="legend">
            <span><i className="dot teal" /> Daily quality %</span>
            <span><i className="dot navy" /> Target 80%</span>
          </div>
        </div>
        <DailyQualityChart series={dailyQuality} target={80} />
      </section>

      <div className="two-col">
        <section className="card chart-card">
          <div className="card-header"><h3>{patient.name}: error mix</h3></div>
          <div className="error-mix-row">
            <ErrorDonut errors={patient.errors} />
            <ErrorList   errors={patient.errors} />
          </div>
        </section>

        <section className="card chart-card">
          <div className="card-header"><h3>{patient.name}: errors over time</h3></div>
          <StackedTimeline data={ERROR_TIMELINE[patient.id] || []} />
        </section>
      </div>
    </>
  )
}

function DayCard({ day, open, onToggle, onOpenSession, showPatient }) {
  const qualityTone = day.quality >= 80 ? 'good'
                    : day.quality >= 60 ? 'warn'
                    : 'bad'
  return (
    <div className={`day-card ${open ? 'open' : ''}`}>
      <button className="day-head" onClick={onToggle}>
        <div className="day-head-left">
          <span className="day-caret">{open ? '▾' : '▸'}</span>
          <span className="day-date">{formatShortDate(day.date)}</span>
          <span className="day-meta">
            {day.sessions.length} session{day.sessions.length === 1 ? '' : 's'}
            <span className="day-sep">·</span>
            {day.totalReps} reps
            <span className="day-sep">·</span>
            <span className="day-flags">{day.totalFlags} flag{day.totalFlags === 1 ? '' : 's'}</span>
          </span>
        </div>
        <div className={`day-quality tone-${qualityTone}`}>
          <span className="day-quality-num">{day.quality}%</span>
          <span className="day-quality-label">quality</span>
        </div>
      </button>
      {open && (
        <div className="day-body">
          <SessionTable
            rows={day.sessions}
            onOpen={onOpenSession}
            showPatient={showPatient}
          />
        </div>
      )}
    </div>
  )
}

/* -------------------- Reports view -------------------- */

function ReportsView({ initialPatient }) {
  const [mode, setMode] = useState('collective')   // 'collective' | 'patient'
  const [patientId, setPatientId] = useState(initialPatient || PATIENTS[0].id)

  useEffect(() => {
    if (initialPatient) setPatientId(initialPatient)
  }, [initialPatient])

  return (
    <div className="detail">
      <div className="reports-toolbar">
        <div className="seg-group">
          <button
            className={`seg ${mode === 'collective' ? 'on' : ''}`}
            onClick={() => setMode('collective')}
          >Caseload</button>
          <button
            className={`seg ${mode === 'patient' ? 'on' : ''}`}
            onClick={() => setMode('patient')}
          >Per patient</button>
        </div>
        {mode === 'patient' && (
          <div className="filters">
            <select value={patientId} onChange={e => setPatientId(e.target.value)}>
              {PATIENTS.map(p => (
                <option key={p.id} value={p.id}>{p.id} · {p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {mode === 'collective'
        ? <CollectiveReports />
        : <PatientReports patientId={patientId} />
      }
    </div>
  )
}

function CollectiveReports() {
  const totalSessions = SESSIONS.length
  const totalFlags = SESSIONS.reduce((s, r) => s + flagCount(r.flags), 0)
  const avgQuality = Math.round(
    SESSIONS.reduce((s, r) => s + sessionQuality(r), 0) / Math.max(SESSIONS.length, 1)
  )
  const adherenceAvg = (PATIENTS.reduce((s, p) => s + p.adherence, 0) / PATIENTS.length * 100).toFixed(0)
  const caseDaily = useMemo(() => caseloadDailyQuality(14), [])

  return (
    <>
      <section className="overview-row">
        <KpiCard label="Total sessions"  value={totalSessions} />
        <KpiCard label="Mean quality"    value={`${avgQuality}%`} tone={avgQuality >= 80 ? 'good' : 'warn'} />
        <KpiCard label="Mean adherence"  value={`${adherenceAvg}%`} tone="good" />
        <KpiCard label="Flags logged"    value={totalFlags} tone="warn" />
      </section>

      <section className="card chart-card">
        <div className="card-header">
          <h3>Caseload quality per day</h3>
          <div className="legend">
            <span><i className="dot teal" /> Daily quality %</span>
            <span><i className="dot navy" /> Target 80%</span>
          </div>
        </div>
        <DailyQualityChart series={caseDaily} target={80} />
      </section>

      <section className="card chart-card">
        <div className="card-header"><h3>Adherence by patient</h3></div>
        <AdherenceBars patients={PATIENTS} />
      </section>

      <section className="card chart-card">
        <div className="card-header">
          <h3>Error heatmap, patients × error types</h3>
          <div className="legend">
            <span style={{ fontSize: 11, color: 'var(--grey)' }}>
              Darker = more occurrences over the last 8 weeks
            </span>
          </div>
        </div>
        <ErrorHeatmap patients={PATIENTS} />
      </section>

      <section className="card chart-card">
        <div className="card-header">
          <h3>Caseload error mix</h3>
          <div className="legend">
            {ERROR_TYPES.map(t => (
              <span key={t.key}><i className="dot" style={{ background: t.color }} /> {t.label}</span>
            ))}
          </div>
        </div>
        <CaseloadErrorBars patients={PATIENTS} />
      </section>
    </>
  )
}

function PatientReports({ patientId }) {
  const patient = PATIENTS.find(p => p.id === patientId)
  const patientSessions = SESSIONS.filter(s => s.patient === patientId)
  const dq = dailyQualitySeries(patientId, 14)
  const totalFlags = patientSessions.reduce((s, r) => s + flagCount(r.flags), 0)
  const avgQuality = patientSessions.length
    ? Math.round(patientSessions.reduce((s, r) => s + sessionQuality(r), 0) / patientSessions.length)
    : 0
  const improvement = dq.length >= 2 ? dq.at(-1).quality - dq[0].quality : 0

  return (
    <>
      <div className="patient-head">
        <div>
          <div className="patient-name">{patient.name}</div>
          <div className="patient-meta">
            {patient.id} · {patient.age} y · {patient.dx}
          </div>
        </div>
      </div>

      <section className="overview-row">
        <KpiCard label="Sessions"      value={patient.sessions} />
        <KpiCard label="Mean quality"  value={`${avgQuality}%`} tone={avgQuality >= 80 ? 'good' : 'warn'} />
        <KpiCard label="Improvement"   value={`${improvement >= 0 ? '+' : ''}${improvement}%`} tone={improvement >= 0 ? 'good' : 'warn'} />
        <KpiCard label="Flags logged"  value={totalFlags} tone={totalFlags > 5 ? 'warn' : 'neutral'} />
      </section>

      <section className="card chart-card">
        <div className="card-header">
          <h3>{patient.name}: quality per day</h3>
        </div>
        <DailyQualityChart series={dq} target={80} />
      </section>

      <div className="two-col">
        <section className="card chart-card">
          <div className="card-header"><h3>{patient.name}: error mix</h3></div>
          <div className="error-mix-row">
            <ErrorDonut errors={patient.errors} />
            <ErrorList   errors={patient.errors} />
          </div>
        </section>

        <section className="card chart-card">
          <div className="card-header"><h3>{patient.name}: errors over time</h3></div>
          <StackedTimeline data={ERROR_TIMELINE[patient.id] || []} />
        </section>
      </div>
    </>
  )
}

/* -------------------- Settings view -------------------- */

function SettingsView({ user, settings, onChange }) {
  const [local, setLocal] = useState(settings)
  return (
    <div className="detail">
      <section className="card">
        <div className="card-header"><h3>Profile</h3></div>
        <div className="settings-row">
          <div className="settings-label">Initials</div>
          <div className="settings-value">{user.initials}</div>
        </div>
        <div className="settings-row">
          <div className="settings-label">Role</div>
          <div className="settings-value">Therapist</div>
        </div>
      </section>

      <section className="card">
        <div className="card-header"><h3>Preferences</h3></div>
        <div className="settings-row">
          <label className="settings-label">Unit system</label>
          <select
            value={local.metricSystem}
            onChange={e => setLocal({ ...local, metricSystem: e.target.value })}
          >
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lb, in)</option>
          </select>
        </div>
        <div className="settings-row">
          <label className="settings-label">Email alerts on red flags</label>
          <input
            type="checkbox"
            checked={local.emailAlerts}
            onChange={e => setLocal({ ...local, emailAlerts: e.target.checked })}
          />
        </div>
        <div className="settings-row">
          <label className="settings-label">Weekly digest email</label>
          <input
            type="checkbox"
            checked={local.weeklyDigest}
            onChange={e => setLocal({ ...local, weeklyDigest: e.target.checked })}
          />
        </div>
        <div className="settings-actions">
          <button className="btn-secondary" onClick={() => setLocal(settings)}>Reset</button>
          <button className="btn-primary" onClick={() => onChange(local)}>Save changes</button>
        </div>
      </section>
    </div>
  )
}

/* -------------------- Shared widgets -------------------- */

function KpiCard({ label, value, tone = 'neutral' }) {
  return (
    <div className={`kpi tone-${tone}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </div>
  )
}

function FlagPill({ n }) {
  if (n === 0) return <span className="pill ok">none</span>
  if (n <= 1) return <span className="pill warn">{n}</span>
  return <span className="pill bad">{n}</span>
}

function SessionTable({ rows, onOpen, showPatient = false }) {
  if (!rows.length) return <div className="empty">No sessions to show.</div>
  return (
    <table className="sessions-table">
      <thead>
        <tr>
          <th>Date</th>
          {showPatient && <th>Patient</th>}
          <th>ID</th>
          <th>Reps</th>
          <th>FTSS</th>
          <th>Flags</th>
          <th>Notes</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map(s => (
          <tr key={s.id}>
            <td>{s.date}</td>
            {showPatient && <td>{s.patient}</td>}
            <td>{s.id}</td>
            <td>{s.reps}</td>
            <td className="num">{s.ftss.toFixed(1)}s</td>
            <td><FlagPill n={flagCount(s.flags)} /></td>
            <td className="notes">{s.notes || '·'}</td>
            <td><button className="link" onClick={() => onOpen(s)}>Open</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Snapshot({ label, value, hint, tone = 'neutral' }) {
  return (
    <div className={`snapshot tone-${tone}`}>
      <div className="snap-value">{value}</div>
      <div className="snap-label">{label}</div>
      {hint && <div className="snap-hint">{hint}</div>}
    </div>
  )
}

function DailyQualityChart({ series, target = 80 }) {
  const w = 760, h = 220
  const padL = 36, padR = 24, padT = 16, padB = 38
  if (!series.length) {
    return <div className="empty">No quality data yet.</div>
  }
  const plotW = w - padL - padR
  const plotH = h - padT - padB
  const max = 100, min = 0
  const xs = series.map((_, i) => padL + (i * plotW) / Math.max(series.length - 1, 1))
  const yOf = (v) => padT + plotH - ((v - min) / (max - min)) * plotH
  const ys = series.map(s => yOf(s.quality))
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ')
  const area = `${path} L ${xs.at(-1)} ${padT + plotH} L ${xs[0]} ${padT + plotH} Z`

  // Tick lines at 0/40/80/100
  const ticks = [0, 40, 80, 100]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark">
      {ticks.map(t => (
        <g key={t}>
          <line x1={padL} x2={w - padR}
                y1={yOf(t)} y2={yOf(t)}
                stroke="#EEF1F5" strokeWidth="1" />
          <text x={padL - 8} y={yOf(t) + 4}
                textAnchor="end" fontSize="10" fill="var(--grey)">
            {t}%
          </text>
        </g>
      ))}
      <line x1={padL} x2={w - padR} y1={yOf(target)} y2={yOf(target)}
            stroke="var(--navy-light)" strokeDasharray="4 4" strokeWidth="1.5" />
      <path d={area} fill="var(--teal)" fillOpacity="0.14" />
      <path d={path} fill="none" stroke="var(--teal)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" />
      {series.map((s, i) => (
        <g key={s.date}>
          <circle cx={xs[i]} cy={ys[i]} r="4.5"
                  fill="var(--white)" stroke="var(--teal)" strokeWidth="2.5" />
          <text x={xs[i]} y={ys[i] - 12}
                textAnchor="middle" fontSize="11"
                fontWeight="700" fill="var(--navy)">
            {s.quality}%
          </text>
          <text x={xs[i]} y={h - padB + 16}
                textAnchor="middle" fontSize="10" fill="var(--grey)">
            {formatShortDate(s.date)}
          </text>
        </g>
      ))}
    </svg>
  )
}

function DaySummaryStrip({ days }) {
  if (!days.length) return <div className="empty">No active days yet.</div>
  return (
    <div className="day-strip">
      {days.map(d => {
        const tone = d.quality >= 80 ? 'good' : d.quality >= 60 ? 'warn' : 'bad'
        return (
          <div key={d.date} className={`day-tile tone-${tone}`}>
            <div className="day-tile-date">{formatShortDate(d.date)}</div>
            <div className="day-tile-q">{d.quality}%</div>
            <div className="day-tile-sub">
              {d.sessions.length} sess · {d.totalReps} reps
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LineChart({ points, target }) {
  const w = 760, h = 220, pad = 32
  if (!points.length) return null
  const max = Math.max(...points, target) * 1.1
  const min = 0
  const x = i => pad + (i * (w - pad * 2)) / Math.max(points.length - 1, 1)
  const y = v => h - pad - ((v - min) / (max - min)) * (h - pad * 2)
  const path = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark">
      <line x1={pad} y1={y(target)} x2={w - pad} y2={y(target)}
            stroke="var(--navy-light)" strokeDasharray="4 4" strokeWidth="1.5" />
      <path d={path} stroke="var(--teal)" strokeWidth="3" fill="none" />
      {points.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r="5"
                  fill="var(--white)" stroke="var(--teal)" strokeWidth="2.5" />
          <text x={x(i)} y={y(v) - 14} textAnchor="middle" fontSize="12" fill="var(--navy)">
            {v.toFixed(1)}s
          </text>
        </g>
      ))}
    </svg>
  )
}

function WeeklyBars({ data }) {
  const w = 760, h = 220, pad = 32
  const barW = (w - pad * 2) / data.length - 8
  const maxV = Math.max(...data.map(d => d.sessions)) * 1.15
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark">
      {data.map((d, i) => {
        const x = pad + i * ((w - pad * 2) / data.length)
        const plannedH = (d.sessions / maxV) * (h - pad * 2)
        const completedH = (d.completed / maxV) * (h - pad * 2)
        return (
          <g key={d.week}>
            <rect x={x} y={h - pad - plannedH} width={barW} height={plannedH}
                  fill="var(--navy-light)" opacity="0.5" rx="3" />
            <rect x={x} y={h - pad - completedH} width={barW} height={completedH}
                  fill="var(--teal)" rx="3" />
            <text x={x + barW / 2} y={h - pad + 16}
                  textAnchor="middle" fontSize="11" fill="var(--grey)">
              {d.week}
            </text>
            <text x={x + barW / 2} y={h - pad - plannedH - 6}
                  textAnchor="middle" fontSize="11" fill="var(--navy)">
              {d.completed}/{d.sessions}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function AdherenceBars({ patients }) {
  const w = 760, h = 240, padL = 80, padR = 20, padT = 20, padB = 20
  const rowH = (h - padT - padB) / patients.length
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark">
      {patients.map((p, i) => {
        const y = padT + i * rowH
        const barW = p.adherence * (w - padL - padR)
        const color = p.adherence > 0.8 ? 'var(--ok)'
                    : p.adherence > 0.6 ? '#C47A00'
                    : 'var(--bad)'
        return (
          <g key={p.id}>
            <text x={padL - 8} y={y + rowH / 2 + 4}
                  textAnchor="end" fontSize="12" fill="var(--navy)">
              {p.name}
            </text>
            <rect x={padL} y={y + rowH / 2 - 7}
                  width={w - padL - padR} height={14}
                  fill="var(--navy-pale)" rx="7" opacity="0.4" />
            <rect x={padL} y={y + rowH / 2 - 7}
                  width={barW} height={14} fill={color} rx="7" />
            <text x={padL + barW + 6} y={y + rowH / 2 + 4}
                  fontSize="12" fill="var(--ink)">
              {Math.round(p.adherence * 100)}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* -------------------- Error analytics widgets -------------------- */

function ErrorDonut({ errors }) {
  const total = Object.values(errors).reduce((a, b) => a + b, 0)
  const cx = 110, cy = 110, r = 80, sw = 26
  if (total === 0) {
    return (
      <svg viewBox="0 0 220 220" className="donut">
        <circle cx={cx} cy={cy} r={r} fill="none"
                stroke="var(--navy-pale)" strokeWidth={sw} opacity="0.5" />
        <text x={cx} y={cy + 6} textAnchor="middle"
              fontSize="22" fontWeight="700" fill="var(--ok)">
          0
        </text>
        <text x={cx} y={cy + 26} textAnchor="middle"
              fontSize="11" fill="var(--grey)">
          no flags
        </text>
      </svg>
    )
  }
  let acc = 0
  const circ = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 220 220" className="donut">
      <circle cx={cx} cy={cy} r={r} fill="none"
              stroke="#EEF1F5" strokeWidth={sw} />
      {ERROR_TYPES.map((t) => {
        const v = errors[t.key] || 0
        if (v === 0) return null
        const len = (v / total) * circ
        const offset = circ * 0.25 - acc       // start at 12 o'clock
        acc += len
        return (
          <circle
            key={t.key}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={t.color}
            strokeWidth={sw}
            strokeDasharray={`${len} ${circ}`}
            strokeDashoffset={offset}
          />
        )
      })}
      <text x={cx} y={cy + 2} textAnchor="middle"
            fontSize="32" fontWeight="700" fill="var(--navy)">
        {total}
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle"
            fontSize="11" fill="var(--grey)">
        total flags
      </text>
    </svg>
  )
}

function ErrorList({ errors }) {
  const total = Object.values(errors).reduce((a, b) => a + b, 0) || 1
  return (
    <ul className="error-list">
      {ERROR_TYPES.map(t => {
        const v = errors[t.key] || 0
        const pct = (v / total) * 100
        return (
          <li key={t.key}>
            <div className="el-label">
              <span className="el-dot" style={{ background: t.color }} />
              {t.label}
            </div>
            <div className="el-bar">
              <div className="el-bar-fill"
                   style={{ width: `${pct}%`, background: t.color }} />
            </div>
            <div className="el-count">{v}</div>
          </li>
        )
      })}
    </ul>
  )
}

/* Small-multiples timeline: one mini line+area chart per error type, stacked
   vertically. Reads cleanly and the trend per category is obvious. */
function StackedTimeline({ data }) {
  if (!data.length) {
    return <div className="empty">No timeline data yet.</div>
  }
  return (
    <div className="small-multiples">
      {ERROR_TYPES.map(t => {
        const series = data.map(d => d[t.key] || 0)
        const sum = series.reduce((a, b) => a + b, 0)
        const latest = series[series.length - 1] || 0
        const prev = series[series.length - 2] || 0
        const delta = latest - prev
        const trendCls = delta < 0 ? 'down' : delta > 0 ? 'up' : 'flat'
        const trendGlyph = delta < 0 ? '▼' : delta > 0 ? '▲' : '■'
        return (
          <div key={t.key} className="sm-row">
            <div className="sm-label">
              <span className="sm-dot" style={{ background: t.color }} />
              <span className="sm-name">{t.label}</span>
            </div>
            <div className="sm-chart">
              <MiniArea series={series}
                       labels={data.map(d => d.week)}
                       color={t.color} />
            </div>
            <div className="sm-stats">
              <span className="sm-total">{sum}</span>
              <span className={`sm-trend trend-${trendCls}`}>
                {trendGlyph} {Math.abs(delta)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MiniArea({ series, labels, color }) {
  const w = 460, h = 64, padX = 6, padT = 12, padB = 14
  const max = Math.max(1, ...series)
  const plotW = w - padX * 2
  const plotH = h - padT - padB
  const step = plotW / Math.max(series.length - 1, 1)
  const xs = series.map((_, i) => padX + i * step)
  const ys = series.map(v => padT + plotH - (v / max) * plotH)
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ')
  const area = `${path} L ${xs.at(-1)} ${padT + plotH} L ${xs[0]} ${padT + plotH} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mini">
      {/* Baseline */}
      <line x1={padX} x2={w - padX}
            y1={padT + plotH} y2={padT + plotH}
            stroke="#EEF1F5" strokeWidth="1" />
      {/* Filled area */}
      <path d={area} fill={color} fillOpacity="0.18" />
      {/* Line */}
      <path d={path} fill="none" stroke={color} strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3"
                fill="white" stroke={color} strokeWidth="2" />
      ))}
      {/* Latest value */}
      <text x={xs.at(-1)} y={ys.at(-1) - 8}
            textAnchor="middle" fontSize="10"
            fontWeight="700" fill="var(--navy)">
        {series.at(-1)}
      </text>
      {/* Week ticks */}
      {labels.map((l, i) => (
        <text key={i} x={xs[i]} y={h - 2}
              textAnchor="middle" fontSize="9" fill="var(--grey-light)">
          {l.replace('W-', '')}
        </text>
      ))}
    </svg>
  )
}

function ErrorHeatmap({ patients }) {
  // Sort patients by total errors descending so the worst sits at the top.
  const sorted = [...patients].sort((a, b) =>
    sumErrors(b.errors) - sumErrors(a.errors)
  )

  // Per-column max so each column has its own intensity scale (otherwise the
  // most common error dominates and the rest reads as a uniform light wash).
  const colMax = {}
  ERROR_TYPES.forEach(t => {
    colMax[t.key] = Math.max(1, ...patients.map(p => p.errors?.[t.key] || 0))
  })

  const padL = 130, padT = 48, padR = 70, padB = 16
  const cellH = 38, cellW = 92, gap = 6
  const w = padL + ERROR_TYPES.length * cellW + padR
  const h = padT + sorted.length * cellH + padB

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark heatmap">
      {/* Column headers with a small color swatch */}
      {ERROR_TYPES.map((t, ci) => {
        const cx = padL + ci * cellW + cellW / 2
        return (
          <g key={t.key}>
            <rect x={cx - 5} y={padT - 28} width="10" height="4"
                  rx="2" fill={t.color} />
            <text x={cx} y={padT - 14}
                  textAnchor="middle" fontSize="11"
                  fontWeight="600" fill="var(--navy)">
              {t.label}
            </text>
          </g>
        )
      })}
      {/* Total column header */}
      <text x={padL + ERROR_TYPES.length * cellW + padR / 2}
            y={padT - 14}
            textAnchor="middle" fontSize="11"
            fontWeight="600" fill="var(--grey)">
        Total
      </text>

      {/* Row labels and cells */}
      {sorted.map((p, ri) => {
        const rowTotal = sumErrors(p.errors)
        const y = padT + ri * cellH
        return (
          <g key={p.id}>
            {/* Row label */}
            <text x={padL - 14} y={y + cellH / 2 + 4}
                  textAnchor="end" fontSize="12.5"
                  fontWeight="600" fill="var(--navy)">
              {p.name}
            </text>
            <text x={padL - 14} y={y + cellH / 2 + 18}
                  textAnchor="end" fontSize="10"
                  fill="var(--grey)">
              {p.id}
            </text>

            {/* Heat cells, scaled per column */}
            {ERROR_TYPES.map((t, ci) => {
              const v = p.errors?.[t.key] || 0
              const intensity = v / colMax[t.key]
              const cx = padL + ci * cellW
              return (
                <g key={t.key}>
                  <rect
                    x={cx + gap / 2}
                    y={y + gap / 2}
                    width={cellW - gap}
                    height={cellH - gap}
                    fill={t.color}
                    fillOpacity={v === 0 ? 0.06 : 0.18 + intensity * 0.78}
                    rx="8"
                  />
                  <text
                    x={cx + cellW / 2}
                    y={y + cellH / 2 + 4}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight={v === 0 ? 400 : 700}
                    fill={v === 0 ? 'var(--grey-light)'
                                  : intensity > 0.55 ? 'white' : 'var(--ink)'}
                  >
                    {v}
                  </text>
                </g>
              )
            })}

            {/* Row total */}
            <text x={padL + ERROR_TYPES.length * cellW + padR / 2}
                  y={y + cellH / 2 + 5}
                  textAnchor="middle" fontSize="14"
                  fontWeight="700" fill="var(--navy)">
              {rowTotal}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function CaseloadErrorBars({ patients }) {
  // Sort patients by total errors (worst first).
  const sorted = [...patients].sort((a, b) =>
    sumErrors(b.errors) - sumErrors(a.errors)
  )
  const maxTotal = Math.max(1, ...sorted.map(p => sumErrors(p.errors)))
  const w = 760
  const padL = 110, padR = 60, padT = 12, padB = 12
  const rowH = 32, rowGap = 8
  const h = padT + sorted.length * (rowH + rowGap) + padB
  const plotW = w - padL - padR

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark">
      {sorted.map((p, ri) => {
        const y = padT + ri * (rowH + rowGap)
        const total = sumErrors(p.errors)
        const totalW = (total / maxTotal) * plotW
        let xCursor = padL
        const segments = ERROR_TYPES
          .map(t => ({ key: t.key, color: t.color, v: p.errors[t.key] || 0 }))
          .filter(s => s.v > 0)

        return (
          <g key={p.id}>
            {/* Row label */}
            <text x={padL - 12} y={y + rowH / 2 + 4}
                  textAnchor="end" fontSize="12"
                  fontWeight="600" fill="var(--navy)">
              {p.name}
            </text>

            {/* Track */}
            <rect
              x={padL} y={y}
              width={plotW} height={rowH}
              fill="#F4F6F9" rx="6"
            />

            {/* Stacked segments inside a rounded clip */}
            <clipPath id={`clip-${p.id}`}>
              <rect x={padL} y={y} width={totalW} height={rowH} rx="6" />
            </clipPath>
            <g clipPath={`url(#clip-${p.id})`}>
              {segments.map((s) => {
                const segW = (s.v / maxTotal) * plotW
                const x = xCursor
                xCursor += segW
                return (
                  <rect key={s.key}
                        x={x} y={y}
                        width={segW} height={rowH}
                        fill={s.color} />
                )
              })}
            </g>

            {/* Row total */}
            <text x={padL + totalW + 8} y={y + rowH / 2 + 4}
                  fontSize="12" fontWeight="700" fill="var(--navy)">
              {total}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function sumErrors(e) {
  return Object.values(e || {}).reduce((a, b) => a + b, 0)
}

/* -------------------- Modals -------------------- */

function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${wide ? 'wide' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

function NewSessionModal({ patients, defaultPatient, onClose, onCreate }) {
  const [patientId, setPatientId] = useState(defaultPatient)
  const [protocol, setProtocol] = useState('5xSTS')
  const [notes, setNotes] = useState('')

  function submit(e) {
    e.preventDefault()
    onCreate({ id: patientId, protocol, notes })
  }
  return (
    <Modal title="Queue a new session" onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <label>
          <span>Patient</span>
          <select value={patientId} onChange={e => setPatientId(e.target.value)}>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.id} · {p.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Protocol</span>
          <select value={protocol} onChange={e => setProtocol(e.target.value)}>
            <option value="5xSTS">Five-times sit-to-stand (5xSTS)</option>
            <option value="30sCST">30-second chair-stand test</option>
            <option value="Custom">Custom (free count)</option>
          </select>
        </label>
        <label>
          <span>Notes (optional)</span>
          <textarea
            rows="3"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Anything to flag for the coach prompt…"
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Queue session</button>
        </div>
      </form>
    </Modal>
  )
}

function SessionDetailModal({ session, onClose }) {
  const patient = PATIENTS.find(p => p.id === session.patient)
  const flagsObj = typeof session.flags === 'object' ? session.flags : {}
  const totalFlags = flagCount(session.flags)
  const reps = buildRepTimeline(session)
  return (
    <Modal title={`Session ${session.id}`} onClose={onClose} wide>
      <div className="session-meta">
        <Meta label="Date"    value={session.date} />
        <Meta label="Patient" value={`${patient?.name || '·'} (${session.patient})`} />
        <Meta label="Reps"    value={session.reps} />
        <Meta label="FTSS"    value={`${session.ftss.toFixed(1)}s`} />
        <Meta label="Flags"   value={<FlagPill n={totalFlags} />} />
      </div>

      <ReplayPlayer session={session} reps={reps} />

      {totalFlags > 0 ? (
        <div className="modal-section">
          <div className="kpi-label">Flag breakdown</div>
          <ul className="error-list compact">
            {ERROR_TYPES.map(t => {
              const v = flagsObj[t.key] || 0
              if (v === 0) return null
              return (
                <li key={t.key}>
                  <div className="el-label">
                    <span className="el-dot" style={{ background: t.color }} />
                    {t.label}
                  </div>
                  <div className="el-count">{v}</div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <div className="modal-section">
          <div className="kpi-label">Flag breakdown</div>
          <div className="empty-mini">Clean session. No flags raised.</div>
        </div>
      )}

      <SessionNotesEditor session={session} />

      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>Close</button>
        <button className="btn-primary" onClick={onClose}>Mark reviewed</button>
      </div>
    </Modal>
  )
}

function SessionNotesEditor({ session }) {
  const key = `arise.therapist.session-notes.${session.id}`
  const initial = useMemo(() => loadSessionNote(key, session.notes || ''), [key, session.notes])
  const [text, setText] = useState(initial)
  const [savedAt, setSavedAt] = useState(0)
  const [dirty, setDirty] = useState(false)

  useEffect(() => { setText(initial); setDirty(false); setSavedAt(0) }, [initial])

  function persist(next) {
    try { localStorage.setItem(key, JSON.stringify({ text: next, savedAt: Date.now() })) } catch {}
    setSavedAt(Date.now())
    setDirty(false)
  }

  function onChange(e) {
    setText(e.target.value)
    setDirty(true)
  }
  function onBlur() {
    if (dirty) persist(text)
  }
  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      persist(text)
    }
  }
  function revert() {
    setText(session.notes || '')
    persist(session.notes || '')
  }

  const fresh = savedAt && (Date.now() - savedAt < 2400)

  return (
    <div className="session-notes">
      <div className="session-notes-head">
        <div className="kpi-label">Notes</div>
        <div className="session-notes-status">
          {dirty && <span className="dirty">Unsaved</span>}
          {!dirty && fresh && <span className="saved">Saved ✓</span>}
          {text !== (session.notes || '') && (
            <button className="link" onClick={revert} title="Discard your edits and restore the original note">
              Revert
            </button>
          )}
        </div>
      </div>
      <textarea
        className="session-notes-area"
        rows="4"
        value={text}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder="Add an observation, treatment change, or follow-up item…"
      />
      <div className="session-notes-hint">
        Saves on blur · Ctrl+Enter to save now · stays on this device
      </div>
    </div>
  )
}

function loadSessionNote(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return typeof parsed?.text === 'string' ? parsed.text : fallback
  } catch { return fallback }
}

/* Derive a per-rep timeline from a session for the replay scrubber.
   Each rep gets an equal slice of the FTSS duration. Flags are distributed
   round-robin across reps so each marker has a definite home; in WP3 this
   is replaced by real per-rep flags from the analytics pipeline. */
function buildRepTimeline(session) {
  const total = session.ftss
  const n = Math.max(1, session.reps)
  const per = total / n
  const reps = Array.from({ length: n }, (_, i) => ({
    n: i + 1,
    start: i * per,
    end:   (i + 1) * per,
    flags: [],
  }))
  const flagsObj = typeof session.flags === 'object' ? session.flags : {}
  let cursor = 0
  ERROR_TYPES.forEach(t => {
    const v = flagsObj[t.key] || 0
    for (let i = 0; i < v; i++) {
      const rep = reps[cursor % n]
      rep.flags.push({ key: t.key, label: t.label, color: t.color })
      cursor += 1
    }
  })
  return reps
}

function ReplayPlayer({ session, reps }) {
  const videoRef = useRef(null)
  const [missing, setMissing] = useState(false)
  const [duration, setDuration] = useState(session.ftss)
  const [currentTime, setCurrentTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const videoSrc = `/sessions/${session.id}.mp4`

  function togglePlay() {
    const v = videoRef.current
    if (!v || missing) return
    if (v.paused) v.play(); else v.pause()
  }
  function seekTo(t) {
    const v = videoRef.current
    if (!v || missing) { setCurrentTime(t); return }
    v.currentTime = Math.max(0, Math.min(t, v.duration || duration))
  }
  function onLoaded() {
    const v = videoRef.current
    if (v && v.duration && !Number.isNaN(v.duration)) setDuration(v.duration)
  }
  function onTime() {
    const v = videoRef.current
    if (v) setCurrentTime(v.currentTime)
  }

  const activeRepIdx = reps.findIndex(r => currentTime >= r.start && currentTime < r.end)

  return (
    <div className="replay">
      <div className="replay-stage">
        <video
          ref={videoRef}
          className={`replay-video ${missing ? 'hidden' : ''}`}
          src={videoSrc}
          preload="metadata"
          onLoadedMetadata={onLoaded}
          onTimeUpdate={onTime}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setMissing(true)}
          playsInline
        />
        {missing && (
          <div className="replay-missing">
            <div className="replay-missing-mark">▶</div>
            <div className="replay-missing-title">Recording not available in demo</div>
            <div className="replay-missing-body">
              In production this panel shows the de-identified video
              (blurred face) with the live pose overlay. Drop a file at
              <code> public{videoSrc}</code> to see it here.
            </div>
          </div>
        )}
      </div>

      <div className="replay-controls">
        <button className="replay-play" onClick={togglePlay} disabled={missing}>
          {playing ? '❚❚' : '▶'}
        </button>
        <div className="replay-time mono">
          {fmtTime(currentTime)} / {fmtTime(duration)}
        </div>
        <ScrubBar
          duration={duration}
          currentTime={currentTime}
          reps={reps}
          onSeek={seekTo}
        />
      </div>

      <div className="rep-chip-strip">
        {reps.map((r, i) => {
          const flagged = r.flags.length > 0
          const isActive = i === activeRepIdx
          return (
            <button
              key={r.n}
              className={`rep-chip ${flagged ? 'flagged' : 'clean'} ${isActive ? 'active' : ''}`}
              onClick={() => seekTo(r.start + 0.05)}
              title={flagged
                ? `Rep ${r.n}: ${r.flags.map(f => f.label).join(', ')}`
                : `Rep ${r.n}: clean`}
            >
              <span className="rep-chip-num">Rep {r.n}</span>
              <span className="rep-chip-dur">{(r.end - r.start).toFixed(1)}s</span>
              {flagged && (
                <span className="rep-chip-dots">
                  {r.flags.map((f, k) => (
                    <span key={k} className="rcd"
                          style={{ background: f.color }} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ScrubBar({ duration, currentTime, reps, onSeek }) {
  const trackRef = useRef(null)
  function pick(e) {
    const t = trackRef.current
    if (!t) return
    const rect = t.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onSeek(ratio * duration)
  }
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0
  return (
    <div className="scrub" ref={trackRef} onClick={pick}>
      <div className="scrub-rail" />
      {reps.map((r, i) => {
        const left = duration > 0 ? (r.start / duration) * 100 : 0
        return (
          <div key={i} className="scrub-rep-tick"
               style={{ left: `${left}%` }} title={`Rep ${r.n}`} />
        )
      })}
      {reps.flatMap(r => r.flags.map((f, k) => {
        const at = (r.start + r.end) / 2
        const left = duration > 0 ? (at / duration) * 100 : 0
        return (
          <div key={`${r.n}-${k}`} className="scrub-flag"
               style={{ left: `${left}%`, background: f.color }}
               title={`Rep ${r.n}: ${f.label}`} />
        )
      }))}
      <div className="scrub-fill" style={{ width: `${pct}%` }} />
      <div className="scrub-thumb" style={{ left: `${pct}%` }} />
    </div>
  )
}

function fmtTime(s) {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

function Meta({ label, value }) {
  return (
    <div>
      <div className="kpi-label">{label}</div>
      <div className="meta-value">{value}</div>
    </div>
  )
}

/* -------------------- Utilities -------------------- */

function withinDaysFromToday(isoDate, days) {
  const today = new Date('2026-06-18')   // pinned for skeleton determinism
  const d = new Date(isoDate)
  const diff = (today - d) / 86400000
  return diff >= 0 && diff <= days
}

function avgImprovement() {
  // Mean % drop between first and most-recent FTSS across all patients with ≥3 sessions.
  const deltas = Object.values(FTSS_SERIES)
    .filter(s => s.length >= 3)
    .map(s => (s[0] - s.at(-1)) / s[0] * 100)
  if (!deltas.length) return 0
  return deltas.reduce((a, b) => a + b, 0) / deltas.length
}

function todayStr() {
  return '2026-06-18'
}

function buildExportCsv(view, selectedPatient) {
  if (view === 'caseload') {
    const rows = SESSIONS.filter(s => s.patient === selectedPatient)
    return toCsv(['date', 'id', 'patient', 'reps', 'ftss', 'flags', 'notes'], rows)
  }
  if (view === 'sessions') {
    return toCsv(['date', 'id', 'patient', 'reps', 'ftss', 'flags', 'notes'], SESSIONS)
  }
  if (view === 'reports') {
    return toCsv(['week', 'sessions', 'completed', 'flags'], WEEKLY)
  }
  return toCsv(['id', 'name', 'age', 'dx', 'sessions', 'lastFTSS', 'adherence', 'openFlags'], PATIENTS)
}

function toCsv(cols, rows) {
  const head = cols.join(',')
  const body = rows.map(r =>
    cols.map(c => {
      let v = r[c]
      if (c === 'flags') v = flagCount(v)
      v = v ?? ''
      const s = String(v).replaceAll('"', '""')
      return /[",\n]/.test(s) ? `"${s}"` : s
    }).join(',')
  ).join('\n')
  return head + '\n' + body + '\n'
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
