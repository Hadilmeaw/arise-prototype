"""Build D1.2 Informed Consent Form using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_D1.2_Informed_Consent_Form.md",
    output_docx=ROOT / "ARISE_D1.2_Informed_Consent_Form.docx",
    doc_title="Informed Consent Form",
    doc_subtitle="Written consent for participation in the ARISE clinical investigation",
    meta={
        "Project": "ARISE",
        "Deliverable": "D1.2 (part 4 of 4)",
        "Work Package": "WP1, Task T1.3",
        "Planned delivery": "Month 3 (mid-September 2026)",
        "Manufacturer": "Innovina S.r.l.",
        "Companion to": "Patient Information Sheet, Clinical Investigation Plan",
        "Languages": "English master, Italian version signed by participants (Annex B)",
        "Confirmed MDR class": "Class IIa under Annex VIII Rule 11",
        "Status": "Draft for internal review",
        "Version, date": "2.0, 9 June 2026",
    },
    doc_short="D1.2 ICF",
)
print("Wrote ARISE_D1.2_Informed_Consent_Form.docx")
