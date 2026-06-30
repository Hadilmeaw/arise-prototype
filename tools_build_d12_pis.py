"""Build D1.2 Patient Information Sheet using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_D1.2_Patient_Information_Sheet.md",
    output_docx=ROOT / "ARISE_D1.2_Patient_Information_Sheet.docx",
    doc_title="Patient Information Sheet",
    doc_subtitle="Information for participants in the ARISE clinical investigation",
    meta={
        "Project": "ARISE",
        "Deliverable": "D1.2 (part 3 of 4)",
        "Work Package": "WP1, Task T1.3",
        "Planned delivery": "Month 3 (mid-September 2026)",
        "Sponsor": "Innovina S.r.l.",
        "Companion to": "Clinical Investigation Plan, Informed Consent Form",
        "Language": "English master version, Italian version provided to participants",
        "Status": "Draft for internal review",
        "Version, date": "[TO BE COMPLETED], [TO BE COMPLETED]",
    },
    doc_short="D1.2 Patient Information Sheet",
)
print("Wrote ARISE_D1.2_Patient_Information_Sheet.docx")
