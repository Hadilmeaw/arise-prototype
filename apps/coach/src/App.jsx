import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { usePose, BONES, KP } from './usePose.js'

const STORAGE_KEY  = 'arise.coach.session'
const HISTORY_KEY  = 'arise.coach.history'
const SETTINGS_KEY = 'arise.coach.settings'
const CALIBRATION_SECONDS = 5

const DEFAULT_SETTINGS = {
  displayName: '',
  sound: true,
  highContrast: false,
  fontScale: 'regular',
  cameraId: 'default',
  motionSensitivity: 'standard',
}

const VIDEOS = [
  /* Clean reference takes */
  { id: 'luca',       label: 'Luca (clean)',           src: '/luca_4th_30sec.mp4' },
  { id: 'ali',        label: 'Ali (clean)',            src: '/ali_4th_30sec.mp4' },
  { id: 'hadil',      label: 'Hadil (clean)',          src: '/hadil_4th_30sec.mp4' },
  { id: 'fran',       label: 'Fran (clean)',           src: '/fran_4th_30sec.mp4' },
  /* Labelled error takes (from bvh_rehab/videosdata/incorrect) */
  { id: 'knee',       label: 'Error: knee valgus',     src: '/ars_knee_valgus.mp4' },
  { id: 'trunk_vid',  label: 'Error: trunk lean',      src: '/ars_trunk_lean.mp4' },
  { id: 'symm',       label: 'Error: asymmetric',      src: '/ars_asymmetric.mp4' },
  { id: 'hands',      label: 'Error: using hands',     src: '/ars_using_hands.mp4' },
]

const FAULTS = [
  { key: 'valgus', short: 'Knees out',   color: '#FF7A88', joints: ['lKnee', 'rKnee'],         phase: 'rising',     tip: 'Push your knees outward so they line up over your toes.', Icon: ValgusIcon },
  { key: 'trunk',  short: 'Stand tall',  color: '#FFB347', joints: ['lShoulder', 'rShoulder'], phase: 'rising',     tip: 'Keep your chest open and your spine long.',                Icon: TrunkIcon  },
  { key: 'asym',   short: 'Even feet',   color: '#B98BE0', joints: ['lAnkle', 'rAnkle'],       phase: 'standing',   tip: 'Press through both feet equally as you rise.',             Icon: AsymIcon   },
  { key: 'slow',   short: 'Smooth pace', color: '#62B6E0', joints: ['lHip', 'rHip'],           phase: 'descending', tip: 'Sit back down with control, without stopping halfway.',    Icon: SlowIcon   },
]

const PHASES = ['sitting', 'rising', 'standing', 'descending']
const PHASE_LABELS_SHORT = { sitting: 'Sit', rising: 'Rise', standing: 'Stand', descending: 'Low' }
const REP_HISTORY_CAP = 10
const FEEDBACK_HOLD_MS = 4000

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
  })
  function handleLogin(patientId) {
    const u = { patientId, loggedAt: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }
  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }
  if (!user) return <Login onLogin={handleLogin} />
  return <CoachShell user={user} onLogout={handleLogout} />
}

/* -------------------- Login -------------------- */

function Login({ onLogin }) {
  const [id, setId] = useState('')
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState(null)

  function submit(e) {
    e.preventDefault()
    if (!id.trim() || !pwd.trim()) {
      setErr('Please enter your ID and password.')
      return
    }
    onLogin(id.trim().toUpperCase())
  }
  return (
    <div className="login-root">
      <div className="login-aura" />
      <div className="login-card">
        <div className="brand">
          <span className="brand-mark">arise</span>
          <span className="brand-sub">coach</span>
        </div>
        <div className="login-title">Welcome back.</div>
        <div className="login-lede">Sign in to start today's session.</div>
        <form onSubmit={submit} className="login-form">
          <label>
            <span>Patient ID</span>
            <input type="text" value={id} onChange={e => setId(e.target.value)}
                   placeholder="e.g. P-001" autoFocus />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)}
                   placeholder="••••" />
          </label>
          {err && <div className="login-err">{err}</div>}
          <button type="submit" className="btn-cta login-submit">Continue</button>
        </form>
        <div className="login-help">Any patient ID and any password. Demo only.</div>
      </div>
    </div>
  )
}

/* -------------------- Shell -------------------- */

