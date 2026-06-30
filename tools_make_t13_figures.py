"""Generate the biomechanical figures embedded in the T1.3 document.

All figures are saved as PNG in figures/ at 300 dpi for print quality.
Style: line-art, black-on-white, similar to Schenkman/Riley reference plates.
"""
import math
from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")
FIG_DIR = ROOT / "figures"
FIG_DIR.mkdir(exist_ok=True)

# Common style
plt.rcParams.update({
    "font.family": "serif",
    "font.size": 9,
    "axes.linewidth": 0.8,
    "lines.linewidth": 1.2,
})


# ───────────────────────────────────────────────────────────────────
# Stick figure helper
# ───────────────────────────────────────────────────────────────────

def stick_figure(ax, *, trunk_angle_deg=0, hip_angle_deg=180, knee_angle_deg=180,
                 ankle_angle_deg=90, posture="standing", x0=0, scale=1.0,
                 chair=False, arm_swing=0):
    """Draw a stick figure in side-view at ax. Origin (x0, 0) is the foot."""
    # Anchor: ankle at (x0, ankle_y)
    s = scale
    foot_y = 0
    ankle = np.array([x0, foot_y + 0.05 * s])

    # Lower leg vertical
    lower_leg_len = 0.45 * s
    knee = ankle + np.array([0, lower_leg_len])

    # Upper leg per knee angle (180 = straight, less = bent)
    upper_leg_len = 0.45 * s
    knee_flex = math.radians(180 - knee_angle_deg)
    # Upper leg goes up-and-forward depending on knee flex
    hip = knee + np.array([math.sin(knee_flex) * upper_leg_len * 0.7,
                            math.cos(knee_flex) * upper_leg_len])

    # Trunk per trunk angle
    trunk_len = 0.50 * s
    trunk_rad = math.radians(trunk_angle_deg)
    shoulder = hip + np.array([math.sin(trunk_rad) * trunk_len,
                                math.cos(trunk_rad) * trunk_len])

    # Head
    head_offset = 0.15 * s
    head_center = shoulder + np.array([math.sin(trunk_rad) * head_offset,
                                        math.cos(trunk_rad) * head_offset])
    head_radius = 0.05 * s

    # Arm swing
    elbow = shoulder + np.array([0.08 * s + arm_swing * 0.05, -0.18 * s])
    wrist = elbow + np.array([0.02 * s + arm_swing * 0.08, -0.18 * s])

    # Floor line
    ax.plot([x0 - 0.4 * s, x0 + 0.4 * s], [foot_y, foot_y], "k-", lw=0.6)

    # Chair if requested
    if chair:
        chair_top = hip[1]
        chair_x = hip[0] - 0.28 * s
        chair_w = 0.20 * s
        chair_h = chair_top - foot_y - 0.05 * s
        # Seat top
        ax.plot([chair_x, chair_x + chair_w],
                [chair_top, chair_top], "k-", lw=0.6)
        # Seat back
        ax.plot([chair_x, chair_x],
                [chair_top, chair_top + 0.30 * s], "k-", lw=0.6)
        # Front legs
        ax.plot([chair_x + chair_w, chair_x + chair_w],
                [chair_top, foot_y + 0.05 * s], "k-", lw=0.6)
        ax.plot([chair_x, chair_x],
                [chair_top, foot_y + 0.05 * s], "k-", lw=0.6)

    # Body segments
    ax.plot([ankle[0], knee[0]], [ankle[1], knee[1]], "k-", lw=1.6)
    ax.plot([knee[0], hip[0]], [knee[1], hip[1]], "k-", lw=1.6)
    ax.plot([hip[0], shoulder[0]], [hip[1], shoulder[1]], "k-", lw=1.6)
    ax.plot([shoulder[0], elbow[0]], [shoulder[1], elbow[1]], "k-", lw=1.2)
    ax.plot([elbow[0], wrist[0]], [elbow[1], wrist[1]], "k-", lw=1.2)
    # Head
    head = plt.Circle(head_center, head_radius, fill=False, lw=1.2)
    ax.add_patch(head)
    # Joints
    for jp in [ankle, knee, hip, shoulder, elbow, wrist]:
        ax.plot(jp[0], jp[1], "ko", markersize=2)

    return {"ankle": ankle, "knee": knee, "hip": hip,
            "shoulder": shoulder, "head": head_center}


