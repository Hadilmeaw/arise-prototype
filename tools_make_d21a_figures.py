"""Generate D2.1A Market Analysis figures with blue-only ARISE template palette.

Outputs (8 figures):
  fig_d21a_market_growth.png      - Italian rehab + digital health market growth
  fig_d21a_segment_breakdown.png  - Italian rehab segment donut
  fig_d21a_tam_sam_som.png        - Funnel for Italy ARR
  fig_d21a_positioning.png        - Positioning matrix vs alternatives
  fig_d21a_porters.png            - Porter's Five Forces
  fig_d21a_pricing_tco.png        - 3-year TCO comparison
  fig_d21a_revenue_projection.png - Year 1 to 3 revenue projection
  fig_d21a_swot.png               - SWOT 2x2 (depth)
  fig_d21a_risk_heatmap.png       - Risk heatmap (pre/post mitigation)

Palette: navy variants + single teal accent for ARISE only.
"""

from pathlib import Path
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, FancyArrowPatch
import matplotlib.ticker as mticker
import numpy as np

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

# ---- Blue-only template palette ----
NAVY_DEEP   = "#0E1F3C"
NAVY        = "#1A335C"
NAVY_MID    = "#2E5288"
NAVY_LIGHT  = "#5C7DA8"
NAVY_PALER  = "#A4B5CE"
NAVY_PALE   = "#D5DDE8"
TEAL        = "#1F8B7A"   # ARISE accent only
TEAL_LIGHT  = "#5DB3A4"
TEAL_PALE   = "#D8ECE6"
INK         = "#141414"
GREY        = "#6B6B6B"
GREY_LIGHT  = "#B5B5B5"
GREY_PALE   = "#EAECEF"
WHITE       = "#FFFFFF"


# ----- Figure 1: Italian rehab + digital health market growth -----

def make_market_growth():
    """All values converted to EUR at 1 USD = 0.92 EUR (mid-2026 indicative rate)."""
    fig, ax = plt.subplots(figsize=(11, 6))

    # USD figures from Grand View Research / Market Research Future, converted to EUR @ 0.92
    years_rehab = [2024, 2025, 2026, 2027, 2028, 2029, 2030]
    rehab_eur_bn = [10.65, 11.22, 11.83, 12.47, 13.15, 13.86, 14.59]
    years_dh = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]
    dh_eur_bn = [5.25, 5.97, 6.79, 7.71, 8.76, 9.94, 11.30, 12.83, 14.57, 16.56, 18.81, 21.37, 24.38]

    ax.plot(years_rehab, rehab_eur_bn, marker="o", linewidth=2.5,
            color=NAVY, markersize=8, markerfacecolor=NAVY,
            markeredgecolor=WHITE, label="Italian medical rehabilitation services (CAGR 5.4%)")
    ax.plot(years_dh, dh_eur_bn, marker="s", linewidth=2.5,
            color=NAVY_LIGHT, markersize=7, markerfacecolor=NAVY_LIGHT,
            markeredgecolor=WHITE, label="Italian digital health (CAGR 13.6%)")

    ax.annotate("EUR 10.7 bn (2024)", xy=(2024, 10.65), xytext=(2024.2, 8.9),
                fontsize=9, color=NAVY,
                arrowprops=dict(arrowstyle="->", color=NAVY, lw=0.8))
    ax.annotate("EUR 14.6 bn (2030)", xy=(2030, 14.59), xytext=(2027.3, 16.5),
                fontsize=9, color=NAVY,
                arrowprops=dict(arrowstyle="->", color=NAVY, lw=0.8))
    ax.annotate("EUR 24.4 bn (2035)", xy=(2035, 24.38), xytext=(2030.5, 22.0),
                fontsize=9, color=NAVY_LIGHT,
                arrowprops=dict(arrowstyle="->", color=NAVY_LIGHT, lw=0.8))

    ax.axvspan(2027, 2029, color=TEAL_PALE, alpha=0.5, zorder=0)
    ax.text(2028, 26.5, "ARISE Phase 2\ncommercial entry",
            fontsize=10, color=TEAL, fontweight="bold",
            ha="center", va="center", style="italic")

    ax.set_xlabel("Year", fontsize=11, color=INK)
    ax.set_ylabel("Market size (EUR billions)", fontsize=11, color=INK)
    ax.set_title("Italian rehabilitation and digital health market growth",
                 fontsize=13, fontweight="bold", color=NAVY, pad=15)
    ax.legend(loc="upper left", frameon=False, fontsize=10)
    ax.set_ylim(0, 28)
    ax.grid(axis="y", linestyle="--", color=GREY_LIGHT, alpha=0.4)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)
    for spine in ["bottom", "left"]:
        ax.spines[spine].set_color(GREY_LIGHT)

    ax.text(2024, -3.0,
            "Sources: Grand View Research (rehab services), Market Research Future (digital health). "
            "Converted from USD at 1 USD = 0.92 EUR.",
            fontsize=8, color=GREY, style="italic")

    plt.tight_layout()
    out = ROOT / "fig_d21a_market_growth.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ----- Figure 2: Italian rehab segment breakdown (donut) -----

