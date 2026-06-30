"""Build the MDR Classification Scenarios document using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_Classification_Scenarios.md",
    output_docx=ROOT / "ARISE_Classification_Scenarios.docx",
    doc_title="MDR Classification Scenarios",
    doc_subtitle="Candidate classifications and their consequences, pending confirmation",
    meta={
        "Project": "ARISE",
        "Document type": "MDR classification placeholder",
        "Companion to": "MDR Compliance Plan",
        "Work Package": "WP1, Task T1.4",
        "Prepared by": "Innovina S.r.l.",
        "Classification authority": "University of Genoa regulatory function",
        "Status": "Pending classification confirmation",
        "Version, date": "1.0, 26 May 2026",
    },
    doc_short="Classification Scenarios",
)
print("Wrote ARISE_Classification_Scenarios.docx")
