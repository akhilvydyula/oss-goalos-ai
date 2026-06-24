"use client";

import { useRef, useState } from "react";
import type { UserState, WeeklyReport } from "@/lib/types";
import { PRIVACY_PROMISE, TAGLINE } from "@/lib/constants";
import { exportState } from "@/lib/storage";
import { sprintsTodayCount } from "@/lib/app-metrics";
import { WeeklyIdentityCard } from "@/components/ui/WeeklyIdentityCard";
import { MetricCard } from "@/components/ui/GoalOSComponents";
import {
  Download,
  Trash2,
  Share2,
  Camera,
  Target,
  Zap,
  Moon,
  Sparkles,
  Calendar,
} from "lucide-react";

function profileInitials(state: UserState): string {
  if (state.displayName?.trim()) {
    return state.displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
  }
  const identity = state.profile?.identity ?? "GoalOS User";
  return identity
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function identityEmoji(identity?: string): string {
  switch (identity) {
    case "Night Scroller":
      return "🌙";
    case "Deep Worker":
      return "🧠";
    case "Focused Creator":
      return "✨";
    case "Career Climber":
      return "📈";
    case "AI Learner":
      return "🤖";
    case "Consistent Builder":
      return "🏗️";
    case "High Potential, Low Execution":
      return "⚡";
    default:
      return "🎯";
  }
}

export function ProfileTab({
  state,
  weeklyReport,
  onUpdate,
  onReset,
}: {
  state: UserState;
  weeklyReport: WeeklyReport;
  onUpdate: (patch: Partial<UserState>) => void;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const identity = state.profile?.identity ?? "Consistent Builder";
  const displayName = state.displayName?.trim() || "Your Profile";
  const initials = profileInitials(state);

  const shareText = `GoalOS AI Weekly
Goal: ${state.goal?.title ?? "My Goal"}
Identity: ${weeklyReport.identity}
Goal Score: ${weeklyReport.averageScore}/100
Goal Time: ${Math.round(weeklyReport.productiveMinutes / 60)}h
Distraction Reduced: ${weeklyReport.distractionReductionPercent}%
${TAGLINE}`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "GoalOS Weekly", text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    const blob = new Blob([exportState(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "goalos-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePhotoChange = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpdate({ profilePhoto: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Profile hero */}
      <div className="goalos-card goalos-card-glow overflow-hidden p-0">
        <div className="bg-gradient-to-br from-[#2be7a8]/20 via-transparent to-[#68a7ff]/15 px-5 pb-5 pt-6">
          <div className="flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative"
              aria-label="Change profile photo"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#2be7a8]/40 bg-gradient-to-br from-[#2be7a8]/30 to-[#68a7ff]/30 shadow-lg shadow-black/30">
                {state.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={state.profilePhoto}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                    {initials || "GO"}
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#06070d]/90 text-[#2be7a8] transition group-hover:bg-[#2be7a8]/20">
                <Camera className="h-4 w-4" />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
            />

            <input
              type="text"
              value={state.displayName ?? ""}
              onChange={(e) => onUpdate({ displayName: e.target.value })}
              placeholder="Add your name"
              className="mt-4 w-full max-w-[220px] border-b border-transparent bg-transparent text-center text-xl font-semibold text-zinc-50 placeholder:text-zinc-600 outline-none focus:border-[#2be7a8]/40"
            />
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-[#2be7a8]">
              <span>{identityEmoji(identity)}</span>
              <span>{identity}</span>
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {state.profile?.coachingTone ?? "Supportive"} coaching tone
            </p>
          </div>
        </div>
      </div>

      {/* Goal summary */}
      {state.goal && (
        <div className="goalos-card p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#68a7ff]/15 p-2 text-[#68a7ff]">
              <Target className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Active goal
              </p>
              <p className="mt-1 font-medium text-zinc-100">{state.goal.title}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {state.goal.dailyCommitmentMinutes} min/day · {state.goal.timelineWeeks} weeks ·{" "}
                {state.goal.focusWindow}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vitals */}
      <div className="grid grid-cols-2 gap-3">
        <VitalSlider
          label="Energy today"
          value={state.energyToday}
          onChange={(v) => onUpdate({ energyToday: v })}
        />
        <VitalSlider
          label="Mood today"
          value={state.moodToday}
          onChange={(v) => onUpdate({ moodToday: v })}
        />
        <MetricCard
          label="Roadmap"
          value={`${state.roadmapProgress}%`}
          accent={state.roadmapProgress >= 50 ? "positive" : "default"}
        />
        <MetricCard
          label="Sprints today"
          value={`${sprintsTodayCount(state.focusSprints)}`}
        />
      </div>

      {/* Productivity DNA */}
      <div className="goalos-card p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Productivity DNA
        </p>
        <div className="mt-3 space-y-2.5 text-sm">
          <DnaRow icon={<Zap className="h-3.5 w-3.5" />} label="Focus window" value={state.profile?.focusWindow ?? state.dna?.bestFocusTime ?? "Morning"} />
          <DnaRow icon={<Moon className="h-3.5 w-3.5" />} label="Distraction trigger" value={state.profile?.distractionTrigger ?? state.dna?.distractionTrigger ?? "Boredom"} />
          <DnaRow icon={<Sparkles className="h-3.5 w-3.5" />} label="Reminder style" value={state.profile?.reminderStrategy ?? "Gentle nudges"} />
          <DnaRow icon={<Calendar className="h-3.5 w-3.5" />} label="Member since" value={new Date(state.createdAt).toLocaleDateString()} />
        </div>
      </div>

      <WeeklyIdentityCard report={weeklyReport} goalTitle={state.goal?.title ?? "Your Goal"} compact />

      {/* Privacy */}
      <div className="goalos-card p-4">
        <h3 className="text-sm font-medium text-zinc-200">Privacy Center</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{PRIVACY_PROMISE}</p>
        <div className="mt-4 flex flex-col gap-2">
          {state.profilePhoto && (
            <button
              type="button"
              onClick={() => onUpdate({ profilePhoto: undefined })}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-zinc-400"
            >
              <Camera className="h-4 w-4" /> Remove photo
            </button>
          )}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm"
          >
            <Download className="h-4 w-4" /> Export my data
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 py-3 text-sm text-rose-400"
          >
            <Trash2 className="h-4 w-4" /> Delete all data
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="goalos-btn-primary flex w-full items-center justify-center gap-2 py-4"
      >
        <Share2 className="h-5 w-5" />
        {copied ? "Copied to clipboard!" : "Share Weekly Identity"}
      </button>
    </div>
  );
}

function VitalSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="goalos-card p-4">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-zinc-50">{value}/5</p>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[#2be7a8]"
        aria-label={label}
      />
    </div>
  );
}

function DnaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-zinc-500">
        <span className="text-[#68a7ff]">{icon}</span>
        {label}
      </span>
      <span className="text-right text-zinc-200">{value}</span>
    </div>
  );
}