def make_segment_breakdown():
    fig, ax = plt.subplots(figsize=(10, 6))

    sizes = [600, 600, 1500, 150, 6500]  # approximate counts
    labels = [
        "Outpatient rehabilitation centres\n(~600 of 1,203)",
        "Other rehabilitation structures\n(~600)",
        "RSA with substantial rehabilitation\n(~1,500)",
        "Hospital physiatry departments\n(~150)",
        "Other socio-sanitary units\n(~6,500)",
    ]
    colors = [NAVY, NAVY_MID, NAVY_LIGHT, TEAL, NAVY_PALER]
    explode = [0.06, 0, 0.06, 0.10, 0]

    wedges, texts = ax.pie(sizes, colors=colors, startangle=90,
                            wedgeprops=dict(width=0.40, edgecolor=WHITE, linewidth=2),
                            explode=explode)

    # Labels with leader lines
    for w, lab in zip(wedges, labels):
        ang = (w.theta2 + w.theta1) / 2
        x = np.cos(np.deg2rad(ang))
        y = np.sin(np.deg2rad(ang))
        ha = "left" if x >= 0 else "right"
        ax.annotate(lab, xy=(x * 0.85, y * 0.85), xytext=(x * 1.35, y * 1.20),
                    ha=ha, fontsize=9, color=INK,
                    arrowprops=dict(arrowstyle="-", color=GREY_LIGHT, lw=0.6))

    # Centre text
    ax.text(0, 0.10, "Italian rehab\n& long-term care",
            ha="center", va="center", fontsize=12,
            fontweight="bold", color=NAVY)
    ax.text(0, -0.18, "9,300+ facilities\nin scope of D2.1A",
            ha="center", va="center", fontsize=10, color=GREY)

    ax.set_title("Italian rehabilitation and long-term care landscape",
                 fontsize=13, fontweight="bold", color=NAVY, pad=20)

    ax.text(-1.3, -1.5,
            "Sources: Ministero della Salute Annuario SSN 2023 (1,203 rehabilitation structures); ISTAT 2023 (8,924 socio-sanitary service units).",
            fontsize=8, color=GREY, style="italic")

    plt.tight_layout()
    out = ROOT / "fig_d21a_segment_breakdown.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ----- Figure 3: TAM-SAM-SOM funnel -----

