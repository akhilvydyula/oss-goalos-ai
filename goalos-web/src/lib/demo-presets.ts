import { generateDemoApps } from "./demo-data";
import { generateRoadmap } from "./agent";
import type { DnaAnswers, ProductivityProfile, UserGoal, UserState } from "./types";

const DEMO_GOAL: UserGoal = {
  template: "data-engineering-job",
  title: "Get Data Engineering Job",
  timelineWeeks: 12,
  dailyCommitmentMinutes: 90,
  focusWindow: "Morning (9–12pm)",
  painPoint: "Too much learning content, not enough portfolio projects",
  motivation: "Land a DE role in 3 months with SQL + PySpark skills",
};

const DEMO_DNA: DnaAnswers = {
  distractionTime: "Late night",
  distractingApps: ["YouTube", "Instagram", "TikTok"],
  distractionTrigger: "Habit",
  bestFocusTime: "Morning (9–12pm)",
  energyLevel: 4,
  coachingTone: "Direct",
  goalBlocker: "Too much content, not enough action",
};

const DEMO_PROFILE: ProductivityProfile = {
  identity: "High Potential, Low Execution",
  distractionTrigger: "Habit",
  focusWindow: "Morning (9–12pm)",
  coachingTone: "Direct",
  reminderStrategy: "Focus sprint before entertainment apps",
};

export function createInstantDemoState(): UserState {
  return {
    onboarded: true,
    privacyAccepted: true,
    displayName: "Akhil",
    goal: DEMO_GOAL,
    dna: DEMO_DNA,
    profile: DEMO_PROFILE,
    apps: generateDemoApps(),
    intentCheckIns: [],
    focusSprints: [
      {
        id: "sprint-demo-1",
        title: "SQL deep work",
        durationMinutes: 25,
        startedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
        completedAt: new Date(Date.now() - 2.5 * 3600000).toISOString(),
        scoreBoost: 5,
      },
    ],
    roadmap: generateRoadmap(DEMO_GOAL, DEMO_DNA),
    roadmapProgress: 42,
    energyToday: 4,
    moodToday: 4,
    weeklyHistory: [68, 72, 75, 71, 78, 74, 76],
    createdAt: new Date().toISOString(),
  };
}
