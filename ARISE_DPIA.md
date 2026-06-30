# Data Protection Impact Assessment

|  |  |
|---|---|
| Project | ARISE, Augmented Rehabilitation and Intelligent System for Enhancement |
| Document | Data Protection Impact Assessment, GDPR Article 35 mandatory assessment |
| Work Package | WP1, Task T1.4, Compliance Management |
| Prepared by | Innovina S.r.l., Data Protection Officer |
| Reviewed by | DINOGMI scientific lead, Studio Buccarella clinical lead |
| Companion to | Data Management Plan, MDR Compliance Plan |
| Version, date | 2.3, 9 June 2026 |

## Executive summary

This document is the Data Protection Impact Assessment for the ARISE project, prepared under GDPR Article 35. A DPIA is mandatory for ARISE on three independent grounds. The processing involves a systematic and extensive evaluation of individuals based on automated processing (AI inference). It involves special category data (health) on a large scale. It involves new technologies that have not previously undergone DPIA in the same context.

The assessment is organised around the project lifecycle defined in the Data Management Plan. There is a pre-trial Phase A (M6 to M15, WP3) in which the training corpus is built and the model is trained, a Bridge period (M8 to M18, WP4) in which the locked model is integrated into the prototype platform, and a Phase B (M19 to M24, WP5) in which the system is demonstrated on real patients. Risk profiles differ across phases and are mapped accordingly.

Twelve risks have been identified, with pre-mitigation likelihood and severity scored on a three-point scale. After the mitigations in Section 6 are in place, all residual risks fall to low likelihood and low to medium severity. No residual risk crosses the threshold for prior consultation with the Garante per la protezione dei dati personali under Article 36.

The DPIA covers GDPR-specific operational controls (retention, deletion, audit logging, encryption, breach response) inline in Section 6. Wider engineering controls (storage, access, pipelines, quality gates) are specified in the DMP and referenced where relevant.

The medical-device classification under MDR has been confirmed as **Class IIa under Annex VIII Rule 11**. This DPIA reflects that confirmation. The Article 22 safeguard in Section 6.8 is calibrated accordingly: the locked model produces information used by the supervising clinician, who remains the clinical decision-maker, so the processing does not constitute a fully automated decision producing legal or similarly significant effects on the data subject.

# Part I: Foundations

## 1. Purpose and legal basis for the DPIA

### 1.1 Why a DPIA is mandatory for ARISE

GDPR Article 35(1) requires a DPIA when processing is likely to result in a high risk to the rights and freedoms of natural persons. Article 35(3) lists three case-based triggers. ARISE meets all three independently.

| Trigger (Article 35(3)) | How it applies to ARISE |
|---|---|
| (a) Systematic and extensive evaluation of personal aspects based on automated processing | The system performs AI-driven classification of repetitions and identifies clinical errors used to inform therapy decisions |
| (b) Processing of special category data (Article 9) on a large scale | Health data is processed across the training corpus and the TRL6 trial, covering hundreds of subjects |
| (c) Use of new technologies | Markerless RGB-based 3D pose estimation combined with biomechanical AI inference is novel in this clinical context |

### 1.2 Scope of this DPIA

This DPIA covers the entire ARISE Phase 1 processing activity from corpus acquisition (M6) through TRL6 clinical demonstration (M24).

| In scope | Out of scope |
|---|---|
| Processing during Phase A, Bridge, Phase B | Phase 2 commercialisation processing (separate Phase 2 DPIA at CE marking) |
| Personal-data streams D-CORPUS, D-TRIAL, D-USABILITY (per DMP Section 4.1) | Non-personal streams D-TELEMETRY and D-ENG |
| Risks to data subject rights and freedoms | Risks to clinical or commercial outcomes (covered by the MDR Compliance Plan) |
| Privacy-specific operational controls (retention, deletion, audit, breach) included inline in Section 6 | Wider engineering controls in the DMP |

### 1.3 Audience

The document is intended for the Innovina Data Protection Officer and Project Lead. It is also reviewed by the scientific lead at DINOGMI, by the clinical lead at Studio Buccarella, by the Ethics Committee in connection with the protocol submission, and by ERDF compliance auditors.

## 2. Lawful bases summary

The processing rests on the following GDPR Article 6 and Article 9 bases. Granular explicit consent is the principal basis. Secondary bases support specific operations that retain a regulatory or contractual character beyond the consent envelope.

