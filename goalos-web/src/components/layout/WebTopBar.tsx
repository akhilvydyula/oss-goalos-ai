import { Search, Sparkles } from "lucide-react";
import { dashboardGreeting } from "@/components/dashboard/PreviewDashboard";
import { NotificationBellButton } from "@/components/ui/NotificationsPanel";

export function WebSearchActions({
  onOpenSearch,
  onOpenCoach,
  onOpenNotifications,
  unreadNotifications = 0,
}: {
  onOpenSearch?: () => void;
  onOpenCoach?: () => void;
  onOpenNotifications?: () => void;
  unreadNotifications?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:border-white/15 hover:bg-white/[0.06]"
        aria-label="Search GoalOS"
      >
        <Search className="h-4 w-4 shrink-0 text-zinc-500" />
        <span className="hidden w-28 text-sm text-zinc-600 sm:inline lg:w-36">Search…</span>
        <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-600 lg:inline">
          Ctrl K
        </kbd>
      </button>
      <NotificationBellButton unread={unreadNotifications} onClick={onOpenNotifications} />
      <button
        type="button"
        onClick={onOpenCoach}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#68a7ff]/20 bg-[#68a7ff]/10 text-[#68a7ff] transition hover:bg-[#68a7ff]/20"
        aria-label="Open AI Coach"
      >
        <Sparkles className="h-4 w-4" />
      </button>
    </div>
  );
}

export function WebTopBar({
  displayName,
  onOpenSearch,
  onOpenCoach,
  onOpenNotifications,
  unreadNotifications,
}: {
  displayName?: string;
  onOpenSearch?: () => void;
  onOpenCoach?: () => void;
  onOpenNotifications?: () => void;
  unreadNotifications?: number;
}) {
  const name = displayName?.trim() || "there";

  return (
    <header className="mb-6 flex shrink-0 flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">{dashboardGreeting(name)}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here&apos;s your performance overview and insights for today.
        </p>
      </div>
      <WebSearchActions
        onOpenSearch={onOpenSearch}
        onOpenCoach={onOpenCoach}
        onOpenNotifications={onOpenNotifications}
        unreadNotifications={unreadNotifications}
      />
    </header>
  );
}

export function WebPageHeader({
  title,
  onOpenSearch,
  onOpenCoach,
  onOpenNotifications,
  unreadNotifications,
}: {
  title: string;
  onOpenSearch?: () => void;
  onOpenCoach?: () => void;
  onOpenNotifications?: () => void;
  unreadNotifications?: number;
}) {
  return (
    <header className="mb-4 flex shrink-0 items-center justify-between gap-4">
      <h1 className="text-xl font-semibold text-zinc-50">{title}</h1>
      <WebSearchActions
        onOpenSearch={onOpenSearch}
        onOpenCoach={onOpenCoach}
        onOpenNotifications={onOpenNotifications}
        unreadNotifications={unreadNotifications}
      />
    </header>
  );
}