# ───────────────────────────────────────────────────────────────────
# Figure 1: Six phases of the Sit-to-Stand movement
# ───────────────────────────────────────────────────────────────────

def fig1_six_phases():
    fig, axes = plt.subplots(1, 6, figsize=(10, 3.2), dpi=300)
    phases = [
        # (name, label, trunk, knee, chair, posture)
        ("Phase 1\nSitting",       0,    90,  True,  "sitting"),
        ("Phase 2\nForward lean",  35,   95,  True,  "lean"),
        ("Phase 3\nLift-off",      30,   130, False, "liftoff"),
        ("Phase 4\nStanding",      8,    175, False, "standing"),
        ("Phase 5\nStabilisation", 2,    178, False, "standing"),
        ("Phase 6\nDescent",       25,   115, False, "descent"),
    ]
    bottom_labels = ["Start", "Anterior\nflexion",
                     "Seat-off", "Full\nextension", "Postural\nsettling",
                     "Controlled\nreturn"]
    for ax, (name, trunk, knee, chair, posture), bot in zip(axes, phases, bottom_labels):
        stick_figure(ax, trunk_angle_deg=trunk, knee_angle_deg=knee,
                     x0=0, scale=1.0, chair=chair, posture=posture)
        # Vertical dashed reference axis at the hip x-projection
        ax.axvline(0, color="grey", linestyle=(0, (1, 2)), lw=0.5)
        ax.set_xlim(-0.55, 0.55)
        ax.set_ylim(-0.05, 1.5)
        ax.set_aspect("equal")
        ax.set_xticks([]); ax.set_yticks([])
        for spine in ax.spines.values(): spine.set_visible(False)
        ax.set_title(name, fontsize=9)
        ax.text(0, -0.05, bot, ha="center", va="top", fontsize=8, style="italic")
    plt.tight_layout()
    out = FIG_DIR / "fig1_six_phases.png"
    plt.savefig(out, dpi=300, bbox_inches="tight", facecolor="white")
    plt.close()
    return out


# ───────────────────────────────────────────────────────────────────
# Figure 2: Hip vertical trajectory across one repetition
# ───────────────────────────────────────────────────────────────────

