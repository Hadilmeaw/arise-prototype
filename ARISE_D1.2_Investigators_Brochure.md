# Investigator's Brochure

| Field | Value |
|---|---|
| Document title | Investigator's Brochure for the ARISE system, Phase 1 clinical investigation |
| Document identifier | ARISE-IB-001 |
| Version | [TO BE COMPLETED at submission] |
| Date | [TO BE COMPLETED at submission] |
| Investigational device | ARISE |
| Manufacturer | Innovina S.r.l. |
| Confirmed MDR classification | Class IIa under Annex VIII Rule 11 |
| Companion to | Clinical Investigation Plan, ARISE-CIP-001 |
| Status | Draft for internal review |

## 1. Device identification and intended purpose

### 1.1 Device identification

| Field | Value |
|---|---|
| Trade name | ARISE |
| Generic name | Markerless computer-vision system for the biomechanical assessment of the Sit-to-Stand transfer |
| Hardware version under investigation | [TO BE COMPLETED at submission] |
| Software version under investigation | [TO BE COMPLETED at submission] |
| Manufacturer | Innovina S.r.l. |
| Country of manufacture | Italy |
| MDR classification | Class IIa, Rule 11 |

### 1.2 Intended purpose

ARISE is intended to support qualified rehabilitation professionals in the assessment of the Sit-to-Stand transfer in adults undergoing motor rehabilitation. The device provides:

- Quantitative kinematic measurement of the Sit-to-Stand transfer, with the Key Performance Indicators defined in Deliverable D1.1
- Detection of pre-defined kinematic errors using the 14-code error taxonomy of D1.1
- Audiovisual biofeedback to the participant during the transfer, designed for low cognitive load
- A clinical dashboard for the therapist, summarising session-level metrics and the longitudinal evolution of the participant

The device does not replace clinical judgment. Decisions on diagnosis, on the rehabilitation plan, and on treatment progression remain with the qualified clinician.

### 1.3 Indications

- Adults aged 18 or older undergoing rehabilitation that includes the Sit-to-Stand transfer
- Healthy adult volunteers participating in the reference cohort for calibration and validation

### 1.4 Contraindications

- Participants for whom the Sit-to-Stand transfer is medically contraindicated
- Participants unable to provide informed consent and with no authorised legal representative
- Settings without the supervision of a qualified rehabilitation professional during the present investigational phase

### 1.5 Warnings and precautions

- The device does not replace the clinical judgment of the qualified rehabilitation professional
- The device is not validated for use without supervision during the present investigation
- The kinematic estimates are subject to a residual error, which is the subject of this investigation
- The biofeedback is designed for adult participants and may not be appropriate for paediatric use or for participants with severe cognitive impairment
- The device is intended for indoor use in controlled lighting

## 2. Description of the device

### 2.1 Components

| Component | Function |
|---|---|
| Coach edge device | On-site processing unit running the kinematic estimation pipeline and the biofeedback engine |
| RGB camera module | Acquisition of the video frames of the Sit-to-Stand transfer |
| Display | Presentation of the visual biofeedback to the participant |
| Loudspeaker | Presentation of the auditory biofeedback to the participant |
| Clinical dashboard | Web-based interface used by the therapist to review per-session and longitudinal data |
| Cloud back-end | Secure storage and processing of de-identified session data |

The camera operates from a distance defined in the installation instructions, typically 1.5 to 3 metres from the chair.

### 2.2 Operating environment

| Parameter | Requirement |
|---|---|
| Ambient lighting | Diffuse, non-directional, sufficient for the camera to acquire the participant without saturation or under-exposure |
| Background | Uniform, with the participant in the foreground |
| Floor | Non-slip, level |
| Free space around the chair | At least 1 metre on each side, 2 metres in front for the camera |
| Power supply | Mains power |
| Network | Wired or wireless connection to the cloud back-end for synchronisation of session data, not required during the session itself |

## 3. Principle of operation

### 3.1 Overview

ARISE acquires video frames from a single calibrated camera placed in front of the seat used for the Sit-to-Stand transfer. The on-device processing engine performs, for each frame:

- Three-dimensional skeleton estimation
- Computation of trunk, hip, and knee angular and velocity trajectories
- Segmentation of the transfer into its six characteristic phases (sitting, forward lean, lift-off, standing, stabilisation, descent)
- Computation of the KPIs defined in D1.1
- Application of a three-layer detection pipeline to identify the kinematic errors of the D1.1 taxonomy
- Generation of audiovisual cues to the participant
- Logging of the session for the clinical dashboard

### 3.2 Three-layer detection

| Layer | Description |
|---|---|
| Population rule | A rule-based detector that fires when a kinematic feature exceeds a threshold derived from the reference population |
| Per-patient z-score | A personalised detector that fires when a feature deviates by more than a defined number of standard deviations from the participant's own historical baseline, computed after at least five repetitions deemed correct |
| Deep learning model | A bidirectional recurrent network trained on the labelled corpus of D1.1, providing an end-to-end probabilistic classification of the kinematic error |

The combination policy is defined in D1.1 and refined during the investigation.

### 3.3 Biofeedback

The biofeedback is presented during the transfer to support self-correction. It comprises:

- A visual element on the display, indicating the current phase and any detected error
- An auditory element from the loudspeaker, with short cues at phase transitions and on detected errors
- A summary at the end of the repetition, indicating the overall quality of the execution

The biofeedback is designed for low cognitive load. The detailed specification is in the user manual.

### 3.4 Clinical dashboard

