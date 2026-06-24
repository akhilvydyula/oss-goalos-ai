import type { AgentActionResult, AgentContext, AgentToolCall, AgentToolName } from "./types";
import { suggestSprint } from "./sprint-agent";
import { generateRoadmap } from "./plan-agent";

function topDistractor(apps: AgentContext["state"]["apps"]) {
  return [...apps]
    .filter((a) => a.classification === "distracting" || a.classification === "mixed")
    .sort((a, b) => b.minutesToday - a.minutesToday)[0];
}

/** Rule-based tool detection from user message and coach chip labels. */
export function detectToolsFromMessage(ctx: AgentContext): AgentToolCall[] {
  const msg = ctx.userMessage.toLowerCase().trim();
  const calls: AgentToolCall[] = [];
  const distractor = topDistractor(ctx.state.apps);

  const wantsSprint =
    msg.includes("sprint") ||
    msg.includes("focus") ||
    msg.includes("timer") ||
    (msg.includes("create") && (msg.includes("am") || msg.includes("morning") || msg.includes(":"))) ||
    msg === "start focus sprint" ||
    msg.includes("start a") && msg.includes("sprint");

  const wantsIntent =
    msg.includes("intent") ||
    msg.includes("block") ||
    (distractor && msg.includes(distractor.name.toLowerCase())) ||
    msg.includes("gate");

  const wantsPlan =
    msg.includes("tomorrow") ||
    msg.includes("plan") ||
    msg.includes("show tomorrow");

  const wantsInsights =
    msg.includes("insight") ||
    msg.includes("weekly") ||
    msg.includes("report") ||
    msg.includes("identity");

  const wantsGoal =
    msg.includes("roadmap") ||
    msg.includes("milestone") ||
    msg.includes("classify") ||
    msg.includes("my goal");

  if (wantsSprint) {
    const sprint = suggestSprint({
      goal: ctx.state.goal,
      score: ctx.score,
      coach: ctx.coach,
      userMessage: ctx.userMessage,
    });
    calls.push({
      tool: "start_focus_sprint",
      params: { title: sprint.title, durationMinutes: sprint.durationMinutes },
    });
  }

  if (wantsIntent && distractor) {
    calls.push({ tool: "open_intent_gate", params: { appId: distractor.id } });
  }

  if (wantsPlan) {
    calls.push({ tool: "show_tomorrow_plan", params: {} });
  }

  if (wantsInsights) {
    calls.push({ tool: "navigate_insights", params: {} });
  }

  if (wantsGoal) {
    calls.push({ tool: "navigate_goal", params: {} });
  }

  if (
    (msg.includes("roadmap") || msg.includes("plan my goal")) &&
    (!ctx.state.roadmap || ctx.state.roadmap.length === 0) &&
    ctx.state.goal
  ) {
    calls.push({ tool: "generate_roadmap", params: {} });
  }

  return dedupeTools(calls);
}

function dedupeTools(calls: AgentToolCall[]): AgentToolCall[] {
  const seen = new Set<AgentToolName>();
  return calls.filter((c) => {
    if (seen.has(c.tool)) return false;
    seen.add(c.tool);
    return true;
  });
}

export function executeAgentTool(
  call: AgentToolCall,
  ctx: AgentContext
): AgentActionResult {
  switch (call.tool) {
    case "start_focus_sprint": {
      const title = String(call.params.title ?? "Focus Sprint");
      const durationMinutes = Number(call.params.durationMinutes ?? 25);
      return {
        sprintPrefill: { title, durationMinutes },
        replySuffix: `\n\n→ Opening ${durationMinutes}-minute "${title}" sprint for you.`,
      };
    }
    case "open_intent_gate": {
      const appId = String(call.params.appId);
      const app = ctx.state.apps.find((a) => a.id === appId);
      return {
        intentAppId: appId,
        replySuffix: app
          ? `\n\n→ Intent Gate opened for ${app.name}.`
          : "\n\n→ Opening Intent Gate.",
      };
    }
    case "show_tomorrow_plan":
      return {
        replySuffix: `\n\n**Tomorrow:** ${ctx.coach.tomorrowPlan}`,
      };
    case "navigate_insights":
      return {
        navigateTab: "insights",
        replySuffix: "\n\n→ Showing your weekly insights.",
      };
    case "navigate_goal":
      return {
        navigateTab: "goal",
        replySuffix: "\n\n→ Opening your goal & app classification.",
      };
    case "generate_roadmap": {
      if (!ctx.state.goal) return {};
      const roadmap = generateRoadmap(ctx.state.goal, ctx.state.dna);
      return {
        statePatch: { roadmap },
        navigateTab: "goal",
        replySuffix: `\n\n→ Generated a ${roadmap.length}-week roadmap for ${ctx.state.goal.title}.`,
      };
    }
    default:
      return {};
  }
}

export function executeAgentTools(
  calls: AgentToolCall[],
  ctx: AgentContext
): AgentActionResult[] {
  return calls.map((call) => executeAgentTool(call, ctx));
}

export function mergeActionResults(results: AgentActionResult[]): AgentActionResult {
  return results.reduce<AgentActionResult>(
    (acc, r) => ({
      replySuffix: [acc.replySuffix, r.replySuffix].filter(Boolean).join(""),
      sprintPrefill: r.sprintPrefill ?? acc.sprintPrefill,
      intentAppId: r.intentAppId ?? acc.intentAppId,
      navigateTab: r.navigateTab ?? acc.navigateTab,
      statePatch: r.statePatch
        ? { ...acc.statePatch, ...r.statePatch }
        : acc.statePatch,
    }),
    {}
  );
}
