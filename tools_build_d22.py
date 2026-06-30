"""Build D2.2 UI/UX Specifications and Mockups using the ARISE template."""
from pathlib import Path
from tools_arise_doc_template import build_arise_document

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

build_arise_document(
    input_md=ROOT / "ARISE_D2.2_UI_UX_Specifications.md",
    output_docx=ROOT / "ARISE_D2.2_UI_UX_Specifications.docx",
    doc_title="D2.2 UI/UX Specifications and Mockups (Patient and Therapist)",
    doc_subtitle="Coach app and Therapist dashboard, anchored to the running React mockups in apps/coach and apps/therapist",
    meta={
        "Project": "ARISE",
        "Deliverable": "D2.2",
        "Work Package": "WP2, Task T2.3 (with Innovina)",
        "Planned delivery": "Month 9",
        "Task lead": "Innovina S.r.l.",
        "Companion to": "D2.1A, D2.1B, D2.1B-bis, T1.3, D1.1",
        "Mockup repository": "apps/coach, apps/therapist (React + Vite)",
        "Persistence (mockup)": "localStorage; cloud API per D2.1B in WP4",
        "Pose engine": "MediaPipe Pose Landmarker Lite (browser, GPU)",
        "Status": "Draft for internal review",
        "Version, date": "1.0, 30 June 2026",
    },
    doc_short="D2.2 UI/UX Specifications",
)
print("Wrote ARISE_D2.2_UI_UX_Specifications.docx")
