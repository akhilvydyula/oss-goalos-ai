"use client";

import { useState } from "react";
import type { UserState } from "@/lib/types";
import { TAGLINE, PRIVACY_PROMISE } from "@/lib/constants";
import { deriveProductivityProfile } from "@/lib/scoring";
import { createInstantDemoState } from "@/lib/demo-presets";
import { generateRoadmap } from "@/lib/agent";
import { GoalSetupStep } from "./GoalSetupStep";
import { DnaQuizStep } from "./DnaQuizStep";
import { Shield, Sparkles, Zap } from "lucide-react";

type Step = "welcome" | "goal" | "dna" | "privacy";

export function OnboardingFlow({
  state,
  persist,
}: {
  state: UserState;
  persist: (s: UserState) => void;
}) {
  const [step, setStep] = useState<Step>("welcome");

  if (step === "welcome") {
    return (
      <div className="relative flex h-full min-h-0 flex-col justify-between overflow-y-auto px-6 py-8">
        <div className="goalos-ambient" aria-hidden />
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2be7a8]/20 bg-[#2be7a8]/10 px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#2be7a8]" />
            <span className="text-[11px] font-medium text-[#2be7a8]">Open source · Local-first</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2be7a8]/80">
            GoalOS AI
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight">
            <span className="goalos-gradient-text">{TAGLINE}</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-300">
            Know where your time goes. Know who you are becoming.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Your phone is not the problem. Unconscious time is the problem.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: "Goal score", value: "76" },
              { label: "Focus sprints", value: "25m" },
              { label: "AI coach", value: "Live" },
            ].map((stat) => (
              <div key={stat.label} className="goalos-card p-3 text-center">
                <p className="text-lg font-bold text-[#2be7a8]">{stat.value}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-8 space-y-3">
          <button
            type="button"
            onClick={() => setStep("goal")}
            className="goalos-btn-primary w-full py-4 text-center"
          >
            Get Started
          </button>
          <button
            type="button"
            onClick={() => persist(createInstantDemoState())}
            className="goalos-btn-secondary flex w-full items-center justify-center gap-2 py-4"
          >
            <Zap className="h-4 w-4 text-[#68a7ff]" />
            Explore demo instantly
          </button>
          <p className="text-center text-[11px] text-zinc-600">
            Demo loads sample data — no signup, runs in your browser
          </p>
        </div>
      </div>
    );
  }

  if (step === "goal") {
    return (
      <GoalSetupStep
        onBack={() => setStep("welcome")}
        onComplete={(goal) => {
          persist({ ...state, goal });
          setStep("dna");
        }}
      />
    );
  }

  if (step === "dna") {
    return (
      <DnaQuizStep
        onBack={() => setStep("goal")}
        onComplete={(dna) => {
          const profile = deriveProductivityProfile(dna);
          persist({
            ...state,
            dna,
            profile,
            energyToday: dna.energyLevel,
            moodToday: Math.min(5, dna.energyLevel + 1),
          });
          setStep("privacy");
        }}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-6 py-8">
      <div className="goalos-card flex flex-1 flex-col p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2be7a8]/15">
          <Shield className="h-6 w-6 text-[#2be7a8]" />
        </div>
        <h2 className="text-2xl font-semibold">Privacy Promise</h2>
        <p className="mt-4 flex-1 leading-relaxed text-zinc-400">{PRIVACY_PROMISE}</p>
        <ul className="mt-4 space-y-2 text-sm text-zinc-500">
          <li>✓ App usage patterns only — no message or content reading</li>
          <li>✓ Local-first storage with export/delete controls</li>
          <li>✓ You control what the AI remembers</li>
        </ul>
      </div>
      <button
        type="button"
        onClick={() => {
          const roadmap = state.goal ? generateRoadmap(state.goal, state.dna) : undefined;
          persist({
            ...state,
            privacyAccepted: true,
            onboarded: true,
            ...(roadmap ? { roadmap } : {}),
          });
        }}
        className="goalos-btn-primary mt-6 w-full py-4"
      >
        Accept & Continue
      </button>
      <p className="mt-3 text-center text-xs text-zinc-600">
        Demo mode uses simulated usage data. Android app uses UsageStatsManager.
      </p>
    </div>
  );
}
