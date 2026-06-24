import type { TabId } from "@/lib/types";
import { Calendar, Target, Sparkles, BarChart3, User } from "lucide-react";

const tabs: { id: TabId; label: string; icon: typeof Calendar }[] = [
  { id: "today", label: "Today", icon: Calendar },
  { id: "goal", label: "Goal", icon: Target },
  { id: "coach", label: "Coach", icon: Sparkles },
  { id: "insights", label: "Insights", icon: BarChart3 },
  { id: "you", label: "You", icon: User },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <nav className="goalos-nav-glass relative z-20 shrink-0">
      <div className="flex items-end justify-around px-1 pb-1 pt-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          const isCoach = id === "coach";

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`relative flex flex-col items-center gap-0.5 rounded-2xl px-2.5 py-2 transition-all ${
                isCoach && !isActive ? "-mt-1" : ""
              } ${
                isActive
                  ? isCoach
                    ? "text-[#06070d]"
                    : "text-[#2be7a8]"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              }`}
            >
              {isCoach ? (
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-[#2be7a8] to-[#68a7ff] shadow-lg shadow-[#2be7a8]/20"
                      : "bg-white/[0.06] ring-1 ring-white/10"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
                </span>
              ) : (
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
              )}
              <span className={`text-[10px] font-medium ${isCoach && isActive ? "text-[#2be7a8]" : ""}`}>
                {label}
              </span>
              {isActive && !isCoach && (
                <span className="absolute -bottom-0.5 h-0.5 w-5 rounded-full bg-[#2be7a8]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
