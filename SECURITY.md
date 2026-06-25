# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `main` branch | ✅ Active development |
| Latest GitHub Release | ✅ |

## Reporting a vulnerability

**Please do not open public GitHub issues for security vulnerabilities.**

1. Go to the [Security tab](https://github.com/akhilvydyula/oss-goalos-ai/security) on the repository
2. Click **Report a vulnerability**
3. Describe the issue, impact, and steps to reproduce

We aim to acknowledge reports within **72 hours** and provide a fix timeline when possible.

## Security model

GoalOS AI is designed **local-first**:

- **Web app**: Data stored in browser `localStorage`. No server by default. WebLLM runs on-device via WebGPU.
- **Android app**: Data stored in DataStore on device. Usage stats via `UsageStatsManager` — app names and durations only, not message content.

### What we do NOT collect (by design)

- Message or notification content
- Keystrokes or typed text outside the app
- Photos, contacts, or call logs
- Server-side user accounts (in current open-source release)

## Best practices for contributors

- Never commit API keys, `.env` files, or `local.properties` with secrets
- Validate user input in coach chat and profile fields
- Keep dependencies updated (`npm audit`, Gradle dependency checks)
