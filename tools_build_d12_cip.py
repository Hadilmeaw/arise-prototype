"""Build D1.2 Clinical Investigation Plan using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_D1.2_Clinical_Investigation_Plan.md",
    output_docx=ROOT / "ARISE_D1.2_Clinical_Investigation_Plan.docx",
    doc_title="Clinical Investigation Plan",
    doc_subtitle="Phase 1 clinical investigation of the ARISE system",
    meta={
        "Project": "ARISE",
        "Deliverable": "D1.2 (part 1 of 4)",
        "Work Package": "WP1, Task T1.3",
        "Planned delivery": "Month 3 (mid-September 2026)",
        "Manufacturer and sponsor": "Innovina S.r.l.",
        "Clinical site": "Studio Buccarella",
        "Scientific partner": "DINOGMI, University of Genoa",
        "Reference instrumentation": "REHELAB, University of Genoa",
        "Confirmed MDR class": "Class IIa under Annex VIII Rule 11",
        "Status": "Draft for internal review",
        "Version, date": "2.0, 9 June 2026",
    },
    doc_short="D1.2 CIP",
)
print("Wrote ARISE_D1.2_Clinical_Investigation_Plan.docx")
