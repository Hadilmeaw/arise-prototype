"""Build D2.1B Cloud Architecture using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_D2.1B_Cloud_Architecture.md",
    output_docx=ROOT / "ARISE_D2.1B_Cloud_Architecture.docx",
    doc_title="D2.1B Cloud Architecture",
    doc_subtitle="EU cloud back-end for ARISE. Edge architecture deferred to D2.1B-bis",
    meta={
        "Project": "ARISE",
        "Deliverable": "D2.1B",
        "Work Package": "WP2, Task T2.1 (with Invenio)",
        "Planned delivery": "Month 9",
        "Task lead": "Innovina S.r.l.",
        "Companion to": "DMP, DPIA, MDR Compliance Plan, D1.1, T1.3, D2.1A, D2.2",
        "Confirmed MDR class": "Class IIa under Annex VIII Rule 11",
        "Cloud vendor (primary)": "AWS eu-central-1 (Frankfurt)",
        "Cloud vendor (DR)": "AWS eu-west-1 (Ireland)",
        "Edge architecture": "Deferred to D2.1B-bis (after product decision)",
        "Status": "Draft for internal review",
        "Version, date": "1.0, 16 June 2026",
    },
    doc_short="D2.1B Cloud Architecture",
)
print("Wrote ARISE_D2.1B_Cloud_Architecture.docx")
