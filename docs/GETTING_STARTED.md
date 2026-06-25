# Getting Started

This guide helps you run GoalOS AI locally — web and Android.

## Web app (`goalos-web`)

### Requirements

- Node.js **20+**
- npm **10+**
- Chrome or Edge (for WebLLM browser AI on Coach tab)

### Install & run

```bash
# From repository root
npm run dev

# Or directly
cd goalos-web
npm install
npm run dev
```

Open **http://localhost:3000** — or the [**live demo**](https://oss-goalos-ai.akhilvydyula1111.workers.dev/) (`admin@demo.goalos` / `Demo1234!`)

### Production build

```bash
cd goalos-web
npm run build
npm start
```

### What to expect

1. **Onboarding** — Goal setup → Productivity DNA → Privacy promise
2. **Today** — Goal Alignment Score, metrics, AI next action
3. **Coach** — Browser AI (WebLLM) or rule-based fallback
4. **You** — Profile with photo, identity, export/delete

Data is stored in **browser localStorage** — no account required.

---

## Android app (`goalos-android`)

### Requirements

- [Android Studio](https://developer.android.com/studio) Ladybug (2024.2+) or newer
- Android SDK **35**
- JDK **17**
- Emulator or physical device (API **26+**)

### Android Studio

1. **File → Open** → select `goalos-android/`
2. Wait for Gradle sync
3. Select device/emulator
4. Click **Run** ▶

### Command line

```bash
cd goalos-android
chmod +x gradlew    # macOS/Linux only
./gradlew assembleDebug
```

**Windows:**

```powershell
cd goalos-android
.\gradlew.bat assembleDebug
```

APK: `app/build/outputs/apk/debug/app-debug.apk`

### Install via ADB

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.goalos.ai/.MainActivity
```

### Usage Access permission

For **real** screen-time tracking:

1. Complete onboarding
2. On **Today** tab → **Open Usage Settings**
3. Enable **Permit usage access** for GoalOS AI
4. Return to the app

---

## Monorepo scripts (root)

From repository root:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start web dev server |
| `npm run build` | Build web for production |
| `npm run lint` | Lint web app |
| `npm start` | Start web production server |

---

## Troubleshooting

### Web: `ENOENT package.json`

Run commands from `goalos-web/` or use root `npm run dev`.

### Web: Coach AI not loading

- Use **Chrome** or **Edge** with WebGPU enabled
- First load downloads ~600MB model (cached after)
- Rule-based coach works without WebGPU

### Android: `JAVA_HOME not set`

Install JDK 17 and set:

```bash
export JAVA_HOME=/path/to/jdk-17
```

### Android: Gradle sync failed

Open Android Studio once to download SDK components. Ensure `local.properties` has `sdk.dir` (not committed to git).

---

## Next steps

- [Architecture](./ARCHITECTURE.md)
- [Deployment](./DEPLOYMENT.md)
- [Contributing](../CONTRIBUTING.md)
