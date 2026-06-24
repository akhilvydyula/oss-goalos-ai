# Contributing to goalos-android

This package is part of the [GoalOS AI monorepo](../).

**Please read the main guide first:** [../CONTRIBUTING.md](../CONTRIBUTING.md)

## Android-specific commands

```bash
cd goalos-android
./gradlew assembleDebug
./gradlew lint
```

**Windows:** `.\gradlew.bat assembleDebug`

APK output: `app/build/outputs/apk/debug/app-debug.apk`

## Android-specific notes

- Design tokens: `ui/theme/GoalOSTokens.kt`
- Do **not** commit `local.properties` (SDK path)
- Keep `CoachEngine` / `ScoringEngine` in sync with web `src/lib/coach.ts` and `scoring.ts`
- Min SDK 26, target SDK 35

## Docs

- [Getting Started](../docs/GETTING_STARTED.md)
- [Architecture](../docs/ARCHITECTURE.md)