function CoachShell({ user, onLogout }) {
  const [screen, setScreen] = useState('idle')
  const [videoId, setVideoId] = useState('luca')
  const [sessionStart, setSessionStart] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [finalReps, setFinalReps] = useState([])
  const [errorState, setErrorState] = useState(null)

  function startCalibration() { setScreen('calibrate') }
  function startSession() {
    setSessionStart(Date.now()); setElapsed(0); setScreen('active')
  }
  function endSession(repLog) {
    setFinalReps(repLog)
    saveSessionToHistory(user.patientId, {
      repLog,
      duration: (Date.now() - sessionStart) / 1000,
      videoId,
    })
    setScreen('done')
  }
  function backToIdle() { setScreen('idle') }
  function goHistory()  { setScreen('history') }
  function goSettings() { setScreen('settings') }

  useEffect(() => {
    if (screen !== 'active') return
    const id = setInterval(() => setElapsed((Date.now() - sessionStart) / 1000), 100)
    return () => clearInterval(id)
  }, [screen, sessionStart])

  const video = VIDEOS.find(v => v.id === videoId)

  return (
    <div className={`coach-root ${screen === 'active' ? 'is-active' : ''}`}>
      <header className="coach-header">
        <div className="brand">
          <span className="brand-mark">arise</span>
          <span className="brand-sub">coach</span>
        </div>
        <div className="header-right">
          {screen !== 'done' && screen !== 'active' && (
            <label className="video-pick">
              <span>Demo video</span>
              <select value={videoId} onChange={e => setVideoId(e.target.value)}>
                {VIDEOS.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
              </select>
            </label>
          )}
          {screen !== 'active' && screen !== 'calibrate' && (
            <nav className="coach-nav">
              <button className={`nav-link ${screen === 'idle' ? 'on' : ''}`}
                      onClick={backToIdle}>Today</button>
              <button className={`nav-link ${screen === 'history' ? 'on' : ''}`}
                      onClick={goHistory}>History</button>
              <button className={`nav-link ${screen === 'settings' ? 'on' : ''}`}
                      onClick={goSettings}>Settings</button>
            </nav>
          )}
          <span className="patient-tag">
            {user.patientId} · cared for by <strong>Dr. X</strong>
          </span>
          <button className="link-btn" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <main className="coach-main">
        {errorState && (
          <ErrorState
            kind={errorState.kind}
            title={errorState.title}
            body={errorState.body}
            onRetry={errorState.onRetry}
            onDismiss={() => setErrorState(null)}
          />
        )}
        {!errorState && screen === 'idle' && (
          <IdleScreen onStart={startCalibration} />
        )}
        {!errorState && screen === 'calibrate' && (
          <CalibrateScreen video={video} onReady={startSession} onCancel={backToIdle} />
        )}
        {!errorState && screen === 'active' && (
          <ActiveScreen video={video} elapsed={elapsed} onEnd={endSession} />
        )}
        {!errorState && screen === 'done' && (
          <DoneScreen repLog={finalReps} elapsed={elapsed}
                      onAgain={startCalibration} onExit={backToIdle} />
        )}
        {!errorState && screen === 'history' && (
          <HistoryScreen patientId={user.patientId} onBack={backToIdle} />
        )}
        {!errorState && screen === 'settings' && (
          <SettingsScreen user={user} onBack={backToIdle} />
        )}
      </main>
    </div>
  )
}

/* -------------------- Idle -------------------- */

function IdleScreen({ onStart }) {
  return (
    <div className="screen idle">
      <div className="breath-ring" aria-hidden />
      <div className="hello">Hello.</div>
      <div className="lede">
        Take a moment. When you're ready, we'll go through your
        sit-to-stand exercises together.
      </div>
      <button className="btn-cta" onClick={onStart}>I'm ready</button>
      <div className="tip">Sit comfortably, feet flat, arms crossed.</div>
    </div>
  )
}

/* -------------------- Active (full-bleed) -------------------- */

function ActiveScreen({ video, elapsed, onEnd }) {
  const videoRef = useRef(null)
  const [repLog, setRepLog] = useState([])
  const [activeFault, setActiveFault] = useState(null)   // {fault, n, ok}
  const [feedbackUntil, setFeedbackUntil] = useState(0)
  const [, forceTick] = useState(0)

  const { landmarks, reps, state, ready } = usePose(videoRef, {
    enabled: true,
    onRep: (n) => {
      const isFault = n % 3 === 0
      const fault = isFault ? FAULTS[Math.floor(n / 3) % FAULTS.length] : null
      setActiveFault({ fault, n, ok: !isFault })
      setFeedbackUntil(Date.now() + FEEDBACK_HOLD_MS)
      setRepLog(prev => [...prev, {
        n,
        ok: !isFault,
        fault: fault?.key || null,
        errorPhase: fault?.phase || null,
      }].slice(-50))
    }
  })

  useEffect(() => {
    if (!feedbackUntil) return
    const t = setTimeout(() => forceTick(x => x + 1), FEEDBACK_HOLD_MS + 50)
    return () => clearTimeout(t)
  }, [feedbackUntil])

  const feedbackActive = activeFault && Date.now() < feedbackUntil
  const showFault = feedbackActive && !activeFault.ok
  const showOk    = feedbackActive && activeFault.ok

  const highlightJoints = showFault ? activeFault.fault.joints : []
  const highlightColor  = showFault ? activeFault.fault.color  : null

  return (
    <div className="screen active-split">
      {/* LEFT — big video, never blocked */}
      <div className="stage-left">
        <VideoCanvas
          videoRef={videoRef}
          videoSrc={video.src}
          landmarks={landmarks}
          highlightJoints={highlightJoints}
          highlightColor={highlightColor}
        />
        {showFault && landmarks && (
          <CorrectionArrows landmarks={landmarks} fault={activeFault.fault} />
        )}

        {/* Big centre fault badge — road-sign style, overlays the video transiently */}
        {showFault && (
          <div className="fault-card"
               style={{
                 '--fault-color': activeFault.fault.color,
                 '--fault-color-soft': activeFault.fault.color + '33',
               }}>
            <div className="fault-card-icon">
              <activeFault.fault.Icon color={activeFault.fault.color} />
            </div>
            <div className="fault-card-label">{activeFault.fault.short}</div>
          </div>
        )}
        {showOk && (
          <div className="ok-card">
            <svg viewBox="0 0 64 64" className="ok-svg">
              <circle cx="32" cy="32" r="28" fill="rgba(155, 229, 200, 0.18)"
                      stroke="#9BE5C8" strokeWidth="2.5" />
              <path d="M18 32 L28 42 L46 22" fill="none"
                    stroke="#9BE5C8" strokeWidth="5"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {!ready && (
          <div className="overlay-badge loading">loading pose model…</div>
        )}
      </div>

      {/* RIGHT — sidebar with HUD elements, always on the side, never on the body */}
      <aside className="side-panel">
        <div className="hud-rep">
          <div className="hud-rep-num">{reps}</div>
          <div className="hud-rep-label">reps</div>
          <div className="hud-time">{elapsed.toFixed(1)}<span>s</span></div>
        </div>

        <PhaseTrackerText currentState={state} repLog={repLog} />

        <button className="btn-soft hud-finish" onClick={() => onEnd(repLog)}>
          I'm finished
        </button>
      </aside>
    </div>
  )
}

/* -------------------- Calibration -------------------- */

function CalibrateScreen({ video, onReady, onCancel }) {
  const videoRef = useRef(null)
  const [countdown, setCountdown] = useState(CALIBRATION_SECONDS)
  const [step, setStep] = useState('pose')
  const { landmarks, ready } = usePose(videoRef, { enabled: true })

  // Auto-advance to countdown once the participant is detected in frame.
  // Mockup heuristic: pose model has produced any landmarks for ~1.2 s of
  // continuous detection. In production this is replaced with a real
  // alignment check (head and shoulders inside the guide region, torso
  // vertical within tolerance, both feet visible).
  const [inFrameStart, setInFrameStart] = useState(0)
  useEffect(() => {
    if (step !== 'pose') return
    if (landmarks && landmarks.length > 0) {
      if (!inFrameStart) setInFrameStart(Date.now())
      else if (Date.now() - inFrameStart >= 1200) setStep('count')
    } else if (inFrameStart) {
      setInFrameStart(0)
    }
  }, [step, landmarks, inFrameStart])

  useEffect(() => {
    if (step !== 'count') return
    if (countdown <= 0) { onReady(); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [step, countdown, onReady])

  const cues = [
    'Sit upright, feet flat on the floor.',
    'Cross your arms gently over your chest.',
    'Look ahead, breathe naturally.',
  ]

  return (
    <div className="screen calibrate">
      <div className="calibrate-stage">
        <div className="calibrate-frame">
          <video ref={videoRef} className="bg-video calibrate-preview"
                 src={video.src} key={video.src}
                 autoPlay loop muted playsInline crossOrigin="anonymous" />
          <svg className="silhouette-guide" viewBox="0 0 1600 900"
               preserveAspectRatio="xMidYMid meet" aria-hidden>
            <defs>
              <linearGradient id="cal-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%"  stopColor="#9BE5C8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#6FCEAA" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <circle cx="800" cy="250" r="70"
                    fill="none" stroke="url(#cal-grad)" strokeWidth="6"
                    strokeDasharray="14 10" />
            <rect x="690" y="330" width="220" height="320" rx="60"
                  fill="none" stroke="url(#cal-grad)" strokeWidth="6"
                  strokeDasharray="14 10" />
          </svg>
          {landmarks && (
            <Skeleton landmarks={landmarks} highlightJoints={[]} highlightColor={null} />
          )}
        </div>
      </div>

      <aside className="calibrate-side">
        {step === 'pose' ? (
          <>
            <div className="cal-eyebrow">Step 1 of 2</div>
            <div className="cal-title">Let's set up.</div>
            <div className="cal-lede">
              Place yourself so your whole body fits in the frame.
              We'll start automatically once we can see you.
            </div>
            <ul className="cal-cues">
              {cues.map((c, i) => (
                <li key={i}>
                  <span className="cal-cue-num">{i + 1}</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="cal-status">
              <span className={`cal-status-dot ${inFrameStart ? 'on' : ''}`} />
              {inFrameStart
                ? 'Got you. Starting in a moment…'
                : 'Waiting for position…'}
            </div>
            <div className="cal-actions">
              <button className="btn-soft" onClick={onCancel}>Not yet</button>
            </div>
          </>
        ) : (
          <>
            <div className="cal-eyebrow">Step 2 of 2 · Hold still</div>
            <div className="cal-title">Calibrating.</div>
            <div className="cal-lede">
              Stay relaxed in the chair. We're learning your shape so the
              feedback fits you, not a generic body.
            </div>
            <div className="cal-countdown">
              <div className="cal-count-ring">
                <svg viewBox="0 0 100 100" aria-hidden>
                  <circle cx="50" cy="50" r="44" fill="none"
                          stroke="rgba(255,245,230,0.10)" strokeWidth="5" />
                  <circle cx="50" cy="50" r="44" fill="none"
                          stroke="#9BE5C8" strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 44}
                          strokeDashoffset={
                            2 * Math.PI * 44 * (1 - countdown / CALIBRATION_SECONDS)
                          }
                          transform="rotate(-90 50 50)"
                          style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
                </svg>
                <div className="cal-count-num">{countdown}</div>
              </div>
              <div className="cal-count-status">
                {ready ? 'Pose model ready' : 'Loading pose model…'}
              </div>
            </div>
            <div className="cal-actions">
              <button className="btn-soft" onClick={onCancel}>Cancel</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

/* -------------------- Done -------------------- */

function DoneScreen({ repLog, elapsed, onAgain, onExit }) {
  const reps = repLog.length
  const cleanReps = repLog.filter(r => r.ok).length
  const score = reps === 0 ? 0 : Math.round((cleanReps / reps) * 100)

  const faultTally = useMemo(() => {
    const counts = {}
    repLog.forEach(r => { if (r.fault) counts[r.fault] = (counts[r.fault] || 0) + 1 })
    return FAULTS.filter(f => counts[f.key]).map(f => ({ ...f, n: counts[f.key] }))
  }, [repLog])

  return (
    <div className="screen done">
      <div className="bloom" aria-hidden />
      <div className="hello">Beautiful work.</div>
      <div className="lede">
        You completed {reps} {reps === 1 ? 'repetition' : 'repetitions'} in {elapsed.toFixed(1)} seconds.
      </div>

      <div className="summary-row">
        <div className="summary-tile">
          <div className="summary-label">reps</div>
          <div className="summary-value">{reps}</div>
        </div>
        <div className="summary-tile">
          <div className="summary-label">clean reps</div>
          <div className="summary-value">{cleanReps}</div>
        </div>
        <div className="summary-tile">
          <div className="summary-label">form score</div>
          <div className="summary-value">{score}%</div>
        </div>
        <div className="summary-tile">
          <div className="summary-label">avg per rep</div>
          <div className="summary-value">
            {(elapsed / Math.max(reps, 1)).toFixed(2)}s
          </div>
        </div>
      </div>

      {faultTally.length > 0 && (
        <div className="done-faults">
          <div className="done-faults-title">Things to work on next time</div>
          <ul>
            {faultTally.map(f => (
              <li key={f.key}>
                <div className="done-fault-icon" style={{ color: f.color }}>
                  <f.Icon color={f.color} />
                </div>
                <div>
                  <div className="done-fault-line">
                    <strong>{f.short}</strong>
                    <span className="fault-n">× {f.n}</span>
                  </div>
                  <div className="fault-tip">{f.tip}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="done-actions">
        <button className="btn-soft" onClick={onExit}>Done for now</button>
        <button className="btn-cta" onClick={onAgain}>Another set</button>
      </div>
    </div>
  )
}

/* -------------------- History -------------------- */

function HistoryScreen({ patientId, onBack }) {
  const [history, setHistory] = useState(() => loadHistory(patientId))
  const [openId, setOpenId] = useState(null)

  function clearAll() {
    if (!window.confirm('Delete all session history on this device?')) return
    saveHistory(patientId, [])
    setHistory([])
  }

  const summary = useMemo(() => {
    if (!history.length) return null
    const totalReps   = history.reduce((s, h) => s + h.reps, 0)
    const cleanReps   = history.reduce((s, h) => s + h.cleanReps, 0)
    const avgScore    = Math.round(
      history.reduce((s, h) => s + h.score, 0) / history.length
    )
    return { sessions: history.length, totalReps, cleanReps, avgScore }
  }, [history])

  const days = useMemo(() => groupSessionsByDay(history), [history])

  return (
    <div className="screen history">
      <div className="hist-head">
        <div>
          <div className="cal-eyebrow">Your sessions</div>
          <div className="hello-sm">Looking back.</div>
          <div className="lede-sm">
            Every session you've completed on this device, grouped by day.
            Tap a session to see what happened.
          </div>
        </div>
        <div className="hist-head-actions">
          <button className="btn-soft" onClick={onBack}>Back to today</button>
          {history.length > 0 && (
            <button className="link-btn" onClick={clearAll}>Clear history</button>
          )}
        </div>
      </div>

      {summary && (
        <div className="hist-summary">
          <HistTile label="days active" value={days.length} />
          <HistTile label="sessions"    value={summary.sessions} />
          <HistTile label="clean reps"  value={summary.cleanReps} />
          <HistTile label="avg score"   value={`${summary.avgScore}%`} />
        </div>
      )}

      {history.length === 0 ? (
        <div className="hist-empty">
          <div className="hist-empty-mark">·</div>
          <div className="hist-empty-title">No sessions yet.</div>
          <div className="hist-empty-body">
            When you finish your first session, it'll appear here.
          </div>
        </div>
      ) : (
        <div className="hist-days">
          {days.map(d => (
            <section key={d.dateKey} className="hist-day">
              <header className="hist-day-head">
                <div className="hist-day-when">
                  <div className="hist-day-label">{d.relativeLabel}</div>
                  <div className="hist-day-date">{d.fullDate}</div>
                </div>
                <div className="hist-day-stats">
                  <span><strong>{d.sessions.length}</strong> session{d.sessions.length === 1 ? '' : 's'}</span>
                  <span><strong>{d.totalReps}</strong> reps</span>
                  <span><strong>{d.totalClean}</strong> clean</span>
                  <span><strong>{d.avgScore}%</strong> avg</span>
                </div>
              </header>
              <ul className="hist-list">
                {d.sessions.map((h, i) => (
                  <li key={h.id} className={`hist-row ${openId === h.id ? 'open' : ''}`}>
                    <button className="hist-row-head"
                            onClick={() => setOpenId(openId === h.id ? null : h.id)}>
                      <div className="hist-row-when">
                        <div className="hist-when-time">{formatHistTime(h.completedAt)}</div>
                        <div className="hist-when-ordinal">
                          Session {d.sessions.length - i} of {d.sessions.length}
                        </div>
                      </div>
                      <div className="hist-row-stats">
                        <span><strong>{h.reps}</strong> reps</span>
                        <span><strong>{h.cleanReps}</strong> clean</span>
                        <span><strong>{h.score}%</strong> form</span>
                        <span>{h.duration.toFixed(1)}s</span>
                      </div>
                      <span className="hist-caret">{openId === h.id ? '▾' : '▸'}</span>
                    </button>
                    {openId === h.id && (
                      <div className="hist-row-body">
                        {h.faults.length === 0 ? (
                          <div className="hist-no-faults">Clean session, no flags.</div>
                        ) : (
                          <ul className="hist-faults">
                            {h.faults.map(f => (
                              <li key={f.key}>
                                <strong>{f.short}</strong>
                                <span className="fault-n">× {f.n}</span>
                                <span className="fault-tip">{f.tip}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function groupSessionsByDay(history) {
  const map = new Map()
  history.forEach(h => {
    const d = new Date(h.completedAt)
    const key = d.toISOString().slice(0, 10)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(h)
  })
  const today = new Date()
  const todayKey = today.toISOString().slice(0, 10)
  const yKey    = new Date(today.getTime() - 86400000).toISOString().slice(0, 10)

  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([dateKey, sessions]) => {
      const sorted    = [...sessions].sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1))
      const totalReps  = sorted.reduce((s, h) => s + h.reps, 0)
      const totalClean = sorted.reduce((s, h) => s + h.cleanReps, 0)
      const avgScore   = Math.round(sorted.reduce((s, h) => s + h.score, 0) / sorted.length)
      let relativeLabel
      if (dateKey === todayKey)      relativeLabel = 'Today'
      else if (dateKey === yKey)     relativeLabel = 'Yesterday'
      else                            relativeLabel = formatRelativeLabel(dateKey)
      const fullDate = new Date(dateKey).toLocaleDateString(undefined, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
      return {
        dateKey, relativeLabel, fullDate,
        sessions: sorted, totalReps, totalClean, avgScore,
      }
    })
}

function formatRelativeLabel(dateKey) {
  const target = new Date(dateKey)
  const days = Math.round((Date.now() - target.getTime()) / 86400000)
  if (days < 7)  return target.toLocaleDateString(undefined, { weekday: 'long' })
  if (days < 30) return `${days} days ago`
  return target.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function HistTile({ label, value }) {
  return (
    <div className="hist-tile">
      <div className="hist-tile-val">{value}</div>
      <div className="hist-tile-lab">{label}</div>
    </div>
  )
}

/* -------------------- Settings -------------------- */

function SettingsScreen({ user, onBack }) {
  const [s, setS] = useState(() => loadSettings())
  const [savedAt, setSavedAt] = useState(0)

  function update(patch) {
    const next = { ...s, ...patch }
    setS(next)
    saveSettings(next)
    setSavedAt(Date.now())
  }

  return (
    <div className="screen settings">
      <div className="hist-head">
        <div>
          <div className="cal-eyebrow">Preferences</div>
          <div className="hello-sm">Make it yours.</div>
          <div className="lede-sm">
            Changes save automatically and stay on this device.
          </div>
        </div>
        <div className="hist-head-actions">
          <button className="btn-soft" onClick={onBack}>Back to today</button>
          {savedAt > 0 && <span className="saved-tag">Saved ✓</span>}
        </div>
      </div>

      <section className="settings-card">
        <div className="settings-card-title">Your profile</div>
        <div className="settings-row">
          <label className="settings-label">Patient ID</label>
          <div className="settings-static">{user.patientId}</div>
        </div>
        <div className="settings-row">
          <label className="settings-label">Display name (optional)</label>
          <input className="settings-input" type="text"
                 placeholder="What should we call you?"
                 value={s.displayName}
                 onChange={e => update({ displayName: e.target.value })} />
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-title">Coach experience</div>
        <ToggleRow label="Spoken cues and sounds"
                   hint="A gentle chime when a rep is clean, a soft tone on a flag."
                   checked={s.sound}
                   onChange={v => update({ sound: v })} />
        <ToggleRow label="High contrast"
                   hint="Stronger colors and thicker outlines."
                   checked={s.highContrast}
                   onChange={v => update({ highContrast: v })} />
        <div className="settings-row">
          <label className="settings-label">Text size</label>
          <select className="settings-select" value={s.fontScale}
                  onChange={e => update({ fontScale: e.target.value })}>
            <option value="regular">Regular</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra large</option>
          </select>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-title">Capture</div>
        <div className="settings-row">
          <label className="settings-label">Camera</label>
          <select className="settings-select" value={s.cameraId}
                  onChange={e => update({ cameraId: e.target.value })}>
            <option value="default">System default</option>
            <option value="front">Front facing</option>
            <option value="rear">Rear facing</option>
          </select>
        </div>
        <div className="settings-row">
          <label className="settings-label">Motion sensitivity</label>
          <select className="settings-select" value={s.motionSensitivity}
                  onChange={e => update({ motionSensitivity: e.target.value })}>
            <option value="gentle">Gentle (fewer flags)</option>
            <option value="standard">Standard</option>
            <option value="strict">Strict (more flags)</option>
          </select>
        </div>
      </section>
    </div>
  )
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <div className="settings-row toggle-row">
      <div>
        <div className="settings-label">{label}</div>
        {hint && <div className="settings-hint">{hint}</div>}
      </div>
      <button className={`toggle ${checked ? 'on' : ''}`}
              role="switch" aria-checked={checked}
              onClick={() => onChange(!checked)}>
        <span className="toggle-knob" />
      </button>
    </div>
  )
}

/* -------------------- Error state -------------------- */

function ErrorState({ kind, title, body, onRetry, onDismiss }) {
  const icon = ERROR_ICON[kind] || ERROR_ICON.generic
  return (
    <div className="screen err">
      <div className="err-card">
        <div className="err-icon">{icon}</div>
        <div className="err-title">{title}</div>
        <div className="err-body">{body}</div>
        <div className="err-actions">
          {onDismiss && (
            <button className="btn-soft" onClick={onDismiss}>Dismiss</button>
          )}
          {onRetry && (
            <button className="btn-cta" onClick={onRetry}>Try again</button>
          )}
        </div>
      </div>
    </div>
  )
}

const ERROR_ICON = {
  camera: (
    <svg viewBox="0 0 64 64" fill="none" stroke="#FFB6A6" strokeWidth="3"
         strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="18" width="48" height="32" rx="6" />
      <circle cx="32" cy="34" r="9" />
      <line x1="12" y1="12" x2="52" y2="52" stroke="#FF7A88" />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 64 64" fill="none" stroke="#F2C879" strokeWidth="3"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 28 Q32 8 54 28" />
      <path d="M18 36 Q32 22 46 36" />
      <path d="M26 44 Q32 38 38 44" />
      <circle cx="32" cy="52" r="3" fill="#F2C879" stroke="none" />
    </svg>
  ),
  pose: (
    <svg viewBox="0 0 64 64" fill="none" stroke="#9BE5C8" strokeWidth="3"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="16" r="6" />
      <line x1="32" y1="22" x2="32" y2="44" />
      <line x1="22" y1="30" x2="42" y2="30" />
      <line x1="32" y1="44" x2="24" y2="56" />
      <line x1="32" y1="44" x2="40" y2="56" />
    </svg>
  ),
  generic: (
    <svg viewBox="0 0 64 64" fill="none" stroke="#FFB6A6" strokeWidth="3"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="22" />
      <line x1="32" y1="22" x2="32" y2="34" />
      <circle cx="32" cy="42" r="1.5" fill="#FFB6A6" stroke="none" />
    </svg>
  ),
}

/* -------------------- History / settings storage -------------------- */

function loadHistory(patientId) {
  try {
    const raw = localStorage.getItem(`${HISTORY_KEY}.${patientId}`)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

function saveHistory(patientId, history) {
  try {
    localStorage.setItem(`${HISTORY_KEY}.${patientId}`, JSON.stringify(history))
  } catch {}
}

function saveSessionToHistory(patientId, { repLog, duration, videoId }) {
  const reps      = repLog.length
  const cleanReps = repLog.filter(r => r.ok).length
  const score     = reps === 0 ? 0 : Math.round((cleanReps / reps) * 100)
  const counts    = {}
  repLog.forEach(r => { if (r.fault) counts[r.fault] = (counts[r.fault] || 0) + 1 })
  const faults = FAULTS
    .filter(f => counts[f.key])
    .map(f => ({ key: f.key, short: f.short, tip: f.tip, n: counts[f.key] }))
  const session = {
    id: `s-${Date.now()}`,
    completedAt: new Date().toISOString(),
    videoId, duration, reps, cleanReps, score, faults,
  }
  const current = loadHistory(patientId)
  saveHistory(patientId, [session, ...current].slice(0, 100))
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch { return { ...DEFAULT_SETTINGS } }
}

function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) } catch {}
}

function formatHistDate(iso) {
  return new Date(iso).toLocaleDateString(undefined,
    { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatHistTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined,
    { hour: '2-digit', minute: '2-digit' })
}

/* ==========================================================
   Phase tracker — clear text labels for the 4 STS phases
   ========================================================== */

const PHASE_LABELS = {
  sitting:    'Sitting',
  rising:     'Rising',
  standing:   'Standing',
  descending: 'Lowering',
}

function PhaseTrackerText({ currentState, repLog }) {
  const lastRep = repLog[repLog.length - 1] || null
  const cleanCount = repLog.filter(r => r.ok).length

  // Determine quality per phase based on the last rep:
  //   'clean'   — last rep finished without an error in this phase
  //   'error'   — last rep flagged this specific phase
  //   'pristine'— no rep yet
  function statusFor(phase) {
    if (!lastRep) return 'pristine'
    if (!lastRep.ok && lastRep.errorPhase === phase) return 'error'
    return 'clean'
  }

  return (
    <div className="phase-panel">
      <div className="panel-title">
        Phase
        <span className="panel-aside">
          {lastRep ? `last rep: #${lastRep.n}` : 'waiting'}
        </span>
      </div>
      <div className="phase-row">
        {PHASES.map((p, i) => {
          const active = p === currentState
          const status = statusFor(p)
          const fault  = status === 'error'
            ? FAULTS.find(f => f.key === lastRep.fault)
            : null
          const accentColor = fault?.color
          return (
            <div key={p} className="phase-item">
              <div
                className={`phase-pill ${active ? 'on' : ''} status-${status}`}
                style={accentColor ? { '--accent': accentColor } : undefined}
              >
                <span className="phase-num">{i + 1}</span>
                <span className="phase-label">{PHASE_LABELS[p]}</span>
                <span className={`phase-status status-${status}`}>
                  {status === 'clean' && '✓'}
                  {status === 'error' && '!'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="phase-summary">
        {repLog.length === 0
          ? 'Begin when ready.'
          : `${cleanCount} of ${repLog.length} reps clean.`}
      </div>
    </div>
  )
}

/* ==========================================================
   Rep dots — one COLUMN per rep, one ROW per STS phase.
   Default = mint dots. If a rep had an error in a given phase,
   ONLY that phase's dot is coloured (with the fault hue). The other
   three phases stay clean so the eye reads "error in rising" at a glance.
   ========================================================== */

function RepDotsLabelled({ repLog }) {
  const recent = repLog.slice(-REP_HISTORY_CAP)
  const goodCount = recent.filter(r => r.ok).length
  const badCount  = recent.length - goodCount

  return (
    <div className="rep-dots-panel">
      <div className="panel-title">
        Recent reps
        <span className="panel-aside">last {REP_HISTORY_CAP}</span>
      </div>
      {recent.length === 0 ? (
        <div className="rep-grid-empty">No reps yet. Begin when ready.</div>
      ) : (
        <div className="rep-grid"
             style={{ '--rep-cols': recent.length }}>
          {/* Column header — rep numbers */}
          <div className="rep-grid-row rep-grid-head">
            <div className="rep-grid-label"></div>
            <div className="rep-grid-cells">
              {recent.map(slot => (
                <div key={slot.n} className="rep-num">{slot.n}</div>
              ))}
            </div>
          </div>
          {/* One row per phase */}
          {PHASES.map((phase) => (
            <div key={phase} className="rep-grid-row">
              <div className="rep-grid-label">{PHASE_LABELS_SHORT[phase]}</div>
              <div className="rep-grid-cells">
                {recent.map((slot) => {
                  const isErrorHere = !slot.ok && slot.errorPhase === phase
                  const fault = isErrorHere ? FAULTS.find(f => f.key === slot.fault) : null
                  return (
                    <span
                      key={slot.n}
                      className={`rdh ${isErrorHere ? 'bad' : 'ok'}`}
                      style={isErrorHere && fault ? { background: fault.color } : undefined}
                      title={
                        isErrorHere
                          ? `Rep ${slot.n}: ${fault?.short || 'flagged'} during ${PHASE_LABELS_SHORT[phase]}`
                          : `Rep ${slot.n}: ${PHASE_LABELS_SHORT[phase]} clean`
                      }
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="rep-dots-legend">
        <span className="lg"><i className="lg-dot ok" /> Clean phase</span>
        <span className="lg"><i className="lg-dot bad" /> Error here</span>
        <span className="lg total">{goodCount}/{recent.length} clean reps</span>
      </div>
    </div>
  )
}

/* ==========================================================
   Video stage + skeleton overlay
   ========================================================== */

function VideoCanvas({ videoRef, videoSrc, landmarks, highlightJoints, highlightColor }) {
  const [missing, setMissing] = useState(false)
  useEffect(() => { setMissing(false) }, [videoSrc])

  return (
    <div className="video-wrap">
      <div className="video-frame">
        <video ref={videoRef} className="bg-video" src={videoSrc} key={videoSrc}
               autoPlay loop muted playsInline crossOrigin="anonymous"
               onError={() => setMissing(true)} />
        {missing && (
          <div className="video-placeholder">
            <div className="cam-label">No video loaded</div>
            <div className="cam-sub">
              Drop a file at <code>apps/coach/public{videoSrc}</code>.
            </div>
          </div>
        )}
        {landmarks && (
          <Skeleton landmarks={landmarks}
                    highlightJoints={highlightJoints}
                    highlightColor={highlightColor} />
        )}
      </div>
    </div>
  )
}

/* ViewBox is 16:9 (1600 x 900). preserveAspectRatio="xMidYMid meet" so the
   SVG fits + centers inside its container exactly like the video's
   object-fit: contain — they overlap pixel-perfectly. */
const VB_W = 1600, VB_H = 900

function Skeleton({ landmarks, highlightJoints, highlightColor }) {
  const isHighlighting = highlightJoints?.length > 0
  const color    = isHighlighting ? '#FF7A88' : '#9BE5C8'
  const colorDk  = isHighlighting ? '#D14E5C' : '#5FB394'
  const glow     = isHighlighting ? 'rgba(255, 122, 136, 0.55)' : 'rgba(155, 229, 200, 0.55)'

  const pts = landmarks.map((p) => ({
    x: p.x * VB_W, y: p.y * VB_H, v: p.visibility ?? 1,
  }))
  const highlightSet = new Set((highlightJoints || []).map(k => KP[k]))

  return (
    <svg className="skeleton-overlay"
         viewBox={`0 0 ${VB_W} ${VB_H}`}
         preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="bone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor={color}   stopOpacity="1" />
          <stop offset="100%" stopColor={colorDk} stopOpacity="0.9" />
        </linearGradient>
        <filter id="sk-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="hl-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>

      {/* Joint-highlight pulse on problem joints */}
      {[...highlightSet].map((idx) => {
        const p = pts[idx]
        if (!p || p.v < 0.4) return null
        return (
          <circle key={`hl-${idx}`} cx={p.x} cy={p.y} r="60"
                  fill={highlightColor || '#FF7A88'}
                  fillOpacity="0.4"
                  style={{ filter: 'url(#hl-glow)' }}>
            <animate attributeName="r" values="48;80;48" dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.55;0.15;0.55" dur="1.1s" repeatCount="indefinite" />
          </circle>
        )
      })}

      {/* Soft outer glow on bones */}
      <g style={{ filter: 'url(#sk-glow)' }} opacity="0.45">
        {BONES.map(([a, b], i) => {
          const pa = pts[a], pb = pts[b]
          if (!pa || !pb || pa.v < 0.4 || pb.v < 0.4) return null
          return (
            <line key={`g-${i}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                  stroke={glow} strokeWidth="18" strokeLinecap="round" />
          )
        })}
      </g>
      {/* Bones — finer */}
      {BONES.map(([a, b], i) => {
        const pa = pts[a], pb = pts[b]
        if (!pa || !pb || pa.v < 0.4 || pb.v < 0.4) return null
        return (
          <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke="url(#bone-grad)" strokeWidth="6.5"
                strokeLinecap="round" />
        )
      })}
      {/* Joints — smaller, more elegant */}
      {Object.values(KP).map((idx) => {
        const p = pts[idx]
        if (!p || p.v < 0.4) return null
        return (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="7"
                    fill="white" opacity="0.95" />
            <circle cx={p.x} cy={p.y} r="4.5"
                    fill={color} />
          </g>
        )
      })}
    </svg>
  )
}

/* ==========================================================
   Correction arrows drawn directly on the skeleton.
   For each fault we anchor arrows to the actual MediaPipe joint
   positions and pulse them so the eye is drawn from far away.
   ========================================================== */

function CorrectionArrows({ landmarks, fault }) {
  const pts = landmarks.map(p => ({
    x: p.x * VB_W, y: p.y * VB_H, v: p.visibility ?? 1,
  }))

  let elements = null

  if (fault.key === 'valgus') {
    const lk = pts[KP.lKnee], rk = pts[KP.rKnee]
    if (visible(lk) && visible(rk)) {
      elements = (
        <>
          <PulseArrow tail={lk} dx={-110} dy={0} color={fault.color} />
          <PulseArrow tail={rk} dx={+110} dy={0} color={fault.color} />
        </>
      )
    }
  }
  if (fault.key === 'trunk') {
    const mid = mid2(pts[KP.lShoulder], pts[KP.rShoulder])
    if (mid) {
      elements = <PulseArrow tail={mid} dx={0} dy={-160} color={fault.color} />
    }
  }
  if (fault.key === 'asym') {
    const la = pts[KP.lAnkle], ra = pts[KP.rAnkle]
    if (visible(la) && visible(ra)) {
      // Downward arrows on each foot — "press equally into the floor"
      elements = (
        <>
          <PulseArrow tail={{ x: la.x, y: la.y - 120 }} dx={0} dy={+90} color={fault.color} />
          <PulseArrow tail={{ x: ra.x, y: ra.y - 120 }} dx={0} dy={+90} color={fault.color} />
        </>
      )
    }
  }
  if (fault.key === 'slow') {
    const lh = pts[KP.lHip], rh = pts[KP.rHip]
    const mid = mid2(lh, rh)
    if (mid) {
      elements = <PulseArrow tail={mid} dx={0} dy={+110} color={fault.color} />
    }
  }
  if (!elements) return null

  return (
    <svg className="arrows-overlay"
         viewBox={`0 0 ${VB_W} ${VB_H}`}
         preserveAspectRatio="xMidYMid meet">
      {elements}
    </svg>
  )
}

function visible(p) { return p && (p.v ?? 1) >= 0.4 }
function mid2(a, b) {
  if (!visible(a) || !visible(b)) return null
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, v: Math.min(a.v ?? 1, b.v ?? 1) }
}

function PulseArrow({ tail, dx, dy, color }) {
  const len = Math.hypot(dx, dy)
  const ux = dx / len, uy = dy / len
  const startGap = 26
  const startX = tail.x + ux * startGap
  const startY = tail.y + uy * startGap
  const endX = startX + ux * (len - startGap)
  const endY = startY + uy * (len - startGap)
  const headLen = 32
  const headHalfW = 22
  const px = -uy, py = ux
  const baseX = endX - ux * headLen
  const baseY = endY - uy * headLen
  const headLeft  = `${baseX + px * headHalfW},${baseY + py * headHalfW}`
  const headRight = `${baseX - px * headHalfW},${baseY - py * headHalfW}`
  const head = `M ${endX} ${endY} L ${headLeft} L ${headRight} Z`

  return (
    <g>
      <g style={{ filter: 'blur(8px)' }} opacity="0.7">
        <line x1={startX} y1={startY} x2={endX} y2={endY}
              stroke={color} strokeWidth="36" strokeLinecap="round" />
        <path d={head} fill={color} stroke={color} strokeWidth="20" strokeLinejoin="round" />
      </g>
      <line x1={startX} y1={startY} x2={endX} y2={endY}
            stroke={color} strokeWidth="22" strokeLinecap="round">
        <animate attributeName="stroke-width" values="16;28;16"
                 dur="0.9s" repeatCount="indefinite" />
      </line>
      <path d={head} fill={color} stroke={color} strokeWidth="8" strokeLinejoin="round" />
    </g>
  )
}

/* ==========================================================
   Fault iconography (used in the center badge + Done screen)
   ========================================================== */

function ValgusIcon({ color }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3.5"
         strokeLinecap="round" strokeLinejoin="round">
      <line x1="24" y1="12" x2="22" y2="50" />
      <line x1="40" y1="12" x2="42" y2="50" />
      <line x1="22" y1="12" x2="42" y2="12" />
      <path d="M14 32 L8 32 M8 32 L12 28 M8 32 L12 36" />
      <path d="M50 32 L56 32 M56 32 L52 28 M56 32 L52 36" />
    </svg>
  )
}
function TrunkIcon({ color }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3.5"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="14" r="5" />
      <line x1="32" y1="20" x2="32" y2="46" />
      <line x1="24" y1="24" x2="40" y2="24" />
      <line x1="26" y1="44" x2="38" y2="44" />
      <path d="M52 50 L52 22 M48 26 L52 22 L56 26" />
    </svg>
  )
}
function AsymIcon({ color }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3.5"
         strokeLinecap="round" strokeLinejoin="round">
      <line x1="32" y1="14" x2="32" y2="44" />
      <line x1="14" y1="44" x2="50" y2="44" />
      <ellipse cx="18" cy="50" rx="6" ry="3" />
      <ellipse cx="46" cy="50" rx="6" ry="3" />
      <line x1="14" y1="40" x2="22" y2="40" />
      <line x1="42" y1="40" x2="50" y2="40" />
    </svg>
  )
}
function SlowIcon({ color }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3.5"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="20" />
      <line x1="32" y1="32" x2="32" y2="20" />
      <line x1="32" y1="32" x2="42" y2="36" />
    </svg>
  )
}
