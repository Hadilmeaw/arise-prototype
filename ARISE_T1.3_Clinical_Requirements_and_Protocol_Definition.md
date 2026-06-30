# T1.3 Clinical Requirements and Protocol Definition

|  |  |
|---|---|
| Project | ARISE, Augmented Rehabilitation and Intelligent System for Enhancement |
| Document type | Task description, work streams, and partner responsibilities |
| Work Package | WP1, Task T1.3 |
| Task lead | Innovina S.r.l. |
| Partners | DINOGMI, University of Genoa, Studio Buccarella |
| Period | M1 to M6 |
| Deliverables produced | D1.1 at M3, D1.2 at M6 |
| Confirmed MDR classification | Class IIa under Annex VIII Rule 11 |
| Companion to | D1.1, D1.2, Compliance Dossier (DMP, DPIA, MDR Compliance Plan) |
| Version, date | 2.0, 9 June 2026 |

## Executive summary

This document is the consolidated output of Task T1.3 in the ARISE Work Package 1. T1.3 is the foundational Industrial Research phase of the project. It runs from M1 to M6 under the lead of Innovina with three parallel work streams. The scientific work stream is led by DINOGMI and produces the biomechanical framework that becomes the ground truth for AI training. The clinical work stream is led by Studio Buccarella and produces the functional and usability requirements that the ARISE system must satisfy. The ethical and operational work stream is led by Innovina with support from the University of Genoa and produces the clinical investigation protocol and the Ethics Committee submission package.

The substantive output of T1.3 is described in this document. The Sit-to-Stand task is decomposed into six biomechanical phases. Eighteen Key Performance Indicators are defined per repetition, grouped in five anatomical categories. Fourteen clinical error codes are defined to capture the dominant deviations from the canonical execution, complemented by two safety flags that are always active. Ground truth for AI training is built through a double-blind annotation procedure adjudicated by DINOGMI. The clinical investigation in WP5 is a single-site, single-arm, prospective demonstration at Studio Buccarella, non-interventional with respect to the patient's prescribed rehabilitation therapy, with broad inclusion criteria and four families of outcome measures. The investigation is conducted under the clinical-investigation framework of MDR Articles 62 to 82 applicable to the **Class IIa** ARISE device, and the safety framework follows MDR Article 80.

# Part I: Foundations

## 1. Purpose, scope, audience

### 1.1 Purpose

To define the clinical and biomechanical specification that governs the entire ARISE project. The output of T1.3 is the technical and clinical baseline for the AI development in WP3, the prototype built in WP4, and the clinical demonstration in WP5. Without T1.3, the rest of the project lacks a defensible target.

### 1.2 Scope

T1.3 covers three areas:

- The first is the biomechanical specification of what constitutes a correct execution of the Sit-to-Stand task.
- The second is the functional and usability specification of the system from the perspective of the clinical site.
- The third is the operational and ethical specification of how the WP5 clinical demonstration is run, including alignment with the MDR clinical-investigation framework for the confirmed Class IIa device.

T1.3 does not cover the AI model implementation (delivered by WP3), the hardware design (delivered by WP3 Task T3.5), the cloud architecture (delivered by WP2 Task T2.1), or the UI design execution (delivered by WP2 Task T2.3). T1.3 produces the requirements that those tasks then satisfy.

### 1.3 Audience

The document is read by the Innovina Project Lead, the Person Responsible for Regulatory Compliance (PRRC) at Innovina, the scientific lead at DINOGMI, the clinical lead at Studio Buccarella, the academic and regulatory contact at the University of Genoa, and the technical leads at Innovina and Invenio.

## 2. Position in the work plan

| Aspect | Value |
|---|---|
| Work Package | WP1, Project Management, Requirements and Dissemination |
| Task identifier | T1.3 |
| Task title | Definition of Clinical Requirements and Protocol |
| Period | M1 to M6 |
| Task lead | Innovina S.r.l. |
| Partners involved | DINOGMI (scientific), Studio Buccarella (clinical), University of Genoa (operational and regulatory support) |
| Deliverables produced | D1.1 at M3, D1.2 at M6 |
| Downstream consumers | WP3 (D1.1 as AI training ground truth), WP4 (D1.1 for prototype acceptance criteria), WP5 (D1.2 as the clinical investigation protocol) |
| Regulatory context | Class IIa clinical investigation under MDR Articles 62 to 82, supported by the ARISE Compliance Dossier (DMP, DPIA, MDR Compliance Plan) |

## 3. Methodology of T1.3

T1.3 follows three principles:

- First, the work is partner-led where the expertise lies with the partner and Innovina-led where the responsibility lies with the sponsor.
- Second, the work streams run in parallel from M1 with weekly coordination, and converge into the two deliverables at M3 and M6 respectively.
- Third, every requirement that emerges from T1.3 is defensible against either a clinical, a biomechanical, or a regulatory source. For the regulatory dimension, the controlling framework is MDR Regulation (EU) 2017/745 applied to the confirmed Class IIa classification of the device.

# Part II: Scientific work stream, biomechanical framework

## 4. The Sit-to-Stand task in clinical context

### 4.1 Clinical significance