The clinical dashboard is a web-based interface that lets the therapist review per-session metrics, trend across sessions, error patterns, and export anonymised data for clinical record purposes. It does not provide diagnostic recommendations.

## 4. Risk analysis and residual risks

The risk-management file is maintained by Innovina as a separate document. The summary of identified risks and residual risks is presented below.

### 4.1 Identified hazards and residual risks

| Hazard | Category | Pre-mitigation risk | Mitigation | Residual risk |
|---|---|---|---|---|
| Fall during the Sit-to-Stand transfer | Patient safety | Moderate | Therapist supervision, inclusion criteria, structured recovery between repetitions | Low |
| Misinterpretation of the kinematic output | Use error | Moderate | Statement that ARISE does not replace clinical judgment, training of the therapist, indication of the residual error in the dashboard | Low |
| Confusion or discomfort with the biofeedback | Use error | Low | Familiarisation phase, option to deactivate the biofeedback, design for low cognitive load | Low |
| Acquisition of an unintended subject in the camera field of view | Privacy | Moderate | Field of view configuration at installation, training of the staff | Low |
| Disclosure of personal data | Privacy and security | Moderate | Encryption at rest and in transit, access control, audit logging — see DPIA | Low |
| Loss of integrity of the session data | Data quality | Low | Integrity checks, backups, audit logging | Low |
| Failure of the device during the session | Availability | Low | Graceful degradation, fall-back to manual assessment by the therapist | Low |

### 4.2 Anticipated adverse events

The anticipated adverse events during the investigation are limited to events associated with the execution of the Sit-to-Stand transfer itself, not caused by the device.

| Anticipated event | Expected severity | Anticipated frequency |
|---|---|---|
| Mild musculoskeletal fatigue | Mild | Common |
| Mild musculoskeletal discomfort | Mild | Occasional |
| Loss of balance with rapid recovery | Mild | Rare |
| Loss of balance with assisted recovery by the supervising clinician | Moderate | Very rare |
| Fall to the ground | Moderate to severe | Not expected; controlled by exclusion criteria and supervision |

No device-related serious adverse event is anticipated.

## 5. Instructions for the investigator

### 5.1 Training requirements

Each member of the clinical staff who uses the device receives a training session before the first use. The training covers: the intended purpose and the limitations of the device, the set-up procedure, supervision of the participant during the session, recording of events in the session log, recording and reporting of adverse events, and handling of malfunctions. A training record (name, date, trainer) is maintained at the clinical site.

### 5.2 Set-up of the device

- Power on the Coach edge device
- Position the camera per the installation instructions
- Verify the field of view, ensuring the participant is fully visible during the transfer
- Verify the connection between the camera and the Coach edge device
- Verify the connection between the Coach and the display and the loudspeaker
- Select the participant identifier in the user interface
- Perform a brief test recording

### 5.3 Use during the session

During the session, the supervising clinician verifies the wellbeing of the participant before each repetition, observes the participant during each repetition per the standard clinical supervision practice, records any event of interest in the session log, intervenes if necessary for safety, and acknowledges any safety alert generated by the device.

### 5.4 End-of-session procedures

At the end of the session, the supervising clinician confirms the wellbeing of the participant, saves the session data, records any adverse event in the source documents and Case Report Form, powers off or sets the device to standby, and synchronises the session data with the cloud back-end at the next opportunity.

### 5.5 Handling of malfunctions

If a malfunction affects the safety of the participant, the supervising clinician interrupts the session immediately. The malfunction is recorded in the session log with the time of occurrence and a description. Innovina is notified within the timeline defined in the Monitoring Plan. The session may continue only after the malfunction has been resolved.

## 6. Disposal

At the end of the investigation, the investigational device is returned to Innovina, which disposes of it in accordance with the applicable Italian and European legislation on electrical and electronic equipment waste.

## 7. Contact information

| Role | Contact |
|---|---|
| Innovina S.r.l. | [TO BE COMPLETED] |
| Person Responsible for Regulatory Compliance | [TO BE COMPLETED] |
| Data Protection Officer | [TO BE COMPLETED] |
| Technical support during the investigation | [TO BE COMPLETED] |
| Emergency contact for adverse events | [TO BE COMPLETED] |

## 8. References

| Reference | Citation |
|---|---|
| CIP | ARISE Clinical Investigation Plan, ARISE-CIP-001 |
| D1.1 | ARISE Deliverable D1.1, Clinical Requirements and Biomechanical KPIs |
| DMP | ARISE Data Management Plan |
| DPIA | ARISE Data Protection Impact Assessment |
| MDR Compliance Plan | ARISE MDR Compliance Plan, confirming Class IIa under Annex VIII Rule 11 |

## Annex A: Applicable standards and regulations

Standards and regulations applied to the device are listed below for completeness. They are referenced in the corresponding technical documentation maintained by Innovina and made available to the Notified Body during the Phase 2 conformity assessment.

| Standard or regulation | Scope |
|---|---|
| Regulation (EU) 2017/745 (MDR) | Medical Devices Regulation |
| Regulation (EU) 2016/679 (GDPR) | Protection of personal data |
| ISO 14155:2020 | Good clinical practice for clinical investigations of medical devices |
| ISO 13485 | Quality management for medical devices |
| ISO 14971 | Risk management for medical devices |
| IEC 62304 | Medical device software life-cycle processes |
| IEC 62366-1 | Usability engineering for medical devices |
| Declaration of Helsinki, 2013 revision | Ethical principles for medical research |
