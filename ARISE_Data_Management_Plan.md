# Data Management Plan

|  |  |
|---|---|
| Project | ARISE, Augmented Rehabilitation and Intelligent System for Enhancement |
| Document | Data Management Plan, engineering specification for ARISE data |
| Work Package | WP1, Task T1.4, Compliance Management |
| Prepared by | Innovina S.r.l. |
| Partners | DINOGMI University of Genoa, Studio Buccarella |
| Companion to | Data Protection Impact Assessment, MDR Compliance Plan |
| Version, date | 3.3, 9 June 2026 |

## Executive summary

This document is the engineering specification for how ARISE data is captured, processed, stored, accessed, versioned, monitored, retained, and deleted across the project lifecycle.

The plan organises around three layers. The Lifecycle layer describes what happens when, across a pre-trial Phase A in which the training corpus is built and the model is trained, a trial Phase B in which the locked model is used in clinical demonstration, and continuous activities that run for the full project. The Data layer describes the five authoritative datasets, their owners, schemas, and quality gates. The Platform layer describes storage, access, and identity, with technology choices kept generic where the vendor is not yet selected.

GDPR risk assessment lives in the DPIA. MDR-aligned technical documentation lives in the MDR Compliance Plan. This document handles the engineering side of the project.

# Part I: Foundations

## 1. Purpose and scope

### 1.1 Purpose

To specify the engineering controls and operational disciplines that keep ARISE data trustworthy, reproducible, and compliant across the project lifecycle.

### 1.2 Scope

| In scope | Out of scope |
|---|---|
| Data inventory, classification, schemas, lineage | GDPR risk assessment (DPIA) |
| Storage, access, identity, encryption | Final cloud vendor and region selection (D2.1B) |
| Pipelines, quality gates, versioning | MDR technical-file structure (MDR Compliance Plan) |
| Ownership and operational responsibilities | UI/UX of the Clinical Dashboard (D2.2) |

### 1.3 Audience

The document is written for the data engineers and platform owners at Innovina who operate the system day to day. It is also intended for the auditors of the funding body, for the Ethics Committee, and for the technical leads at DINOGMI and Studio Buccarella who need to verify that the engineering controls match the partnership agreements.

### 1.4 Technology choices in this document

Storage classes (object store, relational store, cold archive), monitoring service, identity provider, key management service, model registry, and data version-control system are referred to by their generic function rather than by vendor. The specific vendor and region are confirmed in D2.1B.

## 2. Architecture overview

This section describes where data lives and how the system is laid out. The time dimension is covered in Section 3. Detailed schemas are in Section 5 and operational policies are in Sections 6 and 7.

### 2.1 The four storage tiers

| Tier | Function | Latency | Typical contents |
|---|---|---|---|
| Edge | Real-time inference at the Coach device | Less than 100 ms | On-device inference cache, encrypted local buffer drained to cloud after acknowledgement |
| Hot (operational relational store) | Per-session reads, dashboard queries | Less than 1 s | Sessions, reps, baselines, AE log, annotations |
| Warm (cloud object store) | Per-session JSON, landmark streams, dataset snapshots | Seconds | Corpus snapshots (immutable, versioned), per-session bundles, AE evidence packs |
| Cold (cold-archive object store) | Long-term retention | Hours | Archived corpus, archived trial data, archived AE records |

### 2.2 Where compute runs

| Process | Where | Rationale |
|---|---|---|
| Pose estimation, KPI extraction, classification (live) | Edge (Coach device) | Real-time biofeedback requires sub-100 ms latency and cannot tolerate a cloud round-trip |
| Per-session aggregation, dashboard queries | Cloud (hot tier) | Therapist access between sessions |
| Annotation workflows | Cloud (warm) plus annotator workstations via remote desktop | Annotators never receive a local copy of raw data |
| AI training and evaluation | Cloud (warm) with frozen-snapshot inputs | Reproducibility requires immutable inputs |
| Long-term retention | Cloud (cold) | Cost vs access tradeoff |

## 3. Project lifecycle

ARISE has two distinct data phases bridged by a prototyping period, plus a set of continuous activities that run for the full project duration.

### 3.1 The two phases and the bridge