The Sit-to-Stand task is the act of rising from a seated position to a standing position without external assistance. It is one of the most frequently executed Activities of Daily Living. A typical adult performs the transition many times per day. The task is a prerequisite for functional independence in three of the most common rehabilitation contexts: geriatric rehabilitation, orthopedic rehabilitation following hip or knee arthroplasty, and neurological rehabilitation following stroke or in the management of Parkinson disease.

The clinical significance of Sit-to-Stand performance has been established for decades. Cross-sectional studies have established that Sit-to-Stand time correlates with quadriceps strength, with hip and knee range of motion, with fall risk, and with broader functional independence. Longitudinal studies have established that Sit-to-Stand performance is a predictor of subsequent hospitalisation, of loss of independence, and of mortality in older adults. Within rehabilitation, the Sit-to-Stand task is a standard exercise prescribed across multiple pathways. It is performed dozens of times per session in many rehabilitation programs.

### 4.2 Why the Sit-to-Stand task is biomechanically informative

The task is biomechanically informative because it stresses several physiological subsystems simultaneously under conditions that approximate routine functional demand. The lower-limb extensor chain is activated through near-full range of motion at the hip, knee, and ankle. The trunk control system is challenged to produce the anterior flexion required to bring the centre of mass over the base of support. The bilateral balance system is challenged to maintain stability while the centre of mass moves through a vertical excursion. The temporal pattern of activation reveals motor planning, motor execution, and post-task stabilisation.

A degraded Sit-to-Stand performance is therefore biomechanically attributable. A patient who cannot complete the task may be limited by quadriceps strength, by hip or knee range of motion, by trunk control, by balance, by motor planning, or by some combination thereof. The biomechanical signals during the task reveal which subsystem is rate-limiting. This makes the Sit-to-Stand task an unusually rich diagnostic and monitoring target.

### 4.3 Existing assessment paradigms versus ARISE

Three classes of assessment paradigm are currently in clinical use for the Sit-to-Stand task. Each has known strengths and limitations.

| Paradigm | Strengths | Limitations |
|---|---|---|
| Stopwatch-based timing (five-times Sit-to-Stand, 30-second chair-stand) | Inexpensive, no equipment, standard normative data | Single scalar output, no biomechanical attribution, depends on subjective stopping criterion |
| Force-platform kinetics | Objective ground reaction forces, load symmetry quantifiable | Static apparatus, no kinematic information, expensive, not portable |
| Inertial measurement units (IMU) | Kinematic information per joint, portable | Drift, calibration issues, patient must wear the units, usability burden |
| Marker-based motion capture | Gold-standard kinematics | Studio environment, expensive, marker placement time, not routine-clinic-compatible |

The ARISE system positions itself differently. It uses markerless RGB capture combined with on-device 3D pose estimation and AI-based classification. The patient does not wear any instrumentation. The clinical site does not require studio conditions. The system produces a rich biomechanical record per repetition that is both immediately fed back to the patient and aggregated for the therapist.

## 5. Biomechanical phases of the Sit-to-Stand task

### 5.1 Phase decomposition

The Sit-to-Stand task is decomposed into six consecutive phases. The decomposition is more granular than the classical four-phase Schenkman model in that it separates the post-standing stabilisation period as a distinct phase. The separation is biomechanically and clinically motivated: the postural control system requires a measurable period to settle after reaching upright, and the failure mode "patient reaches standing but is still leaned at the moment of peak hip elevation" is clinically distinct from the failure mode "patient never reaches standing at all."

| N | Phase | Definition |
|---|---|---|
| 1 | Sitting | Pre-movement rest. Pelvis is stationary on the chair. Sitting is the reference state for personalisation baselines |
| 2 | Forward lean | Anterior trunk flexion in preparation for lift-off. The pelvis is still on the chair. Forward lean is required to bring the centre of mass over the base of support |
| 3 | Lift-off | The pelvis leaves the chair. Hip and knee extension are active under load. Lift-off is the phase of maximum power demand |
| 4 | Standing | Full upright posture is reached. Knee and hip are near full extension |
| 5 | Stabilisation | Post-standing balance window. The hip-Y trajectory is flat near its peak. The postural control system settles |
| 6 | Descent | Controlled return to the seated position. Descent is symmetric in time to the ascent in healthy execution and pathologically truncated in some compensations |

### 5.2 Phase boundary detection criteria

Phase boundaries are detected from three kinematic signals: vertical hip velocity, knee extension angle, and trunk angle. The detection logic is documented in the per-frame phase detector specified for the on-device pipeline. The principal transitions are summarised below.

| Transition | Detection criterion |
|---|---|
| Sitting to forward lean | Trunk angle exceeds a sitting-baseline threshold sustained over a short window |
| Forward lean to lift-off | Vertical hip velocity exceeds a positive threshold |
| Lift-off to standing | Vertical hip velocity returns to near zero with knee extension above a near-full-extension threshold |
| Standing to stabilisation | Vertical hip velocity at or below zero, no descent yet initiated |
| Stabilisation to descent | Vertical hip velocity drops below a negative threshold |
| Descent to sitting | Vertical hip velocity returns to zero at a low hip-Y position |

