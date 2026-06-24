# Deployment

Guide for deploying GoalOS AI web and distributing the Android app.

## Why Render feels slow

GoalOS web is a **static export** (`output: "export"` in `next.config.ts`). If you deploy it on Render as a **Web Service** (`npm start`), you get:

- **Cold starts** — free services spin down after ~15 minutes of inactivity
- **Node boot time** — unnecessary for a site that is just HTML/JS/CSS in `out/`

**Use a static CDN host instead** (instant load, no spin-down):

| Platform | Speed | Free tier | Setup |
|----------|-------|-----------|-------|
| **[Cloudflare Pages](https://pages.cloudflare.com)** ⭐ best | Fastest global CDN | **~100 sites**, unlimited bandwidth | Connect Git (5 min) |
| **[GitHub Pages](https://pages.github.com)** ✅ zero config | Fast CDN | 1 per repo | Already wired — push to `main` |
| **[Netlify](https://netlify.com)** | Fast CDN | Multiple sites | Connect Git |
| ~~Vercel Hobby~~ | Fast | **Only 1 project** | Skip if you host multiple demos |
| ~~Render Web Service~~ | Slow cold starts | — | Use static site or skip |

Reserve **Render** for the optional SaaS backend (`render.yaml` microservices + Postgres), not the frontend demo.

## Free hosting comparison

| Platform | Free sites | Bandwidth | Cold starts? | Notes |
|----------|-----------|-----------|--------------|-------|
| **Cloudflare Pages** ⭐ | ~100 projects | **Unlimited** | No | Best for multiple OSS demos |
| **GitHub Pages** ✅ | 1 per repo | 100 GB/mo soft | No | Already live, zero secrets |
| **Netlify** | Multiple | ~30 GB credits | No | Good preview deploys |
| **Vercel Hobby** | **1 project only** | 100 GB/mo | No | Not ideal for many repos |
| **Render Web Service** | — | — | **Yes** | Backend API only |

**Live demo (GitHub Pages):** https://akhilvydyula.github.io/oss-goalos-ai/

Every push to `main` redeploys via [`.github/workflows/pages.yml`](../.github/workflows/pages.yml).

---

## Web — Cloudflare Pages (recommended)

**Best free option** when Vercel’s 1-project limit is a problem: up to ~100 sites, unlimited bandwidth, no cold starts, clean URL at `goalos-ai.pages.dev`.

### Option A — Connect Git (easiest, no secrets)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select repo `oss-goalos-ai`
3. Build settings:

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Root directory | `goalos-web` |
| Build command | `npm run build` |
| Output directory | `out` |
| Environment variables | *(none)* |

4. Deploy. Every push to `main` auto-redeploys.

Do **not** set `GITHUB_PAGES=true` — you get a root URL instead of `/oss-goalos-ai/` subpath.

Optional: add custom domain under **Custom domains** in the Cloudflare project.

### Option B — GitHub Actions (advanced)

Use if you prefer deploy from Actions instead of Cloudflare’s Git hook.

1. Create empty Pages project named `goalos-ai` in Cloudflare
2. Add secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
3. Set repo variable `ENABLE_CLOUDFLARE_PAGES` = `true`
4. Workflow: [`.github/workflows/cloudflare-pages.yml`](../.github/workflows/cloudflare-pages.yml)

---

## Web — GitHub Pages (already live)

Zero setup — works today on every `main` push.

| Setting | Value |
|---------|-------|
| **Build** | `goalos-web` → `npm ci && npm run build` with `GITHUB_PAGES=true` |
| **Output** | `goalos-web/out` |
| **URL** | `https://akhilvydyula.github.io/oss-goalos-ai/` |

Trade-off vs Cloudflare: URL includes repo name (`/oss-goalos-ai/`). Speed is still good.

Enable manually (one-time) if Pages is not active:

```bash
gh api -X PUT repos/akhilvydyula/oss-goalos-ai/pages -f build_type=workflow
```

---

## Web — Netlify (alternative)

Good if you already use Netlify for other projects.

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
2. Root: `goalos-web`, build: `npm run build`, publish: `out`
3. No `GITHUB_PAGES` env var

---

## Web — Vercel (single project only)

Vercel Hobby allows **one** project. Fine for a single flagship app; skip if you deploy many demos.

If you still want Vercel: import repo, root `goalos-web`, deploy (`vercel.json` included).

---

## Web — Render (backend only)

Use Render for the **SaaS API stack** (`render.yaml`), not the frontend.

### Frontend on Render (avoid Web Service)

If you must use Render for the web UI, create a **Static Site** (not Web Service):

| Setting | Value |
|---------|-------|
| Root directory | `goalos-web` |
| Build command | `npm ci && npm run build` |
| Publish directory | `out` |

Never use `npm start` for this app — it causes cold-start delays on the free tier.

---

## Web — Docker (self-hosted)

Example `Dockerfile` in `goalos-web/`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
cd goalos-web
docker build -t goalos-web .
docker run -p 3000:3000 goalos-web
```

---

## Android — GitHub Releases

CI builds a debug APK on every `main` push (artifact). For public releases:

```bash
git tag v0.3.0
git push origin v0.3.0
```

The [release workflow](../.github/workflows/release.yml) attaches `app-debug.apk` to the GitHub Release.

### Play Store (future)

Production releases need:

- Signed release keystore
- `assembleRelease` with signing config
- Play Console listing

Not included in OSS demo — contributors can document in a follow-up PR.

---

## CI/CD summary

```
Push/PR → main
    └── ci.yml
          ├── web: lint + build
          └── android: assembleDebug + APK artifact

Tag v*.*.*
    └── release.yml
          ├── web build artifact
          ├── android APK
          └── GitHub Release
```

---

## Health checks

After deploy, verify:

- [ ] Home page loads
- [ ] Onboarding completes
- [ ] Today dashboard shows score
- [ ] Coach tab responds (rule-based or WebLLM)
- [ ] Profile tab scrolls and shows avatar
