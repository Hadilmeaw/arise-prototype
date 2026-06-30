"""Generate the figures used in D2.2 (Coach state machine for now)."""
from pathlib import Path
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")
OUT  = ROOT / "docs" / "d22_figures"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = "#0E1F3C"
TEAL = "#2DA39A"
INK  = "#1A2433"
SOFT = "#F6F8FB"
EDGE = "#0E1F3C"


def box(ax, cx, cy, w, h, label, *, primary=False):
    bg = NAVY if primary else SOFT
    fg = "white" if primary else INK
    rect = FancyBboxPatch(
        (cx - w / 2, cy - h / 2), w, h,
        boxstyle="round,pad=0.02,rounding_size=0.10",
        linewidth=1.2, edgecolor=EDGE, facecolor=bg,
    )
    ax.add_patch(rect)
    ax.text(cx, cy, label, ha="center", va="center",
            fontsize=11, fontweight="600", color=fg)


def arrow(ax, p0, p1, *, label=None, curve=0.0, color=None):
    color = color or EDGE
    arr = FancyArrowPatch(
        p0, p1,
        arrowstyle="-|>", mutation_scale=14,
        linewidth=1.2, color=color,
        connectionstyle=f"arc3,rad={curve}",
    )
    ax.add_patch(arr)
    if label:
        mx = (p0[0] + p1[0]) / 2
        my = (p0[1] + p1[1]) / 2
        ax.text(mx, my, label, fontsize=9, color=INK,
                ha="center", va="center",
                bbox=dict(facecolor="white", edgecolor="none", pad=2))


def build_coach_flow():
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.set_xlim(0, 10); ax.set_ylim(0, 9)
    ax.set_aspect("equal"); ax.axis("off")

    W, H = 2.0, 0.85

    # Column 1 (left): primary path
    box(ax, 2.0, 8.2, W, H, "Login")
    box(ax, 2.0, 6.6, W, H, "Idle / Today")
    box(ax, 2.0, 5.0, W, H, "Calibrate")
    box(ax, 2.0, 3.4, W, H, "Active session", primary=True)
    box(ax, 2.0, 1.8, W, H, "Done")

    # Column 2 (right): side screens
    box(ax, 6.5, 6.6, W, H, "History")
    box(ax, 6.5, 5.0, W, H, "Settings")
    box(ax, 6.5, 3.4, W, H, "Error state")

    # Primary path arrows
    arrow(ax, (2.0, 8.2 - H/2), (2.0, 6.6 + H/2))
    arrow(ax, (2.0, 6.6 - H/2), (2.0, 5.0 + H/2), label="I'm ready")
    arrow(ax, (2.0, 5.0 - H/2), (2.0, 3.4 + H/2), label="auto-detect")
    arrow(ax, (2.0, 3.4 - H/2), (2.0, 1.8 + H/2), label="I'm finished")

    # Done branches
    arrow(ax, (2.0 + 0.4, 1.8 + H/2), (2.0 + 0.4, 5.0 - H/2),
          curve=0.45, label="Another set")
    arrow(ax, (2.0 - 0.4, 1.8 + H/2), (2.0 - 0.4, 6.6 - H/2),
          curve=-0.55, label="Done for now")

    # Idle <-> History
    arrow(ax, (2.0 + W/2, 6.6 + 0.15), (6.5 - W/2, 6.6 + 0.15), label="History")
    arrow(ax, (6.5 - W/2, 6.6 - 0.15), (2.0 + W/2, 6.6 - 0.15), label="Back")
    # Idle <-> Settings
    arrow(ax, (2.0 + W/2, 5.0 + 0.15), (6.5 - W/2, 5.0 + 0.15), label="Settings")
    arrow(ax, (6.5 - W/2, 5.0 - 0.15), (2.0 + W/2, 5.0 - 0.15), label="Back")

    # Error state can interrupt any screen (dashed)
    arr = FancyArrowPatch(
        (2.0 + W/2, 3.4), (6.5 - W/2, 3.4),
        arrowstyle="-|>", mutation_scale=12,
        linewidth=1.2, color="#A0322A", linestyle=(0, (4, 3)),
    )
    ax.add_patch(arr)
    ax.text(4.25, 3.6, "any screen, recoverable", fontsize=9,
            color="#A0322A", ha="center", va="bottom",
            bbox=dict(facecolor="white", edgecolor="none", pad=2))

    # Legend
    ax.text(0.2, 0.4,
            "Navy = primary action  ·  Dashed red = cross-cutting overlay",
            fontsize=9, color=INK)

    fig.tight_layout()
    out = OUT / "coach_flow.png"
    fig.savefig(out, dpi=180, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"wrote {out}")


def build_therapist_nav():
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.set_xlim(0, 10); ax.set_ylim(0, 5)
    ax.set_aspect("equal"); ax.axis("off")

    W, H = 1.9, 0.8

    box(ax, 2.0, 4.0, W, H, "Login")
    box(ax, 2.0, 2.5, W, H, "Caseload", primary=True)
    box(ax, 5.0, 2.5, W, H, "Sessions")
    box(ax, 7.8, 2.5, W, H, "Reports")
    box(ax, 5.0, 1.0, W, H, "Session detail\n(modal)")
    box(ax, 7.8, 1.0, W, H, "Settings")

    arrow(ax, (2.0, 4.0 - H/2), (2.0, 2.5 + H/2))
    arrow(ax, (2.0 + W/2, 2.5), (5.0 - W/2, 2.5), label="click patient")
    arrow(ax, (5.0 + W/2, 2.5), (7.8 - W/2, 2.5))
    arrow(ax, (5.0, 2.5 - H/2), (5.0, 1.0 + H/2), label="open session")
    arrow(ax, (7.8, 2.5 - H/2), (7.8, 1.0 + H/2), curve=0.4)

    # Back arrow Sessions->Caseload
    arrow(ax, (5.0 - W/2 - 0.05, 2.5 - 0.15), (2.0 + W/2 + 0.05, 2.5 - 0.15),
          label="All patients")

    ax.text(0.2, 0.3,
            "Sidebar = nav only (Caseload / Sessions / Reports / Settings).",
            fontsize=9, color=INK)

    fig.tight_layout()
    out = OUT / "therapist_nav.png"
    fig.savefig(out, dpi=180, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"wrote {out}")


if __name__ == "__main__":
    build_coach_flow()
    build_therapist_nav()