### 5.3 Why phase awareness matters

Phase awareness is what allows the system to assign different clinical meaning to the same biomechanical reading. A trunk angle of forty degrees is expected during forward lean and is a sign of adequate momentum generation. The same trunk angle during stabilisation indicates that the patient has not fully righted the trunk and triggers the Incomplete Upright error (E10). A knee angle of one hundred forty degrees is normal during lift-off. The same angle at standing indicates incomplete extension and triggers E3. Phase awareness multiplies the diagnostic power of the underlying kinematic signals.

## 6. Key Performance Indicators

### 6.1 Reference frame and normalisation invariant

Every KPI defined in this section is computed in a patient-anchored coordinate frame. The origin is the mid-pelvis at the first frame of the repetition. The vertical axis is gravity-aligned. The sagittal axis points in the direction the patient faces. The frontal axis is lateral, positive to the patient's left.

The whole repetition is height-normalised by the head-to-foot distance measured at the first frame. The anchor is not refreshed per frame. The reason is critical for biomechanics. Per-frame normalisation by the current head-to-foot distance would regress out the pelvis-Y rise trajectory, which is the dominant kinematic feature of an STS. Anchoring once at frame 0 preserves that trajectory and makes the KPIs comparable across patients of different stature.

### 6.2 Trunk KPIs

The trunk category contains five KPIs that characterise sagittal-plane trunk posture across the repetition.

| KPI | Phase | What it captures |
|---|---|---|
| Sitting trunk angle (mean) | Sitting | Pre-movement trunk posture. Baseline for personal reference |
| Peak trunk angle (ascent) | Forward lean, lift-off | Magnitude of forward lean. Required for momentum generation |
| Trunk angle at peak hip elevation | Standing | Residual lean at full upright. Marker of incomplete recovery |
| Spine curvature (mid-shoulder angle) | All phases | Slumped vs neutral spine. Angle at mid-shoulder of the chain mid-hip to mid-shoulder to nose |
| Lateral trunk sway | Lift-off, standing | Frontal-plane trunk centre-of-mass excursion. Independent of shoulder differential |

### 6.3 Knee KPIs

The knee category contains seven KPIs that characterise knee extension, asymmetry, and alignment.

| KPI | Phase | What it captures |
|---|---|---|
| Peak left knee extension | Lift-off, standing | Maximum knee extension reached on the left side |
| Peak right knee extension | Lift-off, standing | Maximum knee extension reached on the right side |
| Knee extension asymmetry | Standing | Inter-limb difference in peak extension. Flags unilateral deficit |
| Left knee valgus, normalised | Lift-off, standing | Inward collapse of the left knee. Normalised by hip width |
| Right knee valgus, normalised | Lift-off, standing | Inward collapse of the right knee. Normalised by hip width |
| Knee-to-hip ratio (KHR) | Lift-off, standing | Inter-knee distance divided by inter-hip distance. Covers both valgus and varus in a single metric |
| Knee mediolateral instability count | Forward lean, lift-off | Lateral oscillation of the knees during ascent. Captures tremor and stalled ascent |

### 6.4 Hip and velocity KPIs

The hip and velocity category contains four KPIs that characterise hip extension and the speed of the ascent.

| KPI | Phase | What it captures |
|---|---|---|
| Peak left hip extension | Lift-off, standing | Maximum hip extension on the left |
| Peak right hip extension | Lift-off, standing | Maximum hip extension on the right |
| Peak hip vertical velocity | Lift-off | Speed of pelvis rise. Strong clinical proxy for lower-limb power |
| Hip velocity zero-crossing count | Forward lean, lift-off | Oscillation in the vertical rise. Captures stalled or retrying lifts |

### 6.5 Symmetry and balance KPIs

The symmetry and balance category contains three KPIs that characterise whole-body balance and inter-limb symmetry.

| KPI | Phase | What it captures |
|---|---|---|
| CoM lateral excursion, maximum | Lift-off, standing | Largest lateral centre-of-mass displacement during ascent |
| CoM lateral excursion, minimum | Lift-off, standing | Largest contralateral centre-of-mass displacement |
| Shoulder-height differential | All phases | Inter-shoulder vertical asymmetry. Compensatory lateral lean from the shoulders |

### 6.6 Phase-duration KPIs

The phase-duration category contains six timing metrics, one per phase.

| KPI | Clinical relevance |
|---|---|
| Duration of sitting | Inter-rep rest. Fatigue indicator |
| Duration of forward lean | Preparation time before lift-off. Prolonged values indicate hesitation or motor-initiation deficit |
| Duration of lift-off | Ascent execution time. Most informative single duration |
| Duration of standing | Time stabilised upright before descent |
| Duration of stabilisation | Post-standing balance window. Shortness indicates poor postural control |
| Duration of descent | Controlled return time. Too-short value flags uncontrolled drop |

### 6.7 Per-patient personalisation layer

The eighteen KPIs above are computed against a fixed coordinate frame and are comparable across patients in principle. In practice, individual variability in anatomy and habit means that a single population threshold is too crude for personalised therapy. The system therefore maintains a per-patient reference distribution for each KPI, computed from the patient's own clinically correct repetitions.

