# Contributing to GoalOS AI

Thank you for helping make GoalOS AI better! This guide covers how to contribute to the **monorepo** (web + Android).

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Ways to contribute](#ways-to-contribute)
- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Pull request process](#pull-request-process)
- [Coding standards](#coding-standards)
- [CI checks](#ci-checks)
- [Releases](#releases)

## Code of conduct

Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). Be respectful and constructive.

## Ways to contribute

- 🐛 **Bug reports** — [Open an issue](https://github.com/akhilvydyula/goalos-ai/issues/new?template=bug_report.yml)
- ✨ **Feature requests** — [Open an issue](https://github.com/akhilvydyula/goalos-ai/issues/new?template=feature_request.yml)
- 🔧 **Code** — Fix bugs, improve UI, sync scoring logic across platforms
- 📖 **Docs** — Improve README, `docs/`, or inline comments
- 🎨 **Design** — UI/UX polish, Figma updates (see `goalos-android/DESIGN_FIGMA.md`)

## Development setup

### Prerequisites

| Tool | Web | Android |
|------|-----|---------|
| Node.js 20+ | ✅ | — |
| npm | ✅ | — |
| JDK 17 | — | ✅ |
| Android Studio | — | ✅ (recommended) |

### Clone and run (web)

```bash
git clone https://github.com/akhilvydyula/goalos-ai.git
cd goalos-ai
npm install          # installs root scripts only
cd goalos-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Clone and run (Android)

```bash
cd goalos-android
./gradlew assembleDebug
```

Or open `goalos-android/` in Android Studio and click **Run**.

See [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md) for detailed setup.

## Project structure

```
goalos-ai/
├── goalos-web/          # Next.js web app (local-first demo)
├── goalos-android/      # Kotlin + Jetpack Compose native app
├── docs/                # Architecture & guides
├── .github/workflows/   # CI/CD pipelines
├── CONTRIBUTING.md      # This file
├── LICENSE              # MIT
└── README.md            # Project overview
```

### Shared logic (keep in sync when possible)

| Concern | Web | Android |
|---------|-----|---------|
| Scoring v1 | `goalos-web/src/lib/scoring.ts` | `domain/Engines.kt` (ScoringEngine) |
| Coach rules | `goalos-web/src/lib/coach.ts` | `domain/Engines.kt` (CoachEngine) |
| Types / models | `goalos-web/src/lib/types.ts` | `domain/Models.kt` |

## Pull request process

1. **Fork** the repo and create a branch from `main`:
   ```bash
   git checkout -b feat/my-improvement
   ```
2. **Make focused changes** — one feature or fix per PR
3. **Test locally**:
   ```bash
   # Web
   cd goalos-web && npm run lint && npm run build

   # Android
   cd goalos-android && ./gradlew assembleDebug
   ```
4. **Commit** with clear messages:
   ```
   feat(web): add profile photo upload
   fix(android): scroll clipping on profile screen
   docs: update deployment guide
   ```
5. **Open a PR** against `main` — fill out the PR template
6. Wait for **CI** to pass (web lint/build + Android assemble)

### PR checklist

- [ ] CI passes
- [ ] Changes are scoped to the problem
- [ ] README or `docs/` updated if user-facing
- [ ] No secrets or `local.properties` committed
- [ ] Scoring/coach changes mirrored on both platforms (if applicable)

## Coding standards

### Web (`goalos-web`)

- TypeScript strict mode
- Tailwind v4 + design tokens in `globals.css` (`#2BE7A8`, `#68A7FF`)
- Client-only code for WebLLM (`@mlc-ai/web-llm`)
- `"use client"` for interactive components

### Android (`goalos-android`)

- Kotlin + Jetpack Compose
- Design tokens in `ui/theme/GoalOSTokens.kt`
- ViewModel → Repository pattern
- Min SDK 26

## CI checks

Every push and PR to `main` runs [.github/workflows/ci.yml](./.github/workflows/ci.yml):

| Job | What it does |
|-----|----------------|
| **web** | `npm ci` → lint → build |
| **android** | `./gradlew assembleDebug` → uploads APK artifact |

## Releases

Tagged releases (`v*.*.*`) trigger [.github/workflows/release.yml](./.github/workflows/release.yml):

- Builds web production bundle
- Builds Android debug APK
- Publishes GitHub Release with APK attached

Maintainers create a release:

```bash
git tag v0.3.0
git push origin v0.3.0
```

## Questions?

- [Open a discussion](https://github.com/akhilvydyula/goalos-ai/discussions) for questions
- [Open an issue](https://github.com/akhilvydyula/goalos-ai/issues) for bugs/features

Thank you for contributing! 🎯