def make_tam_sam_som():
    fig, ax = plt.subplots(figsize=(11, 6))

    labels = ["TAM", "SAM", "SOM (Year 3)"]
    values = [6.0, 2.2, 0.19]  # midpoints, in EUR millions ARR
    ranges = [(4, 8), (1.2, 3.2), (0.06, 0.32)]
    colors = [NAVY, NAVY_MID, TEAL]
    descriptions = [
        "Total Addressable Market\nEvery Italian clinic that could in principle use ARISE",
        "Serviceable Available Market\nClinics reachable through ARISE distribution and willing to consider EaaS in the early window",
        "Serviceable Obtainable Market\nShare ARISE can realistically capture by end of Phase 2",
    ]

    bar_h = 0.5
    y_positions = [2.5, 1.5, 0.5]

    for i, (lab, val, (lo, hi), col, desc) in enumerate(zip(labels, values, ranges, colors, descriptions)):
        y = y_positions[i]
        # main bar
        ax.barh(y, val, height=bar_h, color=col, edgecolor=WHITE, linewidth=2,
                alpha=0.85, zorder=3)
        # range indicator (light bar showing range)
        ax.barh(y, hi - lo, left=lo, height=bar_h - 0.18, color=col,
                edgecolor=WHITE, alpha=0.35, zorder=2)
        # Range label
        ax.text(hi + 0.15, y, f"€{lo}-{hi}M ARR",
                fontsize=10, fontweight="bold", color=col,
                ha="left", va="center")
        # Layer label
        ax.text(-0.15, y, lab, fontsize=14, fontweight="bold",
                color=col, ha="right", va="center")
        # Description
        ax.text(0.1, y - 0.32, desc, fontsize=9, color=GREY,
                ha="left", va="top", style="italic")

    ax.set_xlim(-1.5, 9.5)
    ax.set_ylim(0, 3.3)
    ax.set_xlabel("Annual recurring revenue, Italy only (€ millions)",
                  fontsize=11, color=INK, labelpad=8)
    ax.set_yticks([])
    ax.set_title("Market size hierarchy for ARISE in Italy (TAM-SAM-SOM)",
                 fontsize=13, fontweight="bold", color=NAVY, pad=15)
    for spine in ["top", "right", "left"]:
        ax.spines[spine].set_visible(False)
    ax.spines["bottom"].set_color(GREY_LIGHT)
    ax.grid(axis="x", linestyle="--", color=GREY_LIGHT, alpha=0.4)
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"€{x:.1f}M"))

    plt.tight_layout()
    out = ROOT / "fig_d21a_tam_sam_som.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ----- Figure 4: Positioning matrix -----

def make_positioning():
    fig, ax = plt.subplots(figsize=(11, 7))

    competitors = [
        ("Stopwatch tests",         1.0, 1.5, 250,  NAVY_PALER),
        ("Pressure plates",         7.5, 5.5, 1400, NAVY_LIGHT),
        ("IMU systems",             5.0, 7.0, 900,  NAVY_MID),
        ("Markerless sports tools", 8.0, 7.5, 1600, NAVY_DEEP),
        ("ARISE",                   2.0, 8.0, 850,  TEAL),
    ]

    # Subtle quadrant backgrounds (all blue-shade)
    ax.add_patch(Rectangle((0, 5), 5, 5, facecolor=TEAL_PALE, alpha=0.50, zorder=0))
    ax.add_patch(Rectangle((5, 5), 5, 5, facecolor=NAVY_PALE, alpha=0.40, zorder=0))
    ax.add_patch(Rectangle((0, 0), 5, 5, facecolor=GREY_PALE, alpha=0.60, zorder=0))
    ax.add_patch(Rectangle((5, 0), 5, 5, facecolor="#EFE3E3", alpha=0.35, zorder=0))

    for name, x, y, s, c in competitors:
        ax.scatter([x], [y], s=s, color=c, alpha=0.92,
                   edgecolors=WHITE, linewidths=2.5, zorder=4)
        if name == "ARISE":
            ax.annotate("ARISE", (x, y), xytext=(x + 0.5, y + 0.45),
                        fontsize=15, fontweight="bold", color=TEAL, zorder=5)
            ax.annotate("(this product)", (x, y), xytext=(x + 0.5, y + 0.10),
                        fontsize=9, color=TEAL, zorder=5, style="italic")
        else:
            ax.annotate(name, (x, y), xytext=(x + 0.5, y + 0.4),
                        fontsize=10.5, color=INK, zorder=5)

    ax.axhline(5, color=GREY, linewidth=0.5, linestyle="--", alpha=0.4)
    ax.axvline(5, color=GREY, linewidth=0.5, linestyle="--", alpha=0.4)

    ax.text(0.4, 9.8, "Information rich\n+ easy to deploy",
            fontsize=10.5, color=TEAL, fontweight="bold",
            ha="left", va="top")
    ax.text(9.6, 9.8, "Information rich\n+ high friction",
            fontsize=10.5, color=NAVY, fontweight="bold",
            ha="right", va="top")
    ax.text(0.4, 0.3, "Low information\n+ low friction",
            fontsize=10.5, color=GREY, fontweight="bold",
            ha="left", va="bottom")
    ax.text(9.6, 0.3, "Low information\n+ high friction",
            fontsize=10.5, color="#8C4A45", fontweight="bold",
            ha="right", va="bottom")

    ax.set_xlim(-0.5, 11)
    ax.set_ylim(0, 10)
    ax.set_xlabel("Deployment friction (set-up time, footprint, patient instrumentation)",
                  fontsize=11, color=INK)
    ax.set_ylabel("Information richness for the therapist\n(kinematic detail, biofeedback, longitudinal context)",
                  fontsize=11, color=INK)
    ax.set_title("Positioning of ARISE vs alternatives in routine STS assessment",
                 fontsize=13, fontweight="bold", color=NAVY, pad=15)
    ax.set_xticks([1, 5, 9]); ax.set_xticklabels(["low", "medium", "high"], color=GREY)
    ax.set_yticks([1, 5, 9]); ax.set_yticklabels(["low", "medium", "high"], color=GREY)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)
    for spine in ["bottom", "left"]:
        ax.spines[spine].set_color(GREY_LIGHT)

    # Legend
    ax.text(10.2, 5.0, "Bubble size:\nrelative cost\nof entry for\nthe buyer",
            fontsize=9, color=GREY, ha="left", va="center", style="italic")

    plt.tight_layout()
    out = ROOT / "fig_d21a_positioning.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ----- Figure 5: Porter's Five Forces -----