| Phase | Period | Work package | Goal | Output deliverables |
|---|---|---|---|---|
| Phase A. Build the model | M6 to M15 | WP3 (Core AI R&D) | Choose an AI approach, acquire a labelled training corpus, train and evaluate the models | D3.1 (M9, sensor study), D3.2 (M9, AI model research and comparison), D3.3 (M12, hardware design), D3.4 (M15, preliminary AI tests on trained models) |
| Bridge. Build the platform | M8 to M18 | WP4 (Prototyping) | Build the TRL6 prototype (5 to 10 Coach units plus cloud platform) and integrate the locked model into it | D4.1 (M18, TRL6 prototype) |
| Phase B. Validate in clinical use | M19 to M24 | WP5 (TRL6 Validation) | Demonstrate the integrated system on real patients in the relevant clinical environment | D5.1 (M24, Final TRL6 Validation Report) |

The phase boundary is hard. The model is locked at M15 (D3.4). No retraining, no model edit, no taxonomy change happens during the WP4 bridge or WP5 trial. The model that ships in the D4.1 prototype is the same model that is demonstrated in WP5. Any model modification after M15 requires explicit Ethics Committee notification and a re-validation cycle. This rule exists because the TRL6 demonstration validates a specific, identifiable system. Changing the system mid-bridge or mid-trial invalidates the evidence.

A small, distinct annotation activity does happen during Phase B. A sampled subset of trial reps is spot-annotated by DINOGMI to validate the locked model's accuracy against expert ground truth (Task T5.4). This is validation, not training.

### 3.2 Phase A. Build the model (M6 to M15)

Phase A is the WP3 industrial research phase. It begins with sensor selection and AI approach selection, then moves into corpus acquisition, training, and evaluation.

| # | Stage | Period | Producer | Action | Output artefact |
|---|---|---|---|---|---|
| A0 | Sensor selection | M6 to M9 | Innovina + Invenio | Comparative study (RGB, RGB-D, IMU prototypes) | D3.1 Sensor Comparison Study Report |
| A1 | AI approach selection | M6 to M9 | Innovina ML + Invenio | Comparative research of candidate architectures | D3.2 AI model research and comparison |
| A2 | Corpus acquisition | M9 to M15 | Patients and healthy volunteers + clinical sites | RGB capture using the chosen sensor | Raw acquisitions in warm tier (D-CORPUS) |
| A3 | Curation | M9 to M15 | ML lead | Build dataset cut from raw acquisitions | Versioned, immutable snapshot |
| A4 | Annotation, primary | M9 to M15 | DINOGMI annotators | Double-blind labelling of every rep | Annotation records (D-CORPUS, annotations component) |
| A5 | Adjudication | M9 to M15 | DINOGMI senior annotator | Resolve inter-annotator disagreements | Adjudicated labels (D-CORPUS, annotations component) |
| A6 | Quality manifest | M14 to M15 | ML lead | Inter-rater agreement, completeness, per-subject distribution audit | Quality manifest signed off |
| A7 | Model training and evaluation | M12 to M15 | ML pipeline | Train on locked corpus plus adjudicated labels, evaluate on a held-out cut | Trained model artefact plus evaluation metrics |
| A8 | Model lock | M15 | ML lead + scientific lead | Sign-off, register model as locked for TRL6 | D3.4 Preliminary AI Tests, model registered as locked |

In parallel with A0 to A8, T3.5 (Hardware design) runs M9 to M12 and produces D3.3 (Hardware Design Document) at M12, feeding directly into WP4. After A8 the model is immutable. No further training occurs in Phase 1.

### 3.3 Bridge. Build the platform (M8 to M18)

The Bridge is the WP4 prototyping phase. No new clinical data is acquired and no model retraining happens here. The activity is engineering. The team integrates the locked model (D3.4) into the Coach device firmware, builds the Cloud Platform (per D2.1B), and performs end-to-end laboratory tests on the integrated stack.

| # | Stage | Period | Producer | Action | Output artefact |
|---|---|---|---|---|---|
| BR1 | Coach hardware prototyping | M8 to M18 | Innovina Hardware | Build 5 to 10 Coach units from D3.3 design | Hardware units (D4.1 component) |
| BR2 | On-device software | M8 to M18 | Innovina ML + Invenio | Integrate locked model into device firmware, biofeedback layer | Coach firmware build |
| BR3 | Cloud platform build | M13 to M18 | Innovina Platform + Invenio | Build the ingestion API, hot and warm stores, Clinical Dashboard | Cloud platform per D2.1B |
| BR4 | System integration and testing | M16 to M18 | Innovina + Invenio | Laboratory tests on the integrated hardware, software, AI stack | Integration test results |

