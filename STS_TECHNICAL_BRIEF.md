# STS Feedback System — Technical Brief

**Audience:** technical leadership with CS/IT PhD background.
**Scope:** complete system overview spanning the upstream research project (`bvh_rehab`) and the deployed kiosk (`sts-feedback-system`), the design choices that link them, the current state of the ML layer, the personalisation architecture, and the recent additions that operationalise per-user learning.

---

## 1. Executive summary

The STS Feedback System is a real-time, monocular-RGB, kiosk-deployable feedback tool for the sit-to-stand functional-mobility test. It detects clinically-meaningful movement faults during each rep, gives live visual cues to the patient, and produces a per-session clinician report plus a longitudinal per-user analytics view.

The system sits on top of an earlier research project, **`bvh_rehab`**, which produced the labelled corpus, the clinical error taxonomy, the skeleton standardisation invariants, and two trained BiLSTM checkpoints. Roughly 70% of `bvh_rehab`'s runtime code is vendored into the deployed kiosk as a `bridge/` layer, with the front-end pose backend replaced (MediaPipe in place of HybrIK) to meet real-time and hardware constraints.

The deployed classification strategy is currently **rule-based + per-user statistical baselines**. The BiLSTM gate is wired but disabled by default because the stage-1 checkpoint exhibits class collapse on STS rep validation data; the stage-2 (error-type) checkpoint is on disk but not yet loaded at runtime.

The personalisation layer — per-user, per-metric `(mean, std)` reference distributions refreshed online every 5 correct reps — is the active "learns from each session" component. Its prerequisites (multi-user identity, session attribution, history navigation, longitudinal analytics) were completed in the recent work session described in §11.

---

## 2. Problem domain

### 2.1 Clinical task

Sit-to-stand (STS) is a standard test in geriatric and rehabilitation medicine. The coarse-grained clinical question is binary ("can the patient stand from a chair without assistance?"); the interesting question is **biomechanical attribution** — which subsystem (quadriceps strength, knee/hip ROM, trunk control, balance) is rate-limiting, and which compensatory pattern is the patient adopting.

The clinically meaningful error taxonomy used throughout both projects — defined in `bvh_rehab` and inherited by the kiosk's rule-based detector — comprises 12 codes:

| Code | Category | Description |
|---|---|---|
| E01 | Trunk | Topping (excessive forward overshoot) |
| E02 | Trunk | Lack of forward lean |
| E03 | Trunk | Slumped spine |
| E04 | Knees | Valgus (inward collapse) |
| E05 | Knees | Varus (outward bowing) |
| E06 | Knees | Instability / jitter |
| E07 | Symmetry | Asymmetric load distribution |
| E08 | Completion | Insufficient ascent momentum |
| E09 | Completion | Uncontrolled descent ("plopping") |
| E10 | Completion | Incomplete range of motion |
| E11 | Hands | Arm launching to gain momentum |
| E12 | Hands | Bracing on knees |

The deployed kiosk renumbers these as E1–E11 + G1/G2 (global instability, shoulder asymmetry) but the underlying biomechanical phenomena are the same.

### 2.2 Engineering constraints

- **Real-time inference** at camera rate (~30 fps) on commodity CPU.
- **Monocular RGB only** — no depth sensor, no inertial instrumentation on the patient.
- **Single point of contact** (touch kiosk) — no clinician supervision during the rep.
- **Offline-capable** — must work without network connectivity.
- **Persistent multi-user state** — each patient's session history and reference distributions stored locally.

These constraints are the primary reason for divergence between `bvh_rehab` (offline batch, HybrIK pose backend) and the deployed kiosk (live, MediaPipe pose backend).

---

## 3. The `bvh_rehab` ↔ deployed-kiosk relationship

The two projects share **domain, taxonomy, skeleton format, and BiLSTM architecture**. They diverge in **input modality, pose backend, primary classification strategy, and runtime mode**.

### 3.1 Side-by-side architecture

