import type { UserState, ScoreBreakdown, CoachRecommendation, TrackedApp } from "@/lib/types";
import { ScoreCard } from "@/components/ui/ScoreCard";
import { HeroCard, MetricCard } from "@/components/ui/GoalOSComponents";
import { AppIcon, SectionLabel } from "@/components/ui/AppIcon";
import { formatMinutes, totalScreenMinutes } from "@/lib/demo-data";
import { Zap, AlertTriangle, Shield, Clock, Flame, ChevronRight } from "lucide-react";

function AppUsageRow({
  app,
  maxMinutes,
  onIntentGate,
}: {
  app: TrackedApp;
  maxMinutes: number;
  onIntentGate?: () => void;
}) {
  const pct = Math.min(100, (app.minutesToday / maxMinutes) * 100);
  const isRisk = app.classification === "distracting" || app.classification === "mixed";

  return (
    <div className="flex items-center gap-3 py-2.5">
      <AppIcon name={app.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-zinc-200">{app.name}</p>
          <span className="shrink-0 text-xs tabular-nums text-zinc-500">
            {formatMinutes(app.minutesToday)}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full rounded-full transition-all ${
              isRisk
                ? "bg-gradient-to-r from-amber-500 to-rose-400"
                : "bg-gradient-to-r from-[#2be7a8] to-[#68a7ff]"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {isRisk && onIntentGate && (
        <button
          type="button"
          onClick={onIntentGate}
          className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-[#68a7ff]"
          aria-label={`Intent gate for ${app.name}`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function TodayDashboard({
  state,
  score,
  coach,
  onStartSprint,
  onIntentGate,
  layout = "mobile",
}: {
  state: UserState;
  score: ScoreBreakdown;
  coach: CoachRecommendation;
  onStartSprint: () => void;
  onIntentGate: (appId: string) => void;
  layout?: "web" | "mobile";
}) {
  const productive = state.apps
    .filter((a) => a.classification === "goal-supporting")
    .reduce((s, a) => s + a.minutesToday, 0);
  const distracted = state.apps
    .filter((a) => a.classification === "distracting")
    .reduce((s, a) => s + a.minutesToday, 0);
  const total = totalScreenMinutes(state.apps);
  const goalPct = total > 0 ? Math.round((productive / total) * 100) : 0;

  const topApps = [...state.apps].sort((a, b) => b.minutesToday - a.minutesToday).slice(0, 5);
  const maxMinutes = topApps[0]?.minutesToday ?? 1;

  const riskApp = [...state.apps]
    .filter((a) => a.classification === "distracting" || a.classification === "mixed")
    .sort((a, b) => b.minutesToday - a.minutesToday)[0];

  const streak = state.focusSprints.length;

  return (
    <div className={`space-y-4 ${layout === "web" ? "sm:space-y-5" : ""}`}>
      <div className={layout === "web" ? "grid gap-4 lg:grid-cols-5 lg:gap-5" : "space-y-4"}>
        <div className={layout === "web" ? "lg:col-span-3" : ""}>
          <ScoreCard score={score} />
        </div>
        <div className={`grid grid-cols-2 gap-3 ${layout === "web" ? "lg:col-span-2 lg:grid-cols-1" : ""}`}>
          <MetricCard
            label="Screen time"
            value={formatMinutes(total)}
            icon={<Clock className="h-4 w-4" />}
          />
          <MetricCard
            label="Goal time"
            value={formatMinutes(productive)}
            accent="positive"
            sub={`${goalPct}% aligned`}
            icon={<Zap className="h-4 w-4" />}
          />
          <MetricCard
            label="Distracted"
            value={formatMinutes(distracted)}
            accent="warning"
            icon={<AlertTriangle className="h-4 w-4" />}
          />
          <MetricCard
            label="Focus sprints"
            value={String(streak)}
            sub="today"
            accent="positive"
            icon={<Flame className="h-4 w-4" />}
          />
        </div>
      </div>

      <HeroCard
        title="AI Next Best Action"
        body={coach.nextAction}
        actionLabel="Start Focus Sprint"
        onAction={onStartSprint}
        icon={<Zap className="h-5 w-5" />}
      />

      <div className="goalos-card p-4 sm:p-5">
        <SectionLabel>Top apps today</SectionLabel>
        <div className="mt-3 divide-y divide-white/[0.04]">
          {topApps.map((app) => (
            <AppUsageRow
              key={app.id}
              app={app}
              maxMinutes={maxMinutes}
              onIntentGate={
                app.classification === "distracting" || app.classification === "mixed"
                  ? () => onIntentGate(app.id)
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {riskApp && (
        <div className="goalos-card border-amber-500/20 bg-amber-500/[0.04] p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Risk window · after 8pm</span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm leading-relaxed text-zinc-400">
            <AppIcon name={riskApp.name} size="sm" />
            <span>
              {riskApp.name} — {formatMinutes(riskApp.minutesToday)} today. Open Intent Gate before
              the next session.
            </span>
          </p>
          <button
            type="button"
            onClick={() => onIntentGate(riskApp.id)}
            className="goalos-btn-ghost mt-3 text-sm text-[#68a7ff]"
          >
            Open Intent Gate →
          </button>
        </div>
      )}

      <div className="goalos-card flex gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2be7a8]/15">
          <Shield className="h-5 w-5 text-[#2be7a8]" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-200">{state.profile?.identity}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">{coach.reminder}</p>
        </div>
      </div>
    </div>
  );
}
