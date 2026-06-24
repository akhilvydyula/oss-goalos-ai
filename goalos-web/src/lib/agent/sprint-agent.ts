import type { CoachRecommendation, ScoreBreakdown, UserGoal } from "../types";

export function sprintTypeFromGoal(goal?: UserGoal): string {
  switch (goal?.template) {
    case "data-engineering-job":
      return "SQL";
    case "software-interview":
      return "DSA";
    case "founder-mode":
      return "build";
    case "learn-ai-de":
      return "ML";
    default:
      return "focus";
  }
}

export function suggestSprint(input: {
  goal?: UserGoal;
  score: ScoreBreakdown;
  coach: CoachRecommendation;
  userMessage?: string;
}): { title: string; durationMinutes: number } {
  const { goal, score, coach, userMessage } = input;
  const sprintType = sprintTypeFromGoal(goal);
  const pointsTo80 = Math.max(0, 80 - score.total);
  const msg = (userMessage ?? "").toLowerCase();

  let durationMinutes = pointsTo80 <= 10 ? 15 : pointsTo80 <= 20 ? 25 : 45;
  if (msg.includes("60") || msg.includes("hour")) durationMinutes = 60;
  else if (msg.includes("45")) durationMinutes = 45;
  else if (msg.includes("15")) durationMinutes = 15;
  else if (msg.includes("25")) durationMinutes = 25;

  let title = `${sprintType} Sprint`;
  if (goal?.template === "data-engineering-job") title = "SQL deep work";
  if (goal?.template === "software-interview") title = "DSA practice";
  if (goal?.template === "founder-mode") title = "Ship sprint";
  if (coach.nextAction.toLowerCase().includes("sql")) title = "SQL deep work";

  return { title, durationMinutes };
}