def fig2_hip_trajectory():
    fig, ax = plt.subplots(figsize=(7, 3.2), dpi=300)
    t = np.linspace(0, 3.0, 600)
    # Synthetic but realistic hip-Y curve (normalised 0..1)
    y = np.zeros_like(t)
    for i, ti in enumerate(t):
        if ti < 0.4:                          # sitting
            y[i] = 0.05
        elif ti < 0.8:                        # forward lean (small rise)
            y[i] = 0.05 + 0.10 * (ti - 0.4) / 0.4
        elif ti < 1.2:                        # lift-off (rapid rise)
            u = (ti - 0.8) / 0.4
            y[i] = 0.15 + 0.75 * (0.5 - 0.5 * math.cos(math.pi * u))
        elif ti < 1.6:                        # standing
            y[i] = 0.92
        elif ti < 2.0:                        # stabilisation plateau
            y[i] = 0.93 - 0.005 * (ti - 1.6)
        elif ti < 2.7:                        # descent
            u = (ti - 2.0) / 0.7
            y[i] = 0.92 - 0.85 * (0.5 - 0.5 * math.cos(math.pi * u))
        else:
            y[i] = 0.07

    ax.plot(t, y, "k-", lw=1.4)
    ax.set_xlabel("Time (s)")
    ax.set_ylabel("Hip vertical position\n(normalised)")
    ax.set_xlim(0, 3.0)
    ax.set_ylim(0, 1.05)
    ax.set_yticks([0, 0.25, 0.50, 0.75, 1.00])
    ax.grid(axis="y", lw=0.3, linestyle="--", color="grey", alpha=0.5)

    # Phase bands
    phase_bounds = [
        (0.00, 0.40, "Sitting",       "#ECECEC"),
        (0.40, 0.80, "Forward\nlean", "#F5DCB3"),
        (0.80, 1.20, "Lift-off",      "#C2D4E8"),
        (1.20, 1.60, "Standing",      "#CFE8C2"),
        (1.60, 2.00, "Stabilis.",     "#CFE8C2"),
        (2.00, 3.00, "Descent",       "#F5DCB3"),
    ]
    for a, b, lab, col in phase_bounds:
        ax.axvspan(a, b, ymin=0, ymax=0.08, color=col)
        ax.text((a + b) / 2, -0.025, lab, ha="center", va="top", fontsize=7)
    # Boundary markers
    for a, _, _, _ in phase_bounds[1:]:
        ax.axvline(a, color="grey", lw=0.4, linestyle=(0, (2, 2)))

    ax.set_title("Hip vertical trajectory across one Sit-to-Stand repetition",
                 fontsize=10)
    plt.tight_layout()
    out = FIG_DIR / "fig2_hip_trajectory.png"
    plt.savefig(out, dpi=300, bbox_inches="tight", facecolor="white")
    plt.close()
    return out


# ───────────────────────────────────────────────────────────────────
# Figure 3: Reference coordinate frame and KPI joint angles
# ───────────────────────────────────────────────────────────────────

def fig3_reference_frame():
    fig, ax = plt.subplots(figsize=(5, 5), dpi=300)
    joints = stick_figure(ax, trunk_angle_deg=20, knee_angle_deg=160,
                          x0=0, scale=1.0, posture="liftoff")
    # Axes anchored at hip
    hip = joints["hip"]
    arrow_len = 0.45
    # Y up
    ax.annotate("", xy=(hip[0], hip[1] + arrow_len), xytext=(hip[0], hip[1]),
                arrowprops=dict(arrowstyle="->", lw=1.4, color="#1A335C"))
    ax.text(hip[0] + 0.02, hip[1] + arrow_len, " Y (gravity, up)",
            color="#1A335C", fontsize=9, va="center")
    # X forward
    ax.annotate("", xy=(hip[0] + arrow_len, hip[1]), xytext=(hip[0], hip[1]),
                arrowprops=dict(arrowstyle="->", lw=1.4, color="#C02A2A"))
    ax.text(hip[0] + arrow_len, hip[1] - 0.05, " X (sagittal, forward)",
            color="#C02A2A", fontsize=9, va="top")
    # Z lateral - drawn as a small dot with label
    ax.plot(hip[0], hip[1], "o", markersize=8, markerfacecolor="white",
            markeredgecolor="#2E7D32")
    ax.plot(hip[0], hip[1], "o", markersize=2, color="#2E7D32")
    ax.text(hip[0] + 0.06, hip[1] + 0.04, "Z (lateral,\ninto page)",
            color="#2E7D32", fontsize=9, va="center")

    # Mark mid-pelvis origin
    ax.text(hip[0] - 0.07, hip[1] - 0.08, "Origin: mid-pelvis\nat frame 0",
            fontsize=8, style="italic", color="grey")

    ax.set_xlim(-0.6, 0.9)
    ax.set_ylim(-0.05, 1.6)
    ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
    for spine in ax.spines.values(): spine.set_visible(False)
    ax.set_title("Patient-anchored reference frame", fontsize=10)
    plt.tight_layout()
    out = FIG_DIR / "fig3_reference_frame.png"
    plt.savefig(out, dpi=300, bbox_inches="tight", facecolor="white")
    plt.close()
    return out


# ───────────────────────────────────────────────────────────────────
# Figure 4: Key biomechanical angles measured per repetition
# ───────────────────────────────────────────────────────────────────

