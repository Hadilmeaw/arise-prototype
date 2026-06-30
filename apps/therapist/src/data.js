/* Fake fixtures for the D2.2 skeleton.
   In WP3 this file is replaced by an API client hitting ECS Fargate. */

export const ERROR_TYPES = [
  { key: 'valgus',   label: 'Knee valgus',      color: '#E76A5A' },
  { key: 'trunk',    label: 'Trunk lean',       color: '#E1A24A' },
  { key: 'asym',     label: 'L/R asymmetry',    color: '#6F9DDE' },
  { key: 'slow',     label: 'Slow descent',     color: '#9F7BD1' },
  { key: 'incomplete', label: 'Incomplete rise', color: '#5DB3A4' },
]

export const PATIENTS = [
  { id: 'P-001', name: 'M. R.', age: 72, dx: 'Post-stroke, Lt hemiparesis', sessions: 12, lastFTSS: 14.2, trend: 'down', adherence: 0.92, openFlags: 1,
    errors: { valgus: 8,  trunk: 2,  asym: 14, slow: 4,  incomplete: 1 } },
  { id: 'P-002', name: 'G. B.', age: 68, dx: 'Knee OA, post-TKA',           sessions:  8, lastFTSS: 18.6, trend: 'flat', adherence: 0.74, openFlags: 0,
    errors: { valgus: 11, trunk: 3,  asym: 2,  slow: 6,  incomplete: 0 } },
  { id: 'P-003', name: 'L. C.', age: 75, dx: 'Sarcopenia, frailty',         sessions: 21, lastFTSS: 22.4, trend: 'up',   adherence: 0.51, openFlags: 3,
    errors: { valgus: 4,  trunk: 6,  asym: 5,  slow: 18, incomplete: 9 } },
  { id: 'P-004', name: 'A. G.', age: 64, dx: 'Hip replacement (R)',         sessions:  4, lastFTSS: 16.0, trend: 'down', adherence: 0.88, openFlags: 0,
    errors: { valgus: 2,  trunk: 1,  asym: 6,  slow: 2,  incomplete: 0 } },
  { id: 'P-005', name: 'S. M.', age: 81, dx: 'Parkinson, H&Y 2',            sessions: 17, lastFTSS: 24.8, trend: 'up',   adherence: 0.66, openFlags: 2,
    errors: { valgus: 3,  trunk: 9,  asym: 4,  slow: 12, incomplete: 7 } },
  { id: 'P-006', name: 'F. T.', age: 70, dx: 'Lower back pain, chronic',    sessions:  9, lastFTSS: 17.1, trend: 'down', adherence: 0.81, openFlags: 0,
    errors: { valgus: 1,  trunk: 14, asym: 2,  slow: 3,  incomplete: 0 } },
  { id: 'P-007', name: 'E. V.', age: 78, dx: 'Knee OA, bilateral',          sessions: 14, lastFTSS: 19.5, trend: 'flat', adherence: 0.72, openFlags: 1,
    errors: { valgus: 16, trunk: 4,  asym: 3,  slow: 5,  incomplete: 1 } },
  { id: 'P-008', name: 'R. P.', age: 66, dx: 'Post-COVID deconditioning',   sessions:  6, lastFTSS: 15.3, trend: 'down', adherence: 0.95, openFlags: 0,
    errors: { valgus: 1,  trunk: 1,  asym: 0,  slow: 2,  incomplete: 0 } },
]