The personalisation layer has three safeguards. First, a minimum of five clinically correct repetitions is required before any per-patient score is computed for that KPI. Second, the reference distribution updates only from clinically correct repetitions, so a patient who is consistently wrong does not normalise to "wrong is normal." Third, the population-level thresholds remain frozen. The per-patient score is a complementary signal, not a replacement for the absolute thresholds. A patient whose form was good last week and is subtly off today is flagged by the per-patient layer even if no absolute threshold is crossed.

## 7. Clinical error taxonomy

### 7.1 Structure of the taxonomy

The error taxonomy contains fourteen clinical error codes grouped into five anatomical categories, plus two safety flags that are always on. The taxonomy is what the AI is trained to predict and what the Clinical Dashboard reports to the therapist.

| Category | Error codes | Number |
|---|---|---|
| Trunk | E2, E3b, E5 | 3 |
| Knees | E1, E1b, E4, E6b | 4 |
| Completion | E3, E6, E8, E9, E10 | 5 |
| Symmetry | E7 | 1 |
| Hands | E11 | 1 |
| Safety flags | G1, G2 | 2 |

### 7.2 Trunk errors

| Code | Name | Clinical pattern |
|---|---|---|
| E2 | Insufficient forward lean | Patient attempts to stand without enough hip-trunk flexion to bring the centre of mass over the feet. Common in hip-flexor weakness, fear of falling, learned habit |
| E3b | Slumped spine | Sustained kyphotic posture during the rep. Thoracic-driven, not hip-driven. Distinct from E2 |
| E5 | Trunk sway | Excessive lateral motion during ascent or standing. Balance compensation, side-specific weakness, fear of falling |

### 7.3 Knee errors

| Code | Name | Clinical pattern |
|---|---|---|
| E1 | Knee valgus | One or both knees collapse medially under load. Major risk factor for medial collateral ligament strain and for patellofemoral pain. Frequent in hip-abductor weakness |
| E1b | Knee varus | Knees bow outward during ascent. Less common but present in bow-leg deformity and certain neurological gait patterns |
| E4 | Asymmetric knee extension | Significant inter-limb difference at standing. Classical post-stroke and post-arthroplasty pattern |
| E6b | Knee instability | Tremor or stalled ascent. Common in Parkinson disease and in deconditioned geriatric patients |

### 7.4 Completion errors

| Code | Name | Clinical pattern |
|---|---|---|
| E3 | Incomplete knee extension | One or both knees fail to reach functional extension at standing. Quadriceps weakness, flexion contracture, pain avoidance |
| E6 | Slow movement | Lift-off duration exceeds threshold. Marker of lower-limb power deficit and frailty |
| E8 | Failed stand | Repetition initiated but full extension never achieved. Patient returns to sitting without completing |
| E9 | Uncontrolled descent | Patient reaches standing but the return to the chair is not controlled. Eccentric quadriceps weakness |
| E10 | Incomplete upright | Patient reaches standing but the trunk is still pronouncedly leaned at the moment of peak hip elevation |

### 7.5 Symmetry errors

| Code | Name | Clinical pattern |
|---|---|---|
| E7 | Asymmetric weight shift | Lateral lean during ascent indicating uneven loading. Key marker of post-stroke hemiparesis and of post-surgical pain avoidance |

### 7.6 Hands errors

| Code | Name | Clinical pattern |
|---|---|---|
| E11 | Hands assist | Patient uses hands on the chair seat or on knees to assist the lift. Two subtypes: pushing on knees, pushing on chair |

### 7.7 Safety flags

The safety flags G1 and G2 are always active and are never suppressed by phase, by calibration, or by personalisation. A false negative on either flag is treated as a patient-safety event.

| Code | Name | Clinical pattern |
|---|---|---|
| G1 | Sudden drop | Anomalous rapid downward motion of the pelvis. Fall precursor or actual fall |
| G2 | Extreme shoulder asymmetry | Severe inter-shoulder height difference. Major loss of balance |

## 8. Ground truth methodology for AI training

### 8.1 Why ground truth matters

The AI models developed in WP3 learn to predict the error taxonomy from the kinematic signals. Their accuracy is bounded by the accuracy of the labels they learn from. A noisy label set produces a model that imitates the noise. A clean, adjudicated label set produces a model whose errors are systematic and identifiable.

### 8.2 Annotation protocol design

The annotation protocol is double-blind and adjudicated. Every repetition in the training corpus is labelled independently by two annotators. Disagreements are resolved by a senior annotator who acts as adjudicator. The annotation captures, for each repetition, a binary label (correct or incorrect), a subset of error codes from the taxonomy, a per-code severity (low, medium, high), and the annotator's confidence (low, medium, high) with an optional free-text clinical note.

### 8.3 Quality safeguards

Before the labelled corpus is released to AI training in WP3, three quality safeguards are run:

- First, a ten-percent random sample of the corpus is jointly re-reviewed by both annotators and the adjudicator to detect systematic label noise.
- Second, the per-subject label distribution is audited to detect any subject whose label distribution is a statistical outlier and might indicate annotation drift specific to that subject.
- Third, the completeness and validity of the metadata (annotator identifier, timestamp, confidence, free-text note presence) is checked.

