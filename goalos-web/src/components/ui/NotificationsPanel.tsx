"use client";

import { Bell, X, Sparkles, Target, Flame, BarChart3 } from "lucide-react";
import type { AppNotification } from "@/lib/notifications";

const CATEGORY_STYLE: Record<
  AppNotification["category"],
  { icon: typeof Bell; color: string }
> = {
  coach: { icon: Sparkles, color: "text-[#68a7ff]" },
  goal: { icon: Target, color: "text-[#2be7a8]" },
  focus: { icon: Flame, color: "text-amber-400" },
  insight: { icon: BarChart3, color: "text-zinc-400" },
};

export function NotificationsPanel({
  open,
  notifications,
  readIds,
  onClose,
  onOpen,
  onMarkAllRead,
}: {
  open: boolean;
  notifications: AppNotification[];
  readIds: Set<string>;
  onClose: () => void;
  onOpen: (notification: AppNotification) => void;
  onMarkAllRead: () => void;
}) {
  if (!open) return null;

  const unread = notifications.filter((n) => !readIds.has(n.id)).length;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center bg-black/50 p-4 pt-16 backdrop-blur-sm sm:justify-end sm:pt-20 sm:pr-8"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="goalos-card w-full max-w-md overflow-hidden border-white/10 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-100">Notifications</h2>
            {unread > 0 && (
              <span className="rounded-full bg-[#2be7a8] px-2 py-0.5 text-[10px] font-bold text-[#06070d]">
                {unread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[11px] font-medium text-[#68a7ff] hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[min(60vh,420px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">
              You&apos;re all caught up — no nudges right now.
            </p>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {notifications.map((notification) => {
                const isRead = readIds.has(notification.id);
                const style = CATEGORY_STYLE[notification.category];
                const Icon = style.icon;
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(notification)}
                      className={`flex w-full gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.03] ${
                        isRead ? "opacity-60" : "bg-[#2be7a8]/[0.03]"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ${style.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-zinc-100">
                            {notification.title}
                          </p>
                          {!isRead && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2be7a8]" />
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                          {notification.body}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="border-t border-white/[0.06] px-4 py-2 text-[10px] text-zinc-600">
          Nudges from your coach, score, and usage — tap to act
        </p>
      </div>
    </div>
  );
}

export function NotificationBellButton({
  unread,
  onClick,
  compact,
}: {
  unread: number;
  onClick?: () => void;
  compact?: boolean;
}) {
  const size = compact ? "h-9 w-9" : "h-10 w-10";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex ${size} items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:text-zinc-200`}
      aria-label={unread > 0 ? `${unread} unread notifications` : "Notifications"}
    >
      <Bell className="h-4 w-4" />
      {unread > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2be7a8] px-1 text-[9px] font-bold text-[#06070d]">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}
