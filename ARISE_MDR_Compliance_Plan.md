# MDR Compliance Plan

|  |  |
|---|---|
| Project | ARISE, Augmented Rehabilitation and Intelligent System for Enhancement |
| Document | MDR Compliance Plan, medical-device regulatory alignment under Regulation (EU) 2017/745 |
| Work Package | WP1, Task T1.4, Compliance Management |
| Prepared by | Innovina S.r.l. |
| Reviewed by | Person Responsible for Regulatory Compliance (PRRC), Innovina; regulatory function, University of Genoa |
| Confirmed MDR classification | **Class IIa under Annex VIII Rule 11** |
| Companion to | Data Management Plan, Data Protection Impact Assessment |
| Version, date | 3.0, 9 June 2026 |

## Executive summary

This document specifies how the ARISE project aligns its development, validation, and documentation practices to **Regulation (EU) 2017/745 (MDR)**, so that the Phase 1 demonstration produces evidence reusable for Phase 2 CE marking without rework.

The medical-device classification of ARISE under MDR Annex VIII has been confirmed as **Class IIa under Rule 11**. The previously circulated companion document **ARISE Classification Scenarios** is now superseded by the present plan and is archived. All class-dependent fields in this document are populated accordingly.

Phase 1 does not require CE marking. Its demonstration takes place under an approved Ethics Committee protocol (D1.2) following the clinical-investigation framework of MDR Articles 62 to 82. However, every artefact produced during Phase 1 (technical documentation, risk register, clinical-evaluation evidence, post-market surveillance plan, quality system records) is structured to be MDR-traceable for the Class IIa conformity assessment that follows in Phase 2.

The chosen conformity-assessment route for Phase 2 is **MDR Annex IX (full quality management system assessment plus assessment of the technical documentation)**, on the basis that it provides the broader QMS validation that is useful for the Equipment-as-a-Service commercial model. **Notified Body involvement is required** for Class IIa under Annex IX. The Notified Body engagement is planned to begin in the second half of Phase 1, with formal QMS audit in the early part of Phase 2.

# Part I: Foundations

## 1. Purpose and scope

### 1.1 Purpose

To ensure that Phase 1 produces MDR-traceable documentation, so that Phase 2 commercialisation (CE marking) is not delayed by retroactive regulatory work, and to specify the MDR obligations that apply to the Phase 1 clinical investigation under the confirmed Class IIa classification.

### 1.2 Scope

| In scope | Out of scope |
|---|---|
| Device identification, intended purpose | GDPR risk assessment (DPIA) |
| MDR classification and conformity assessment pathway | Engineering implementation detail (DMP) |
| Risk management process | UI/UX of the Coach and Dashboard (D2.2) |
| Clinical evaluation strategy (full evaluation per Class IIa requirements) | Project management (T1.1) |
| Technical documentation structure (Annex II and Annex III) | Final Notified Body selection (decided in Phase 2 from the agreed shortlist) |
| Vigilance under MDR Article 80 (Phase 1) and Articles 83 to 87 (Phase 2) |  |
| Quality management alignment with ISO 13485 |  |

## 2. Regulatory framework

The applicable regulation is Regulation (EU) 2017/745 (MDR), which is directly applicable across the European Union. ARISE is in clinical investigation during Phase 1 (MDR Articles 62 to 82), not in post-market vigilance. This distinction governs which obligations apply when.

| Lifecycle stage | Project phase | Applicable MDR provisions |
|---|---|---|
| Clinical investigation (no CE marking) | Phase 1 (M1 to M24) | Articles 62 to 82, Annex XV. AE recording under Article 80 |
| Conformity assessment | Phase 2 (post-Phase 1) | Articles 52 to 60, **Annex IX (chosen route for Class IIa)** |
| Placing on market | Phase 2 (post CE marking) | Articles 5 to 13, Annex I (general safety and performance requirements), Annex III (post-market surveillance plan) |
| Post-market surveillance | Phase 2 ongoing | Articles 83 to 86, with Article 86 PSUR cadence for Class IIa devices |
| Post-market vigilance | Phase 2 ongoing | Articles 87 to 92 |