| Activity | Article 6 basis | Article 9 basis |
|---|---|---|
| Corpus acquisition (Phase A) | 6(1)(a) explicit consent | 9(2)(a) explicit consent, with 9(2)(j) scientific research (Art. 89(1) safeguards) as secondary basis |
| Model training (Phase A) | 6(1)(a) explicit consent (same data subjects, same consent) | 9(2)(a) and 9(2)(j) |
| Trial operation, therapeutic context (Phase B) | 6(1)(a) explicit consent + 6(1)(b) contract for care between patient and clinic | 9(2)(a) and 9(2)(h) provision of health care |
| Adverse event log handling (Phase B) | 6(1)(c) legal obligation under MDR Article 80 (recording and reporting of adverse events during clinical investigations) | 9(2)(a) explicit consent (the participant consents to AE recording at enrolment), with 9(2)(h) as secondary basis (care-relationship context) |
| Usability questionnaires (Phase B) | 6(1)(a) explicit consent | 9(2)(a) |
| Sharing with DINOGMI for research | 6(1)(a) | 9(2)(a), 9(2)(j) |
| Sharing with Studio Buccarella for care | 6(1)(b) | 9(2)(h) |

Article 6(1) bases used are (a) consent, (b) contract, and (c) legal obligation. Article 9(2) bases used are (a) explicit consent, (h) provision of health care, and (j) scientific research with the safeguards required by Article 89(1).

The MDR reference for Phase 1 is Article 80 (clinical investigation AE recording), not Article 87 (post-market vigilance), because the device is not yet placed on the Union market during the TRL6 demonstration. Article 87 becomes the controlling reference in Phase 2 after CE marking, with the post-market surveillance framework of Articles 83 to 86 applying to the Class IIa device.

Consent is documented in writing through the Informed Consent procedure that is attached to D1.2. Consent is granular: the subject consents separately to therapeutic use, to use of data for AI training, and to use for scientific publication and dissemination. Withdrawal of consent is operationalised through the deletion procedure in Section 6.5.

# Part II: The processing

## 3. Description of the processing

### 3.1 Nature

The processing comprises four activities that vary by phase. Engineering details are in the DMP. This section restates the privacy-relevant aspects only.

| Activity | Phase | Privacy-relevant aspect |
|---|---|---|
| Video capture of patient performing STS | Phase A and Phase B | Biometric and health data, special category (Article 9) |
| Derivation of 3D anatomical landmarks and biomechanical KPIs | Phase A and Phase B | Derived special category data |
| Classification by rule layer and AI model | Phase A (laboratory) and Phase B (in operation, with locked model from D3.4) | Automated processing of special category data |
| Annotation and adjudication of the corpus | Phase A only (M9 to M15) | Human-attributed labels on identified biometric data |

### 3.2 Scope

| Aspect | Detail |
|---|---|
| Categories of data subject | Adult patients in active rehabilitation, healthy adult volunteers for the AI training corpus |
| Categories of data | Biometric (3D pose), health (rehabilitation performance), opinion (usability questionnaires) |
| Volume estimate | Approximately 50 to 100 subjects in Phase A, 50 to 150 subjects in Phase B |
| Duration of active processing | M6 to M24 |
| Retention after active processing | See Section 6.4 (retention schedule) |

### 3.3 Context

| Aspect | Detail |
|---|---|
| Relationship with data subjects | Patient and clinical care provider (Studio Buccarella), or research participant and research institution (DINOGMI) |
| Reasonable expectation of processing | Yes. Consent is informed, explicit, granular |
| Vulnerable populations | Yes. Geriatric patients, post-stroke patients with possible cognitive impairment. Special safeguards apply (Section 6.6) |
| Previously processed elsewhere | No |
| Public concerns | None specifically identified to date |

### 3.4 Purposes

Each purpose has a necessary justification.

| Purpose | Necessity justification |
|---|---|
| Real-time biofeedback to the patient during the rep | Core therapeutic function. Cannot be achieved without per-frame biometric capture |
| Longitudinal therapeutic monitoring by the therapist | Requires per-rep KPI data. Pseudonymisation is sufficient |
| Training AI models that generalise across patient populations | Requires diverse labelled examples. Pseudonymised landmark and label data is sufficient |
| TRL6 validation evidence (D5.1) | Required by the funding programme and by the Ethics Committee |
| Post-market surveillance preparation (MDR alignment for the confirmed Class IIa device) | Required for Phase 2 commercialisation pathway under MDR Articles 83 to 86 |