The artifact at the end of the Bridge is D4.1 (TRL6 prototype). It is the system demonstrated in Phase B.

### 3.4 Phase B. Validate in clinical use (M19 to M24)

| # | Stage | Producer | Action | Output artefact |
|---|---|---|---|---|
| B1 | Capture | Patient + Coach device | STS performed in routine therapy session, on-device inference uses the locked model from A8 | Local encrypted buffer (edge) |
| B2 | Ingestion | Coach to ingestion API | Signed TLS upload, schema validation at the API boundary | Rows in hot tier + objects in warm tier |
| B3 | Per-session aggregation | Cloud worker | End-of-session aggregation (KPIs, error counts, quality score) | Session record + per-session bundle |
| B4 | Therapist consumption | Clinical Dashboard | Read by the patient's named therapist | Read-only access |
| B5 | Spot-annotation (T5.4) | DINOGMI annotators on a sampled subset | Compare ARISE output to expert label | Validation records (separate from corpus annotations) |
| B6 | Adverse event tracking | Clinical lead | Log incidents in real time, escalate as required | AE record (D-TRIAL, AE sub-component) |
| B7 | Archive | Lifecycle scheduler | Migrate to cold tier per retention schedule | Cold-tier objects + audit log |

### 3.5 Continuous activities (M1 to M24)

These run uninterrupted across both phases and are not specific to either.

| Activity | Description |
|---|---|
| Telemetry | Device health, ingestion rates, latency distributions |
| Logging | Structured application logs, audit logs |
| Monitoring and alerting | Coverage of platform health, paging on threshold violations |
| Backup and snapshots | Nightly backups, point-in-time recovery |
| Retention enforcement | Nightly retention-policy evaluation, deletion jobs |
| Compliance audit | Quarterly reviews of access logs, retention compliance |
| Post-market surveillance preparation | From M18, scaffolding for Article 86 PSUR data collection in Phase 2, given the confirmed Class IIa classification |

# Part II: The data itself

## 4. Data inventory

This section identifies every dataset in scope, who owns it, where the authoritative copy lives, and the consumers it serves.

### 4.1 Authoritative datasets

There are five datasets at the top level. The two most important are D-CORPUS and D-TRIAL. D-CORPUS has two sub-components (raw acquisitions and annotations) because they are logically one dataset consumed together but written by different processes. D-TRIAL has a sub-component (AE log) with stricter access and longer retention than the rest of trial data, but operationally it is the same data stream.

| ID | Dataset | Components | Owner | System of record | Downstream consumers |
|---|---|---|---|---|---|
| D-CORPUS | Training corpus (Phase A) | (a) Raw acquisitions: video, landmarks, KPIs. (b) Annotations: labels, severities, adjudication trail | Innovina ML + DINOGMI | Warm object store (raw, snapshots) + hot relational store (annotations) | Training, evaluation |
| D-TRIAL | TRL6 trial operational data (Phase B) | (a) Per-rep KPIs and sessions. (b) Adverse event log (encrypted with separate key, longer retention) | Innovina Platform. AE sub-component owned by Studio Buccarella | Hot relational store + warm object store | Dashboard, T5.4 analysis, D5.1, DPO and regulator for AE |
| D-USABILITY | Usability questionnaires and interview notes (Phase B) | SUS scores + structured interview transcripts | Innovina Clinical Coordinator + DINOGMI + Studio Buccarella (jointly) | Warm object store (transcripts) + hot relational store (scored) | D5.1 |
| D-TELEMETRY | Device telemetry, system logs | Continuous | Innovina Platform | Monitoring service | On-call ops, post-incident analysis |
| D-ENG | Code, model weights, configs | Continuous | Innovina Engineering | Git (code), model registry (models), data version-control (data pointers) | Development, training |

### 4.2 Classification matrix

Granularity is at the component level where the classification differs across components of the same dataset.

| Dataset, component | Sensitivity | Personal data | Special category |
|---|---|---|---|
| D-CORPUS, raw acquisitions (video) | Restricted | Yes (biometric) | Yes (health) |
| D-CORPUS, raw acquisitions (landmarks + KPIs) | Confidential | Pseudonymised | Yes |
| D-CORPUS, annotations | Confidential | Linked to subject ID | Yes |
| D-TRIAL, per-rep KPIs | Confidential | Pseudonymised | Yes |
| D-TRIAL, dashboard aggregates | Internal | Pseudonymised | Yes |
| D-TRIAL, AE log | Restricted | Pseudonymised | Yes |
| D-USABILITY | Internal | Pseudonymised | Yes (opinion + health) |
| D-TELEMETRY | Internal | None | No |
| D-ENG | Internal | None | No |

