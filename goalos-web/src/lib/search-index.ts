import type { CoachRecommendation, TabId, UserState } from "./types";
import { suggestedActions, suggestedPrompts } from "./coach";

export type SearchGroup = "Navigate" | "Actions" | "Apps" | "Coach";

export interface SearchItem {
  id: string;
  label: string;
  subtitle: string;
  group: SearchGroup;
  searchText: string;
  run: () => void;
}

export interface SearchCallbacks {
  navigate: (tab: TabId) => void;
  openFocusSprint: () => void;
  openIntentGate: (appId: string) => void;
  askCoach: (message: string) => void;
  logAppUsage: (appId: string, minutes: number) => void;
}

const NAV: { tab: TabId; label: string; keywords: string[] }[] = [
  { tab: "today", label: "Dashboard", keywords: ["home", "overview", "today", "performance"] },
  { tab: "goal", label: "Goals & apps", keywords: ["goals", "projects", "apps", "tracking"] },
  { tab: "coach", label: "AI Coach", keywords: ["coach", "chat", "ai", "focus"] },
  { tab: "insights", label: "Insights", keywords: ["insights", "analytics", "weekly", "report"] },
  { tab: "you", label: "Settings", keywords: ["settings", "profile", "account", "reset"] },
];

export function buildSearchItems(
  state: UserState,
  coach: CoachRecommendation,
  callbacks: SearchCallbacks
): SearchItem[] {
  const items: SearchItem[] = [];

  for (const entry of NAV) {
    items.push({
      id: `nav-${entry.tab}`,
      label: entry.label,
      subtitle: "Go to page",
      group: "Navigate",
      searchText: [entry.label, ...entry.keywords].join(" "),
      run: () => callbacks.navigate(entry.tab),
    });
  }

  items.push({
    id: "action-sprint",
    label: "Start focus sprint",
    subtitle: "Open sprint timer",
    group: "Actions",
    searchText: "start focus sprint timer deep work session",
    run: () => callbacks.openFocusSprint(),
  });

  if (state.goal?.title) {
    items.push({
      id: "goal-title",
      label: state.goal.title,
      subtitle: "Your active goal",
      group: "Navigate",
      searchText: `${state.goal.title} goal target objective`,
      run: () => callbacks.navigate("goal"),
    });
  }

  for (const app of state.apps) {
    items.push({
      id: `app-${app.id}`,
      label: app.name,
      subtitle: `${app.classification.replace("-", " ")} · ${app.minutesToday}m today`,
      group: "Apps",
      searchText: `${app.name} ${app.classification} app usage`,
      run: () => callbacks.navigate("goal"),
    });

    items.push({
      id: `log-${app.id}-15`,
      label: `Log 15m on ${app.name}`,
      subtitle: "Add manual usage",
      group: "Actions",
      searchText: `log 15 minutes ${app.name} track usage time`,
      run: () => {
        callbacks.logAppUsage(app.id, 15);
        callbacks.navigate("goal");
      },
    });

    if (app.classification === "mixed" || app.classification === "distracting") {
      items.push({
        id: `intent-${app.id}`,
        label: `Intent gate — ${app.name}`,
        subtitle: "Check if usage aligns with goal",
        group: "Actions",
        searchText: `intent gate ${app.name} distraction block check`,
        run: () => callbacks.openIntentGate(app.id),
      });
    }
  }

  for (const prompt of suggestedPrompts(
    state,
    state.weeklyHistory[state.weeklyHistory.length - 1]
  )) {
    items.push({
      id: `coach-prompt-${prompt.slice(0, 24)}`,
      label: prompt,
      subtitle: "Ask AI Coach",
      group: "Coach",
      searchText: `${prompt} coach ask question`,
      run: () => {
        callbacks.navigate("coach");
        callbacks.askCoach(prompt);
      },
    });
  }

  for (const action of suggestedActions(state, coach)) {
    items.push({
      id: `coach-action-${action.slice(0, 24)}`,
      label: action,
      subtitle: "Coach action",
      group: "Coach",
      searchText: `${action} coach action sprint plan`,
      run: () => {
        callbacks.navigate("coach");
        callbacks.askCoach(action);
      },
    });
  }

  return items;
}

export function filterSearchItems(items: SearchItem[], query: string, limit = 12): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return items.filter((item) => item.group === "Navigate" || item.id === "action-sprint").slice(0, limit);
  }

  const tokens = q.split(/\s+/).filter(Boolean);
  return items
    .filter((item) => {
      const haystack = item.searchText.toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    })
    .slice(0, limit);
}
