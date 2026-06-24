# Deployment

Guide for deploying GoalOS AI web and distributing the Android app.

## Web — Render

GoalOS AI web is a standard Next.js app. [Render](https://render.com) is a good fit.

### Render Web Service settings

| Setting | Value |
|---------|-------|
| **Root directory** | `goalos-web` |
| **Build command** | `npm install && npm run build` |
| **Start command** | `npm start` |
| **Node version** | 20 |

Render sets `PORT` automatically. Next.js binds correctly on Render.

### Environment variables

**None required** for the open-source demo. WebLLM runs in the user's browser.

### Static export (optional)

The app uses client-side state and WebLLM — **SSR static export is not recommended** without changes. Use `npm start` on a Node web service.

---

## Web — Vercel

1. Import repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `goalos-web`
3. Deploy — no env vars needed

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
