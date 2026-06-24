import type { FocusSprint } from "./types";

export function isToday(iso?: string): boolean {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
}

export function sprintsTodayCount(sprints: FocusSprint[]): number {
  return sprints.filter((s) => isToday(s.completedAt)).length;
}

export function focusMinutesToday(sprints: FocusSprint[]): number {
  return sprints
    .filter((s) => isToday(s.completedAt))
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

/** Chart bars for Mon–Sun; only today has real focus minutes. */
export function focusMinutesWeekBars(sprints: FocusSprint[]): number[] {
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const bars = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
  const todayMins = focusMinutesToday(sprints);
  if (todayMins > 0) {
    bars[todayIndex] = Math.max(todayMins / 10, 0.5);
  }
  return bars;
}

export function sprintScoreBoost(durationMinutes: number): number {
  if (durationMinutes >= 45) return 8;
  if (durationMinutes >= 25) return 5;
  return 3;
}