## 5. Schemas

Every dataset that crosses a system boundary has a versioned schema. Schemas are validated at write time (ingestion) and at read time (consumer side) so producers and consumers cannot drift silently.

### 5.1 Per-rep KPI record (D-TRIAL, D-CORPUS)

| Field | Type | Notes |
|---|---|---|
| rep_id | UUID | Stable identifier across all downstream artefacts |
| session_id | UUID | Foreign key to sessions |
| subject_id | string, opaque | Pseudonymised at the point of acquisition |
| device_id | string | Hardware unit identifier |
| acquired_at | timestamp (UTC) | RFC 3339 |
| phase_durations_s | object | One float per phase. Sitting, forward lean, lift-off, standing, stabilisation, descent |
| kpis | object | 18 named numeric KPIs (see D1.1 Section 3) |
| classification | object | { binary, errors[], severities[], confidence } |
| safety_flags | list | Subset of { G1, G2 } if fired |
| pipeline_metadata | object | Inference latency, frame count, dropped frames |

### 5.2 Session record (D-TRIAL)

| Field | Type |
|---|---|
| session_id | UUID |
| subject_id | string, opaque |
| started_at, ended_at | timestamps |
| device_id | string |
| therapist_id | string, opaque |
| rep_count, correct_count | integers |
| avg_quality | float |

### 5.3 Annotation record (D-CORPUS, annotations component)

| Field | Type | Notes |
|---|---|---|
| annotation_id | UUID | |
| rep_id | UUID | Foreign key |
| annotator_id | string, opaque | |
| label_binary | enum | correct, incorrect |
| label_errors | list | Subset of E1..G2 |
| label_severities | list | Aligned with label_errors, enum { low, medium, high } |
| confidence | enum | low, medium, high |
| free_text_note | string, optional | |
| created_at | timestamp | |
| adjudicated | boolean | True if this is the final post-adjudication label |
| adjudicator_id | string, opaque, nullable | |

### 5.4 Adverse event record (D-TRIAL, AE sub-component)

| Field | Type | Notes |
|---|---|---|
| ae_id | UUID | |
| subject_id | string, opaque | |
| session_id | UUID, nullable | |
| occurred_at | timestamp | |
| reporter_id | string, opaque | |
| attributable_to_system | enum | yes, no, unclear |
| severity | enum | minor, serious, critical |
| description | string | Encrypted at rest with a separate key |
| follow_up | text, nullable | |
| status | enum | open, under_review, closed |

# Part III: Operations

## 6. Pipelines

Pipelines are grouped by the phase in which they run. Phase A pipelines are one-shot and complete before the trial begins. Phase B pipelines run continuously during the trial. Continuous pipelines run across the entire project.

Every pipeline is idempotent and replayable from its inputs. Inputs are addressed by immutable dataset versions. Outputs carry the pipeline version that produced them.

### 6.1 Phase A pipelines (pre-trial, M6 to M15)

| Pipeline | Trigger | Inputs | Outputs | Owner |
|---|---|---|---|---|
| Corpus acquisition | Scheduled clinical session | Coach upload | Raw acquisitions in warm tier | Platform + Clinical |
| Annotation manifest build | Manual on dataset cut | Warm slice | Versioned manifest | ML + DINOGMI |
| Annotation labelling | Manifest published | Manifest + clips | Annotation records (D-CORPUS) | DINOGMI annotators |
| Adjudication | Inter-annotator disagreement | Two annotation rows | Adjudicated label (D-CORPUS) | DINOGMI senior |
| Quality manifest | End of annotation | All annotations + clips | Quality manifest (κ scores, completeness, per-subject distribution) | ML lead + DINOGMI |
| Training dataset cut | One-time, end of T3.2 | D-CORPUS (raw + annotations) | Frozen tar with manifest + SHA-256 | ML lead |
| Model training | Frozen dataset + config | Frozen dataset | Model run, model artefact, eval report | ML lead |
| Held-out evaluation | New model artefact | Model + held-out cut | Metrics report | ML lead |
| Model lock and registration | Eval acceptance at M15 | Model artefact + metrics | Registered model marked locked for TRL6 (D3.4) | ML lead + Scientific lead |

