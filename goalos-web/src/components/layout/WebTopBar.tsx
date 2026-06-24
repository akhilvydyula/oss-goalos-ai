import { Bell, Search, Sparkles } from "lucide-react";
import { dashboardGreeting } from "@/components/dashboard/PreviewDashboard";

export function WebTopBar({ displayName }: { displayName?: string }) {
  const name = displayName?.trim() || "there";

  return (
    <header className="mb-6 flex shrink-0 flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">{dashboardGreeting(name)}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here&apos;s your performance overview and insights for today.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-36 bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600 sm:w-48"
          />
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:text-zinc-200"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#68a7ff]/20 bg-[#68a7ff]/10 text-[#68a7ff]"
          aria-label="AI"
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
