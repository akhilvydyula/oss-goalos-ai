import type { IntentReason } from "../types";
import type { IntentClassification } from "./types";

const INTENT_KEYWORDS: { reason: IntentReason; aligned: boolean; patterns: string[] }[] = [
  { reason: "learning", aligned: true, patterns: ["learn", "tutorial", "course", "study", "sql", "python"] },
  { reason: "work", aligned: true, patterns: ["work", "job", "project", "email", "meeting"] },
  { reason: "interview-prep", aligned: true, patterns: ["interview", "leetcode", "dsa", "prep"] },
  { reason: "business-research", aligned: true, patterns: ["research", "startup", "market", "competitor"] },
  { reason: "messaging", aligned: true, patterns: ["message", "reply", "whatsapp", "text", "call"] },
  { reason: "entertainment", aligned: false, patterns: ["fun", "watch", "meme", "reel", "bored", "relax"] },
  { reason: "stress-relief", aligned: false, patterns: ["stress", "tired", "escape", "unwind"] },
  { reason: "boredom", aligned: false, patterns: ["bored", "nothing", "kill time", "scroll"] },
  { reason: "no-reason", aligned: false, patterns: ["habit", "idk", "don't know", "just because"] },
];

export function classifyIntentText(text: string, appName: string): IntentClassification {
  const normalized = text.toLowerCase().trim();
  if (!normalized) {
    return {
      reason: "no-reason",
      aligned: false,
      confidence: "low",
      explanation: "No reason given — treat as unconscious open.",
    };
  }

  let best: (typeof INTENT_KEYWORDS)[number] | null = null;
  let bestScore = 0;

  for (const entry of INTENT_KEYWORDS) {
    const score = entry.patterns.filter((p) => normalized.includes(p)).length;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore > 0) {
    return {
      reason: best.reason,
      aligned: best.aligned,
      confidence: bestScore >= 2 ? "high" : "medium",
      explanation: best.aligned
        ? `Sounds aligned with ${appName} for ${best.reason.replace("-", " ")}.`
        : `Likely entertainment on ${appName} — consider a focus sprint first.`,
    };
  }

  const alignedGuess =
    normalized.includes("goal") ||
    normalized.includes("need to") ||
    normalized.includes("have to");

  return {
    reason: alignedGuess ? "work" : "entertainment",
    aligned: alignedGuess,
    confidence: "low",
    explanation: alignedGuess
      ? "Parsed as goal-related intent."
      : "Could not classify — defaulting to entertainment risk.",
  };
}