# Part II: Device and classification

## 3. Device description and intended purpose

### 3.1 Device identification

| Attribute | Value |
|---|---|
| Trade name | ARISE Coach (hardware + on-device software) and ARISE Clinical Dashboard (cloud software) |
| Manufacturer | Innovina S.r.l. |
| Configuration | All-in-one camera plus edge computing unit at the clinical site, plus cloud Dashboard accessed via authenticated web client |
| Components | Coach device (camera, edge inference unit, biofeedback display), Cloud Dashboard (secure web platform), locked AI model from D3.4 |
| Software safety class per IEC 62304 | Class B (no death or serious injury is possible from software failure, given mandatory clinician supervision and the contactless nature of the device) |
| Unique Device Identifier (UDI) | Assigned in Phase 2 prior to CE marking, registered in EUDAMED |

### 3.2 Intended purpose statement

ARISE is intended to support rehabilitation of adult patients performing the Sit-to-Stand exercise by providing real-time biofeedback to the patient in the form of visual and auditory cues during the repetition, and by providing objective biomechanical analytics to the supervising therapist in the form of per-rep KPIs, error counts, longitudinal trends, and safety alerts.

Intended user populations are adult rehabilitation patients supervised by licensed physiotherapists. The intended use environment is clinical rehabilitation centres, gyms, and care facilities.

The information produced by ARISE is intended to support therapeutic decisions made by the supervising clinician. The device does not replace clinical judgment.

## 4. MDR classification

### 4.1 Confirmed classification

| Field | Value |
|---|---|
| **Confirmed class** | **Class IIa** |
| Applicable classification rule | **MDR Annex VIII, Rule 11** |
| Conformity assessment route | **Annex IX (full QMS assessment plus assessment of the technical documentation)** |
| Notified Body involvement required | **Yes, mandatory for Class IIa under Annex IX** |
| Software safety class per IEC 62304 | Class B |
| Classification authority | Regulatory function of the University of Genoa, in consultation with Innovina S.r.l. as legal manufacturer |
| Date of confirmation | June 2026 |

### 4.2 Rule 11 application and rationale

MDR Annex VIII Rule 11 states:

> Software intended to provide information which is used to take decisions with diagnosis or therapeutic purposes is classified as class IIa, except if such decisions have an impact that may cause death or an irreversible deterioration of a person's state of health, in which case it is in class III, or a serious deterioration of a person's state of health or a surgical intervention, in which case it is classified as class IIb. Software intended to monitor physiological processes is classified as class IIa, except if it is intended for monitoring of vital physiological parameters, where the nature of variations of those parameters is such that it could result in immediate danger to the patient, in which case it is classified as class IIb. All other software is classified as class I.

The application to ARISE is as follows.

| Step | Question | Answer |
|---|---|---|
| 1 | Is ARISE software within MDR scope as a medical device under Article 2(1)? | Yes. The intended purpose includes the treatment and alleviation of motor disability through rehabilitation support, which is a medical purpose under Article 2(1) |
| 2 | Does ARISE provide information used to take decisions with therapeutic purposes? | Yes. The clinical dashboard provides KPIs and error detections used by the therapist to decide treatment progression. The real-time biofeedback directly modifies the patient's motor execution, which is itself a therapeutic intervention |
| 3 | Could such decisions cause death or irreversible deterioration of a person's state of health? | No. The therapist supervises every session, the device is contactless, and the worst foreseeable consequence of a misclassification is a sub-optimal repetition that the therapist corrects |
| 4 | Could such decisions cause serious deterioration or a surgical intervention? | No, for the same reasons as step 3 |
| 5 | Is ARISE intended for monitoring of vital physiological parameters where variations could result in immediate danger? | No. The kinematic variables observed (joint angles, velocities) are not vital signs |
| Result | Default Rule 11 outcome | **Class IIa** |