export const SESSIONS = [
  /* P-001 — three sessions today, two on the 14th */
  { id: 'S-1042', patient: 'P-001', date: '2026-06-18', reps: 5, ftss: 14.0, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Afternoon set. Best of the day.' },
  { id: 'S-1042b', patient: 'P-001', date: '2026-06-18', reps: 5, ftss: 14.4, flags: { valgus: 1, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Midday set, mild fatigue.' },
  { id: 'S-1042c', patient: 'P-001', date: '2026-06-18', reps: 4, ftss: 15.1, flags: { valgus: 0, trunk: 1, asym: 0, slow: 0, incomplete: 1 }, notes: 'Morning set, stopped early.' },
  { id: 'S-1031', patient: 'P-001', date: '2026-06-14', reps: 5, ftss: 15.0, flags: { valgus: 1, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Valgus on rep 4.' },
  { id: 'S-1031b', patient: 'P-001', date: '2026-06-14', reps: 5, ftss: 15.6, flags: { valgus: 0, trunk: 1, asym: 0, slow: 0, incomplete: 0 }, notes: 'Second set later in day.' },
  { id: 'S-1020', patient: 'P-001', date: '2026-06-10', reps: 5, ftss: 15.8, flags: { valgus: 0, trunk: 2, asym: 0, slow: 0, incomplete: 0 }, notes: 'Trunk lean; coach prompted twice.' },
  { id: 'S-1010', patient: 'P-001', date: '2026-06-07', reps: 5, ftss: 16.4, flags: { valgus: 1, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Slow descent.' },
  { id: 'S-0998', patient: 'P-001', date: '2026-06-03', reps: 4, ftss: 18.1, flags: { valgus: 0, trunk: 0, asym: 1, slow: 1, incomplete: 1 }, notes: 'Stopped early. Fatigue.' },
  /* P-002 — two sessions today */
  { id: 'S-1045', patient: 'P-002', date: '2026-06-18', reps: 5, ftss: 18.6, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Steady.' },
  { id: 'S-1045b', patient: 'P-002', date: '2026-06-18', reps: 5, ftss: 19.1, flags: { valgus: 1, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Repeat set, slight valgus.' },
  { id: 'S-1035', patient: 'P-002', date: '2026-06-15', reps: 5, ftss: 18.8, flags: { valgus: 1, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Hand on thigh once.' },
  { id: 'S-1024', patient: 'P-002', date: '2026-06-11', reps: 5, ftss: 19.0, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: '' },
  /* P-003 — two sessions on the 17th */
  { id: 'S-1041', patient: 'P-003', date: '2026-06-17', reps: 4, ftss: 22.4, flags: { valgus: 0, trunk: 1, asym: 1, slow: 0, incomplete: 0 }, notes: 'Asymmetry on rep 3.' },
  { id: 'S-1041b', patient: 'P-003', date: '2026-06-17', reps: 3, ftss: 23.7, flags: { valgus: 0, trunk: 2, asym: 1, slow: 1, incomplete: 1 }, notes: 'Repeat set, more fatigue.' },
  { id: 'S-1029', patient: 'P-003', date: '2026-06-13', reps: 4, ftss: 21.8, flags: { valgus: 0, trunk: 2, asym: 0, slow: 1, incomplete: 0 }, notes: 'Trunk lean.' },
  { id: 'S-1015', patient: 'P-003', date: '2026-06-09', reps: 5, ftss: 20.9, flags: { valgus: 0, trunk: 0, asym: 1, slow: 1, incomplete: 0 }, notes: '' },
  /* P-004 — two sessions today */
  { id: 'S-1044', patient: 'P-004', date: '2026-06-18', reps: 5, ftss: 16.0, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Good follow-through.' },
  { id: 'S-1044b', patient: 'P-004', date: '2026-06-18', reps: 5, ftss: 15.7, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Even cleaner second set.' },
  { id: 'S-1033', patient: 'P-004', date: '2026-06-15', reps: 5, ftss: 16.6, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: '' },
  /* P-005 */
  { id: 'S-1040', patient: 'P-005', date: '2026-06-17', reps: 4, ftss: 24.8, flags: { valgus: 0, trunk: 1, asym: 0, slow: 1, incomplete: 0 }, notes: 'Slow rise on rep 3.' },
  { id: 'S-1028', patient: 'P-005', date: '2026-06-13', reps: 4, ftss: 25.2, flags: { valgus: 0, trunk: 0, asym: 0, slow: 1, incomplete: 0 }, notes: '' },
  /* P-006 */
  { id: 'S-1043', patient: 'P-006', date: '2026-06-18', reps: 5, ftss: 17.1, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: '' },
  /* P-007 */
  { id: 'S-1039', patient: 'P-007', date: '2026-06-17', reps: 5, ftss: 19.5, flags: { valgus: 1, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Valgus on rep 2.' },
  /* P-008 — two sessions today */
  { id: 'S-1046', patient: 'P-008', date: '2026-06-18', reps: 5, ftss: 15.3, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Excellent progress.' },
  { id: 'S-1046b', patient: 'P-008', date: '2026-06-18', reps: 5, ftss: 15.0, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: 'Second set, even faster.' },
  { id: 'S-1037', patient: 'P-008', date: '2026-06-16', reps: 5, ftss: 15.9, flags: { valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: '' },
  { id: 'S-1026', patient: 'P-008', date: '2026-06-12', reps: 5, ftss: 16.5, flags: { valgus: 1, trunk: 0, asym: 0, slow: 0, incomplete: 0 }, notes: '' },
]

/* Per-patient FTSS series for the trend chart (oldest → newest). */
export const FTSS_SERIES = {
  'P-001': [22.0, 20.4, 19.1, 18.1, 16.4, 15.8, 15.0, 14.2],
  'P-002': [21.2, 20.5, 19.6, 19.0, 18.8, 18.6],
  'P-003': [18.2, 19.0, 19.8, 20.4, 20.9, 21.8, 22.4],
  'P-004': [18.6, 17.4, 16.6, 16.0],
  'P-005': [22.1, 22.8, 23.5, 24.0, 25.2, 24.8],
  'P-006': [20.0, 19.2, 18.4, 17.6, 17.1],
  'P-007': [19.0, 19.2, 19.4, 19.5],
  'P-008': [19.1, 17.8, 16.5, 15.9, 15.3],
}

/* Per-patient per-week error counts for the last 8 weeks (oldest → newest). */
export const ERROR_TIMELINE = {
  'P-001': [
    { week: 'W-15', valgus: 3, trunk: 1, asym: 5, slow: 1, incomplete: 1 },
    { week: 'W-16', valgus: 2, trunk: 0, asym: 3, slow: 1, incomplete: 0 },
    { week: 'W-17', valgus: 1, trunk: 1, asym: 2, slow: 1, incomplete: 0 },
    { week: 'W-18', valgus: 1, trunk: 0, asym: 2, slow: 0, incomplete: 0 },
    { week: 'W-19', valgus: 1, trunk: 0, asym: 1, slow: 1, incomplete: 0 },
    { week: 'W-20', valgus: 0, trunk: 0, asym: 1, slow: 0, incomplete: 0 },
    { week: 'W-21', valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 },
    { week: 'W-22', valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 },
  ],
  'P-002': [
    { week: 'W-15', valgus: 3, trunk: 1, asym: 0, slow: 2, incomplete: 0 },
    { week: 'W-16', valgus: 2, trunk: 0, asym: 1, slow: 1, incomplete: 0 },
    { week: 'W-17', valgus: 2, trunk: 1, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-18', valgus: 1, trunk: 0, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-19', valgus: 1, trunk: 1, asym: 1, slow: 0, incomplete: 0 },
    { week: 'W-20', valgus: 1, trunk: 0, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-21', valgus: 1, trunk: 0, asym: 0, slow: 0, incomplete: 0 },
    { week: 'W-22', valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 },
  ],
  'P-003': [
    { week: 'W-15', valgus: 0, trunk: 0, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-16', valgus: 1, trunk: 0, asym: 0, slow: 2, incomplete: 1 },
    { week: 'W-17', valgus: 0, trunk: 1, asym: 1, slow: 2, incomplete: 1 },
    { week: 'W-18', valgus: 0, trunk: 1, asym: 1, slow: 3, incomplete: 1 },
    { week: 'W-19', valgus: 1, trunk: 1, asym: 0, slow: 2, incomplete: 2 },
    { week: 'W-20', valgus: 1, trunk: 1, asym: 1, slow: 3, incomplete: 1 },
    { week: 'W-21', valgus: 0, trunk: 1, asym: 1, slow: 2, incomplete: 2 },
    { week: 'W-22', valgus: 1, trunk: 1, asym: 1, slow: 3, incomplete: 1 },
  ],
  'P-004': [
    { week: 'W-19', valgus: 1, trunk: 1, asym: 3, slow: 1, incomplete: 0 },
    { week: 'W-20', valgus: 1, trunk: 0, asym: 2, slow: 1, incomplete: 0 },
    { week: 'W-21', valgus: 0, trunk: 0, asym: 1, slow: 0, incomplete: 0 },
    { week: 'W-22', valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 },
  ],
  'P-005': [
    { week: 'W-15', valgus: 0, trunk: 2, asym: 1, slow: 2, incomplete: 1 },
    { week: 'W-16', valgus: 1, trunk: 1, asym: 0, slow: 1, incomplete: 1 },
    { week: 'W-17', valgus: 0, trunk: 2, asym: 1, slow: 2, incomplete: 1 },
    { week: 'W-18', valgus: 0, trunk: 1, asym: 0, slow: 2, incomplete: 1 },
    { week: 'W-19', valgus: 1, trunk: 1, asym: 1, slow: 1, incomplete: 1 },
    { week: 'W-20', valgus: 1, trunk: 1, asym: 0, slow: 2, incomplete: 1 },
    { week: 'W-21', valgus: 0, trunk: 1, asym: 1, slow: 1, incomplete: 1 },
    { week: 'W-22', valgus: 0, trunk: 0, asym: 0, slow: 1, incomplete: 0 },
  ],
  'P-006': [
    { week: 'W-17', valgus: 0, trunk: 4, asym: 1, slow: 1, incomplete: 0 },
    { week: 'W-18', valgus: 0, trunk: 3, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-19', valgus: 1, trunk: 2, asym: 1, slow: 0, incomplete: 0 },
    { week: 'W-20', valgus: 0, trunk: 2, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-21', valgus: 0, trunk: 2, asym: 0, slow: 0, incomplete: 0 },
    { week: 'W-22', valgus: 0, trunk: 1, asym: 0, slow: 0, incomplete: 0 },
  ],
  'P-007': [
    { week: 'W-15', valgus: 4, trunk: 1, asym: 1, slow: 1, incomplete: 0 },
    { week: 'W-16', valgus: 3, trunk: 0, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-17', valgus: 2, trunk: 1, asym: 1, slow: 0, incomplete: 1 },
    { week: 'W-18', valgus: 2, trunk: 0, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-19', valgus: 2, trunk: 1, asym: 0, slow: 0, incomplete: 0 },
    { week: 'W-20', valgus: 1, trunk: 0, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-21', valgus: 1, trunk: 1, asym: 1, slow: 1, incomplete: 0 },
    { week: 'W-22', valgus: 1, trunk: 0, asym: 0, slow: 0, incomplete: 0 },
  ],
  'P-008': [
    { week: 'W-19', valgus: 1, trunk: 0, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-20', valgus: 0, trunk: 1, asym: 0, slow: 1, incomplete: 0 },
    { week: 'W-21', valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 },
    { week: 'W-22', valgus: 0, trunk: 0, asym: 0, slow: 0, incomplete: 0 },
  ],
}

/* Weekly caseload-wide totals (last 8 weeks). */
export const WEEKLY = [
  { week: 'W-15', sessions: 18, completed: 16, flags: 5 },
  { week: 'W-16', sessions: 22, completed: 19, flags: 7 },
  { week: 'W-17', sessions: 25, completed: 23, flags: 4 },
  { week: 'W-18', sessions: 27, completed: 24, flags: 6 },
  { week: 'W-19', sessions: 31, completed: 28, flags: 3 },
  { week: 'W-20', sessions: 29, completed: 27, flags: 5 },
  { week: 'W-21', sessions: 34, completed: 32, flags: 4 },
  { week: 'W-22', sessions: 32, completed: 31, flags: 2 },
]

/* Helper: total flags for a session = sum of all error counts. */
export function flagCount(flags) {
  if (typeof flags === 'number') return flags
  return Object.values(flags || {}).reduce((a, b) => a + b, 0)
}

/* Quality % for a single session: 100% minus 10% per flagged event,
   capped at 0..100. Mocked heuristic for the skeleton. */
export function sessionQuality(s) {
  const flags = flagCount(s.flags)
  return Math.max(0, Math.min(100, 100 - flags * 10))
}

/* Group an array of sessions by ISO date string. Returns
   [{ date, sessions: [...], quality: avgPercent, flagCount }] in
   descending date order (newest first). */
export function groupByDay(sessions) {
  const map = new Map()
  for (const s of sessions) {
    if (!map.has(s.date)) map.set(s.date, [])
    map.get(s.date).push(s)
  }
  return [...map.entries()]
    .map(([date, list]) => {
      const totalFlags = list.reduce((sum, s) => sum + flagCount(s.flags), 0)
      const totalReps  = list.reduce((sum, s) => sum + s.reps, 0)
      const quality    = Math.round(
        list.reduce((sum, s) => sum + sessionQuality(s), 0) / list.length)
      return { date, sessions: list, quality, totalFlags, totalReps }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

/* For a patient, return the per-day quality % series (oldest → newest)
   over the last N days that have sessions. */
export function dailyQualitySeries(patientId, days = 14) {
  const patientSessions = SESSIONS.filter(s => s.patient === patientId)
  return groupByDay(patientSessions)
    .slice(0, days)
    .map(d => ({ date: d.date, quality: d.quality, sessions: d.sessions.length }))
    .reverse()   // oldest → newest for line charts
}

/* Caseload-wide per-day quality. */
export function caseloadDailyQuality(days = 14) {
  return groupByDay(SESSIONS)
    .slice(0, days)
    .map(d => ({
      date: d.date,
      quality: d.quality,
      sessions: d.sessions.length,
      patients: new Set(d.sessions.map(s => s.patient)).size,
    }))
    .reverse()
}

/* Patients flagged as needing attention. */
export function patientsAtRisk() {
  return PATIENTS
    .filter(p => p.adherence < 0.70 || p.openFlags >= 2 || p.trend === 'up')
    .sort((a, b) => b.openFlags - a.openFlags)
}

export function formatShortDate(iso) {
  const d = new Date(iso + 'T00:00:00Z')
  const day = d.toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', timeZone: 'UTC',
  })
  return day
}