## 4. Necessity and proportionality

### 4.1 Data minimisation

The dataset retained long-term is the minimum necessary for the stated purposes.

| Minimisation measure | Operational detail |
|---|---|
| Raw video deleted after labelling sign-off | Retention 6 to 12 months from acquisition. Trigger is annotation manifest sign-off |
| Identifier mapping held only at the clinical site | Innovina engineers and annotators never receive the mapping |
| AI training on pseudonymised data only | Identifiers removed at the corpus snapshot boundary |
| Per-rep aggregation | No continuous physiological streams retained beyond the rep |

### 4.2 Accuracy

Annotator double-labelling and DINOGMI adjudication ensure label accuracy (DMP Section 3.1 and Section 6.1). Data subjects can request correction of inaccurate data through the channel described in Section 4.4 below.

### 4.3 Information provided to data subjects

Under Articles 13 and 14, each data subject receives a structured Information Sheet at recruitment. The Information Sheet is finalised in D1.2 and covers the following elements.

| Element | Notes |
|---|---|
| Identity of the Controller | Named in the Information Sheet |
| Purposes and lawful basis | Granular: therapeutic, training, publication |
| Recipients | Innovina, DINOGMI, Studio Buccarella |
| Retention | Per Section 6.4 below |
| Rights | Access, rectification, erasure, restriction, portability, object, not subject to fully automated decision-making |
| Right to lodge a complaint | With the Garante per la protezione dei dati personali |
| Automated processing safeguard | No fully automated clinical decision is taken on the patient. ARISE is a Class IIa medical device that produces information for the therapist, who remains the clinical decision-maker |

### 4.4 Data subject rights

Rights are operationalised through the clinical site, who relays through the subject ID mapping to Innovina when needed.

| Right (GDPR) | Mechanism |
|---|---|
| Information (Art. 13, 14) | Information Sheet at recruitment |
| Access (Art. 15) | Patient requests via Studio Buccarella |
| Rectification (Art. 16) | Same channel |
| Erasure (Art. 17) | Same channel. Technical procedure in Section 6.5 below |
| Restriction (Art. 18) | Same channel |
| Portability (Art. 20) | Limited applicability. Available on request in a machine-readable format |
| Object (Art. 21) | Same channel. Effective from receipt |
| Not subject to automated decisions (Art. 22) | Confirmed. ARISE is decision support. The therapist decides |

### 4.5 Joint controller and processor arrangements

| Agreement | Parties | Scope |
|---|---|---|
| Data Processing Agreement (Art. 28) | Innovina (Processor) and Studio Buccarella (Controller) | Clinical operation during Phase B |
| Joint Controller Agreement (Art. 26) | Innovina and DINOGMI | AI training corpus (Phase A) |

Both agreements include sub-processor obligations, security commitments, audit rights, and breach notification timelines.

# Part III: Risk and mitigation

## 5. Risk register

### 5.1 Identified risks

Twelve risks have been identified across the project lifecycle. Each is scored on likelihood and severity using a three-point scale (Low, Medium, High) before mitigation. The phase in which the risk is most prominent is indicated. Affected rights are expressed in concrete GDPR terms: privacy, self-determination, autonomy, non-discrimination.

| ID | Risk | Phase most exposed | Likelihood (pre) | Severity (pre) | Affected rights |
|---|---|---|---|---|---|
| RD1 | Re-identification of pseudonymised data via biometric pose signature | A, B | Medium | Medium | Privacy, non-discrimination |
| RD2 | Unauthorised access to clinical data at rest | A, B, Bridge | Low | High | Privacy, self-determination |
| RD3 | Unauthorised access in transit | A, B | Low | High | Privacy |
| RD4 | Data breach with public disclosure | A, B, Bridge | Low | High | Privacy, self-determination, non-discrimination |
| RD5 | Function creep: data used for purposes not consented to | A, B | Medium | High | Self-determination, autonomy |
| RD6 | Retention beyond schedule | A, B | Medium | Medium | Self-determination |
| RD7 | Bias in AI training data leading to inequitable care | A | Medium | Medium | Non-discrimination |
| RD8 | Patient inferred clinical condition disclosed beyond intended audience | B | Low | High | Privacy, possible economic harm |
| RD9 | Misclassification by the locked model leading to harmful therapeutic recommendation | B | Low | Medium | Health |
| RD10 | Adverse-event log mishandled, exposing identifiable patient | B | Low | High | Privacy |
| RD11 | Continued processing of a withdrawn participant's data due to incomplete propagation of the withdrawal across systems | A, B | Medium | Medium | Self-determination |
| RD12 | Re-identification of an adverse-event patient via pose signature stored alongside the AE record | B | Low | High | Privacy |