def make_porters():
    """Larger figure with bigger text sizes throughout."""
    fig, ax = plt.subplots(figsize=(15, 11))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 11)
    ax.axis("off")

    # Central rivalry box
    cx, cy = 6.0, 5.5
    cw, ch = 5.0, 2.6
    cb = FancyBboxPatch((cx - cw/2, cy - ch/2), cw, ch,
                        boxstyle="round,pad=0.03,rounding_size=0.18",
                        linewidth=3, edgecolor=NAVY_DEEP, facecolor=NAVY)
    ax.add_patch(cb)
    ax.text(cx, cy + 0.75, "INDUSTRY RIVALRY",
            fontsize=20, fontweight="bold", color=WHITE,
            ha="center", va="center")
    ax.text(cx, cy + 0.25, "STS assessment market",
            fontsize=14, color=NAVY_PALE, ha="center", va="center")
    ax.text(cx, cy - 0.30, "Intensity: MEDIUM",
            fontsize=14, color=TEAL_LIGHT, fontweight="bold",
            ha="center", va="center", style="italic")
    ax.text(cx, cy - 0.85,
            "Direct rivalry in routine rehab is low.\nSpecialist-lab rivalry is high, but ARISE does not play there.",
            fontsize=11, color=NAVY_PALE, ha="center", va="center", style="italic")

    # Four surrounding boxes
    forces = [
        (0.2, 8.4, 5.4, 2.5,
         "Threat of new entrants", "MEDIUM-HIGH", NAVY_MID,
         ["Sports markerless vendors repurposing for clinical use",
          "MDR Class IIa barrier (Notified Body 12-18 months)",
          "AI / ML talent and corpus barriers",
          "Net: barrier delays entrants, does not block them"]),
        (6.4, 8.4, 5.4, 2.5,
         "Threat of substitutes", "MEDIUM", NAVY_MID,
         ["Stopwatch tests are the entrenched default",
          "Open-source markerless (OpenCap) anchors WTP",
          "IMU systems for non-STS assessment",
          "Net: substitutes exist but each has structural limits"]),
        (0.2, 0.1, 5.4, 2.5,
         "Bargaining power of buyers", "MEDIUM-HIGH", NAVY_MID,
         ["Single clinic per deal, low switching cost",
          "Price sensitivity in routine outpatient & RSA",
          "Public tender favours incumbents in hospitals",
          "Net: lighthouse references reduce per-deal power"]),
        (6.4, 0.1, 5.4, 2.5,
         "Bargaining power of suppliers", "LOW", TEAL,
         ["Commodity hardware (camera, edge SoC)",
          "Multi-vendor cloud (AWS, Azure, GCP, OVHcloud)",
          "Open-source ML frameworks",
          "Net: Innovina is not locked to any supplier"]),
    ]
    for x, y, w, h, title, intensity, header_col, items in forces:
        bg = FancyBboxPatch((x, y), w, h,
                            boxstyle="round,pad=0.02,rounding_size=0.12",
                            linewidth=1.5, edgecolor=NAVY_LIGHT, facecolor=WHITE)
        ax.add_patch(bg)
        # Header band
        ax.add_patch(Rectangle((x, y + h - 0.58), w, 0.58,
                               linewidth=0, facecolor=header_col))
        ax.text(x + 0.25, y + h - 0.29, title,
                fontsize=15, fontweight="bold", color=WHITE,
                ha="left", va="center")
        ax.text(x + w - 0.25, y + h - 0.29, intensity,
                fontsize=12, color=WHITE, ha="right", va="center",
                fontweight="bold", style="italic")
        for i, it in enumerate(items):
            color = TEAL if it.startswith("Net:") else INK
            weight = "bold" if it.startswith("Net:") else "normal"
            ax.text(x + 0.25, y + h - 0.95 - i * 0.38,
                    f"•  {it}", fontsize=11, color=color,
                    fontweight=weight, ha="left", va="center")

    # Arrows
    def arrow(x1, y1, x2, y2):
        a = FancyArrowPatch((x1, y1), (x2, y2),
                            arrowstyle="-|>", mutation_scale=18,
                            linewidth=1.5, color=GREY)
        ax.add_patch(a)
    arrow(3.5, 8.4, 5.0, 6.7)
    arrow(8.5, 8.4, 7.0, 6.7)
    arrow(3.5, 2.6, 5.0, 4.3)
    arrow(8.5, 2.6, 7.0, 4.3)

    ax.text(6.0, 10.7, "Porter's Five Forces: STS assessment market",
            fontsize=17, fontweight="bold", color=NAVY, ha="center")

    plt.tight_layout()
    out = ROOT / "fig_d21a_porters.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ----- Figure 6: 3-year TCO comparison -----

