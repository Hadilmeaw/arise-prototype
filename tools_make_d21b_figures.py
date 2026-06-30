"""Generate D2.1B Cloud Architecture figures.

Three figures, redesigned for clarity:
  fig_d21b_system_overview.png   - C4-style system context
  fig_d21b_dataflow.png          - clean UML-style sequence diagram
  fig_d21b_deployment.png        - AWS-style deployment topology

Cloud-only. No edge hardware detail.
"""

from pathlib import Path
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, FancyArrowPatch

ROOT = Path(r"\\wsl.localhost\Ubuntu-20.04\home\ev04\v2")

NAVY_DEEP   = "#0E1F3C"
NAVY        = "#1A335C"
NAVY_MID    = "#2E5288"
NAVY_LIGHT  = "#5C7DA8"
NAVY_PALER  = "#A4B5CE"
NAVY_PALE   = "#D5DDE8"
TEAL        = "#1F8B7A"
TEAL_LIGHT  = "#5DB3A4"
TEAL_PALE   = "#D8ECE6"
INK         = "#141414"
GREY        = "#5B5B5B"
GREY_LIGHT  = "#B5B5B5"
LIGHT_FILL  = "#F4F6F9"
WHITE       = "#FFFFFF"


def box(ax, x, y, w, h, text, *, fill=LIGHT_FILL, edge=NAVY_LIGHT, text_color=INK,
        fontsize=12, bold=False, rounded=True, lw=1.8):
    if rounded:
        b = FancyBboxPatch((x, y), w, h,
                           boxstyle="round,pad=0.02,rounding_size=0.10",
                           linewidth=lw, edgecolor=edge, facecolor=fill)
    else:
        b = Rectangle((x, y), w, h, linewidth=lw, edgecolor=edge, facecolor=fill)
    ax.add_patch(b)
    ax.text(x + w / 2, y + h / 2, text,
            ha="center", va="center", fontsize=fontsize,
            color=text_color, fontweight="bold" if bold else "normal")


def arrow(ax, x1, y1, x2, y2, *, color=NAVY, lw=2.2, style="-|>"):
    a = FancyArrowPatch((x1, y1), (x2, y2),
                        arrowstyle=style, mutation_scale=20,
                        linewidth=lw, color=color,
                        shrinkA=2, shrinkB=2)
    ax.add_patch(a)


# ---------------------------------------------------------------------------
# Figure 1: System context (C4-style)
# ---------------------------------------------------------------------------