### 4.3 Consequences of the confirmed classification

The Class IIa confirmation has the following consequences across the project.

| Area | Consequence |
|---|---|
| Conformity-assessment route | Annex IX, requiring a Notified Body |
| Notified Body involvement | Required for both QMS audit (Annex IX Chapter I) and technical documentation assessment (Annex IX Chapter II) |
| Clinical evaluation | Full clinical evaluation per MDR Article 61 and Annex XIV Part A, including a Clinical Evaluation Plan, a Clinical Evaluation Report, and a Post-Market Clinical Follow-up (PMCF) plan |
| Quality management | Certified ISO 13485 quality management system before Notified Body audit |
| Technical documentation | Full Annex II content set, plus Annex III post-market surveillance plan |
| Vigilance | Article 87 reporting timelines apply. PSUR cadence per Article 86 is every two years for Class IIa |
| Phase 2 timeline | 12 to 18 months from end of Phase 1 to CE marking, dominated by Notified Body queue and audit cycle |

## 5. Conformity assessment pathway

### 5.1 Chosen route

The conformity-assessment route for the Class IIa ARISE device is **MDR Annex IX**, which combines:

1. **Annex IX Chapter I**: assessment of the quality management system (QMS) by the Notified Body
2. **Annex IX Chapter II**: assessment of the technical documentation by the Notified Body, on a representative sample basis for Class IIa devices

The alternative route, **Annex XI Part A** (product verification on the basis of type-examination), was considered and rejected. Annex IX is preferred because:

- It provides broader QMS validation, which supports the Equipment-as-a-Service commercial model where the same QMS underpins multiple deployment configurations
- It avoids the need for a separate Annex X type-examination, which Annex XI Part A would presuppose for this class of device
- It is the route most commonly chosen by software-as-a-medical-device manufacturers for Class IIa devices, and Notified Bodies are most familiar with this pathway for software

### 5.2 Notified Body engagement plan

| Milestone | Target timing | Activity |
|---|---|---|
| Notified Body shortlist | M14 (Phase 1) | Identify candidate Notified Bodies designated for MDR with the relevant codes for software in rehabilitation. Candidate codes include MDA 1207 (active devices for rehabilitation) and MDS 1010 (devices incorporating software). The final code matrix is confirmed in Phase 2 |
| Pre-submission meeting | M18 to M20 (Phase 1 end) | Informal meeting with the preferred Notified Body to align on the technical-documentation scope and on the QMS readiness expectations |
| Notified Body selection | First quarter of Phase 2 | Signed contract with the chosen Notified Body |
| QMS audit | Second quarter of Phase 2 | Annex IX Chapter I assessment |
| Technical documentation assessment | Third quarter of Phase 2 | Annex IX Chapter II assessment |
| Issue of EC certificate | Fourth quarter of Phase 2 to first quarter of the following year | Subject to the Notified Body queue, which is the dominant timing uncertainty |
| CE marking and commercial launch | Following EC certificate issue | Phase 2 EaaS launch |

# Part III: Engineering and clinical compliance

## 6. Risk management

The risk-management process follows **ISO 14971:2019** and is conducted by the Innovina internal process for medical-device projects. The process is conducted to a depth appropriate to Class IIa under Annex IX and is subject to review by the Notified Body in Phase 2.

### 6.1 Risk-management process

| N | Activity | Output |
|---|---|---|
| RM1 | Risk-management plan | Document defining the process, responsibilities, acceptability criteria |
| RM2 | Hazard analysis | Identification of foreseeable hazards across normal use and reasonably foreseeable misuse |
| RM3 | Risk evaluation | Per-hazard estimation of severity and probability, against acceptability criteria |
| RM4 | Risk control | Mitigation measures: inherent safety, protective measures, information for safety |
| RM5 | Residual risk evaluation | Post-mitigation assessment and sign-off |
| RM6 | Risk-management report | Summary submitted to the Notified Body as part of the Annex IX Chapter II technical documentation assessment |