def make_pricing_tco():
    """Figures match the §9.2 TCO assumptions table in the markdown."""
    fig, ax = plt.subplots(figsize=(12, 6.5))

    categories = ["Stopwatch\ntest", "ARISE\nEssential", "ARISE\nStandard", "ARISE\nProfessional",
                  "IMU system\n(mid-range)", "Pressure plate\n(mid-range)",
                  "Markerless\nmulti-camera"]
    # 3-year TCO ranges in K EUR (low, high), aligned with §9.2 of the document
    tco_low  = [0,   7.164, 14.364, 25.164, 18.0, 30.0, 60.0]
    tco_high = [0.1, 7.164, 14.364, 32.364, 35.0, 60.0, 120.0]
    bar_colors = [NAVY_PALER, TEAL, TEAL, TEAL, NAVY_LIGHT, NAVY_MID, NAVY_DEEP]

    midpoints = [(lo + hi) / 2 for lo, hi in zip(tco_low, tco_high)]
    x_pos = np.arange(len(categories))

    ax.bar(x_pos, midpoints, color=bar_colors, edgecolor=WHITE,
           linewidth=2, alpha=0.92, zorder=3)
    ax.errorbar(x_pos, midpoints,
                yerr=[[m - lo for m, lo in zip(midpoints, tco_low)],
                      [hi - m for m, hi in zip(midpoints, tco_high)]],
                fmt="none", ecolor=NAVY_DEEP, capsize=5, capthick=1.5, zorder=4)
    for i, (m, lo, hi) in enumerate(zip(midpoints, tco_low, tco_high)):
        if lo == hi == 0:
            label = "€0"
        elif lo == 0 and hi <= 1:
            label = f"≤€{int(hi*1000)}"
        elif lo == hi:
            label = f"€{lo:.1f}k"
        else:
            label = f"€{lo:.0f}–{hi:.0f}k"
        ax.text(i, hi + 4, label, ha="center", va="bottom",
                fontsize=10, fontweight="bold", color=INK)

    ax.axvspan(0.5, 3.5, alpha=0.10, color=TEAL, zorder=0)
    ax.text(2.0, 132, "ARISE EaaS subscription tiers",
            ha="center", va="center", fontsize=11, color=TEAL,
            fontweight="bold", style="italic")

    ax.set_xticks(x_pos)
    ax.set_xticklabels(categories, fontsize=10, color=INK)
    ax.set_ylabel("3-year total cost of ownership (€ thousands)",
                  fontsize=11, color=INK)
    ax.set_title("Three-year total cost of ownership: ARISE vs alternatives",
                 fontsize=13, fontweight="bold", color=NAVY, pad=15)
    ax.set_ylim(0, 140)
    ax.grid(axis="y", linestyle="--", color=GREY_LIGHT, alpha=0.4)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)
    for spine in ["bottom", "left"]:
        ax.spines[spine].set_color(GREY_LIGHT)

    ax.text(0, -25,
            "TCO assumptions in §9.2 of the document. Ranges reflect capital purchase + software/maintenance + indirect costs over 3 years.",
            fontsize=8, color=GREY, style="italic")

    plt.tight_layout()
    out = ROOT / "fig_d21a_pricing_tco.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ----- Figure 7: 3-year revenue projection -----