### 5.2 Risk-by-phase summary

| Phase | Risks predominantly active in this phase |
|---|---|
| Phase A (corpus, M6 to M15) | RD1, RD5, RD7, RD11 |
| Bridge (prototype, M8 to M18) | RD2, RD4 |
| Phase B (trial, M19 to M24) | RD8, RD9, RD10, RD12, plus continuing RD1 to RD7 |
| Continuous (M1 to M24) | RD2, RD3, RD4, RD6, RD11 |

## 6. Mitigation measures

Each risk in Section 5 is mapped to one or more mitigations below. Wider engineering controls live in the DMP. Privacy-specific operational controls (retention, deletion, audit, breach, encryption) are stated inline here because they are GDPR controls and belong in this document.

### 6.1 Against re-identification (RD1, RD12)

| Measure | Detail |
|---|---|
| Identifier mapping held only at the clinical site | Innovina never receives the mapping (DMP Section 6.4) |
| Pose data exported as a 23-joint BVH-compatible skeleton, not raw biometric template | D1.1 Section 2.2 |
| Raw video never shared outside Innovina, deleted at retention trigger | Section 6.4 and Section 6.5 below |
| Annotation guidelines exclude rare-condition outliers that could be re-identified by inference | DMP Section 3.1 |
| AE record stores no raw pose data, only a textual description and pointers to the relevant session and rep | Section 6.9 below |

### 6.2 Against unauthorised access (RD2, RD3): encryption and access control

| Measure | Detail |
|---|---|
| Encryption at rest | All personal-data tiers use encryption with customer-managed keys |
| Encryption in transit | Transport Layer Security on every data-bearing connection |
| Role-based access, least privilege | Roles defined in DMP Section 8.2, access patterns in DMP Section 8.3 |
| Time-boxed elevation of privileged roles | Maximum 4 hours per session for engineering roles |
| Audit log of all access events | Append-only, immutable |
| Penetration testing | First test before WP4 backend goes live (M15), annual thereafter |

### 6.3 Against breach (RD4): breach response procedure

| Measure | Detail |
|---|---|
| Breach detection | Monitoring alerts on anomalous access patterns |
| Supervisory authority notification | Within 72 hours of confirmed breach (Article 33). DPO is the notifier |
| Data subject notification | Per Article 34 when the breach is likely to result in high risk to rights and freedoms. Channel via the clinical site |
| Documentation | Incident log entry. Root cause analysis |
| Annual simulation | One tabletop exercise per year |

### 6.4 Against retention beyond schedule (RD6): retention schedule

Retention is enforced automatically by a nightly job that evaluates retention rules against the audit log.

| Dataset, component | Retention | Justification |
|---|---|---|
| D-CORPUS, raw acquisitions (video) | 6 to 12 months from acquisition | Time needed to derive and audit the landmark stream |
| D-CORPUS, raw acquisitions (landmarks + KPIs) | 10 years from study end | MDR Article 10(8) minimum retention for the technical documentation of a Class IIa device |
| D-CORPUS, annotations | 10 years | Auditability of training corpus |
| D-TRIAL, operational (per-rep KPIs, sessions) | 10 years from session | MDR Article 10(8) minimum retention for Class IIa |
| D-TRIAL, AE log sub-component | 15 years from incident | Medical-device incident record-keeping |
| D-USABILITY | 10 years | MDR Article 10(8) minimum retention for Class IIa |
| Subject ID mapping (held only at clinical site) | 10 years | Required for data subject rights exercise |

Retention for non-personal data (D-TELEMETRY, D-ENG) is governed by the DMP and not in scope here.

### 6.5 Against function creep (RD5) and withdrawn-data propagation (RD11)