# Part III: Clinical work stream, functional and usability requirements

## 9. Target patient populations

### 9.1 Population profiles

The patient populations for which ARISE is intended fall within the operational envelope of the rehabilitation contexts below. The Sit-to-Stand task is a routine part of rehabilitation for all of them, although for different clinical reasons. The actual mix of patients seen at the trial site is confirmed with Studio Buccarella during T1.3.

| Population | Primary clinical context | Why STS matters in their therapy |
|---|---|---|
| Geriatric, sarcopenic | Strength and frailty | STS time and quality track frailty progression and predict falls |
| Post-hip or post-knee arthroplasty | Range of motion and load-bearing recovery | STS is a core post-surgical rehabilitation exercise. Asymmetric loading reveals incomplete recovery |
| Post-stroke, hemiparetic | Motor planning, unilateral deficit | STS asymmetry is a sensitive marker of the affected side and a treatment target |
| Parkinson disease | Bradykinesia, postural instability | STS is a routine exercise for ambulation. Tremor and stalled ascents are typical |
| Otherwise healthy adults receiving deconditioning rehabilitation | General functional decline | STS is a standard re-conditioning exercise |
| Healthy adult volunteers | Reference data for ground truth | Healthy volunteers anchor the upper bound of canonical execution, against which patient data is compared |

The system must work across this mix without configuration switching at session start.

### 9.2 What this means for the system

The breadth of the patient population means that the AI must generalise beyond any single pathology. The training corpus in WP3 must include enough examples of each pathology to support stratified evaluation. The Clinical Dashboard must surface pathology-relevant cues without being cluttered for patients whose pathology does not exercise those cues. The per-patient personalisation layer is particularly important for patients whose baseline is far from the population mean.

## 10. Clinical workflow integration

### 10.1 The routine rehabilitation session

The Sit-to-Stand exercise is normally one block within a longer rehabilitation session supervised by a licensed physiotherapist. The exact session duration, the number of repetitions, and the rest intervals are part of the patient's prescribed therapy and are determined by the physiotherapist. ARISE does not change this. The session structure at the trial site was confirmed with Studio Buccarella in the early weeks of T1.3.

### 10.2 Where ARISE fits in the workflow

The data collection at the trial site happens in two stages. In the first stage, video recordings of patients performing the Sit-to-Stand exercise are captured at the site under appropriate consent and processed off-site by Innovina to build the training corpus. In the second stage, after the prototype is built in WP4 and Ethics Committee approval is in place, the integrated ARISE system is deployed at the site and the patient performs the exercise in front of the Coach device, which provides real-time biofeedback and writes data to the Clinical Dashboard. The two-stage approach decouples the corpus-building activity from the live deployment activity and allows the AI model to be trained before the prototype is integrated.

In both stages, the physiotherapist continues to deliver the patient's prescribed therapy. ARISE does not change the therapy. The Coach, when deployed, is supplementary to the physiotherapist's verbal cues.

## 11. Therapist-facing requirements

### 11.1 Clinical Dashboard requirements

The Clinical Dashboard is the therapist-facing interface to the data. The requirements summarised below are agreed with Studio Buccarella during T1.3.

| Requirement | Detail |
|---|---|
| At-a-glance state | The therapist must be able to see a single patient's recent state in one screen, without navigating through menus |
| Trend over time | The therapist must be able to see how a metric has trended over the patient's enrolment, to support therapy adjustment |
| Error breakdown | When a session contained errors, the therapist must be able to see which error codes fired, how often, and with what severity |
| Safety surfacing | Any G1 or G2 event must be surfaced immediately on the patient's home screen and must not be missable |
| Comparison to baseline | Where personalisation data exists, the Dashboard must show the current value relative to the patient's own baseline, not only to the population threshold |
| Inter-session context | The Dashboard must show context across sessions, not only within a session, to support adherence and progression assessment |
| Decision support, not decision making | All language used in the Dashboard must frame data as information for the therapist. No phrase suggests an automated clinical decision. This framing is consistent with the Class IIa positioning of the device under Rule 11 and with the Article 22 GDPR safeguard stated in the DPIA |
| Patient privacy | The Dashboard enforces row-level access. The patient's named therapist sees that patient's data. Other staff at the clinic see only their own caseload |

### 11.2 Setup and operation

The Coach device must be operable by a physiotherapist without specialist support. The detailed setup, operation, and maintenance requirements are agreed with Studio Buccarella during T1.3 and are recorded in D1.1.

## 12. Patient-facing requirements

### 12.1 Coach biofeedback requirements

The Coach biofeedback is the patient-facing element. It runs in real time during the repetition. The requirements below come from observation and from the clinical literature on motor learning in elderly and cognitively impaired patients.

| Requirement | Detail |
|---|---|
| Low cognitive load | The patient must be able to use the biofeedback without instruction beyond the physiotherapist's normal exercise guidance. No interpretation of numbers, no menus, no choices |
| Immediate feedback | Feedback must arrive within the perceptual window for motor learning (sub-100 millisecond from movement to cue) |
| Single dominant signal | At any moment the biofeedback presents one dominant signal, not several. The dominant signal is the most clinically actionable correction available |
| Visual signal | Visual signals must be readable from the typical patient distance and angle. Colour choice respects common forms of colour vision deficiency |
| Audio signal | Audio signal must be distinguishable from ambient gym noise without being intrusive |
| Reinforcement on correct execution | Positive reinforcement on correct execution is as important as correction on incorrect execution. The biofeedback is balanced |

