# Contributing to goalos-web

This package is part of the [GoalOS AI monorepo](../).

**Please read the main guide first:** [../CONTRIBUTING.md](../CONTRIBUTING.md)

## Web-specific commands

```bash
cd goalos-web
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Web-specific notes

- Design tokens live in `src/app/globals.css` (`#2BE7A8`, `#68A7FF`)
- WebLLM coach: `src/lib/web-llm-coach.ts` (client-only, WebGPU)
- Keep scoring in sync with Android: `src/lib/scoring.ts` ↔ `goalos-android/.../Engines.kt`

## Docs

- [Architecture](../docs/ARCHITECTURE.md)
- [Deployment](../docs/DEPLOYMENT.md)