### 6.2 Phase B pipelines (trial, M19 to M24)

| Pipeline | Trigger | Inputs | Outputs | Owner |
|---|---|---|---|---|
| Trial ingestion | Coach upload during routine session | Raw rep payload | Rows in hot tier + objects in warm tier | Platform |
| Per-session aggregation | End of session | Reps for the session | Session row + per-session bundle | Platform |
| Spot annotation (T5.4) | Validation subset sampled | Subset of trial reps | Validation labels (separate from D-CORPUS annotations) | DINOGMI |
| Accuracy comparison | Spot-annotated subset available | Validation labels + locked-model output | Accuracy report | ML + DINOGMI |
| AE escalation | New AE record | Write to D-TRIAL AE sub-component | Page to clinical lead + DPO, device freeze if attributable | Platform + Clinical |
| Dashboard read paths | Therapist login | Hot tier | Read-only views | Platform |
| Usability data collection | End of session or end of enrolment | Questionnaire submissions | D-USABILITY records | Clinical Coordinator |

### 6.3 Continuous pipelines (M1 to M24)

| Pipeline | Trigger | Function |
|---|---|---|
| Telemetry collection | Continuous | Device health, latency, throughput |
| Log aggregation | Continuous | Structured app logs into searchable index |
| Audit log write | On every privileged access or deletion | Append to immutable audit log |
| Retention enforcement | Nightly | Evaluate retention rules, queue deletions |
| Backup | Nightly | Database backups + object snapshots |
| Quarterly retention audit | Quarterly | Verify nothing past retention remains |

### 6.4 Acquisition flow detail

The acquisition flow is identical in Phase A and Phase B, but consumers differ.

| Step | Component | Output |
|---|---|---|
| Pseudonymisation at enrolment | Studio Buccarella admin | subject_id assigned, mapping held only at the clinical site |
| Per-frame capture | Coach device, edge | RGB frames, 33 landmarks, per-frame features |
| Per-rep aggregation | Coach device, edge | One rep record per repetition |
| Local buffering | Coach device, edge | Encrypted FIFO buffer with disk-quota cap |
| Ingestion | Cloud API | Schema validation, signed write |
| Acknowledgement | Cloud API to Coach | After durable write. Device purges local copy only after ACK |

## 7. Data quality

### 7.1 Dimensions tracked

| Dimension | Definition | Measurement |
|---|---|---|
| Completeness | Fraction of expected fields present | Per-record schema validation, per-batch metric |
| Accuracy (vs annotation) | Agreement of automated classification with annotated ground truth | Held-out test set in Phase A, spot-annotated subset in Phase B |
| Consistency | FK integrity, phase boundaries match rep boundaries | Nightly consistency job |
| Timeliness | Time from acquisition to availability in warm tier | Per-event metric |
| Validity | Values within expected ranges (angles in [0, 180], KHR in [0, 5], etc.) | Schema constraints + range checks |
| Uniqueness | rep_id unique across the corpus | Database constraint |

### 7.2 Quality gates

A dataset cannot be promoted across a boundary unless it passes its gate.

| Promotion | Gate |
|---|---|
| Edge to cloud | Schema validation, signed write, ACK |
| Cloud to annotation (Phase A) | Manifest contains all expected reps, no NaN KPIs above tolerance |
| Annotation to adjudicated | Both annotators have labelled, disagreement routed to adjudicator |
| Adjudicated to training cut | Inter-rater agreement target (Cohen κ greater than or equal to 0.70 binary, Fleiss κ greater than or equal to 0.60 per code) on calibration subset |
| Training cut to training run | SHA-256 of manifest matches expected, size and label distribution within tolerance |
| Trained model to lock | Held-out F1, error-category macro F1, per-stratum bias metrics meet acceptance |

### 7.3 Anomaly detection and triage

| Signal | Action |
|---|---|
| Spike in schema validation failures | Page on-call, freeze ingestion until root cause known |
| Sudden drop in average inference confidence | Auto-open ticket, sample affected reps to QA queue |
| Drift in KPI distributions (per device, site, cohort) | Weekly drift report, manual triage |
| Per-subject label outlier distribution (Phase A) | Auto-flag for re-review (the "audit before calibrating" rule) |
| AE attributable to system (Phase B) | Immediate page to DPO + clinical lead, freeze affected device |

