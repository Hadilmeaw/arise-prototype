"""Build the ARISE References Catalogue using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_References_Catalogue.md",
    output_docx=ROOT / "ARISE_References_Catalogue.docx",
    doc_title="ARISE References Catalogue",
    doc_subtitle="Sit-to-Stand clinical and biomechanical sources behind D1.1 and T1.3",
    meta={
        "Project": "ARISE",
        "Document type": "References catalogue, per-threshold source tracing",
        "Companion to": "D1.1 Clinical Requirements and Biomechanical KPIs, T1.3 Clinical Requirements and Protocol Definition",
        "Scope": "Sit-to-Stand biomechanics, clinical assessment tests, muscle and pathology associations, technology and regulatory sources",
        "Number of cited sources": "60+",
        "Status": "Draft for internal review",
        "Version, date": "1.0, 15 June 2026",
    },
    doc_short="References Catalogue",
)
print("Wrote ARISE_References_Catalogue.docx")
