import type { ScoreBreakdown } from "@/lib/types";
import { scoreColor } from "@/lib/scoring";
import { ScoreLabel } from "@/components/ui/AppIcon";
import { TrendingUp } from "lucide-react";

let scoreGradId = 0;

export function ScoreCard({ score }: { score: ScoreBreakdown }) {
  const gradId = `scoreGrad-${++scoreGradId}`;
  const circumference = 2 * Math.PI * 62;
  const offset = circumference - (score.total / 100) * circumference;
  const pointsTo80 = Math.max(0, 80 - score.total);

  return (
    <div className="goalos-card goalos-card-glow goalos-score-card relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#2be7a8]/10 blur-3xl" />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Goal Alignment Score
          </p>
          <ScoreLabel score={score.total} />
        </div>
        {pointsTo80 > 0 && pointsTo80 <= 15 && (
          <span className="rounded-full border border-[#2be7a8]/25 bg-[#2be7a8]/10 px-2.5 py-1 text-[10px] font-medium text-[#2be7a8]">
            +{pointsTo80} to 80
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-col items-center sm:flex-row sm:items-center sm:gap-8">
        <div className="relative h-40 w-40 shrink-0">
          <svg className="-rotate-90" viewBox="0 0 140 140" aria-hidden>
            <circle
              cx="70"
              cy="70"
              r="62"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="10"
            />
            <circle
              cx="70"
              cy="70"
              r="62"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="score-ring-animate drop-shadow-[0_0_12px_rgba(43,231,168,0.35)]"
            />
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2be7a8" />
                <stop offset="50%" stopColor="#3dd4a8" />
                <stop offset="100%" stopColor="#68a7ff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold tabular-nums tracking-tight ${scoreColor(score.total)}`}>
              {score.total}
            </span>
            <span className="text-sm text-zinc-500">/ 100</span>
          </div>
        </div>

        <div className="mt-4 w-full flex-1 space-y-3 sm:mt-0">
          <ScoreRow label="Goal time" value={score.goalSupportingTime} max={30} />
          <ScoreRow label="Roadmap" value={score.roadmapCompletion} max={20} />
          <ScoreRow label="Deep work" value={score.deepWork} max={15} />
          <ScoreRow label="Intent match" value={score.intentMatch} max={15} />
          {score.distractionPenalty < 0 && (
            <p className="flex items-center gap-1.5 text-xs text-rose-400/90">
              <TrendingUp className="h-3 w-3 rotate-180" />
              Distraction {score.distractionPenalty} pts
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-zinc-500">{label}</span>
        <span className="tabular-nums text-zinc-300">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2be7a8] to-[#68a7ff] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
