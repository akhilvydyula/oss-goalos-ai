import type { CoachRecommendation, CoachMessage, ScoreBreakdown, UserState } from "./types";
import { formatMinutes } from "./demo-data";
import { replyTo } from "./coach";
import type { MLCEngineInterface } from "@mlc-ai/web-llm";

/** Tried in order — falls back to smaller models if GPU memory or download fails. */
export const WEB_LLM_MODEL_CANDIDATES = [
  "Llama-3.2-1B-Instruct-q4f16_1-MLC",
  "SmolLM2-360M-Instruct-q4f16_1-MLC",
  "SmolLM2-135M-Instruct-q0f16-MLC",
] as const;

export const WEB_LLM_MODEL = WEB_LLM_MODEL_CANDIDATES[0];

export type WebLLMStatus =
  | "checking"
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "unsupported";

export function isBraveBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } };
  return Boolean(nav.brave?.isBrave) || /Brave/i.test(navigator.userAgent);
}

export async function checkWebGPUSupport(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
  try {
    const gpu = navigator.gpu as {
      requestAdapter: (opts?: { powerPreference?: string }) => Promise<unknown | null>;
    };
    const adapter = await gpu.requestAdapter({ powerPreference: "high-performance" });
    if (!adapter) {
      const fallback = await gpu.requestAdapter();
      return fallback !== null;
    }
    return true;
  } catch {
    return false;
  }
}

export function formatWebLLMError(err: unknown, modelId?: string): string {
  const raw = err instanceof Error ? err.message : String(err ?? "Unknown error");
  const lower = raw.toLowerCase();
  const modelHint = modelId ? ` (model: ${modelId})` : "";

  if (lower.includes("webgpu") || lower.includes("gpu")) {
    return (
      "WebGPU is unavailable. Use Chrome or Edge on desktop, enable GPU acceleration in settings, " +
      "then refresh. Brave users: enable WebGPU at brave://flags/#enable-unsafe-webgpu."
    );
  }

  if (
    lower.includes("failed to fetch") ||
    lower.includes("network") ||
    lower.includes("load failed") ||
    lower.includes("cors")
  ) {
    const brave = isBraveBrowser();
    return (
      "Model download blocked. Check your internet connection" +
      (brave
        ? " and disable Brave Shields for this site (lion icon in the address bar), then retry."
        : ", disable ad blockers for this site, then retry.") +
      modelHint
    );
  }

  if (
    lower.includes("device lost") ||
    lower.includes("out of memory") ||
    lower.includes("oom") ||
    lower.includes("vram")
  ) {
    return (
      "GPU ran out of memory loading the model. Close other tabs/apps and retry — " +
      "we automatically try smaller models on each attempt." +
      modelHint
    );
  }

  if (lower.includes("cache") || lower.includes("indexeddb")) {
    return "Browser storage error. Clear site data for this page in browser settings, then retry.";
  }

  if (raw.trim()) {
    return `${raw}${modelHint}`;
  }

  return `Failed to load browser AI model${modelHint}. Use Chrome/Edge on desktop with WebGPU enabled.`;
}

export function buildCoachSystemPrompt(
  state: UserState,
  score: ScoreBreakdown,
  coach: CoachRecommendation
): string {
  const distractor = [...state.apps]
    .filter((a) => a.classification === "distracting" || a.classification === "mixed")
    .sort((a, b) => b.minutesToday - a.minutesToday)[0];

  return `You are GoalOS AI Coach — a concise, motivating productivity coach.
Turn screen time into goal time. Be direct, warm, and actionable. Keep replies under 120 words.

User context:
- Goal: ${state.goal?.title ?? "Not set"}
- Productivity identity: ${state.profile?.identity ?? "Unknown"}
- Focus window: ${state.profile?.focusWindow ?? "Morning"}
- Goal Alignment Score today: ${score.total}/100
- Diagnosis: ${coach.diagnosis}
- Next best action: ${coach.nextAction}
- Reminder: ${coach.reminder}
- Top distractor app: ${distractor ? `${distractor.name} (${formatMinutes(distractor.minutesToday)} today)` : "none"}
- Roadmap progress: ${state.roadmapProgress}%

Give practical coaching: focus sprints, intent gates, night scrolling guards, tomorrow plans.
You can trigger in-app actions when appropriate — the app will open focus sprints, intent gates, insights, and goal tabs based on user requests.
Never mention API keys, servers, or that you are a language model.`;
}

let enginePromise: Promise<MLCEngineInterface> | null = null;
let loadedModelId: string | null = null;
let loadProgressCallback: ((progress: number, text: string) => void) | undefined;

async function createEngineForModel(modelId: string): Promise<MLCEngineInterface> {
  const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
  return CreateMLCEngine(modelId, {
    initProgressCallback: (report) => {
      loadProgressCallback?.(report.progress, report.text);
    },
  });
}

export function getLoadedWebLLMModelId(): string | null {
  return loadedModelId;
}

export async function loadWebLLMEngine(
  onProgress?: (progress: number, text: string) => void,
  modelCandidates: readonly string[] = WEB_LLM_MODEL_CANDIDATES
): Promise<MLCEngineInterface> {
  const supported = await checkWebGPUSupport();
  if (!supported) {
    throw new Error(formatWebLLMError(new Error("WebGPU not available")));
  }

  if (onProgress) loadProgressCallback = onProgress;

  if (enginePromise && loadedModelId) {
    return enginePromise;
  }

  enginePromise = (async () => {
    const errors: string[] = [];

    for (let i = 0; i < modelCandidates.length; i++) {
      const modelId = modelCandidates[i]!;
      try {
        if (i > 0) {
          loadProgressCallback?.(
            0,
            `Retrying with smaller model (${modelId})…`
          );
        }
        const engine = await createEngineForModel(modelId);
        loadedModelId = modelId;
        return engine;
      } catch (err) {
        const msg = formatWebLLMError(err, modelId);
        errors.push(msg);
        loadProgressCallback?.(0, `Failed ${modelId} — trying fallback…`);
      }
    }

    throw new Error(errors[errors.length - 1] ?? formatWebLLMError(new Error("All models failed")));
  })().catch((err) => {
    enginePromise = null;
    loadedModelId = null;
    throw err;
  });

  return enginePromise;
}

export function resetWebLLMEngine(): void {
  enginePromise = null;
  loadedModelId = null;
  loadProgressCallback = undefined;
}

export async function generateCoachReplyWithWebLLM(input: {
  state: UserState;
  score: ScoreBreakdown;
  coach: CoachRecommendation;
  history: CoachMessage[];
  userMessage: string;
  onProgress?: (progress: number, text: string) => void;
}): Promise<string> {
  const { state, score, coach, history, userMessage, onProgress } = input;

  const engine = await loadWebLLMEngine(onProgress);
  const systemPrompt = buildCoachSystemPrompt(state, score, coach);

  const recent = history.slice(-8).map((m) => ({
    role: (m.role === "coach" ? "assistant" : "user") as "assistant" | "user",
    content: m.text,
  }));

  const response = await engine.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      ...recent,
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 220,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("Empty model response");
  }
  return text;
}

export function fallbackCoachReply(
  userMessage: string,
  state: UserState,
  score: ScoreBreakdown,
  coach: CoachRecommendation
): string {
  return replyTo(userMessage, state, score, coach);
}
