import type { TabId } from "@/lib/types";
import { Home, Target, Zap, BarChart3, Plus } from "lucide-react";

const left: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "today", label: "Home", icon: Home },
  { id: "goal", label: "Goals", icon: Target },
];

const right: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "coach", label: "Coach", icon: Zap },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

export function BottomNav({
  active,
  onChange,
  onFab,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
  onFab: () => void;
}) {
  return (
    <nav className="goalos-nav-glass relative z-20 shrink-0 px-4 pb-2 pt-1">
      <div className="flex items-end justify-between">
        <div className="flex flex-1 justify-around">
          {left.map(({ id, label, icon: Icon }) => (
            <NavBtn key={id} id={id} label={label} icon={Icon} active={active} onChange={onChange} />
          ))}
        </div>

        <button
          type="button"
          onClick={onFab}
          className="-mt-7 mx-2 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#68a7ff] to-[#4d7fff] shadow-lg shadow-[#68a7ff]/35"
          aria-label="Start focus sprint"
        >
          <Plus className="h-7 w-7 text-white" strokeWidth={2.5} />
        </button>

        <div className="flex flex-1 justify-around">
          {right.map(({ id, label, icon: Icon }) => (
            <NavBtn key={id} id={id} label={label} icon={Icon} active={active} onChange={onChange} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavBtn({
  id,
  label,
  icon: Icon,
  active,
  onChange,
}: {
  id: TabId;
  label: string;
  icon: typeof Home;
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  const isActive = active === id;
  return (
    <button
      type="button"
      onClick={() => onChange(id)}
      className={`flex flex-col items-center gap-0.5 px-2 py-2 transition-colors ${
        isActive ? "text-[#2be7a8]" : "text-zinc-500"
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
