"""Generate the participant-flow figure for the D1.2 Clinical Investigation Plan."""
from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

NAVY = "#1A335C"
TEAL = "#1F8B7A"
GREY = "#6B6B6B"
LIGHT = "#F2F4F8"
INK = "#141414"


def draw_box(ax, x, y, w, h, text, fill=LIGHT, edge=NAVY, text_color=INK, fontsize=10, bold=True):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.08",
                         linewidth=1.4, edgecolor=edge, facecolor=fill)
    ax.add_patch(box)
    ax.text(x + w / 2, y + h / 2, text,
            ha="center", va="center",
            fontsize=fontsize, color=text_color,
            fontweight="bold" if bold else "normal",
            wrap=True)


def draw_arrow(ax, x1, y1, x2, y2, color=NAVY):
    arrow = FancyArrowPatch((x1, y1), (x2, y2),
                            arrowstyle='-|>', mutation_scale=18,
                            linewidth=1.4, color=color)
    ax.add_patch(arrow)


fig, ax = plt.subplots(figsize=(8.5, 11))
ax.set_xlim(0, 10)
ax.set_ylim(0, 13)
ax.axis("off")

# Layout: vertical flow with side annotations
boxes = [
    (3.0, 11.7, 4.0, 0.9, "Recruitment, screening, consent"),
    (3.0, 10.2, 4.0, 0.9, "Eligibility met"),
    (3.0, 8.7,  4.0, 0.9, "Enrolment, baseline assessment"),
    (3.0, 7.2,  4.0, 0.9, "ARISE session 1"),
    (3.0, 5.7,  4.0, 0.9, "ARISE session 2 ... session n"),
    (3.0, 4.2,  4.0, 0.9, "Reference instrumentation session\nat REHELAB"),
    (3.0, 2.7,  4.0, 0.9, "Follow-up visit"),
    (3.0, 1.2,  4.0, 0.9, "End of investigation for the participant"),
]

# Use NAVY-style boxes for two key milestones
key_boxes = {5}  # the REHELAB session

for i, (x, y, w, h, text) in enumerate(boxes):
    if i in key_boxes:
        draw_box(ax, x, y, w, h, text, fill="#E8F1EE", edge=TEAL)
    else:
        draw_box(ax, x, y, w, h, text)

# Arrows between boxes
for i in range(len(boxes) - 1):
    _, y1, _, h1, _ = boxes[i]
    x2, y2, w2, _, _ = boxes[i + 1]
    cx = x2 + w2 / 2
    draw_arrow(ax, cx, y1, cx, y2 + 0.9)

# Side note for the REHELAB session
ax.annotate(
    "Optoelectronic\nreference, jointly\nwith DINOGMI",
    xy=(7.0, 4.65), xytext=(8.4, 4.65),
    ha="left", va="center",
    fontsize=9, color=TEAL, fontweight="bold",
    arrowprops=dict(arrowstyle="-", color=TEAL, lw=1)
)

# Title
ax.text(5.0, 12.6, "Participant flow",
        ha="center", va="bottom",
        fontsize=14, fontweight="bold", color=NAVY)

plt.tight_layout()
out = ROOT / "fig_d12_participant_flow.png"
plt.savefig(out, dpi=200, bbox_inches="tight", facecolor="white")
plt.close()
print(f"Wrote {out}")