| Stage | `bvh_rehab` (research, offline) | `sts-feedback-system` (deployed, live) |
|---|---|---|
| Pose estimation | HybrIK on mp4 file → SMPL 24-joint, ~1 fps on CPU | MediaPipe Pose on live stream → 33 landmark, ~30 fps |
| Skeleton conversion | Canonical 22 → BVH 23 | MediaPipe 33 → BVH 23 (`src/bridge/mediapipe_to_bvh.py`) |
| Skeleton standardisation | Rigidify against frame-0 bone lengths + frame-0-anchored normalisation | Identical functions, ported to `src/bridge/skeleton_ops.py` + live `rigidify.py` |
| Feature extraction | 300-D engineered features per clip (`traininge/extraction_e.py`) | Per-frame geometric features (`src/feature_extraction/feature_extractor.py`) |
| Classification | (a) two sklearn packs: `bin_pack` + `err_pack` (`runtime/rehab_bvh_pipeline.py`); (b) BiLSTM multi-task (`training/train_bvh.py`) | Rule-based `ErrorDetector` (primary) + BiLSTM confidence gate (currently inert) |
| Output | `feedback.json` + `detected.bvh` + `corrected.bvh` | Live kiosk overlay + post-rep card + `TherapistDashboard` + SQLite persistence + per-session JSON report |

### 3.2 Code literally ported into the deployed kiosk

The `src/bridge/` package is a vendored runtime port of `bvh_rehab` modules:

```
bvh_rehab/standards.py                  ──►  src/bridge/skeleton_ops.py
  parse_bvh, FK, rigidify, normalize         (same functions, live-callable)

bvh_rehab/bvh_adapter_to_template.py    ──►  src/bridge/joint_mapping.py
  22-canonical → 23-BVH template mapping     (unchanged)

bvh_rehab/analysis/build_reference_stats──►  src/bridge/reference_stats.py
  population μ/σ over BVH features            (generalised to per-user keys)

bvh_rehab/training/models.py            ──►  src/bridge/lstm_model.py
  RehabBVHMultiTaskLSTM architecture          (architecturally identical)

bvh_rehab/standardize.py                ──►  src/bridge/ml_gate.py (score_clip path)
  T_target=300 resample + frame-0 norm        (mirrors training preprocessing exactly)
```

Two files are **new** in the deployed kiosk and have no `bvh_rehab` analogue:

- `src/bridge/mediapipe_to_bvh.py` — adapts MediaPipe's 33-keypoint output to the 23-joint BVH template the model expects. MediaPipe does not expose Pelvis, Waist, Spine, Chest, Neck, HeadTip, or Collars; these are **synthesised by interpolation** along the hip-mid → shoulder-mid → nose chain. Coordinate-frame conversion (image-coords y-down → BVH y-up) is performed here.
- `src/bridge/rigidify.py` — live (streaming) variant of `bvh_rehab`'s offline rigidifier. Maintains a warmup window (30 frames) and a calibration window (45 frames, aligned with the phase detector's calibration boundary) before producing stable per-frame skeletons.

### 3.3 What was deliberately not ported, and why