### 6.2 Identified hazards (preliminary)

The full risk register is maintained as a separate controlled document, available to the Notified Body during the Annex IX audit. The hazards below are the high-level inventory.

| ID | Hazard | Mitigation category |
|---|---|---|
| H1 | Patient fall during exercise | Information for safety (Instructions for Use mandate therapist supervision), always-on G1 safety flag in software |
| H2 | Misclassification of correct rep as incorrect, leading to confusing biofeedback | Protective measure: multi-layer detection (rule + per-patient z-score), confidence gating |
| H3 | Misclassification of incorrect rep as correct, missing a clinical concern | Protective measure: multi-layer detection reduces single-point failure |
| H4 | Therapist over-reliance on dashboard analytics | Information for safety: clear labelling that data is decision-support, not decision-making. Therapist training covers this |
| H5 | Device malfunction during session (camera failure, software crash) | Inherent safety: graceful degradation. Protective measure: session-resume policy and on-site spare units |
| H6 | Cybersecurity incident exposing patient data | Cross-reference to DPIA Section 6 and DMP Section 8. Compliant with MDR Annex I GSPR 17.2 |
| H7 | Misuse on patient outside intended population (severe cognitive impairment, acute instability) | Information for safety: contraindications explicit in IFU. Protective measure: therapist enrolment gating |
| H8 | Inaccurate AI inference due to environmental factors (lighting, clothing, occlusion) | Inherent safety: rigidification reduces noise. Protective measure: confidence threshold suppresses low-quality reps |

## 7. Clinical evaluation strategy

### 7.1 Phase 1 clinical investigation

The Phase 1 demonstration in WP5 is a clinical investigation under MDR Articles 62 to 82, conducted under an Ethics-Committee-approved protocol (D1.2). The protocol is the controlling document for how the investigation is run.

| Phase 1 clinical-evaluation component | Source |
|---|---|
| Clinical Investigation Plan | D1.2 |
| Investigator's Brochure (referencing intended purpose, risks, prior data) | D1.2 companion document |
| Recording of adverse events under Article 80 | DMP Section 3.3 (D-TRIAL AE sub-component), DPIA Section 6.9 |
| Performance against acceptance criteria | Validation Acceptance Criteria document, finalised in WP5 |
| Usability evaluation | DMP Section 3.3 (D-USABILITY), D5.1 |
| Safety evaluation | DPIA Section 5 risk register, plus the ISO 14971 risk-management report |
| Patient and therapist feedback | T5.3, D5.1 |

### 7.2 Phase 2 clinical evaluation

For a Class IIa device, full clinical evaluation per **MDR Article 61** and **Annex XIV Part A** is required. The clinical-evaluation chain in Phase 2 comprises the documents below, prepared in accordance with **MDCG 2020-5** (Clinical Evaluation, Equivalence) and **MDCG 2020-6** (Sufficient Clinical Evidence for Legacy Devices) and the relevant **MEDDEV 2.7/1 rev 4** guidance where still applicable.

| Phase 2 document | Purpose |
|---|---|
| Clinical Evaluation Plan (CEP) | Defines the scope of the clinical evaluation, the equivalent or comparable devices considered, the literature-review strategy, and the acceptance criteria for clinical safety and performance |
| Literature review | Systematic review of the published evidence on markerless biomechanical assessment, on biofeedback in motor rehabilitation, and on the Sit-to-Stand task, with appraisal of each source's relevance and quality |
| Clinical Evaluation Report (CER) | Compiled from D5.1 (the TRL6 Validation Report) plus the literature review, with the benefit-risk analysis required by MDR Article 61 |
| Post-Market Clinical Follow-up (PMCF) Plan | Per Annex XIV Part B. Mandatory for Class IIa devices. Defines the proactive collection and evaluation of clinical data from the device in routine clinical use post-CE marking |