## 13. Operational constraints

The ARISE system is designed to operate in standard rehabilitation environments without studio conditions. Detailed site-specific constraints (lighting, layout, connectivity, maintenance) are confirmed with Studio Buccarella once on-site assessment is performed and are recorded in D1.1. The training corpus in WP3 includes lighting and environmental variation that approximates the realistic range encountered in clinical settings, so the system generalises beyond a single site.

## 14. Inclusion and exclusion criteria for the clinical investigation

### 14.1 Inclusion criteria

The investigation enrolls two cohorts. The patient cohort provides the data on real rehabilitation execution of the Sit-to-Stand task. The healthy-volunteer cohort provides reference data that anchors the upper bound of canonical execution, against which patient data is compared and on which the AI training ground truth is calibrated.

| Cohort | Criterion | Detail |
|---|---|---|
| Patient | Adulthood | At least eighteen years of age |
| Patient | Active rehabilitation | In active rehabilitation at the trial site and prescribed Sit-to-Stand exercises as part of therapy |
| Patient | Informed consent | Able to give informed consent, or a legal representative is able to give it on their behalf, per the Ethics-Committee-approved procedure |
| Patient | Physical capacity | Physically able to attempt the Sit-to-Stand task with the level of supervision normally provided at the trial site |
| Healthy volunteer | Adulthood | At least eighteen years of age |
| Healthy volunteer | Functional status | No current rehabilitation episode and no condition that affects Sit-to-Stand execution |
| Healthy volunteer | Informed consent | Able to give informed consent |

The patient inclusion criteria are intentionally broad. The objective of the investigation is to validate the ARISE system across the realistic mix of patients, not to recruit a single homogeneous cohort.

### 14.2 Exclusion criteria

| Criterion | Detail |
|---|---|
| Acute instability | Patient is in acute medical instability that makes the Sit-to-Stand task inappropriate at the time of enrolment |
| Safety risk | Patient's physical or cognitive condition makes the Sit-to-Stand task unsafe even with normal supervision |
| Inability to consent without representative | Patient has severe cognitive impairment and no legal representative is available to give informed consent on their behalf |
| Concurrent investigation conflict | Patient is enrolled in another clinical investigation whose protocol forbids concurrent enrolment |

# Part IV: Ethical and operational work stream, protocol and submission

## 15. Clinical investigation design

### 15.1 Design justification

The clinical investigation conducted in WP5 is designed as a **single-site, single-arm, prospective demonstration study** of the ARISE system within routine clinical practice. The investigation is **non-interventional with respect to the patient's prescribed rehabilitation therapy**, meaning that all clinical decisions and treatment plans remain entirely under the responsibility of the treating clinicians and are not modified by participation in the investigation. No randomisation procedures are applied, and no control arm is included.

The investigation is, however, a **clinical investigation of an investigational medical device within the meaning of MDR Article 2(45)**, since the ARISE system is the device whose safety and performance are being assessed. As such, the investigation falls under the framework of **MDR Articles 62 to 82** applicable to the confirmed **Class IIa** device, with the safety reporting requirements of **MDR Article 80** in force throughout. The "non-interventional" qualifier above refers to therapeutic prescription only, not to the device itself.

This design choice is guided by three primary considerations:

- First, the principal regulatory and scientific objective of WP5 is to demonstrate the safe and effective integration of the ARISE system into a real-world clinical workflow, rather than to establish comparative treatment efficacy. In this context, a single-arm, prospective demonstration is appropriate, as it enables assessment of system performance, usability, and clinical integration under authentic operating conditions without introducing artificial experimental constraints. The data generated supports the Class IIa clinical evaluation that is required under MDR Article 61 and Annex XIV Part A.
- Second, the non-interventional nature of the investigation with respect to the therapeutic prescription significantly reduces ethical and procedural complexity. By ensuring that patients continue to receive their standard, individually prescribed rehabilitation therapy without alteration, the investigation avoids interference with clinical decision-making and minimises additional risk or burden to participants. This approach supports ethical compliance while maintaining ecological validity.
- Third, practical and logistical constraints also inform the investigation design. The available clinical capacity at a single site over a six-month recruitment and observation period limits the feasible sample size. Implementing a two-arm or controlled comparative design within these constraints would require either an impractically large recruitment effort or would result in an insufficiently powered comparison due to sample-size compression. A single-arm prospective design therefore represents a pragmatic balance between methodological rigor and operational feasibility, enabling meaningful data collection within the defined timeframe and setting.

### 15.2 Sample size considerations

The sample size is open for discussion among DINOGMI, Studio Buccarella, and Innovina, and is finalised before the first enrolment. The final figure is agreed between the partners and recorded in D1.2.

