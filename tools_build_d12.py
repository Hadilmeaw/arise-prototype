"""Build D1.2 Clinical Investigation Protocol using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_D1.2_Clinical_Investigation_Protocol.md",
    output_docx=ROOT / "ARISE_D1.2_Clinical_Investigation_Protocol.docx",
    doc_title="Clinical Investigation Protocol",
    doc_subtitle="Phase 1 clinical demonstration of the ARISE system",
    meta={
        "Project": "ARISE",
        "Deliverable": "D1.2",
        "Work Package": "WP1, Task T1.3",
        "Planned delivery": "Month 6 (June 2026)",
        "Sponsor": "Innovina S.r.l.",
        "Clinical partner and site": "Studio Buccarella",
        "Scientific partner": "DINOGMI, University of Genoa",
        "Version, date": "1.0, 26 May 2026",
    },
    doc_short="D1.2 Clinical Investigation Protocol",
)
print("Wrote ARISE_D1.2_Clinical_Investigation_Protocol.docx")