The depth of the clinical evaluation matches the Class IIa expectation. Equivalence claims against existing devices are evaluated under MDCG 2020-5 and are unlikely to be sufficient on their own, given the novel combination of markerless RGB capture with biomechanical AI inference. The clinical evaluation therefore relies primarily on the data generated by the Phase 1 clinical investigation plus the planned PMCF.

## 8. Quality management

Innovina operates an internal quality management process during Phase 1 with the target of achieving certified **ISO 13485:2016** compliance before the Notified Body QMS audit in Phase 2. The process covers seven areas.

| QMS area | Phase 1 alignment | Phase 2 readiness |
|---|---|---|
| Document and change control | All MDR-relevant artefacts under controlled change history | Audit-ready for ISO 13485 clause 4.2 |
| Design and development controls | WP3 and WP4 workflows produce traceable design history | Audit-ready for ISO 13485 clause 7.3 and IEC 62304 |
| Procurement controls | Coach hardware procurement traceable | Audit-ready for ISO 13485 clause 7.4 |
| Customer-property handling | Patient data covered by DMP and DPIA | Audit-ready for ISO 13485 clause 7.5.4 |
| Internal audit | Six-month cycle during Phase 1 | Audit-ready for ISO 13485 clause 8.2.4 |
| Management review | Six-month cycle during Phase 1 | Audit-ready for ISO 13485 clause 5.6 |
| Corrective and preventive action (CAPA) | CAPA process operational from M6 | Audit-ready for ISO 13485 clauses 8.5.2 and 8.5.3 |

# Part IV: Lifecycle and reporting

## 9. Technical documentation (MDR Annex II and Annex III)

Phase 1 produces, in Annex II-compatible structure, the technical documentation listed below. Each item has controlled change history. The total document set is the full content set for Class IIa under Annex IX Chapter II.

| Annex II Section | Phase 1 status | Phase 2 use |
|---|---|---|
| Section 1, Device description and specification | Drafted in D1.1 + D2.1B + D3.3 | Foundation of the Annex II technical file |
| Section 2, Information supplied with the device (IFU, labelling) | First draft at M18 | Finalised pre-CE submission |
| Section 3, Design and manufacturing information | Maintained in WP3 (D3.3) and WP4 (D4.1) | Annex II Section 3 |
| Section 4, General Safety and Performance Requirements (GSPR) checklist | Drafted M9 to M18 | Annex II Section 4 |
| Section 5, Benefit-risk analysis and risk management | Per Section 6 of this plan plus the ISO 14971 risk-management file | Annex II Section 5 |
| Section 6, Product verification and validation | D5.1 plus the bench-test reports and the software verification per IEC 62304 | Annex II Section 6 |
| Section 6.1(e), Clinical evaluation | D5.1 plus the Phase 2 Clinical Evaluation Report | Annex II Section 6.1(e) |
| Annex III, Post-Market Surveillance Plan | Drafted M22, finalised M24 | Submitted as part of the Annex IX Chapter II technical-documentation assessment |

## 10. Vigilance and post-market surveillance

### 10.1 Phase 1 obligations (clinical investigation)

| Obligation | MDR reference | Implementation |
|---|---|---|
| Record adverse events | Article 80(1) | D-TRIAL AE sub-component (DMP Section 3.3, Section 4.1), AE schema in DMP Section 5.4 |
| Report serious adverse events to competent authority | Article 80(2) | Procedure defined in D1.2 Section 12. Reporting timeline: immediately for events that present an imminent risk of death, serious injury, or serious illness; otherwise within 7 days |
| Inform Ethics Committee of safety-significant events | Article 80(3) | Procedure defined in D1.2 Section 12 |
| Implement halt criteria | Article 78 | Halt criteria defined in D1.2 Section 14 |
| Maintain trial master file | Article 72(3), Annex XV Chapter III, point 3 | Innovina retains. Retention period at least 10 years from the end of the clinical investigation, available for inspection |

### 10.2 Phase 2 obligations (post-market, Class IIa)

