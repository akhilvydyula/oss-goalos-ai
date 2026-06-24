import { DEFAULT_APPS } from "./constants";
import type { TrackedApp } from "./types";

const DEMO_MINUTES: Record<string, number> = {
  Udemy: 94,
  ChatGPT: 38,
  YouTube: 72,
  Instagram: 48,
  LinkedIn: 22,
  LeetCode: 55,
  Notion: 41,
  Chrome: 28,
  WhatsApp: 19,
  TikTok: 31,
};

export function generateDemoApps(): TrackedApp[] {
  return DEFAULT_APPS.map((app, i) => ({
    id: `app-${i}`,
    name: app.name,
    packageName: app.packageName,
    classification: app.classification,
    minutesToday: DEMO_MINUTES[app.name] ?? 30,
    sessions: app.classification === "distracting" ? 12 : 6,
    lastOpenedHour:
      app.classification === "distracting" || app.name === "YouTube" ? 22 : 10,
  }));
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatHour(hour: number): string {
  const h = hour % 24;
  const period = h >= 12 ? "pm" : "am";
  const display = h % 12 || 12;
  return `${display}${period}`;
}

export function totalScreenMinutes(apps: TrackedApp[]): number {
  return apps.reduce((s, a) => s + a.minutesToday, 0);
}