- **HybrIK** — heavyweight (GPU-preferred, ~GB weights, batch-oriented). Incompatible with the real-time + commodity-CPU constraint. Replaced wholesale by MediaPipe.
- **The 300-D sklearn feature-based runtime** (`rehab_bvh_pipeline.py`'s `bin_pack` + `err_pack`) — this is a parallel, fully self-contained ML approach inside `bvh_rehab` that uses joblib-loaded scikit-learn models on engineered features. Neither the feature extractor nor these models were carried over. The kiosk uses the BiLSTM path exclusively for its ML layer.
- **BVH file output** — the kiosk produces no BVH artefacts; per-rep persistence is the SQLite `reps` table plus a per-session JSON report.

### 3.4 The covariate shift problem

The BiLSTM checkpoints were trained on **HybrIK-derived BVH skeletons**. The deployed kiosk feeds them **MediaPipe-derived BVH skeletons**. Nominally both are 23-joint BVH after the standardisation pipeline; empirically the noise, jitter, and accuracy profiles differ.

This is a **covariate shift at deployment time** — same task, same label space, same input *shape*, different input *distribution*. The standard mitigations are (a) finetune the model on MediaPipe-derived data, or (b) use HybrIK offline purely as a label-generator and retrain end-to-end. Both are tractable on top of existing infrastructure. This shift is the leading hypothesis for why stage-1's binary head exhibits class collapse on validation reps (see §6.3).

---

## 4. Pose estimation and skeleton standardisation

### 4.1 MediaPipe Pose backend

`PoseEstimator` (`src/pose_estimation/pose_estimator.py`) wraps MediaPipe with `model_complexity=1`, `confidence_threshold=0.5`, and 3D-landmark output enabled. MediaPipe's 3D output is in a normalised hip-centred coordinate system with notable per-frame jitter — adequate as a first pass but not directly usable for biomechanical features that require temporal stability (knee valgus norm, trunk angle).

### 4.2 Rigidification

`Rigidifier` (`src/bridge/rigidify.py`) estimates bone lengths during a warmup window (30 frames) and a calibration window (45 frames). Once calibrated, each subsequent frame's joint positions are constrained to lie on a kinematic chain with the calibrated bone lengths, removing per-frame jitter that would otherwise propagate into velocity and acceleration features. This is the live-streaming version of the offline procedure in `bvh_rehab/standards.py::rigidify_positions`.

### 4.3 Normalisation invariant (the critical detail)

The most consequential detail in the entire system, documented in [`src/bridge/ml_gate.py`](sts-feedback-system-main/src/bridge/ml_gate.py) lines 8–14:

> Training (`bvh_rehab/standardize.py`) ran the whole clip through (1) linear time-resample to T_target=300, (2) rigidify against frame-0 bone lengths, (3) **clip-level normalisation that uses frame-0 pelvis / chest-pelvis yaw / head-foot height as references for the entire clip**. Earlier inference normalised every frame against itself, which destroys the vertical pelvis trajectory that is the dominant signal for a sit-to-stand.

The intuition: STS classification is dominated by the **pelvis-y rise** over the rep. Per-frame normalisation by *that frame's* head-to-foot distance, with root-centring on *that frame's* pelvis, regresses out the very signal the model is meant to read. Training fixed frame-0 as the reference for all 300 timesteps; inference must do the same. `score_clip` mirrors this exactly:

1. Linear time-resample the raw rep buffer to T = 300.
2. Rigidify against frame-0 bone lengths (`rigidify_iters=2`).
3. Apply frame-0-anchored normalisation: pelvis at origin, hip vector yaw-aligned to canonical X, height-scaled by frame-0 head-to-foot distance.

A diagnostic path `score_normalized` skips the adapter entirely and feeds pre-processed clips from `dataset_norm_positions.npz` — this isolates **checkpoint health** from **adapter health** when debugging.

---

## 5. Phase detection — finite-state machine

`PhaseDetector` (`src/phase_detection/phase_detector.py`) implements an explicit state graph:

```
sitting ──► forward_lean ──► lift_off ──► standing ──► descent ──► sitting
```

Transition guards key on hip velocity, knee extension threshold, and trunk angle. The detector exposes a `CALIBRATION_REPS` warmup (default 3) during which the system suppresses error emission so per-user baselines have a chance to populate before being scored against.

An alternative `PelvisPhaseDetector` (`src/phase_detection/pelvis_phase_detector.py`) segments reps by detecting pelvis-y extrema and is used for replay of the v6-locked corpus because that's the detector the rule thresholds were tuned against.

The auto-selection logic in `src/main_qt.py` picks `fsm` for live sources (webcam or any URL with `://`) and `pelvis` for file replay. This is empirical, not theoretical — different framings favour different detectors.

---

## 6. Error detection: hybrid rule + statistical layer

`ErrorDetector` (`src/error_detection/error_detector.py`) is a **deliberate hybrid**:

### 6.1 Absolute rule layer

Population-level thresholds encoding "this form is clinically wrong regardless of who the patient is." Example: knee valgus norm > X for ≥ N consecutive frames during the ascent phase fires `E1`. Thresholds are tuned against the v6 corpus and locked at F1 = 0.779 in the most recent evaluation.

### 6.2 Statistical (z-score) layer

For each tracked metric, the `baselines` table stores a per-user `(mean, std, n, updated_at)` tuple. Live values are scored as `z = (live - μ) / σ` and abnormal-for-this-user deviations fire alternate codes.

This layering is what makes "actively learning from every session" achievable without falling into the model-collapse trap (training on detector output reinforces detector bias). The absolute layer catches clinical errors regardless of user history; the statistical layer captures personal regression against the patient's own typical pattern. **The two layers are independent and additive.**

### 6.3 BiLSTM confidence gate (currently inert)

`MLGate` (`src/bridge/ml_gate.py`) wraps `stage1_best.pt` as a per-rep judge: given a buffered raw rep clip, return `p_incorrect ∈ [0, 1]`. Policy: live cues fire unchanged; only the post-rep error *summary* is suppressed when `p_inc < threshold` (default 0.75).

**Current status: disabled by default.** Reported validation metrics from training (in `config/config.yaml`):

```
val_bin_f1 = 0.738
confusion matrix:  [[17, 43],
                    [ 0, 48]]    (TN, FP / FN, TP)
precision = 0.527    recall = 1.000
```

Recall = 1.000 with precision ≈ 0.5 indicates **collapse to the positive class**: the model labels essentially every rep as "incorrect." A gate that can't disagree with the rule layer in the precision-improving direction is net-negative; hence `enabled: false` in production.

The leading hypothesis for the collapse is the HybrIK→MediaPipe covariate shift (§3.4) combined with class imbalance during training. The model has not been retrained against MediaPipe-derived inputs since deployment.

---

## 7. The BiLSTM model in detail

### 7.1 Architecture

`RehabBVHMultiTaskLSTM` (`src/bridge/lstm_model.py`): shared BiLSTM encoder with two linear heads.

```
Input  [B, T=300, F=69]               # 23 joints × 3 coords
   │
   ├─► BiLSTM(input=69, hidden=128, layers=2, bidirectional=True)
   │      → [B, T, 256]                # bidirectional concat
   │      → take last hidden h_n[-1]   → [B, 256]
   │
   ├─► binary_head : Linear(256 → 2)   # {Correct, Incorrect}
   └─► error_head  : Linear(256 → 12)  # E01..E12
```

Weight initialisation: Xavier-uniform on `weight_ih` and on linear heads; orthogonal on `weight_hh`; zero on all biases.

### 7.2 The two checkpoints

`stage1_best.pt` and `stage2_best.pt` are **separate checkpoints produced by a two-stage training procedure** (`bvh_rehab/training/train_bvh.py` lines 4–19):

- **Stage 1**: train backbone + binary head on `REAL + AUGmented` samples. Augmented samples are downweighted (`aug_weight=0.1`). `WeightedRandomSampler` balances classes (`balance_bin=1`). Error head loss is OFF (`lambda_err_stage1=0`).
- **Stage 2**: load the stage-1 checkpoint, **freeze backbone + binary head**, train the error head **only on real-incorrect samples** (`is_aug == 0 AND y_bin == 1`). Error head loss is ON (`lambda_err_stage2=1`).

So architecturally there is one multi-task network, but the two checkpoints behave like two single-purpose models because of the freeze pattern:

| Checkpoint | Binary head | Error head |
|---|---|---|
| `stage1_best.pt` | trained | random init (untrained) |
| `stage2_best.pt` | frozen at stage-1 values | trained on real-incorrect only |

`stage2_best.pt` is the **complete model** — it contains both the binary classifier from stage 1 and the error-type classifier from stage 2. **The deployed kiosk currently loads only `stage1_best.pt`**, which means even if the gate were enabled, the error-type capability would not be available without a checkpoint swap.

### 7.3 The dormant capability

`stage2_best.pt` is on disk but not loaded by any code path in the deployed kiosk. The 12-class error classifier — trained against the same E01–E12 taxonomy the rule detector uses — is therefore latent capacity. Activating it would require resolving the same covariate-shift problem that disables stage 1, but it is the highest-leverage ML investment available: an existing trained classifier, on the existing label space, fine-tunable on the existing training infrastructure.

---

## 8. Persistence layer

Plain SQLite (Python stdlib `sqlite3`), four tables, no ORM, schema in `src/persistence/db.py`:

```sql
users(id, name, height_cm, created_at)

sessions(id, user_id, started_at, ended_at, total_frames, avg_quality)
  FOREIGN KEY(user_id) → users(id)

reps(id, session_id, user_id, cycle_number,
     grade, quality, was_correct,
     features_json, phase_durations_json, created_at)
  FOREIGN KEY(session_id) → sessions(id)
  FOREIGN KEY(user_id) → users(id)
  INDEX(user_id, was_correct), INDEX(session_id)

baselines(user_id, metric, mean, std, n, updated_at)
  PRIMARY KEY (user_id, metric)
  FOREIGN KEY(user_id) → users(id)
```

Notes:

- `features_json` and `phase_durations_json` are JSON-serialised dicts; metric names are stable identifiers like `ascent_trunk_peak`, `sitting_khr_mean`, `ascent_left_valgus_peak` (defined in `src/persistence/rep_features.py::_METRIC_SPEC`).
- `baselines` is the live-adaptive table. `STSDatabase.add_rep` triggers `recompute_baselines(user_id)` automatically after every 5th *correct* rep (`_BASELINE_REFRESH_EVERY = 5`). Metrics with fewer than 5 samples are skipped (`_MIN_REPS_FOR_BASELINE`).
- `std` is floored at `1e-6` to avoid div-by-zero in downstream z-scoring when all samples are identical.
- The DB connection is opened lazily; foreign keys are enforced (`PRAGMA foreign_keys = ON`).

Per-session JSON reports are written to `reports/session_<id>_<safe_user>_<YYYYMMDD_HHMMSS>.json` by `TherapistReport.generate()`. The DB stores summary data; the per-session JSON stores the full rep-level detail including `error_names`, `corrections`, `exercises`, and `ml_cleared` (which the DB does not).

---

## 9. The personalisation architecture — the "AI" story

The deployed system's "learns from every session" capability is delivered by the personalisation layer, which is **a deliberate three-layer architecture with one online-adaptive layer**:

| Layer | Adaptation | Failure mode if isolated |
|---|---|---|
| **Population rule thresholds** (`ErrorDetector` rules) | Frozen | Insensitive to user-specific anatomy/style |
| **Per-user z-score baselines** (`baselines` table) | **Online, every 5 correct reps** | A user who is already wrong on day 1 normalises to wrong-as-typical |
| **BiLSTM gate** (stage 1/2 checkpoints) | Frozen | Currently inert (§6.3) |

Each layer compensates for the other layers' failure modes:

- The rule layer catches absolute clinical errors regardless of who the patient is, so a brand-new user whose baseline is already faulty still gets flagged.
- The baseline layer catches per-user regression that the population-level rules would miss (a user whose form was good yesterday and is now subtly off).
- The BiLSTM (when functional) acts as a noise filter on the rule layer's outputs, gaining precision at the cost of recall.

This architecture is specifically designed to avoid the model-collapse trap of naive online learning. The frequently-misunderstood version of "the app learns from each video" — using detector output as training labels — would just teach a neural network to imitate the rule detector, ceiling-locked at F1 = 0.779 and reinforcing any rule-layer bias. Our architecture instead lets only the **statistical reference distribution** drift online, while both classification components (rules, BiLSTM) stay frozen. The drift target is well-defined (per-user, per-metric mean and std), bounded (5-correct-rep refresh, n ≥ 5 minimum, std floor 1e-6), and reversible (rebuildable from rep history at any time).

---

## 10. UI architecture

### 10.1 Threading model

The kiosk uses **PySide6** with a strict two-thread split:

- **GUI thread**: Qt event loop, widget tree, paint events.
- **Worker thread (`QThread`)**: owns the `STSFeedbackSystem` instance including MediaPipe handles and `cv2.VideoCapture`. The pipeline is constructed *inside* `QThread.run()`, not on the GUI thread, because MediaPipe and OpenCV capture handles are not safe under inter-thread access.

Subtleties documented in the source:

- A `_Coordinator` `QObject` is instantiated on the main thread so cross-thread signals land on a receiver with correct thread affinity. Connecting a worker signal directly to a plain Python function loses Qt's thread-affinity detection and triggers paint/parenting bugs.
- `worker.stop()` and `worker.resume()` are connected with `Qt.ConnectionType.DirectConnection`. The worker runs a tight `while self._running` loop with **no Qt event loop of its own**, so the default queued connection would never deliver these slot calls and the kiosk would never shut down cleanly.
- `app.setQuitOnLastWindowClosed(False)` is set explicitly because the kiosk window closes before the dashboard opens; the default Qt teardown would race the worker's finalisation.

### 10.2 Live MJPEG input (WSL2 workaround)

WSL2 cannot reliably forward UVC isochronous frames from a USB webcam to `/dev/video0` on recent kernels. The workaround:

1. A Windows-side MJPEG server (`tools/win_camera_server.py`) captures via DirectShow and serves `multipart/x-mixed-replace` over HTTP.
2. The kiosk consumes it via `BufferedURLCapture` (`src/pose_estimation/buffered_url_capture.py`) — a one-slot latest-frame cache backed by a background reader thread, dropping stale frames so the pipeline always sees the freshest available frame rather than the oldest queued.

This is the standard live-IP-camera consumer pattern. Without frame-drop, the pipeline (~40 ms/frame) lagging behind the source (~33 ms/frame) accumulates seconds of latency over a session.

---

## 11. Recent work — operationalising the personalisation layer

The persistence schema for multi-user, per-user-baseline operation existed prior to this work, but the kiosk attributed every session to a single hard-coded user (`default` in `config.yaml`), making the personalisation layer architecturally inert. The recent work session removed that bottleneck and added longitudinal navigation.

### 11.1 User identity infrastructure

- **`UserPickerWindow`** (`src/ui/user_picker.py`): tile-grid picker shown before each kiosk session. One-tap-to-start UX for known users; a "+ New user" tile prompts for a name via `QInputDialog` and creates the row in `users`.
- **Mode toggle**: a top-bar button flips the picker between "Start session" and "View history" modes. In start mode, tapping a tile begins a new session; in history mode, tapping a tile opens that user's session history window. The new-user tile is suppressed in history mode (creating a user has no meaning when reviewing past sessions).
- **DB query**: `STSDatabase.list_users()` joins `users` against `sessions` to compute `last_seen` and `session_count`, ordered most-recent-first so frequent users surface at the top of the grid.
- **Plumbing**: `STSFeedbackSystem.__init__`, `PipelineWorker.__init__`, and `main_qt.py` all accept an optional `user_name` override. The kiosk picker drives this at runtime; a `--user NAME` CLI flag bypasses the picker for headless/scripted runs.
- **Legacy data**: the prior single-user record (`default`, 359 sessions, 989 reps, 18 baseline rows) was renamed to `legacy` so its accumulated baseline rows remain queryable as a historical corpus but do not contaminate any new user's baseline.

### 11.2 Session history navigation

- **`SessionHistoryWindow`** (`src/ui/session_history.py`): per-user list of past sessions, newest first. Each row shows date, session ID, rep count, correct count, and avg quality. Sessions without a saved per-session JSON (legacy, crashed mid-finalisation) render disabled with a "no detailed report saved" caption — graceful degradation rather than a hard failure.
- **Click semantics**: clicking a session row opens the existing `TherapistDashboard` for that session, re-using the same window that pops at session end. The per-session JSON is the source of truth for the full rep-level detail; `TherapistReport.find_session_json(reports_dir, session_id)` resolves the filename via glob on `session_<id>_*.json`.
- **Cumulative entry**: a `Cumulative — all sessions` row at the top of the list opens the longitudinal analytics window.

### 11.3 Cumulative analytics (`CumulativeDashboard`)

`src/ui/cumulative_dashboard.py` — four-tab QPainter-based dashboard, zero new runtime dependencies (no matplotlib, no QtCharts).

**Tab 1 — Overview.** Hero element: `_QualityGaugeRing`, a circular gauge with a dot trail.

- Centre: the cumulative average quality (e.g. 84) rendered as a large numeral; "avg quality" caption underneath.
- Ring: arc filled proportional to the average, colour-coded by quality band (green ≥ 85, yellow ≥ 70, red < 70).
- Dot trail: one dot per session arranged clockwise from 12 o'clock (oldest at top), colour-tinted by that session's quality band, alpha-graded by age (oldest at 35% opacity, newest at 100%), with the newest dot ringed in white. Capped at 60 visible dots; gauge average is still computed across the full history.
- **Interactive**: hovering a dot shows a tooltip with session #, date, quality, and rep count via `QToolTip.showText`; clicking a dot emits `session_clicked(int)` which `main_qt.py` routes to `_open_session_dashboard`, opening that session's `TherapistDashboard`.
- Hit-test radius: 12 px (larger than the visual dot) to give touch input forgiving aim. Hit targets are rebuilt in `paintEvent` on every render so they remain consistent under window resize.

**Tab 2 — Quality trend.** Precise per-session line chart, X = session order, Y = avg quality (0–100). Gridlines at 50 / 75 / 100 matching the rep-grade boundaries. Same hover-tooltip and click-to-open-dashboard behaviour as the gauge. Header caption explicitly explains what the axes mean and how to interpret slope clinically.

**Tab 3 — Errors.** Stacked bar chart of per-session error counts, with each bar segment colour-coded by error code. Capped at the 50 most recent sessions to keep individual bars wide enough to read (~14 px / bar floor). Legend below the chart, aggregate error-totals table at the bottom. Sessions without saved JSONs contribute their summary row but not their error breakdown (no JSON = no `error_names` data; only the rule-detector's per-rep summary persists across both DB and JSON, the codes themselves only persist to JSON).

**Tab 4 — Metric drift.** Small-multiples grid of per-metric drift charts. For each of the 18 tracked metrics (e.g. `ascent_trunk_peak`, `sitting_khr_mean`, `ascent_left_valgus_peak`), one tile shows mean ± 1 std as a translucent ribbon over time, with the mean drawn as a line. Auto-Y range per tile (metric's own min/max ± padding) so each tile uses its full vertical space. Metrics with fewer than 2 sessions are excluded — single-session "drift" is uninformative and would clutter the grid with flat lines. This is the **visualisation of the personalisation layer's reference distribution evolving over time** — exactly what makes "the system learns from each session" visible to a clinician.

### 11.4 UI rendering fixes encountered along the way

- Plain `QWidget` does not auto-render stylesheet backgrounds. The initial implementation set `setStyleSheet("background-color: ...")` on the chart widgets but overrode `paintEvent`, which silently dropped the stylesheet-painted background and rendered light-coloured ticks/titles against the OS-default widget background. Fix: explicit `p.fillRect(self.rect(), QColor(_PANEL))` at the top of every chart's `paintEvent`.
- Metric-drift tile titles were originally at 9pt and pinned to a colour that overlapped the unfilled background; bumped to 11pt bold on the now-painted `_PANEL2` background.
- Stacked bars at 360 sessions produced ~1.8 px bars — visually empty. Capped at 50 most recent with a "showing newest 50 of N" caption.

---

## 12. Smoke-tested numbers (legacy user, 360 sessions)

Performance characteristics measured on the existing legacy corpus:

```
list_users()                              :   2 users          ~1 ms
list_sessions(legacy.user_id)             : 360 rows           3.0 ms
session_quality_series(legacy.user_id)    : 355 rows           0.4 ms
get_session_reps(latest_session_id)       :   7 reps           0.1 ms

CumulativeDashboard(...) full construction:                  260 ms
  ├─ list_sessions                                              3 ms
  ├─ get_session_reps × 360 sessions                          ~50 ms
  ├─ JSON load × 360 reports for error codes                 ~150 ms
  └─ widget tree assembly + initial paint                     ~55 ms
```

For the deployment use case (10–100 sessions per real user, not 360), this profile leaves substantial headroom. The 260 ms full-cumulative-load on the worst-case legacy corpus is comfortable for a kiosk; a typical user with 20 sessions will load in 15–20 ms.

Domain-level numbers from the legacy corpus:

```
total reps              :  989
correct                 :  918  (93%)
distinct error codes seen : 14
top three (cumulative)  : E3 (incomplete knee extension) × 72
                          E1 (knee valgus)               × 45
                          E10 (incomplete rise)          × 41
metric_drift series     :  18  (matches _METRIC_SPEC entries)
```

The 93% correct-rate on legacy is inflated by known noisy labels in the Fran clips (subtle valgus marked correct), which is a separate data-quality issue tracked outside this brief.

---

## 13. Honest gap assessment

### 13.1 What works

- Real-time pose → feature → phase → rule detection at camera rate.
- Per-user session attribution.
- Per-user baseline auto-refresh (the online-adaptive layer).
- Persistent multi-user history with longitudinal analytics.
- Per-session report generation (Markdown + HTML + JSON).

### 13.2 What is wired but inert

- BiLSTM stage-1 gate (class-collapsed; disabled in config).
- BiLSTM stage-2 error classifier (on disk, not loaded).

### 13.3 What is not yet built

- A clinician review / labelling UI. Without it, no new labels enter the system, so the rule layer cannot be retrained against new ground truth and no supervised improvement to either BiLSTM checkpoint is possible.
- Resolution of the HybrIK→MediaPipe covariate shift. Until addressed, the BiLSTM checkpoints cannot reliably contribute.
- A baseline-divergence "early warning" surface in the clinician view — the drift data is now visualised per-metric, but there is no automated flag for "this user's distribution is moving in a clinically concerning direction."

### 13.4 Roadmap, in dependency order

1. **Clinician review UI** for flagged reps → produces clean labels.
2. **Retrain stage-1 binary head** on MediaPipe-derived BVH skeletons using the existing `train_bvh.py` infrastructure → restores the gate.
3. **Activate stage-2 error classifier** with the same retraining approach → produces a second-opinion error-type signal to ensemble against the rule layer.
4. **Drift-alert rules** on top of the baseline table → "this user's typical valgus peak has shifted by > 2σ over the last 5 sessions; review."

Each step is bounded scope on top of existing infrastructure. None requires new ML capability that does not already exist somewhere in `bvh_rehab`.

---

## 14. Source-file index

For reference and code review, the most relevant files are:

**Deployed kiosk (`sts-feedback-system-main/`):**

```
src/main.py                              STSFeedbackSystem orchestrator
src/main_qt.py                           Qt entry point + picker/history wiring
src/pose_estimation/pose_estimator.py    MediaPipe wrapper
src/pose_estimation/buffered_url_capture.py   MJPEG live consumer
src/feature_extraction/feature_extractor.py   Per-frame geometric features
src/phase_detection/phase_detector.py    FSM phase detector
src/phase_detection/pelvis_phase_detector.py  Pelvis-trajectory phase detector
src/error_detection/error_detector.py    Hybrid rule + z-score detector
src/bridge/ml_gate.py                    BiLSTM gate wrapper
src/bridge/lstm_model.py                 RehabBVHMultiTaskLSTM definition
src/bridge/mediapipe_to_bvh.py           MediaPipe 33 → BVH 23 adapter
src/bridge/rigidify.py                   Live rigidifier
src/bridge/skeleton_ops.py               Ported from bvh_rehab/standards.py
src/persistence/db.py                    SQLite schema + queries
src/persistence/rep_features.py          Per-rep summary metric spec
src/ui/kiosk_window.py                   Live kiosk UI
src/ui/user_picker.py                    User picker (Start/History modes)
src/ui/session_history.py                Per-user session list
src/ui/cumulative_dashboard.py           Longitudinal analytics window
src/ui/therapist_dashboard.py            Per-session clinician dashboard
src/ui/pipeline_worker.py                Qt worker thread wrapper
src/reporting/therapist_report.py        Per-session JSON/MD/HTML writer
tools/win_camera_server.py               Windows-side MJPEG bridge
config/config.yaml                       Runtime configuration
models/stage1_best.pt                    BiLSTM checkpoint (binary head trained)
models/stage2_best.pt                    BiLSTM checkpoint (both heads trained)
data/sts.db                              SQLite persistence
reports/session_*.json                   Per-session structured reports
```

**Research substrate (`bvh_rehab/`):**

```
standards.py                             BVH parse, FK, rigidify, normalize
standardize.py                           NPZ dataset builder
bvh_adapter_to_template.py               22-canonical → 23-BVH template
training/models.py                       RehabBVHMultiTaskLSTM definition
training/train_bvh.py                    Two-stage training loop
runtime/rehab_bvh_pipeline.py            Offline mp4 → feedback.json pipeline
runtime/hybrik_to_canonical.py           HybrIK SMPL → canonical 22
analysis/build_reference_stats.py        Population μ/σ builder
features/extract_sts_features_v2.py      STS-specific feature extraction
training1/, training2/, training3/       Iteration directories
```

---

*End of brief.*
