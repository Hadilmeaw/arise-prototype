"""Build the T1.3 Task Document using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_T1.3_Clinical_Requirements_and_Protocol_Definition.md",
    output_docx=ROOT / "ARISE_T1.3_Clinical_Requirements_and_Protocol_Definition.docx",
    doc_title="T1.3 Clinical Requirements and Protocol Definition",
    doc_subtitle="Task description, work streams, and partner responsibilities",
    meta={
        "Project": "ARISE",
        "Document type": "Task description",
        "Work Package": "WP1, Task T1.3",
        "Period": "M1 to M6",
        "Task lead": "Innovina S.r.l.",
        "Partners": "DINOGMI, University of Genoa, Studio Buccarella",
        "Deliverables produced": "D1.1 (M3), D1.2 (M6)",
        "Confirmed MDR class": "Class IIa under Annex VIII Rule 11",
        "Regulatory framework": "MDR Articles 62-82, Annex XV (Phase 1 clinical investigation)",
        "Companion documents": "D1.1, D1.2, Compliance Dossier (DMP, DPIA, MDR Plan)",
        "Version, date": "2.0, 9 June 2026",
    },
    doc_short="T1.3 Task Description",
)
print("Wrote ARISE_T1.3_Clinical_Requirements_and_Protocol_Definition.docx")
