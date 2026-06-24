import type { TabId } from "@/lib/types";
import { Crown } from "lucide-react";

export function MobileTopBar({
  displayName,
  onProfile,
}: {
  displayName?: string;
  onProfile?: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between px-4 pb-2 pt-3">
      <h1 className="text-lg font-bold tracking-tight text-zinc-50">GoalOS AI</h1>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-300">
          <Crown className="h-3 w-3" />
          Premium
        </span>
        <button
          type="button"
          onClick={onProfile}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2be7a8]/40 to-[#68a7ff]/40 text-sm font-bold text-white ring-2 ring-white/10"
        >
          {(displayName ?? "A")[0]}
        </button>
      </div>
    </header>
  );
}

const tabs: { id: TabId; label: string }[] = [
  { id: "today", label: "Dashboard" },
  { id: "goal", label: "Goals" },
  { id: "coach", label: "Focus" },
  { id: "insights", label: "Insights" },
];

export function MobileTabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <div className="flex shrink-0 gap-1 border-b border-white/[0.06] px-4">
      {tabs.map(({ id, label }) => {
        const isActive =
          active === id || (id === "today" && active === "you");
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "text-[#2be7a8]" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {label}
            {isActive && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#2be7a8]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