def make_revenue_projection():
    fig, ax = plt.subplots(figsize=(11, 6))

    years = ["Year 1", "Year 2", "Year 3"]
    seg_outpatient = [20, 80, 165]   # K EUR
    seg_rsa        = [15, 55, 115]
    seg_hospital   = [0, 25, 60]
    seg_homerehab  = [0, 0, 12]

    x = np.arange(len(years))
    w = 0.6

    p1 = ax.bar(x, seg_outpatient, w, color=NAVY, label="Outpatient rehab centres", edgecolor=WHITE)
    p2 = ax.bar(x, seg_rsa, w, bottom=seg_outpatient, color=NAVY_MID,
                label="RSA nursing homes", edgecolor=WHITE)
    bottom2 = [a + b for a, b in zip(seg_outpatient, seg_rsa)]
    p3 = ax.bar(x, seg_hospital, w, bottom=bottom2, color=NAVY_LIGHT,
                label="Hospital physiatry", edgecolor=WHITE)
    bottom3 = [a + b for a, b in zip(bottom2, seg_hospital)]
    p4 = ax.bar(x, seg_homerehab, w, bottom=bottom3, color=TEAL,
                label="Home tele-rehab (Phase 2)", edgecolor=WHITE)

    # Total labels on top
    totals = [a + b + c + d for a, b, c, d in zip(seg_outpatient, seg_rsa, seg_hospital, seg_homerehab)]
    for i, t in enumerate(totals):
        ax.text(i, t + 8, f"€{t}k", ha="center", va="bottom",
                fontsize=11, fontweight="bold", color=NAVY)

    ax.set_xticks(x)
    ax.set_xticklabels(years, fontsize=11, color=INK)
    ax.set_ylabel("Annual recurring revenue (€ thousands)",
                  fontsize=11, color=INK)
    ax.set_title("Three-year revenue projection by segment, Italy",
                 fontsize=13, fontweight="bold", color=NAVY, pad=15)
    ax.legend(loc="upper left", frameon=False, fontsize=10)
    ax.set_ylim(0, 400)
    ax.grid(axis="y", linestyle="--", color=GREY_LIGHT, alpha=0.4)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)
    for spine in ["bottom", "left"]:
        ax.spines[spine].set_color(GREY_LIGHT)
    ax.text(0, -55, "Plan figures derived from EaaS pricing in §7.2 and pilot-to-paid assumptions in §9.",
            fontsize=8, color=GREY, style="italic")

    plt.tight_layout()
    out = ROOT / "fig_d21a_revenue_projection.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ----- Figure 8: SWOT 2x2 with depth (blue-only) -----

