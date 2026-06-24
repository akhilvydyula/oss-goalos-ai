import { replyTo } from "../coach";
import type { AgentContext, AgentRouteResult } from "./types";
import {
  detectToolsFromMessage,
  executeAgentTools,
  mergeActionResults,
} from "./tools";

/** Routes coach messages through tool detection + rule-based reply. */
export function routeCoachMessage(ctx: AgentContext): AgentRouteResult & { reply: string } {
  const toolCalls = detectToolsFromMessage(ctx);
  const actionResults = executeAgentTools(toolCalls, ctx);
  const merged = mergeActionResults(actionResults);

  let reply = replyTo(ctx.userMessage, ctx.state, ctx.score, ctx.coach);
  if (merged.replySuffix) {
    reply = reply + merged.replySuffix;
  }

  return {
    toolCalls,
    actionResults,
    combinedReplySuffix: merged.replySuffix ?? "",
    reply,
  };
}

/** Apply merged agent side effects — returns patches for hook state setters. */
export function applyAgentEffects(merged: ReturnType<typeof mergeActionResults>) {
  return {
    sprintPrefill: merged.sprintPrefill,
    intentAppId: merged.intentAppId,
    navigateTab: merged.navigateTab,
    statePatch: merged.statePatch,
  };
}
