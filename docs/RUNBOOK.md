# GoalOS AI — Operations Runbook

<p align="center">
  <a href="./runbook/index.html"><strong>▶ Interactive runbook (swipe deck)</strong></a>
  &nbsp;·&nbsp;
  <a href="./runbook/GoalOS-Operations-Runbook.pdf"><strong>📕 Download PDF book</strong></a>
  &nbsp;·&nbsp;
  <a href="https://oss-goalos-ai.akhilvydyula1111.workers.dev/runbook/"><strong>Live version</strong></a>
</p>

<p align="center">
  Carousel-style ops guide — inspired by enterprise case-study decks.<br />
  <em>Swipe through 6 slides: problem → stack → deploy → smoke test → ship.</em>
</p>

---

## Quick links

| Resource | URL |
|----------|-----|
| **Live demo** | https://oss-goalos-ai.akhilvydyula1111.workers.dev/ |
| **GitHub** | https://github.com/akhilvydyula/oss-goalos-ai |
| **Deploy guide** | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| **Architecture** | [ARCHITECTURE.md](./ARCHITECTURE.md) |

**Demo login:** `admin@demo.goalos` / `Demo1234!`

---

## Slide 1 — Hook

GoalOS AI ships as a **local-first productivity OS** — web demo, Android companion, and Cloudflare Workers production deploy.

This runbook covers launch, verification, troubleshooting, and release.

---

## Slide 2 — The problem

Without a goal operating system, teams hit:

- **Screen time without context** — minutes tracked, ambition not measured
- **Scattered tools** — coaches, blockers, and to-dos in different apps
- **API-key fatigue** — AI stacks that need servers before day one
- **Deploy drift** — README and demo URLs falling behind production

---

## Slide 3 — The stack

| Layer | What it does |
|-------|----------------|
| **goalos-web** | Next.js static export, WebLLM coach, `localStorage` |
| **goalos-android** | Kotlin + Compose, UsageStats tracking |
| **Cloudflare Workers** | Serves `goalos-web/out` via `wrangler deploy` |
| **Enterprise shell** | Demo auth, admin console, optional SaaS services |

**Product loop:** Goal Setup → DNA → Usage → Intent Gate → Alignment Score → Coach → Sprint → Identity

---

## Slide 4 — Run commands

```bash
# Local dev
git clone https://github.com/akhilvydyula/oss-goalos-ai.git
cd oss-goalos-ai
npm run dev
# → http://localhost:3000

# Production build
npm run build
# → goalos-web/out

# Deploy (Cloudflare Workers Builds)
npx wrangler deploy
```

| Metric | Value |
|--------|-------|
| API keys (demo fallback) | 0 |
| License | MIT |
| Smoke-test routes | `/`, `/login/`, `/web/`, `/app/` |
| Cinematic promo | `npm run build:cinematic-promo` |

---

## Slide 5 — Operator checklist

### Post-deploy smoke test

- [ ] `/` — landing page loads
- [ ] `/login/` — demo sign-in works
- [ ] `/web/` — product demo + coach
- [ ] `/app/` — enterprise shell
- [ ] `/mobile/` — phone-frame UI

### Common fixes

| Issue | Fix |
|-------|-----|
| `next: not found` on CI | Use root `npm run build` (installs `goalos-web` deps) |
| Worker 404 | Check `wrangler.toml` → `[assets].directory = "./goalos-web/out"` |
| Coach AI won't load | Use Chrome/Edge + WebGPU; fallback coach still works |
| Android `JAVA_HOME` | Install JDK 17, set `JAVA_HOME` |

---

## Slide 6 — Ship it

1. **Point all docs** at `https://oss-goalos-ai.akhilvydyula1111.workers.dev/`
2. **Attach promo video** — `goalos-web/public/media/readme/goalos-cinematic-promo.mp4`
3. **Star + share** — GitHub repo for builders discovering the project
4. **Tag releases** — `git tag v0.x.x && git push origin v0.x.x` for Android APK artifacts

---

## Related docs

- [Getting Started](./GETTING_STARTED.md)
- [Deployment](./DEPLOYMENT.md)
- [SaaS Architecture](./SAAS_ARCHITECTURE.md)
- [Contributing](../CONTRIBUTING.md)
