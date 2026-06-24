# GoalOS AI — Native Android App

<p align="center">
  <strong>Turn screen time into goal time — on your phone.</strong>
</p>

<p align="center">
  <a href="../CONTRIBUTING.md">Contributing</a> ·
  <a href="../docs/GETTING_STARTED.md">Getting Started</a> ·
  <a href="../docs/ARCHITECTURE.md">Architecture</a>
</p>

Kotlin + Jetpack Compose native app with **real** `UsageStatsManager` tracking.

## Features

- Goal setup + Productivity DNA onboarding
- **Real app usage tracking** via `UsageStatsManager`
- Goal Alignment Score (v1 formula)
- Interactive AI Coach chat
- Intent Gate before distracting apps
- Focus Sprint timer
- Premium profile with avatar & identity
- DataStore persistence (local-first)

## Requirements

- [Android Studio](https://developer.android.com/studio) Ladybug (2024.2+) or newer
- Android SDK 35
- JDK 17
- Physical device or emulator (API 26+)

## Quick start

### Android Studio

1. **File → Open** → `goalos-android/`
2. Gradle sync
3. Run on device/emulator ▶

### Command line

```bash
cd goalos-android
./gradlew assembleDebug
```

**Windows:** `.\gradlew.bat assembleDebug`

APK: `app/build/outputs/apk/debug/app-debug.apk`

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Usage Access permission

1. Complete onboarding
2. **Today** tab → **Open Usage Settings**
3. Enable **Permit usage access** for GoalOS AI

## Project structure

```
goalos-android/
├── app/src/main/java/com/goalos/ai/
│   ├── domain/          # Scoring, coach, models
│   ├── data/            # DataStore, UsageStatsManager
│   ├── ui/              # Compose screens + theme
│   └── GoalOSViewModel.kt
```

## Stack

| Layer | Tech |
|-------|------|
| Language | Kotlin |
| UI | Jetpack Compose + Material 3 |
| Storage | DataStore |
| Usage | UsageStatsManager |
| Min SDK | 26 |

## CI

Every PR builds via [CI workflow](../.github/workflows/ci.yml). Debug APK uploaded as artifact.

## Related

- [Web app](../goalos-web/)
- [Monorepo README](../README.md)
- [Contributing](../CONTRIBUTING.md)

## License

[MIT](../LICENSE)
