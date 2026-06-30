"""Build D2.1A Market Analysis Document using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_D2.1A_Market_Analysis.md",
    output_docx=ROOT / "ARISE_D2.1A_Market_Analysis.docx",
    doc_title="D2.1A Market Analysis Document",
    doc_subtitle="ARISE versus pressure plates and the wider STS assessment market",
    meta={
        "Project": "ARISE",
        "Deliverable": "D2.1A",
        "Work Package": "WP2, Task T2.2 (with Invenio)",
        "Planned delivery": "Month 9",
        "Task lead": "Innovina S.r.l.",
        "Companion to": "D1.1, T1.3, Compliance Dossier",
        "Confirmed MDR class": "Class IIa under Annex VIII Rule 11",
        "Scope": "Market, competitive, commercial, reimbursement",
        "Status": "Draft for internal review",
        "Version, date": "1.0, 10 June 2026",
    },
    doc_short="D2.1A Market Analysis",
)
print("Wrote ARISE_D2.1A_Market_Analysis.docx")