def make_system_overview():
    fig, ax = plt.subplots(figsize=(15, 9))
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 9.5)
    ax.axis("off")

    ax.text(7.5, 9.05, "ARISE cloud back-end — system context",
            ha="center", va="center", fontsize=17,
            fontweight="bold", color=NAVY)

    # --- Actor column (left) ---
    actors = [
        (7.20, "Clinical sites",
         "Send post-session bundles\nover HTTPS + mTLS", TEAL, TEAL_PALE),
        (5.30, "Therapists",
         "Read patient KPIs in\nthe web dashboard", TEAL, TEAL_PALE),
        (3.40, "DINOGMI annotators",
         "Write ground-truth labels\n(Phase A only)", NAVY_MID, NAVY_PALE),
        (1.50, "Innovina engineering",
         "Operate and audit\nthe platform", NAVY_DEEP, NAVY_PALE),
    ]
    for y, title, subtitle, edge, fill in actors:
        b = FancyBboxPatch((0.4, y), 3.5, 1.55,
                           boxstyle="round,pad=0.02,rounding_size=0.10",
                           linewidth=2.0, edgecolor=edge, facecolor=fill)
        ax.add_patch(b)
        ax.text(2.15, y + 1.05, title, ha="center", va="center",
                fontsize=13, fontweight="bold", color=edge)
        ax.text(2.15, y + 0.40, subtitle, ha="center", va="center",
                fontsize=10.5, color=INK)

    # --- The cloud back-end (system boundary) ---
    sys_x, sys_y, sys_w, sys_h = 5.5, 1.4, 9.1, 7.2
    system = FancyBboxPatch((sys_x, sys_y), sys_w, sys_h,
                            boxstyle="round,pad=0.04,rounding_size=0.20",
                            linewidth=2.5, edgecolor=NAVY,
                            facecolor=NAVY_PALE, alpha=0.30)
    ax.add_patch(system)
    # Header band
    band = FancyBboxPatch((sys_x, sys_y + sys_h - 0.75), sys_w, 0.75,
                          boxstyle="round,pad=0.02,rounding_size=0.10",
                          linewidth=0, facecolor=NAVY)
    ax.add_patch(band)
    ax.text(sys_x + sys_w / 2, sys_y + sys_h - 0.38,
            "ARISE cloud back-end   ·   AWS Frankfurt (eu-central-1)",
            ha="center", va="center", fontsize=14,
            fontweight="bold", color=WHITE)

    # Inside the system: 3 rows × 2 columns of logical components
    col1_x, col2_x = sys_x + 0.35, sys_x + 4.75
    col_w = 3.95
    row_h = 1.30
    row_top = sys_y + sys_h - 1.05
    row_gap = 0.30

    components = [
        ("Identity & access",
         "Cognito · OIDC · MFA"),
        ("Ingestion API",
         "API Gateway + WAF\nmTLS · schema check"),
        ("Application services",
         "ECS Fargate\nAPIs + workers"),
        ("Data stores",
         "RDS PostgreSQL\nS3 warm/cold (EU)"),
        ("Dashboard back-end",
         "Row-level access control"),
        ("Observability & audit",
         "CloudWatch · CloudTrail\nGuardDuty"),
    ]

    positions = []
    for i, (title, subtitle) in enumerate(components):
        row = i // 2
        col_x = col1_x if i % 2 == 0 else col2_x
        y_top = row_top - row * (row_h + row_gap)
        positions.append((col_x, y_top - row_h, col_w, row_h))
        b = FancyBboxPatch((col_x, y_top - row_h), col_w, row_h,
                           boxstyle="round,pad=0.02,rounding_size=0.08",
                           linewidth=1.6, edgecolor=NAVY_MID,
                           facecolor=WHITE)
        ax.add_patch(b)
        ax.text(col_x + col_w / 2, y_top - 0.42,
                title, ha="center", va="center",
                fontsize=12.5, fontweight="bold", color=NAVY)
        ax.text(col_x + col_w / 2, y_top - 0.95,
                subtitle, ha="center", va="center",
                fontsize=10.5, color=INK)

    # Footer band (cross-cutting concerns)
    footer = FancyBboxPatch((sys_x + 0.35, sys_y + 0.20), sys_w - 0.70, 0.55,
                            boxstyle="round,pad=0.02,rounding_size=0.08",
                            linewidth=1.6, edgecolor=TEAL, facecolor=TEAL_PALE)
    ax.add_patch(footer)
    ax.text(sys_x + sys_w / 2, sys_y + 0.475,
            "Cross-cutting: TLS 1.3 in transit · KMS customer-managed keys at rest · EEA-only storage",
            ha="center", va="center", fontsize=10.5, color=NAVY)

    # --- Connectors actor → system boundary (only to the boundary, not internals) ---
    boundary_x = sys_x
    for y, title, *_ in actors:
        actor_mid_y = y + 0.78
        arrow(ax, 3.95, actor_mid_y, boundary_x, actor_mid_y,
              color=NAVY_MID, lw=1.8)

    # Legend
    ax.text(7.5, 0.35,
            "Arrows: HTTPS over the public internet. Mutual TLS on the clinical-site path.",
            ha="center", va="center", fontsize=10, color=GREY, style="italic")

    out = ROOT / "fig_d21b_system_overview.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ---------------------------------------------------------------------------
# Figure 2: Per-session data flow (UML-style sequence diagram)
# ---------------------------------------------------------------------------

