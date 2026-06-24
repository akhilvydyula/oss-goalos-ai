"use client";

/** Inline SVG sparkline — no chart library dependency. */
export function Sparkline({
  data,
  color = "#2be7a8",
  height = 32,
  width = 80,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
      />
    </svg>
  );
}

export function BarChart({
  data,
  labels,
  highlightIndex,
  height = 64,
}: {
  data: number[];
  labels: string[];
  highlightIndex?: number;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  const barW = 100 / data.length;
  const viewHeight = Math.round(height * 0.625);

  return (
    <svg
      viewBox={`0 0 100 ${viewHeight}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="none"
      aria-hidden
      aria-label={`Bar chart: ${labels.join(", ")}`}
    >
      {data.map((v, i) => {
        const h = (v / max) * (viewHeight - 4);
        const x = i * barW + barW * 0.15;
        const w = barW * 0.7;
        const isHi = i === highlightIndex;
        return (
          <rect
            key={i}
            x={x}
            y={viewHeight - h}
            width={w}
            height={h}
            rx={2}
            fill={isHi ? "url(#barGradHi)" : "url(#barGrad)"}
            opacity={isHi ? 1 : 0.55}
          />
        );
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2be7a8" />
          <stop offset="100%" stopColor="#68a7ff" />
        </linearGradient>
        <linearGradient id="barGradHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ef0b8" />
          <stop offset="100%" stopColor="#7ab8ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AlignmentGauge({
  score,
  size = "lg",
}: {
  score: number;
  size?: "sm" | "lg";
}) {
  const r = size === "lg" ? 54 : 40;
  const stroke = size === "lg" ? 8 : 6;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const dim = size === "lg" ? 140 : 100;
  const cx = dim / 2;

  return (
    <div className="relative" style={{ width: dim, height: dim }}>
      <svg className="-rotate-90" width={dim} height={dim} aria-hidden>
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 8px rgba(43,231,168,0.4))" }}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2be7a8" />
            <stop offset="100%" stopColor="#68a7ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-bold tabular-nums text-[#2be7a8] ${size === "lg" ? "text-4xl" : "text-2xl"}`}
        >
          {score}
        </span>
        {size === "lg" && <span className="text-xs text-zinc-500">/ 100</span>}
      </div>
    </div>
  );
}

export function DayLabels({ labels, activeIndex }: { labels: string[]; activeIndex: number }) {
  return (
    <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
      {labels.map((l, i) => (
        <span key={l} className={i === activeIndex ? "font-semibold text-[#2be7a8]" : ""}>
          {l}
        </span>
      ))}
    </div>
  );
}