def make_swot():
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 11)
    ax.axis("off")

    quads = [
        (0.3, 5.7, 5.6, 4.9,
         "STRENGTHS", TEAL,
         {
             "Product": [
                 "Contactless markerless capture, no patient instrumentation",
                 "Sub-100 ms edge inference for real-time biofeedback",
                 "Three-dimensional kinematics (trunk, hip, knee)",
                 "Sit-to-Stand specificity: 18 KPIs and 14-code taxonomy",
                 "Three-layer detection (rule + per-patient z-score + DL)",
             ],
             "Commercial": [
                 "EaaS removes the capital barrier for routine clinics",
                 "Sub-2-minute set-up fits the 30-45 min session",
                 "Documentation utility for SSN accreditation",
             ],
             "Strategic": [
                 "Class IIa confirmed under MDR Rule 11",
                 "Native Italian partnerships (DINOGMI, Buccarella)",
                 "REHELAB optoelectronic gold standard available",
             ],
         }),
        (6.1, 5.7, 5.6, 4.9,
         "WEAKNESSES", NAVY_LIGHT,
         {
             "Product": [
                 "No prior clinical investigation evidence yet",
                 "Markerless accuracy in varied lighting still to prove",
                 "Single condition (STS) at Phase 1",
                 "Dashboard not yet integrated with hospital IS",
             ],
             "Commercial": [
                 "Zero brand recognition at launch",
                 "Direct-sales capability not yet scaled",
                 "No established distributor channel in Italy",
             ],
             "Strategic": [
                 "Notified Body queue dependency for CE marking",
                 "Reliance on a single Italian pilot site for WP5",
                 "Limited regulatory experience as a first-time manufacturer",
             ],
         }),
        (0.3, 0.3, 5.6, 4.9,
         "OPPORTUNITIES", NAVY_MID,
         {
             "Market": [
                 "EU expansion after Italian beachhead (DE, ES, FR)",
                 "Italian rehab services market CAGR 5.4% to 2030",
                 "Italian digital health market CAGR 13.6% to 2035",
                 "Home tele-rehabilitation as a Phase 2 segment",
             ],
             "Product": [
                 "Extend taxonomy to TUG, balance, gait in Phase 2",
                 "Hospital information system integration",
                 "Multi-language biofeedback for cross-EU deployment",
             ],
             "Regulatory & reimbursement": [
                 "DiGA reimbursement track in Germany",
                 "PECAN early-access framework in France",
                 "PNRR digital-health funding for Italian regional projects",
             ],
         }),
        (6.1, 0.3, 5.6, 4.9,
         "THREATS", NAVY_DEEP,
         {
             "Competitive": [
                 "Larger markerless vendors entering rehab (Movella, Theia)",
                 "BTS or Captiks adding markerless to existing offer",
                 "Open-source markerless (OpenCap) erodes willingness to pay",
             ],
             "Regulatory": [
                 "Notified Body queue stretching beyond 18 months",
                 "MDR class re-evaluation by NB during assessment",
                 "GDPR enforcement on biometric data tightening",
             ],
             "Market": [
                 "Pilot-to-paid conversion below 50%",
                 "No dedicated SSN code for STS objectivity",
                 "Cybersecurity incident in the cloud back-end",
                 "SSN budget cuts affecting public-segment uptake",
             ],
         }),
    ]
    for x, y, w, h, header, color, subcats in quads:
        bg = FancyBboxPatch((x, y), w, h,
                            boxstyle="round,pad=0.02,rounding_size=0.10",
                            linewidth=2.2, edgecolor=color, facecolor=WHITE)
        ax.add_patch(bg)
        ax.add_patch(Rectangle((x, y + h - 0.55), w, 0.55,
                               linewidth=0, facecolor=color))
        ax.text(x + w/2, y + h - 0.28, header,
                fontsize=15, fontweight="bold", color=WHITE,
                ha="center", va="center")
        cur_y = y + h - 1.05
        for cat, items in subcats.items():
            ax.text(x + 0.22, cur_y, cat,
                    fontsize=10.5, fontweight="bold", color=color,
                    ha="left", va="center", style="italic")
            cur_y -= 0.28
            for it in items:
                ax.text(x + 0.40, cur_y, f"• {it}",
                        fontsize=8.5, color=INK, ha="left", va="center")
                cur_y -= 0.27
            cur_y -= 0.10

    ax.text(6.0, 10.75, "SWOT analysis - ARISE go-to-market",
            fontsize=15, fontweight="bold", color=NAVY, ha="center")
    ax.text(-0.15, 8.15, "INTERNAL", fontsize=10, color=GREY,
            rotation=90, ha="center", va="center", style="italic")
    ax.text(-0.15, 2.75, "EXTERNAL", fontsize=10, color=GREY,
            rotation=90, ha="center", va="center", style="italic")
    ax.text(3.1, -0.10, "POSITIVE", fontsize=10, color=GREY,
            ha="center", va="center", style="italic")
    ax.text(8.9, -0.10, "NEGATIVE", fontsize=10, color=GREY,
            ha="center", va="center", style="italic")

    plt.tight_layout()
    out = ROOT / "fig_d21a_swot.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ----- Figure 9: Risk heatmap with mitigation arrows (blue palette) -----

