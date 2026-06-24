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

/** Zeroed apps for real users starting from scratch. */
export function createFreshApps(): TrackedApp[] {
  return DEFAULT_APPS.map((app, i) => ({
    id: `app-${i}`,
    name: app.name,
    packageName: app.packageName,
    classification: app.classification,
    minutesToday: 0,
    sessions: 0,
    lastOpenedHour: 12,
  }));
}

/** Rich sample data — only for "Explore demo instantly". */
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

/** Pad weekly scores for charts (min 2 points for sparklines). */
export function chartSeries(history: number[], minLength = 7): number[] {
  if (history.length >= minLength) return history.slice(-minLength);
  const pad = Array(minLength - history.length).fill(0);
  return [...pad, ...history];
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatDelta(pct: number | null, unit = ""): string {
  if (pct === null) return "Starting today";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%${unit ? ` ${unit}` : ""}`;
}
