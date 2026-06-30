"""Build the ARISE Template (empty/placeholder) docx.

This deliberately uses placeholder text on the cover so the reader can
see the file is a template. Real documents replace the placeholders
with the actual cover-page content.
"""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_Template_Sample_content.md",
    output_docx=ROOT / "ARISE_Template.docx",
    doc_title="[DOCUMENT TITLE]",
    doc_subtitle="[Document subtitle goes here]",
    meta={
        "Project": "ARISE",
        "Deliverable": "[D.X.X]",
        "Document type": "[DOCUMENT TYPE]",
        "Work Package": "[WP, Task]",
        "Planned delivery": "[Month X]",
        "Prepared by": "Innovina S.r.l.",
        "Partners": "[List partners]",
        "Version, date": "[X.X], [DD Month YYYY]",
    },
    doc_short="[Document short name]",
)
print("Wrote ARISE_Template.docx")
