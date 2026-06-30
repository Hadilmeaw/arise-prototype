# ARISE — D2.2 UI skeletons

Two thin React + Vite apps that will grow into the WP3 prototype.

| App | Purpose | Dev URL |
|---|---|---|
| `coach/` | Patient-facing kiosk run during a sit-to-stand session | http://localhost:5173 |
| `therapist/` | Web dashboard for therapist review of session data | http://localhost:5174 |

Shared design tokens live in `shared/theme.css` (palette + buttons + spacing). Both apps import it via `main.jsx`.

## Run (WSL)

```bash
# Coach
cd ~/v2/apps/coach && npm run dev

# Therapist (separate terminal)
cd ~/v2/apps/therapist && npm run dev
```

Both bind to `host: true`, so you can also reach them from Windows at the same URLs (Vite prints both the localhost and the LAN URLs on startup).

## Structure

```
apps/
  coach/         Vite + React, patient kiosk
  therapist/     Vite + React, therapist dashboard
  shared/
    theme.css    palette + design tokens, imported by both apps
```

## State today (skeleton only)

**Coach** — three screens: Idle → Active (rep counter, camera placeholder, live feedback) → Done summary. "Log rep" button stands in for the MediaPipe rep detector that will be wired up in WP3.

**Therapist** — sidebar with mock caseload, top bar, patient detail with KPI cards, FTSS trend sparkline (SVG), and session history table. All data is mocked inside `App.jsx`.

## Next (for the actual D2.2 deliverable)

1. Replace mock data in therapist app with a fake API client (one file) that the WP3 build can swap for the real ECS Fargate endpoints.
2. Wire the coach's "Log rep" button to a real MediaPipe pose loop running in the browser (see `docs/web_architecture.md`).
3. Wireframe additional screens: login, patient onboarding, session detail drill-down.
