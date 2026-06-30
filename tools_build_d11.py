"""Build D1.1 Clinical Requirements and Biomechanical KPIs using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_D1.1_Clinical_Requirements_and_KPIs_v2.md",
    output_docx=ROOT / "ARISE_D1.1_Clinical_Requirements_and_KPIs.docx",
    doc_title="Clinical Requirements and Biomechanical KPIs",
    doc_subtitle="Sit-to-Stand functional assessment",
    meta={
        "Project": "ARISE",
        "Deliverable": "D1.1",
        "Work Package": "WP1, Task T1.3",
        "Planned delivery": "Month 3 (March 2026)",
        "Prepared by": "Innovina S.r.l.",
        "Scientific partner": "DINOGMI, University of Genoa",
        "Clinical partner": "Studio Buccarella",
        "Version, date": "2.0, 26 May 2026",
    },
    doc_short="D1.1 Clinical Requirements and KPIs",
)
print("Wrote ARISE_D1.1_Clinical_Requirements_and_KPIs.docx")