The sample size must be sufficient to support the **clinical evaluation under MDR Article 61 and Annex XIV Part A** for a Class IIa device, on the basis of the primary accuracy endpoint described in D1.2 and the planned stratified analyses across the patient populations defined in Section 9. The biostatistician at DINOGMI conducts the power calculation that underpins the agreed figure.

### 15.3 Per-patient procedural flow

The flow of a patient through the investigation is described below.

| Stage | Action | Approximate duration |
|---|---|---|
| Eligibility check | The physiotherapist confirms inclusion and exclusion criteria | At the patient's routine visit |
| Information sharing | The Information Sheet is provided. The patient considers participation | At least twenty-four hours |
| Consent | The Consent Form is signed. A copy is given to the patient | Five minutes |
| Enrolment | The patient is assigned an opaque subject identifier. The mapping is held only at the trial site | Five minutes |
| Routine sessions | The patient performs the Sit-to-Stand exercise in front of the Coach device during their normal rehabilitation sessions | As prescribed |
| Spot-annotation | On a sampled subset of repetitions, a DINOGMI annotator labels the repetition to provide an expert reference for accuracy validation | Asynchronous, on a sampled subset |
| Usability questionnaires | The patient completes a usability questionnaire at the protocol-defined timepoints. The physiotherapist also completes a usability questionnaire | Ten minutes per questionnaire |
| End of participation | The patient ends participation by completing their normal course of rehabilitation, by withdrawing consent, or by being excluded for safety reasons | At the patient's normal end of therapy |

### 15.4 Spot-annotation versus full annotation

The investigation cannot afford full annotation of every trial repetition. The volume is too large and the annotator time too valuable. Instead, the investigation uses spot-annotation. A sampled subset of repetitions, drawn to be representative across patients and across the duration of the investigation, is annotated. This subset constitutes the accuracy-evaluation reference. The system's output on the subset is compared against the DINOGMI annotation and the agreement is reported as the accuracy outcome.

## 16. Outcome measures

The investigation defines outcome measures in four families.

### 16.1 Accuracy

| Measure | Source |
|---|---|
| Mean absolute error of joint-angle measurements (knee, hip, trunk) against the reference instrumentation provided by DINOGMI | Spot-annotated subset, T5.4 |
| F1 score of per-rep binary classification (correct or incorrect) against the expert reference | Spot-annotated subset, T5.4 |
| Phase-segmentation accuracy on annotated repetitions | T5.4 |

### 16.2 Usability

| Measure | Source |
|---|---|
| System Usability Scale (SUS) score for patients | Patient questionnaire |
| System Usability Scale score for therapists | Therapist questionnaire |
| Comprehension of the biofeedback by patients | Structured post-session interview, sampled subset |
| Therapist confidence in dashboard interpretation | Structured interview |

### 16.3 Safety

| Measure | Source |
|---|---|
| Count and severity of adverse events attributable to system use | Adverse event log |
| False-negative count on the G1 safety flag | Manual review of every G1-flagged repetition |

### 16.4 Adherence

| Measure | Source |
|---|---|
| Patient session adherence rate over the investigation period | Cloud Dashboard logs |
| Per-patient repetition count per session at steady state | Cloud Dashboard logs |
| Therapist-reported clinical actionability of the dashboard data | Structured therapist debrief |

The quantitative thresholds against which these outcome measures are judged for success are recorded in the separate document **ARISE Validation Acceptance Criteria**.

## 17. Safety framework

### 17.1 Adverse event definitions

An adverse event in the context of this investigation is any untoward occurrence affecting the patient and arising during their participation. The definitions used follow **ISO 14155:2020** and **MDR Article 2** for clinical investigations of medical devices: adverse event (AE), adverse device effect (ADE), serious adverse event (SAE), serious adverse device effect (SADE), and unanticipated serious adverse device effect (USADE). Adverse events are also categorised by severity as minor, serious, or critical, and by attributability as attributable, possibly attributable, or not attributable to system use.

### 17.2 Recording

All adverse events are recorded in the adverse event log at the trial site at the time of occurrence. The clinical lead at Studio Buccarella is responsible for the recording. The schema of the adverse event record is defined in the **Data Management Plan**, Section 5.4 (D-TRIAL AE sub-component).

### 17.3 Reporting

Serious adverse events, serious adverse device effects, and unanticipated serious adverse device effects are reported by Studio Buccarella to Innovina (sponsor), and by Innovina to the Ethics Committee and to the Italian National Competent Authority (Ministero della Salute, Direzione Generale dei Dispositivi Medici e del Servizio Farmaceutico), in accordance with **MDR Article 80(2) and 80(3)** and with the timelines below.

| Event type | Reporting timeline |
|---|---|
| Event that may have led, or may lead, to imminent risk of death or to serious deterioration of a person's state of health | Immediately, without delay and not later than 2 calendar days from awareness |
| Any other serious adverse event, serious adverse device effect, or device deficiency that could have led to a serious adverse device effect | Without delay and not later than 7 calendar days from awareness |
| New findings in relation to a previously reported event | Without delay and not later than 7 calendar days from awareness |
| Non-serious adverse events not related to the investigational device | Included in the next periodic report to the Ethics Committee |