Phase 1 does not have a commercial product on the market, so there is no formal post-market surveillance obligation. However, the architecture for PMS is established in Phase 1 so that it activates immediately on CE marking. The reporting cadence for Class IIa is set out below.

| Phase 2 obligation | MDR reference | Class IIa specifics | Phase 1 preparatory work |
|---|---|---|---|
| Post-market surveillance plan | Article 84, Annex III | Plan in place at CE marking | Architecture established in DMP Section 3.5 (continuous activities) |
| Periodic Safety Update Report (PSUR) | Article 86 | Updated **at least every two years** for Class IIa, made available to the Notified Body through EUDAMED | Reporting templates drafted at M22 |
| Vigilance: reporting of serious incidents and Field Safety Corrective Actions (FSCAs) | Article 87 | Serious incidents reported without delay and not later than 15 days; for incidents presenting a serious threat to public health, immediately and not later than 2 days; for death or unanticipated serious deterioration, not later than 10 days | Procedure drafted at M22 |
| Trend reporting | Article 88 | Statistically significant increases in non-serious incidents or expected undesirable side-effects must be reported | KPI-distribution drift monitoring (DMP Section 7.3) repurposed for trend detection |
| PMCF plan and reports | Annex XIV Part B | **Mandatory for Class IIa**. PMCF report at least every two years and integrated into the PSUR | Drafted in Phase 2 |
| EUDAMED registration | Articles 27, 28, 29, 31 | UDI assignment, manufacturer registration, device registration before placing on the market | UDI structure prepared in Phase 1 |

## 11. Phase 1 to Phase 2 transition

The transition is gated by completion of D5.1 at M24. Phase 2 begins with the steps below.

| Phase 2 milestone | Trigger | Class IIa timing |
|---|---|---|
| Confirm classification (already done in Phase 1) | n/a | Confirmed in this document, Section 4 |
| Appoint PRRC and confirm QMS | D5.1 sign-off | Q1 of Phase 2 |
| Sign Notified Body contract | QMS in place, pre-submission complete | Q1 of Phase 2 |
| Compile Annex II technical file | Conformity assessment procedure | Q1 to Q2 of Phase 2 |
| Notified Body QMS audit (Annex IX Chapter I) | Contract and QMS in place | Q2 of Phase 2 |
| Notified Body technical-documentation assessment (Annex IX Chapter II) | Technical file submitted | Q3 of Phase 2 |
| EC certificate issued | NB assessments complete | Q4 of Phase 2 or Q1 following year |
| CE marking and EaaS commercial launch | EC certificate in hand | Following EC certificate |
| First PSUR | 24 months after first device on the market | Per Article 86 cadence |
| First PMCF report | 24 months after first device on the market | Per Annex XIV Part B |

# Part V: Governance

## 12. Roles and responsibilities

| Role | Organisation | MDR responsibility |
|---|---|---|
| Project Lead | Innovina | Overall MDR compliance. Sign-off on this plan |
| Person Responsible for Regulatory Compliance (PRRC, Article 15) | Innovina | Overall MDR responsibility per Article 15. Sign-off on conformity assessment submissions |
| Quality Manager | Innovina | QMS alignment with ISO 13485, document control, CAPA |
| Risk Manager | Innovina | Risk-management process owner per ISO 14971. Maintains the risk register |
| Clinical Lead | Studio Buccarella | Conduct of the clinical investigation. AE recording per Article 80 |
| Scientific Lead | DINOGMI | Independent scientific validation of clinical-performance claims. Gold-standard reference instrumentation at REHELAB |
| Notified Body | To be selected in Phase 2 | Annex IX Chapter I QMS assessment and Annex IX Chapter II technical-documentation assessment for the Class IIa device |
| Italian National Competent Authority | Ministero della Salute, Direzione Generale dei Dispositivi Medici e del Servizio Farmaceutico | Notification of the Phase 1 clinical investigation under Article 70. Vigilance reporting destination in Phase 2 |
