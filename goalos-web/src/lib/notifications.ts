import type { CoachRecommendation, ScoreBreakdown, TabId, UserState } from "./types";
import { sprintsTodayCount } from "./app-metrics";

export type NotificationAction =
  | { type: "navigate"; tab: TabId }
  | { type: "sprint" }
  | { type: "intent"; appId: string }
  | { type: "coach" };

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: "coach" | "goal" | "focus" | "insight";
  action: NotificationAction;
}

const READ_KEY = "goalos-read-notifications";

function todayKey(): string {
  return new Date().toDateString();
}

export function loadReadNotificationIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as { day: string; ids: string[] };
    if (parsed.day !== todayKey()) return new Set();
    return new Set(parsed.ids);
  } catch {
    return new Set();
  }
}

export function saveReadNotificationIds(ids: Set<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    READ_KEY,
    JSON.stringify({ day: todayKey(), ids: [...ids] })
  );
}

export function buildNotifications(
  state: UserState,
  coach: CoachRecommendation,
  score: ScoreBreakdown
): AppNotification[] {
  const day = todayKey();
  const items: AppNotification[] = [];

  items.push({
    id: `coach-reminder-${day}`,
    title: "Coach reminder",
    body: coach.reminder,
    category: "coach",
    action: { type: "coach" },
  });

  if (score.total < 80) {
    items.push({
      id: `score-nudge-${day}`,
      title: `Alignment at ${score.total}/100`,
      body: coach.nextAction,
      category: "goal",
      action: { type: "sprint" },
    });
  }

  if (sprintsTodayCount(state.focusSprints) === 0) {
    items.push({
      id: `sprint-nudge-${day}`,
      title: "No focus sprint today",
      body: "Start a 25-minute sprint to boost your score and roadmap.",
      category: "focus",
      action: { type: "sprint" },
    });
  }

  const topDistractor = [...state.apps]
    .filter((a) => a.classification === "distracting" || a.classification === "mixed")
    .sort((a, b) => b.minutesToday - a.minutesToday)[0];

  if (topDistractor && topDistractor.minutesToday >= 20) {
    items.push({
      id: `intent-${topDistractor.id}-${day}`,
      title: `${topDistractor.name} usage is high`,
      body: `You've logged ${topDistractor.minutesToday}m today. Check intent before more scrolling.`,
      category: "focus",
      action: { type: "intent", appId: topDistractor.id },
    });
  }

  if (state.weeklyHistory.length >= 2) {
    const trend =
      state.weeklyHistory[state.weeklyHistory.length - 1] -
      state.weeklyHistory[state.weeklyHistory.length - 2];
    if (trend !== 0) {
      items.push({
        id: `insight-trend-${day}`,
        title: trend > 0 ? "Score trending up" : "Score dipped",
        body:
          trend > 0
            ? `+${trend} pts since your last check-in.`
            : `${trend} pts since last check-in — review Insights.`,
        category: "insight",
        action: { type: "navigate", tab: "insights" },
      });
    }
  }

  if (state.demoMode) {
    items.push({
      id: `demo-hint-${day}`,
      title: "Sample data active",
      body: "Pre-filled metrics are for preview. Log time or run sprints to see live score changes.",
      category: "insight",
      action: { type: "navigate", tab: "goal" },
    });
  }

  return items;
}

export function unreadCount(notifications: AppNotification[], readIds: Set<string>): number {
  return notifications.filter((n) => !readIds.has(n.id)).length;
}