def make_dataflow():
    fig, ax = plt.subplots(figsize=(15, 9))
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 10)
    ax.axis("off")

    ax.text(7.5, 9.55, "Per-session data flow (cloud-side)",
            ha="center", va="center", fontsize=17,
            fontweight="bold", color=NAVY)

    # Five lifelines: x-position, header label, colour
    lifelines = [
        (1.50, "Clinical client",       TEAL),
        (4.40, "API Gateway\n+ WAF",    NAVY_LIGHT),
        (7.25, "Application\nservices", NAVY),
        (10.10, "Data stores",          NAVY_MID),
        (13.00, "Therapist\ndashboard", TEAL_LIGHT),
    ]
    lifeline_top = 8.40
    lifeline_bot = 0.80
    head_w, head_h = 2.30, 0.95

    for x, label, color in lifelines:
        # Header box
        b = FancyBboxPatch((x - head_w / 2, lifeline_top - head_h),
                           head_w, head_h,
                           boxstyle="round,pad=0.02,rounding_size=0.10",
                           linewidth=0, facecolor=color)
        ax.add_patch(b)
        ax.text(x, lifeline_top - head_h / 2, label,
                ha="center", va="center", fontsize=12.5,
                fontweight="bold", color=WHITE)
        # Lifeline (dashed)
        ax.plot([x, x], [lifeline_bot, lifeline_top - head_h],
                color=GREY_LIGHT, linewidth=1.2, linestyle=(0, (4, 4)),
                zorder=0)

    # Sequence messages: (y, from_idx, to_idx, label, color, return?)
    messages = [
        (6.85, 0, 1, "1. POST /sessions  (TLS 1.3 + mTLS)",                NAVY,       False),
        (6.10, 1, 2, "2. Verify OIDC token, forward request",              NAVY,       False),
        (5.35, 2, 3, "3. Validate schema, deduplicate by UUID",            NAVY,       False),
        (4.60, 2, 3, "4. Write raw bundle (hot DB + warm S3)",             NAVY,       False),
        (3.85, 2, 3, "5. Compute per-session KPIs, write summary",         NAVY,       False),
        (3.10, 3, 2, "6. Persist confirmation",                            NAVY_LIGHT, True),
        (2.35, 2, 0, "7. HTTP 201 Created  (durable write ack)",           NAVY_LIGHT, True),
        (1.40, 4, 3, "8. Therapist opens session, dashboard queries KPIs", TEAL,       False),
    ]

    for y, f_idx, t_idx, label, color, is_return in messages:
        x1 = lifelines[f_idx][0]
        x2 = lifelines[t_idx][0]
        style = "->" if is_return else "-|>"
        lw = 1.7 if is_return else 2.1
        arrow(ax, x1, y, x2, y, color=color, lw=lw, style=style)
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 0.18, label,
                ha="center", va="bottom", fontsize=11, color=INK)

    # Footer note
    ax.text(7.5, 0.30,
            "All steps execute inside the Frankfurt region. Audit events written to CloudTrail throughout.",
            ha="center", va="center", fontsize=10, color=GREY, style="italic")

    out = ROOT / "fig_d21b_dataflow.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


# ---------------------------------------------------------------------------
# Figure 3: Deployment topology (AWS-style)
# ---------------------------------------------------------------------------

