"""Build the three Compliance Dossier documents as standalone .docx files,
each using the ARISE template (cover page, header, footer)."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

# 01 — Data Management Plan
build_arise_document(
    input_md=ROOT / "ARISE_Data_Management_Plan.md",
    output_docx=ROOT / "ARISE_Data_Management_Plan.docx",
    doc_title="Data Management Plan",
    doc_subtitle="Engineering specification for ARISE data, Phase 1",
    meta={
        "Project": "ARISE",
        "Document type": "Task description, Data Management Plan",
        "Work Package": "WP1, Task T1.4 (Compliance Management)",
        "Prepared by": "Innovina S.r.l.",
        "Companion to": "DPIA, MDR Compliance Plan",
        "Confirmed MDR class": "Class IIa under Annex VIII Rule 11",
        "Funding instrument": "ERDF",
        "Version, date": "3.3, 9 June 2026",
    },
    doc_short="DMP",
)
print("Wrote ARISE_Data_Management_Plan.docx")

# 02 — Data Protection Impact Assessment
build_arise_document(
    input_md=ROOT / "ARISE_DPIA.md",
    output_docx=ROOT / "ARISE_DPIA.docx",
    doc_title="Data Protection Impact Assessment",
    doc_subtitle="GDPR Article 35 mandatory assessment, Phase 1",
    meta={
        "Project": "ARISE",
        "Document type": "DPIA under GDPR Article 35",
        "Work Package": "WP1, Task T1.4 (Compliance Management)",
        "Prepared by": "Innovina S.r.l., Data Protection Officer",
        "Companion to": "DMP, MDR Compliance Plan",
        "Confirmed MDR class": "Class IIa under Annex VIII Rule 11",
        "Number of risks identified": "12",
        "Residual risk crosses Article 36 threshold": "No",
        "Version, date": "2.3, 9 June 2026",
    },
    doc_short="DPIA",
)
print("Wrote ARISE_DPIA.docx")

# 03 — MDR Compliance Plan
build_arise_document(
    input_md=ROOT / "ARISE_MDR_Compliance_Plan.md",
    output_docx=ROOT / "ARISE_MDR_Compliance_Plan.docx",
    doc_title="MDR Compliance Plan",
    doc_subtitle="Medical-device regulatory alignment under Regulation (EU) 2017/745",
    meta={
        "Project": "ARISE",
        "Document type": "MDR Compliance Plan",
        "Work Package": "WP1, Task T1.4 (Compliance Management)",
        "Prepared by": "Innovina S.r.l.",
        "Reviewed by": "PRRC, Innovina; regulatory function, University of Genoa",
        "Confirmed MDR class": "Class IIa under Annex VIII Rule 11",
        "Conformity assessment route": "Annex IX (Notified Body required)",
        "Software safety class (IEC 62304)": "Class B",
        "Phase 1 vigilance reference": "MDR Article 80",
        "Phase 2 vigilance reference": "MDR Articles 83-87 (PSUR every 2 years per Article 86)",
        "Version, date": "3.0, 9 June 2026",
    },
    doc_short="MDR Plan",
)
print("Wrote ARISE_MDR_Compliance_Plan.docx")
