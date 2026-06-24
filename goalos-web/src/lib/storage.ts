import type { UserState } from "./types";
import { createFreshApps } from "./demo-data";

const STORAGE_KEY = "goalos-user-state";

/** Brand-new user — no fake usage, no scores, onboarding required. */
export function createScratchState(): UserState {
  return {
    onboarded: false,
    privacyAccepted: false,
    apps: createFreshApps(),
    intentCheckIns: [],
    focusSprints: [],
    roadmapProgress: 0,
    energyToday: 3,
    moodToday: 3,
    weeklyHistory: [],
    createdAt: new Date().toISOString(),
  };
}

export const defaultState = createScratchState;

export function loadState(): UserState {
  if (typeof window === "undefined") return createScratchState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createScratchState();
    const parsed = JSON.parse(raw) as Partial<UserState>;
    return {
      ...createScratchState(),
      ...parsed,
      apps: parsed.apps?.length ? parsed.apps : createFreshApps(),
    };
  } catch {
    return createScratchState();
  }
}

export function saveState(state: UserState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportState(state: UserState): string {
  return JSON.stringify(state, null, 2);
}