These timelines apply to the **Class IIa** ARISE device under Phase 1 clinical investigation. In Phase 2, after CE marking, the vigilance framework of **MDR Article 87** takes over with comparable timelines for serious incidents and Field Safety Corrective Actions. The transition is described in the MDR Compliance Plan.

The reporting procedure is held as a Standard Operating Procedure at the trial site and is included in the Ethics Committee submission package.

### 17.4 Halt criteria

The investigation is halted, in whole or in part, on any of the triggers below.

| Trigger | Action |
|---|---|
| One or more adverse events attributable to system use | Immediate halt of the affected device. Root cause analysis. Resume only after Ethics Committee notification |
| Pattern of misclassifications causing confusing biofeedback | Halt of the affected device. Investigation by Innovina engineering. Resume only after the pattern is understood and mitigated |
| Two or more device malfunctions in a single week | Halt of the device fleet. Hardware diagnostic. Resume only after the fleet is verified |
| Discovery of any safety issue not anticipated in the risk register | Halt of the affected device. Risk-register update. Ethics Committee notification. Resume only after Committee acknowledgement |
| Notified Body or Competent Authority instruction (Phase 2 carry-over) | Halt as instructed. Action plan submitted to the instructing body |

## 18. Informed consent procedure

### 18.1 Information Sheet

The Information Sheet is given to every prospective patient at the eligibility-check stage and is the basis for the informed-consent decision. It is written in plain language at a reading level accessible to the patient populations seen at Studio Buccarella. It covers what the study is about, what participation involves, the risks, the benefits, how the patient's data is handled, the patient's right to withdraw, and the contact details for questions outside the trial site.

A version of the Information Sheet adapted for patients with mild cognitive impairment (the Easy Read version) is also prepared. The Easy Read version conveys the same information with shorter sentences, fewer subordinate clauses, and supporting illustrations.

The full content of the Information Sheet is given in the companion document **ARISE D1.2 Patient Information Sheet**, and the corresponding consent form is given in **ARISE D1.2 Informed Consent Form**.

### 18.2 Granular consent

Consent is granular. The Consent Form records three separate consent decisions by the patient. The first is consent to the use of the patient's data for their own care at Studio Buccarella. The second is consent to the use of the pseudonymised data for AI training. The third is consent to the use of the pseudonymised data in scientific publications and conference presentations. The patient can consent to any subset of the three. Two additional optional consents cover the reference instrumentation session at REHELAB and the right to be contacted at the end of the investigation for a plain-language results summary.

### 18.3 Vulnerable subjects

For patients with cognitive impairment, the consent procedure is carried out with the patient's legal representative, in accordance with the Ethics-Committee-approved procedure for vulnerable subjects. An independent witness is available at consent. The capacity-to-consent assessment is performed by clinical staff before recruitment and is documented in the patient file.

### 18.4 Withdrawal

The patient can withdraw from the investigation at any time and for any reason, without giving any explanation. Withdrawal does not affect the patient's continued care. The data already collected before withdrawal is retained subject to the patient's withdrawal preferences expressed at the time, which may include continued use of the already-collected data for the analyses described in the protocol, or full deletion under the data subject's GDPR Article 17 right.

## 19. Ethics Committee submission

### 19.1 Identification of the competent Ethics Committee

The territorially competent Ethics Committee for the trial site at Studio Buccarella is identified at the start of T1.3 in consultation with the clinical site administration and with the University of Genoa. The identification of the competent Committee is recorded as an open item in this document until confirmed.

### 19.2 Submission package contents

The Ethics Committee submission package includes the documents below. D1.2 is the principal document. Together they form the complete submission for the Class IIa clinical investigation under MDR Articles 62 to 82 and Annex XV.

| Document | Source |
|---|---|
| Clinical Investigation Plan (Protocol) | D1.2 Clinical Investigation Plan |
| Investigator's Brochure | D1.2 Investigator's Brochure |
| Patient Information Sheet (standard and Easy Read versions) | D1.2 Patient Information Sheet |
| Informed Consent Form | D1.2 Informed Consent Form |
| Clinical Requirements and Biomechanical KPIs | D1.1 |
| Data Management Plan | Compliance Dossier, document 01 |
| Data Protection Impact Assessment | Compliance Dossier, document 02 |
| MDR Compliance Plan (confirming Class IIa under Annex VIII Rule 11) | Compliance Dossier, document 03 |
| ARISE Validation Acceptance Criteria | Companion document |
| Sponsor cover letter | Drafted at end of M5 |
| Insurance documentation for the clinical investigation | To be confirmed prior to submission |
| Curricula vitae of the Principal Investigator and key personnel | To be confirmed prior to submission |
| Ethics Committee submission form (Italian standard) | Provided by the Committee |
| Notification to the National Competent Authority under MDR Article 70 | Drafted at end of M5, submitted in parallel with the Ethics Committee package |

### 19.3 Submission timeline

The submission package is finalised at the end of M5 and submitted at the start of M6. Submission within M6 builds a buffer against the Ethics Committee review timeline. The expected review period is between six weeks and three months from submission, depending on the Committee. **WP5 cannot begin until the Committee has approved the protocol and the National Competent Authority has acknowledged the notification under MDR Article 70.**
