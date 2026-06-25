#!/usr/bin/env python3
"""Generate GoalOS Operations Runbook PDF (carousel-style book)."""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "docs" / "runbook"
PUBLIC_DIR = ROOT / "goalos-web" / "public" / "runbook"
OUTPUT = OUT_DIR / "GoalOS-Operations-Runbook.pdf"

LIVE = "https://oss-goalos-ai.akhilvydyula1111.workers.dev/"
GITHUB = "https://github.com/akhilvydyula/oss-goalos-ai"

# GoalOS brand
BG = (6, 7, 13)
CARD = (12, 14, 24)
ACCENT = (43, 231, 168)
WHITE = (244, 246, 251)
MUTED = (139, 147, 167)
ORANGE = (251, 146, 60)
BLUE = (104, 167, 255)


class RunbookPDF(FPDF):
    def __init__(self) -> None:
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_auto_page_break(auto=False)
        self.set_margins(0, 0, 0)
        font_dir = Path("C:/Windows/Fonts")
        self.add_font("Segoe", "", str(font_dir / "segoeui.ttf"))
        self.add_font("Segoe", "B", str(font_dir / "segoeuib.ttf"))
        self.add_font("Segoe", "I", str(font_dir / "segoeuii.ttf"))
        self.add_font("Consolas", "", str(font_dir / "consola.ttf"))

    def dark_page(self) -> None:
        self.add_page()
        self.set_fill_color(*BG)
        self.rect(0, 0, 210, 297, style="F")
        # top glow
        self.set_fill_color(20, 40, 32)
        self.ellipse(105 - 80, -30, 160, 80, style="F")

    def eyebrow(self, text: str, y: float) -> None:
        self.set_xy(22, y)
        self.set_font("Segoe", "B", 8)
        self.set_text_color(*ACCENT)
        self.cell(0, 5, text.upper())

    def draw_title(self, text: str, y: float, size: float = 26) -> float:
        self.set_xy(22, y)
        self.set_font("Segoe", "B", size)
        self.set_text_color(*WHITE)
        self.multi_cell(166, size * 0.42, text)
        return self.get_y()

    def body(self, text: str, y: float, size: float = 11, color: tuple[int, int, int] = MUTED) -> float:
        self.set_xy(22, y)
        self.set_font("Segoe", "", size)
        self.set_text_color(*color)
        self.multi_cell(166, 5.5, text)
        return self.get_y()

    def card_box(self, y: float, h: float) -> None:
        self.set_fill_color(*CARD)
        self.set_draw_color(40, 44, 58)
        self.rect(18, y, 174, h, style="DF")

    def bullet_card(self, y: float, icon: str, title: str, body: str, icon_color: tuple[int, int, int] = ACCENT) -> float:
        self.set_fill_color(18, 20, 30)
        self.set_draw_color(35, 38, 50)
        self.rect(24, y, 162, 22, style="DF")
        self.set_xy(28, y + 3)
        self.set_font("Segoe", "B", 12)
        self.set_text_color(*icon_color)
        self.cell(8, 6, icon)
        self.set_xy(38, y + 4)
        self.set_font("Segoe", "B", 10)
        self.set_text_color(*WHITE)
        self.cell(0, 5, title)
        self.set_xy(38, y + 10)
        self.set_font("Segoe", "", 9)
        self.set_text_color(*MUTED)
        self.multi_cell(142, 4.5, body)
        return y + 26

    def metric_box(self, x: float, y: float, value: str, label: str) -> None:
        self.set_fill_color(16, 36, 30)
        self.set_draw_color(43, 80, 65)
        self.rect(x, y, 78, 28, style="DF")
        self.set_xy(x + 6, y + 5)
        self.set_font("Segoe", "B", 18)
        self.set_text_color(*ACCENT)
        self.cell(0, 8, value)
        self.set_xy(x + 6, y + 15)
        self.set_font("Segoe", "", 8)
        self.set_text_color(*MUTED)
        self.multi_cell(66, 3.8, label)

    def page_footer(self, n: int, total: int) -> None:
        self.set_xy(22, 282)
        self.set_font("Segoe", "", 8)
        self.set_text_color(80, 86, 100)
        self.cell(90, 4, "GoalOS AI  |  Operations Runbook")
        self.set_xy(120, 282)
        self.cell(70, 4, f"{n} / {total}", align="R")
        # accent line
        self.set_fill_color(*ACCENT)
        self.rect(22, 278, 30, 0.8, style="F")

    def cover(self) -> None:
        self.dark_page()
        banner = ROOT / "goalos-web" / "public" / "media" / "readme" / "hero-banner.png"
        if banner.exists():
            self.image(str(banner), x=18, y=38, w=174)

        self.set_fill_color(*ACCENT)
        self.rect(22, 128, 36, 1.2, style="F")

        self.set_xy(22, 136)
        self.set_font("Segoe", "B", 9)
        self.set_text_color(*ACCENT)
        self.cell(0, 5, "OPERATIONS RUNBOOK")

        self.draw_title("Turn screen time\ninto goal time.", 146, 30)
        self.body(
            "The official GoalOS AI playbook for launch, deploy, smoke-test, and ship. "
            "Built for builders. Open source. MIT licensed.",
            198,
            11,
            (197, 202, 214),
        )

        self.set_xy(22, 248)
        self.set_font("Segoe", "", 9)
        self.set_text_color(*MUTED)
        self.cell(0, 5, LIVE.replace("https://", ""))
        self.set_xy(22, 255)
        self.cell(0, 5, GITHUB.replace("https://", ""))

        self.set_xy(22, 268)
        self.set_font("Segoe", "I", 9)
        self.set_text_color(100, 108, 124)
        self.cell(0, 5, "Swipe-deck format  |  6 chapters  |  2026")

    def slide_problem(self, n: int, total: int) -> None:
        self.dark_page()
        self.eyebrow("Chapter 02  |  The Problem", 28)
        y = self.draw_title("Builders track hours.\nNot ambition.", 38, 24)

        pains = [
            ("!", "Screen time without context", "Dashboards show minutes, not whether those minutes moved goals forward.", ORANGE),
            ("~", "Scattered tools", "Coaches, blockers, and to-dos live in different tabs with no shared loop.", ORANGE),
            ("#", "API-key fatigue", "AI productivity stacks often need keys, servers, and Docker before day one.", ORANGE),
            (">", "Deploy drift", "README links, demo URLs, and static exports fall out of sync after launch.", ORANGE),
        ]
        y = max(y + 8, 78)
        for icon, title, body, color in pains:
            y = self.bullet_card(y, icon, title, body, color)
        self.page_footer(n, total)

    def slide_stack(self, n: int, total: int) -> None:
        self.dark_page()
        self.eyebrow("Chapter 03  |  The Stack", 28)
        y = self.draw_title("One product loop.\nThree surfaces.", 38, 24)

        items = [
            ("W", "goalos-web", "Next.js static export, WebLLM coach, localStorage persistence."),
            ("A", "goalos-android", "Kotlin + Compose, real UsageStats tracking, shared scoring."),
            ("C", "Cloudflare Workers", "wrangler deploy serves goalos-web/out at the edge."),
            ("E", "Enterprise shell", "Demo auth, admin console, optional SaaS microservices."),
        ]
        y = max(y + 8, 78)
        for icon, title, body in items:
            y = self.bullet_card(y, icon, title, body, BLUE if icon == "C" else ACCENT)

        self.body(
            "Product loop: Goal Setup -> DNA -> Usage -> Intent Gate -> "
            "Alignment Score -> Coach -> Sprint -> Identity",
            y + 4,
            9,
        )
        self.page_footer(n, total)

    def slide_run(self, n: int, total: int) -> None:
        self.dark_page()
        self.eyebrow("Chapter 04  |  Run It", 28)
        y = self.draw_title("Clone to live\nin minutes.", 38, 24)

        commands = [
            "git clone https://github.com/akhilvydyula/oss-goalos-ai.git",
            "cd oss-goalos-ai && npm run dev",
            "npm run build",
            "npx wrangler deploy",
        ]
        y = max(y + 6, 72)
        self.card_box(y, 38)
        cy = y + 6
        for cmd in commands:
            self.set_xy(26, cy)
            self.set_font("Consolas", "", 8.5)
            self.set_text_color(200, 230, 215)
            self.cell(0, 5, cmd)
            cy += 8

        my = y + 48
        self.metric_box(24, my, "0", "API keys for demo coach fallback")
        self.metric_box(108, my, "MIT", "Open source license")
        self.metric_box(24, my + 34, "4", "Smoke routes: / /login /web /app")
        self.metric_box(108, my + 34, "49s", "Cinematic LinkedIn promo ready")
        self.page_footer(n, total)

    def slide_ops(self, n: int, total: int) -> None:
        self.dark_page()
        self.eyebrow("Chapter 05  |  Operator", 28)
        y = self.draw_title("Demo creds &\nsmoke test.", 38, 24)

        checks = [
            ("/", "Landing page loads"),
            ("/login/", "Demo sign-in: admin@demo.goalos / Demo1234!"),
            ("/web/", "Product demo + AI coach"),
            ("/app/", "Enterprise shell + admin"),
            ("/mobile/", "Phone-frame mobile UI"),
        ]
        y = max(y + 6, 72)
        for route, label in checks:
            y = self.bullet_card(y, "v", route, label)

        self.set_xy(24, y + 4)
        self.set_font("Segoe", "I", 10)
        self.set_text_color(*WHITE)
        self.multi_cell(162, 5, '"You\'re not distracted - you just don\'t have an operating system for your goals yet."')
        self.set_xy(24, self.get_y() + 2)
        self.set_font("Segoe", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 4, "GoalOS AI product thesis")
        self.page_footer(n, total)

    def slide_ship(self, n: int, total: int) -> None:
        self.dark_page()
        self.eyebrow("Chapter 06  |  Ship It", 28)
        y = self.draw_title("Star the repo.\nShare the demo.\nShip your PR.", 38, 22)

        steps = [
            ("1", "Point every README at production", LIVE),
            ("2", "Attach the cinematic promo on LinkedIn", "goalos-cinematic-promo.mp4 (~49s)"),
            ("3", "First comment: live demo + GitHub link", "Keeps LinkedIn reach high"),
            ("4", "Tag releases for Android APK", "git tag v0.x.x && git push origin v0.x.x"),
        ]
        y = max(y + 6, 108)
        for num, title, sub in steps:
            y = self.bullet_card(y, num, title, sub)

        self.set_fill_color(*ACCENT)
        self.rect(24, y + 6, 80, 12, style="F")
        self.set_xy(28, y + 9)
        self.set_font("Segoe", "B", 10)
        self.set_text_color(4, 18, 13)
        self.cell(0, 5, "Open live demo")
        self.page_footer(n, total)

    def slide_hook(self, n: int, total: int) -> None:
        self.dark_page()
        self.eyebrow("Chapter 01  |  Hook", 28)
        y = self.draw_title("GoalOS AI in\nproduction.", 38, 26)
        self.body(
            "GoalOS ships as a local-first web demo, Android companion, and "
            "Cloudflare Workers deployment - turning screen time into goal time.",
            y + 6,
            11,
            (197, 202, 214),
        )
        y = self.body(
            "This runbook walks you through launch, verification, troubleshooting, "
            "and release - the same flow used to ship oss-goalos-ai to production.",
            self.get_y() + 4,
        )

        highlights = [
            ("G", "Goal Alignment Score", "Explainable daily 0-100 score with v1 formula."),
            ("A", "AI Coach", "Browser-local WebLLM - no API key required."),
            ("F", "Focus Sprints", "Intent Gate + timed deep work blocks."),
            ("P", "Privacy-first", "Usage patterns only. Data stays on device."),
        ]
        y = max(y + 10, 120)
        for icon, title, body in highlights:
            y = self.bullet_card(y, icon, title, body)
        self.page_footer(n, total)

    def appendix(self, n: int, total: int) -> None:
        self.dark_page()
        self.eyebrow("Appendix  |  Troubleshooting", 28)
        y = self.draw_title("Common fixes.", 38, 22)

        fixes = [
            ("next: not found", "Run root npm run build - installs goalos-web deps first."),
            ("Worker 404", "wrangler.toml assets directory must be ./goalos-web/out"),
            ("Coach won't load", "Use Chrome/Edge + WebGPU; rule-based fallback works."),
            ("JAVA_HOME missing", "Install JDK 17 and set JAVA_HOME for Android builds."),
        ]
        y = max(y + 6, 68)
        for issue, fix in fixes:
            y = self.bullet_card(y, "?", issue, fix, ORANGE)

        self.body("Promo video rebuild: npm run build:cinematic-promo", y + 6, 9)
        self.body("Import readme art: python goalos-web/scripts/import-readme-media.py <folder>", self.get_y() + 2, 9)
        self.page_footer(n, total)

    def back_cover(self) -> None:
        self.dark_page()
        self.set_fill_color(*ACCENT)
        self.ellipse(105 - 60, 200, 120, 120, style="F")
        self.set_xy(22, 80)
        self.set_font("Segoe", "B", 28)
        self.set_text_color(*WHITE)
        self.multi_cell(166, 12, "GoalOS AI")
        self.set_xy(22, 110)
        self.set_font("Segoe", "", 14)
        self.set_text_color(*ACCENT)
        self.cell(0, 6, "Open Source. Built for Builders.")
        self.body(LIVE, 140, 10, WHITE)
        self.body(GITHUB, 150, 10, MUTED)
        self.set_xy(22, 240)
        self.set_font("Segoe", "I", 10)
        self.set_text_color(100, 108, 124)
        self.multi_cell(166, 5, "MIT License  |  Akhil Vydyula & contributors  |  goalos-ai")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    pdf = RunbookPDF()
    total = 9

    pdf.cover()
    pdf.slide_hook(1, total)
    pdf.slide_problem(2, total)
    pdf.slide_stack(3, total)
    pdf.slide_run(4, total)
    pdf.slide_ops(5, total)
    pdf.slide_ship(6, total)
    pdf.appendix(7, total)
    pdf.back_cover()

    pdf.output(str(OUTPUT))
    copy = PUBLIC_DIR / OUTPUT.name
    pdf.output(str(copy))
    print(f"Done: {OUTPUT}")
    print(f"Copy: {copy}")


if __name__ == "__main__":
    main()