def make_deployment():
    fig, ax = plt.subplots(figsize=(15, 9.5))
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 10)
    ax.axis("off")

    ax.text(7.5, 9.65, "Deployment topology — primary region and disaster recovery",
            ha="center", va="center", fontsize=17,
            fontweight="bold", color=NAVY)

    # --- External actors (left column) ---
    box(ax, 0.3, 6.55, 3.0, 2.30,
        "Italian\nclinical sites",
        fill=TEAL_PALE, edge=TEAL, fontsize=13, bold=True)
    ax.text(1.8, 6.30, "HTTPS + mTLS",
            ha="center", va="center", fontsize=10, color=GREY, style="italic")

    box(ax, 0.3, 3.20, 3.0, 2.30,
        "Therapist\nweb client",
        fill=TEAL_PALE, edge=TEAL, fontsize=13, bold=True)
    ax.text(1.8, 2.95, "HTTPS + OIDC + MFA",
            ha="center", va="center", fontsize=10, color=GREY, style="italic")

    # --- Primary region (centre) ---
    region_x, region_y, region_w, region_h = 3.85, 0.75, 7.15, 8.30
    rg = FancyBboxPatch((region_x, region_y), region_w, region_h,
                        boxstyle="round,pad=0.03,rounding_size=0.18",
                        linewidth=2.5, edgecolor=NAVY,
                        facecolor=NAVY_PALE, alpha=0.28)
    ax.add_patch(rg)
    # Region title
    title = FancyBboxPatch((region_x, region_y + region_h - 0.75),
                           region_w, 0.75,
                           boxstyle="round,pad=0.02,rounding_size=0.10",
                           linewidth=0, facecolor=NAVY)
    ax.add_patch(title)
    ax.text(region_x + region_w / 2, region_y + region_h - 0.38,
            "AWS Frankfurt — eu-central-1   (PRIMARY)",
            ha="center", va="center", fontsize=13.5,
            fontweight="bold", color=WHITE)

    # Edge tier (inside region, top)
    edge_y = region_y + region_h - 1.95
    box(ax, region_x + 0.35, edge_y, region_w - 0.70, 1.05,
        "Edge tier:   Route 53  →  CloudFront  →  API Gateway + WAF",
        fill=WHITE, edge=NAVY_MID, fontsize=11.5, bold=True)

    # VPC container
    vpc_x = region_x + 0.35
    vpc_y = region_y + 0.85
    vpc_w = region_w - 0.70
    vpc_h = edge_y - vpc_y - 0.25
    vpc = FancyBboxPatch((vpc_x, vpc_y), vpc_w, vpc_h,
                         boxstyle="round,pad=0.02,rounding_size=0.10",
                         linewidth=1.8, edgecolor=NAVY_MID,
                         facecolor=WHITE, linestyle="--")
    ax.add_patch(vpc)
    ax.text(vpc_x + 0.20, vpc_y + vpc_h - 0.28,
            "Production VPC   ·   3 Availability Zones",
            ha="left", va="center", fontsize=11.5,
            fontweight="bold", color=NAVY_MID)

    # Service tiles inside VPC (2 cols × 3 rows)
    tile_cols = 2
    tile_rows = 3
    tile_pad = 0.25
    grid_left = vpc_x + tile_pad
    grid_right = vpc_x + vpc_w - tile_pad
    grid_top = vpc_y + vpc_h - 0.65
    grid_bot = vpc_y + tile_pad
    tile_w = (grid_right - grid_left - tile_pad * (tile_cols - 1)) / tile_cols
    tile_h = (grid_top - grid_bot - tile_pad * (tile_rows - 1)) / tile_rows

    tiles = [
        ("Cognito",          "OIDC · MFA"),
        ("ECS Fargate",      "APIs + workers"),
        ("RDS PostgreSQL",   "Multi-AZ"),
        ("S3 (warm + cold)", "Object Lock"),
        ("KMS (CMK)",        "Customer-managed keys"),
        ("CloudTrail\n+ GuardDuty", "Audit + threat detect"),
    ]
    for i, (title_t, sub_t) in enumerate(tiles):
        row = i // tile_cols
        col = i % tile_cols
        tx = grid_left + col * (tile_w + tile_pad)
        ty = grid_top - (row + 1) * tile_h - row * tile_pad
        b = FancyBboxPatch((tx, ty), tile_w, tile_h,
                           boxstyle="round,pad=0.02,rounding_size=0.08",
                           linewidth=1.4, edgecolor=NAVY_LIGHT,
                           facecolor=LIGHT_FILL)
        ax.add_patch(b)
        ax.text(tx + tile_w / 2, ty + tile_h * 0.62,
                title_t, ha="center", va="center",
                fontsize=12, fontweight="bold", color=NAVY)
        ax.text(tx + tile_w / 2, ty + tile_h * 0.25,
                sub_t, ha="center", va="center",
                fontsize=10, color=INK)

    # --- DR region (top right) ---
    dr_x, dr_y, dr_w, dr_h = 11.55, 5.20, 3.20, 3.85
    dr = FancyBboxPatch((dr_x, dr_y), dr_w, dr_h,
                        boxstyle="round,pad=0.03,rounding_size=0.15",
                        linewidth=2.0, edgecolor=NAVY_MID,
                        facecolor=NAVY_PALE, alpha=0.25)
    ax.add_patch(dr)
    dr_title = FancyBboxPatch((dr_x, dr_y + dr_h - 0.65), dr_w, 0.65,
                              boxstyle="round,pad=0.02,rounding_size=0.10",
                              linewidth=0, facecolor=NAVY_MID)
    ax.add_patch(dr_title)
    ax.text(dr_x + dr_w / 2, dr_y + dr_h - 0.33,
            "AWS Ireland — eu-west-1   (DR)",
            ha="center", va="center", fontsize=12,
            fontweight="bold", color=WHITE)
    box(ax, dr_x + 0.20, dr_y + 2.15, dr_w - 0.40, 0.85,
        "RDS standby\nread replica", fill=WHITE, fontsize=10.5)
    box(ax, dr_x + 0.20, dr_y + 1.10, dr_w - 0.40, 0.85,
        "S3 cross-region\nreplication", fill=WHITE, fontsize=10.5)
    box(ax, dr_x + 0.20, dr_y + 0.20, dr_w - 0.40, 0.70,
        "Cold archive replica", fill=WHITE, fontsize=10)

    # --- Innovina engineering account (bottom right) ---
    eng_x, eng_y, eng_w, eng_h = 11.55, 0.75, 3.20, 4.10
    eng = FancyBboxPatch((eng_x, eng_y), eng_w, eng_h,
                         boxstyle="round,pad=0.03,rounding_size=0.15",
                         linewidth=2.0, edgecolor=NAVY_DEEP,
                         facecolor=NAVY_PALE, alpha=0.25)
    ax.add_patch(eng)
    eng_title = FancyBboxPatch((eng_x, eng_y + eng_h - 0.65), eng_w, 0.65,
                               boxstyle="round,pad=0.02,rounding_size=0.10",
                               linewidth=0, facecolor=NAVY_DEEP)
    ax.add_patch(eng_title)
    ax.text(eng_x + eng_w / 2, eng_y + eng_h - 0.33,
            "Innovina engineering account",
            ha="center", va="center", fontsize=11.5,
            fontweight="bold", color=WHITE)
    box(ax, eng_x + 0.20, eng_y + 2.30, eng_w - 0.40, 0.85,
        "Bastion +\nremote admin", fill=WHITE, fontsize=10.5)
    box(ax, eng_x + 0.20, eng_y + 1.25, eng_w - 0.40, 0.85,
        "CI/CD pipeline\n(Terraform IaC)", fill=WHITE, fontsize=10.5)
    box(ax, eng_x + 0.20, eng_y + 0.30, eng_w - 0.40, 0.75,
        "Separate AWS\naccount + IAM",
        fill=WHITE, fontsize=10)

    # --- Inter-region and cross-account connectors ---
    # Clients → edge
    arrow(ax, 3.30, 7.70, region_x, edge_y + 0.50,
          color=NAVY, lw=2.4)
    arrow(ax, 3.30, 4.35, region_x, edge_y + 0.50,
          color=TEAL, lw=2.0)
    # Primary → DR (replication)
    arrow(ax, region_x + region_w, region_y + region_h - 3.0,
          dr_x, dr_y + dr_h - 1.5,
          color=NAVY_LIGHT, lw=2.2)
    ax.text((region_x + region_w + dr_x) / 2,
            region_y + region_h - 2.2,
            "async\nreplication",
            ha="center", va="center", fontsize=10,
            color=NAVY_LIGHT, style="italic")
    # Engineering → primary (admin)
    arrow(ax, eng_x, eng_y + eng_h - 1.5,
          region_x + region_w, region_y + 1.5,
          color=NAVY_DEEP, lw=1.8, style="-|>")
    ax.text((eng_x + region_x + region_w) / 2,
            region_y + 1.3,
            "bastion + IaC",
            ha="center", va="center", fontsize=10,
            color=NAVY_DEEP, style="italic")

    # Footer
    ax.text(7.5, 0.30,
            "EU-only storage   ·   ISO 27001 / SOC 2 / ISO 27017 / ISO 27018 inherited from AWS   ·   customer-managed KMS keys",
            ha="center", va="center", fontsize=10.5, color=GREY, style="italic")

    out = ROOT / "fig_d21b_deployment.png"
    plt.savefig(out, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close()
    print(f"Wrote {out}")


if __name__ == "__main__":
    make_system_overview()
    make_dataflow()
    make_deployment()