def make_risk_heatmap():
    fig, ax = plt.subplots(figsize=(14, 8))

    # Blue sequential cell colors
    cell_colors = [
        [NAVY_PALE,  NAVY_PALE,  NAVY_PALER],   # impact low (bottom row)
        [NAVY_PALE,  NAVY_PALER, NAVY_LIGHT],   # impact medium
        [NAVY_PALER, NAVY_LIGHT, NAVY_MID],     # impact high (top row)
    ]
    for r in range(3):
        for c in range(3):
            ax.add_patch(Rectangle((c, r), 1, 1,
                                   facecolor=cell_colors[r][c],
                                   edgecolor=WHITE, linewidth=2))

    risks = [
        ("R1", "NB queue delays CE marking",      (1.6, 2.4), (1.2, 1.5)),
        ("R2", "Competitor markerless launch",    (1.3, 2.0), (1.0, 1.4)),
        ("R3", "No SSN code for STS",             (1.5, 1.4), (1.5, 1.0)),
        ("R4", "Accuracy < threshold",            (1.1, 2.3), (0.5, 1.4)),
        ("R5", "Pilot-to-paid conversion low",    (1.5, 1.3), (1.0, 0.8)),
        ("R6", "Distributor partnership delay",   (1.4, 1.5), (0.9, 1.0)),
        ("R7", "Cybersecurity incident",          (0.5, 2.6), (0.3, 2.2)),
        ("R8", "Usability score below threshold", (0.6, 2.2), (0.3, 1.6)),
    ]
    for rid, label, (x0, y0), (x1, y1) in risks:
        ax.annotate("", xy=(x1, y1), xytext=(x0, y0),
                    arrowprops=dict(arrowstyle="->", color=TEAL,
                                    lw=1.8, alpha=0.85))
        ax.scatter([x1], [y1], s=150, facecolor=WHITE,
                   edgecolors=TEAL, linewidths=2.2, zorder=5)
        ax.scatter([x0], [y0], s=170, color=NAVY_DEEP,
                   edgecolors=WHITE, linewidths=1.8, zorder=6)
        ax.annotate(rid, (x0, y0), xytext=(x0, y0),
                    ha="center", va="center", fontsize=9,
                    fontweight="bold", color=WHITE, zorder=7)

    ax.set_xticks([0.5, 1.5, 2.5])
    ax.set_xticklabels(["Low", "Medium", "High"], fontsize=11, color=INK)
    ax.set_yticks([0.5, 1.5, 2.5])
    ax.set_yticklabels(["Low", "Medium", "High"], fontsize=11, color=INK)
    ax.set_xlabel("Likelihood", fontsize=12, color=INK, labelpad=10)
    ax.set_ylabel("Impact", fontsize=12, color=INK, labelpad=10)
    ax.set_xlim(0, 3)
    ax.set_ylim(0, 3)
    ax.set_aspect("equal", adjustable="box")
    ax.set_title("Strategic risk heat map (pre- and post-mitigation)",
                 fontsize=13, fontweight="bold", color=NAVY, pad=15)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.tick_params(length=0)

    ax.set_xlim(0, 9)
    legend_x = 3.4
    ax.text(legend_x, 2.92, "Risk register",
            fontsize=12, fontweight="bold", color=NAVY)
    for i, (rid, label, _, _) in enumerate(risks):
        y = 2.65 - i * 0.30
        ax.scatter([legend_x + 0.05], [y], s=80, color=NAVY_DEEP, zorder=5,
                   edgecolors=WHITE, linewidths=1)
        ax.text(legend_x + 0.05, y, rid, fontsize=8, fontweight="bold",
                color=WHITE, ha="center", va="center", zorder=6)
        ax.text(legend_x + 0.32, y, label, fontsize=9.5, color=INK, va="center")

    # Marker legend
    ax.scatter([5.9], [0.50], s=150, color=NAVY_DEEP,
               edgecolors=WHITE, linewidths=1.5, zorder=5)
    ax.text(6.15, 0.50, "Pre-mitigation position",
            fontsize=9, color=INK, va="center")
    ax.scatter([5.9], [0.18], s=150, facecolor=WHITE,
               edgecolors=TEAL, linewidths=2, zorder=5)
    ax.text(6.15, 0.18, "Post-mitigation position (teal arrow shows direction)",
            fontsize=9, color=INK, va="center")

    plt.tight_layout()
    out = ROOT / "fig_d21a_risk_heatmap.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


if __name__ == "__main__":
    make_market_growth()
    make_segment_breakdown()
    make_tam_sam_som()
    make_positioning()
    make_porters()
    make_pricing_tco()
    make_revenue_projection()
    make_swot()
    make_risk_heatmap()