| Measure | Detail |
|---|---|
| Granular consent | Separate boxes on the consent form for therapeutic use, AI training, publication. Documented in D1.2 |
| Purpose-specific access control | AI training environment cannot access clinical-only data, and vice versa (DMP Section 8) |
| Erasure procedure | On withdrawal of consent, the DPO triggers the erasure job, which propagates the subject_id to deletion across hot, warm, and cold tiers, and removes the subject from any open dataset cut not yet frozen. Anonymised aggregates already used in publications cannot be retracted (this is disclosed in the Information Sheet) |
| Erasure verification | Quarterly audit confirms that no subject_id flagged for erasure remains in any tier |

### 6.6 Against bias (RD7)

| Measure | Detail |
|---|---|
| Stratified recruitment | Across age, gender, condition type. Documented in D1.2 |
| Bias metrics in D5.1 | Reported per demographic stratum |
| Annotation audit | DMP Section 7.3 flags subjects whose labels show systematic outlier distribution before training |

### 6.7 Against inferred-condition disclosure (RD8)

| Measure | Detail |
|---|---|
| Pseudonymisation | DMP Section 6.4 |
| Strict role-based access at the Dashboard | Only the patient's named therapist sees their data (DMP Section 8.2) |

### 6.8 Against misclassification harm (RD9)

| Measure | Detail |
|---|---|
| Article 22 safeguard | The locked model produces information for the therapist, who remains the clinical decision-maker. No fully automated clinical decision is made on the patient. This is consistent with the confirmed Class IIa classification of the device (decision-support software for therapeutic decisions) |
| Biofeedback limitation | Real-time biofeedback is limited to motor-cue guidance and is not a clinical diagnosis (D1.1) |
| Always-on safety flags | G1 and G2 fire regardless of phase, calibration, or personalisation (D1.1 Section 6.6) |
| Adverse event log | Captures any incident attributable to system use |

### 6.9 Against AE log mishandling (RD10)

| Measure | Detail |
|---|---|
| Restricted access | Clinical lead at the trial site and Innovina |
| Pseudonymisation at entry | AE records carry the opaque subject_id, never the patient's real identity |
| Separate-key encryption | AE description field encrypted with a key not held by general engineering roles |
| No raw pose data attached | AE record links by session_id and rep_id to indices, not to raw landmarks (mitigation against RD12) |

### 6.10 Audit logging policy

Two logs are maintained, both append-only and immutable.

| Log | Retention | Scope |
|---|---|---|
| Data-access audit log | 2 years | Every read of personal data, with timestamp, role, subject_id (pseudonymised), action |
| Deletion audit log | 10 years | Every deletion event, with timestamp, role, dataset, justification |

### 6.11 Residual risk summary

After the mitigations in this section are in place, all residual risks fall to low likelihood and low to medium severity. No residual risk crosses the threshold for prior consultation with the supervisory authority under Article 36.

# Part IV: Governance

## 7. Roles and consultations

| Role | Organisation | Responsibility under this DPIA |
|---|---|---|
| Data Protection Officer | Innovina | Owns this DPIA, approves and reviews, primary point of contact for the supervisory authority |
| Project Lead | Innovina | Operational responsibility for implementing mitigations |
| Scientific Lead | DINOGMI | Approves mitigations relevant to research processing (Section 6.6 bias) |
| Clinical Lead | Studio Buccarella | Approves mitigations relevant to clinical processing (Section 6.7 inferred condition, Section 6.9 AE) |
| Joint Controller | Innovina and DINOGMI | Article 26 agreement governs the training corpus |
| Patient representatives | Via Studio Buccarella where available | Consulted during design of the Information Sheet and consent procedure |

## 8. Approval and review cadence

| Event | Trigger | Outcome |
|---|---|---|
| Material change review | Any material change to purpose, data type, recipients, retention, security | New DPIA version |
| Breach review | Any data breach | New DPIA version with updated risk register |
| Routine review | At M12 (project mid-term) and M24 (project end) | Confirmation or revision |
| Phase transition review | Before Phase A starts (M6), before Phase B starts (M19) | Confirmation that controls are in place |
| Pre-Phase 2 review | At the end of Phase 1, before CE marking is sought for the Class IIa device | A Phase 2 DPIA is opened that supersedes the present document for the commercial post-market processing |