def fig4_key_angles():
    fig, axes = plt.subplots(1, 3, figsize=(10, 3.6), dpi=300)
    # Trunk angle
    ax = axes[0]
    joints = stick_figure(ax, trunk_angle_deg=30, knee_angle_deg=160, x0=0)
    hip = joints["hip"]
    # Vertical reference dashed
    ax.plot([hip[0], hip[0]], [hip[1], hip[1] + 0.5], "k--", lw=0.6)
    # Arc indicator at hip between vertical and trunk
    arc_r = 0.18
    theta = np.linspace(math.pi/2, math.pi/2 - math.radians(30), 40)
    arc_x = hip[0] + arc_r * np.cos(theta)
    arc_y = hip[1] + arc_r * np.sin(theta)
    ax.plot(arc_x, arc_y, "r-", lw=1.4)
    ax.text(hip[0] + 0.20, hip[1] + 0.30, r"$\theta_{trunk}$", color="red",
            fontsize=12)
    ax.set_xlim(-0.5, 0.6); ax.set_ylim(-0.05, 1.55); ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
    for spine in ax.spines.values(): spine.set_visible(False)
    ax.set_title("Trunk angle\nfrom vertical", fontsize=9)

    # Knee angle
    ax = axes[1]
    joints = stick_figure(ax, trunk_angle_deg=5, knee_angle_deg=140, x0=0)
    knee = joints["knee"]
    arc_r = 0.13
    # Arc on the posterior side of the knee
    theta = np.linspace(math.radians(180), math.radians(225), 40)
    arc_x = knee[0] + arc_r * np.cos(theta)
    arc_y = knee[1] + arc_r * np.sin(theta)
    ax.plot(arc_x, arc_y, "r-", lw=1.4)
    ax.text(knee[0] - 0.30, knee[1] - 0.10, r"$\theta_{knee}$", color="red",
            fontsize=12)
    ax.set_xlim(-0.5, 0.6); ax.set_ylim(-0.05, 1.55); ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
    for spine in ax.spines.values(): spine.set_visible(False)
    ax.set_title("Knee internal\nangle", fontsize=9)

    # Hip angle
    ax = axes[2]
    joints = stick_figure(ax, trunk_angle_deg=15, knee_angle_deg=140, x0=0)
    hip = joints["hip"]
    arc_r = 0.18
    # Anterior arc between upper-leg-up and trunk-up
    theta = np.linspace(math.radians(70), math.radians(125), 40)
    arc_x = hip[0] + arc_r * np.cos(theta)
    arc_y = hip[1] + arc_r * np.sin(theta)
    ax.plot(arc_x, arc_y, "r-", lw=1.4)
    ax.text(hip[0] + 0.20, hip[1] + 0.15, r"$\theta_{hip}$", color="red",
            fontsize=12)
    ax.set_xlim(-0.5, 0.6); ax.set_ylim(-0.05, 1.55); ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
    for spine in ax.spines.values(): spine.set_visible(False)
    ax.set_title("Hip internal\nangle", fontsize=9)

    fig.suptitle("Principal joint angles measured per repetition",
                 fontsize=10, y=1.02)
    plt.tight_layout()
    out = FIG_DIR / "fig4_key_angles.png"
    plt.savefig(out, dpi=300, bbox_inches="tight", facecolor="white")
    plt.close()
    return out


# ───────────────────────────────────────────────────────────────────
# Figure 5: Front-view error patterns (valgus, varus, asymmetry, sway)
# ───────────────────────────────────────────────────────────────────