# Part IV: Platform

## 8. Storage, access, identity

### 8.1 Storage layout

The cloud has two object-store tiers (warm and cold) and one relational store (hot). Within each tier, data is organised by purpose. The vendor-specific path syntax is not in scope here because the vendor is not yet selected.

**Warm tier (cloud object store).** Holds operational and corpus artefacts. Each top-level area contains a subtree by purpose. The training corpus area is immutable and version-locked, with one folder per dataset version. The trial area is organised by site and acquisition date, with per-session JSON files and per-rep landmark files. The adverse-event area is organised by date and uses a separate encryption key, so even a platform engineer with general warm-tier access cannot read AE descriptions without the AE key. The usability area is organised by date and subject identifier.

**Cold tier (cold-archive object store).** Holds long-term archives. The corpus archive mirrors the warm-tier dataset-version structure for retained snapshots. The trial archive is partitioned by year. The AE archive is partitioned by year. A separate area, "raw video pending delete," holds raw video that has not yet been deleted and is auto-purged on annotation sign-off.

**Hot tier (relational store).** Holds five schemas. The "core" schema holds sessions, reps, and baselines. The "annotations" schema holds the corpus annotation rows. The "ae" schema holds adverse events. The "usability" schema holds the scored questionnaires. The "audit" schema holds the access and deletion logs.

### 8.2 Roles

The access model uses a small, declarative role set held in version control.

| Role | Capabilities |
|---|---|
| therapist | Read patient data within own caseload, create AE entries |
| annotator | Read corpus clips, write annotation rows |
| adjudicator | Read annotation rows, write adjudicated rows |
| engineer | Read versioned dataset snapshots, trigger training jobs, write to model registry, operate infrastructure, trigger deletion jobs. Cannot read the encrypted AE description field |
| dpo | Read audit log, trigger erasure for a subject |
| security_auditor | Read audit log only |

Privileged roles require MFA. Privileged sessions are time-boxed to a maximum of four hours.

### 8.3 Access patterns

| Persona | Path | Mechanism |
|---|---|---|
| Therapist | Clinical Dashboard | Identity provider with MFA, backend enforces row-level filter to patient cohort |
| Annotator | Annotation workstation | Remote desktop into bastion, no local data persistence, MFA + just-in-time access |
| Engineer | Notebook environment or operational tools | SSO with MFA, scoped to versioned dataset snapshots, break-glass procedure logged separately |
| DPO | Audit tools | SSO with MFA, read-only audit log |
| External auditor | Read-only audit slice | Time-boxed credentials, full access logging, signed agreement |
| Notified Body auditor | Read-only audit slice + QMS documentation | Time-boxed credentials, signed confidentiality agreement, scope limited to the conformity assessment of the Class IIa device per MDR Annex IX |

## Part V: Compliance

## 9. Compliance traceability matrix

Each engineering control in this document supports one or more regulatory obligations. This table is the audit-traceability artefact.

| Control | GDPR | MDR |
|---|---|---|
| Pseudonymisation at acquisition (Section 6.4) | Art. 32(1)(a) | Annex II Section 6, Annex IX Section 2.2 (traceability for Class IIa) |
| Encryption at rest and in transit (Section 8) | Art. 32(1)(a) | Annex I GSPR 17.2 cybersecurity, Annex II Section 6 |
| Audit log of access and deletions (Section 6.3) | Art. 30, Art. 32(1)(d) | Annex II Section 6, traceability evidence for Annex IX audit |
| Retention schedule and deletion | Art. 5(1)(e), Art. 17 | Article 10(8) ten-year retention for Class IIa technical documentation, Annex IX Section 8 |
| Quality gates (Section 7.2) | Art. 5(1)(d) accuracy | Annex II Section 6.2 verification and validation |
| Subject erasure procedure | Art. 17, Art. 28(3)(g) | n/a |
| Bias monitoring across strata (Section 7.3) | Recital 71 (automated decisions) | Annex I GSPR 17 (software), Annex I GSPR 22 (devices intended for use by lay persons not applicable here) |
| KPI-distribution drift monitoring (Section 7.3) | n/a | Article 88 trend reporting in Phase 2 post-market |

GDPR risk weighting and mitigation depth are in the DPIA. MDR-specific record-keeping requirements are in the MDR Compliance Plan. This document is the engineering substrate that both rely on.
