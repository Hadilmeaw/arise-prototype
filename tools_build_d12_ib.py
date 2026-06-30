"""Build D1.2 Investigator's Brochure using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_D1.2_Investigators_Brochure.md",
    output_docx=ROOT / "ARISE_D1.2_Investigators_Brochure.docx",
    doc_title="Investigator's Brochure",
    doc_subtitle="Device description and pre-clinical evaluation summary",
    meta={
        "Project": "ARISE",
        "Deliverable": "D1.2 (part 2 of 4)",
        "Work Package": "WP1, Task T1.3",
        "Planned delivery": "Month 3 (mid-September 2026)",
        "Manufacturer": "Innovina S.r.l.",
        "Companion to": "Clinical Investigation Plan",
        "Confirmed MDR class": "Class IIa under Annex VIII Rule 11",
        "Status": "Draft for internal review",
        "Version, date": "2.0, 9 June 2026",
    },
    doc_short="D1.2 IB",
)
print("Wrote ARISE_D1.2_Investigators_Brochure.docx")