def _frontal_stick(ax, *, khr=1.0, shoulder_dy=0.0, leg_color="black",
                   title=""):
    """Front-view stick figure. khr = knee-to-hip ratio; <1 valgus, >1 varus.
    shoulder_dy = vertical offset of right shoulder (positive = right higher)."""
    cx = 0
    head_r = 0.05
    # Heights
    head_y = 1.45
    shoulder_y = 1.30
    hip_y = 0.90
    knee_y = 0.50
    ankle_y = 0.10

    hw = 0.10   # half hip width
    shw = 0.13  # half shoulder width
    aw = 0.10   # half ankle width

    left_sh = (cx - shw, shoulder_y + shoulder_dy/2)
    right_sh = (cx + shw, shoulder_y - shoulder_dy/2)
    left_hip = (cx - hw, hip_y)
    right_hip = (cx + hw, hip_y)
    left_ankle = (cx - aw, ankle_y)
    right_ankle = (cx + aw, ankle_y)
    knee_distance = hw * 2 * khr
    left_knee = (cx - knee_distance / 2, knee_y)
    right_knee = (cx + knee_distance / 2, knee_y)

    # Floor
    ax.plot([cx - 0.35, cx + 0.35], [0.05, 0.05], "k-", lw=0.6)
    # Head
    head = plt.Circle((cx, head_y), head_r, fill=False, lw=1.2)
    ax.add_patch(head)
    # Neck to mid-shoulder
    midsh = (cx, (left_sh[1] + right_sh[1]) / 2)
    ax.plot([cx, midsh[0]], [head_y - head_r, midsh[1]], "k-", lw=1.2)
    # Shoulder bar
    ax.plot([left_sh[0], right_sh[0]], [left_sh[1], right_sh[1]], "k-", lw=1.4)
    # Trunk to hip bar
    ax.plot([midsh[0], cx], [midsh[1], hip_y], "k-", lw=1.4)
    # Hip bar
    ax.plot([left_hip[0], right_hip[0]], [hip_y, hip_y], "k-", lw=1.4)
    # Legs
    ax.plot([left_hip[0], left_knee[0]], [hip_y, knee_y], "-",
            color=leg_color, lw=1.6)
    ax.plot([right_hip[0], right_knee[0]], [hip_y, knee_y], "-",
            color=leg_color, lw=1.6)
    ax.plot([left_knee[0], left_ankle[0]], [knee_y, ankle_y], "-",
            color=leg_color, lw=1.6)
    ax.plot([right_knee[0], right_ankle[0]], [knee_y, ankle_y], "-",
            color=leg_color, lw=1.6)
    # Joints
    for jp in [left_sh, right_sh, left_hip, right_hip,
               left_knee, right_knee, left_ankle, right_ankle]:
        ax.plot(jp[0], jp[1], "ko", markersize=2)

    ax.set_xlim(-0.45, 0.45); ax.set_ylim(0, 1.6)
    ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
    for spine in ax.spines.values(): spine.set_visible(False)
    ax.set_title(title, fontsize=8.5)


def fig5_error_patterns():
    fig, axes = plt.subplots(1, 4, figsize=(10, 3.5), dpi=300)
    _frontal_stick(axes[0], khr=1.0, title="Normal\nKHR $\\approx$ 1.0")
    _frontal_stick(axes[1], khr=0.55, leg_color="red",
                   title="E1 Knee valgus\nKHR < 0.70")
    _frontal_stick(axes[2], khr=1.45, leg_color="red",
                   title="E1b Knee varus\nKHR > 1.30")
    _frontal_stick(axes[3], khr=1.0, shoulder_dy=0.10,
                   title="E7 Asymmetric\nweight shift")
    fig.suptitle("Examples of clinical error patterns in the front view",
                 fontsize=10, y=1.02)
    plt.tight_layout()
    out = FIG_DIR / "fig5_error_patterns.png"
    plt.savefig(out, dpi=300, bbox_inches="tight", facecolor="white")
    plt.close()
    return out


# ───────────────────────────────────────────────────────────────────

def main():
    figs = [fig1_six_phases(), fig2_hip_trajectory(), fig3_reference_frame(),
            fig4_key_angles(), fig5_error_patterns()]
    print(f"Generated {len(figs)} figures in {FIG_DIR}")
    for f in figs:
        print(f"  {f.name}")


if __name__ == "__main__":
    main()
