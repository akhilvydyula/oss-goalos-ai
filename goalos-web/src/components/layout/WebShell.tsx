"use client";

import Link from "next/link";
import { Monitor, Smartphone } from "lucide-react";

export function WebShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="goalos-page-bg goalos-app-viewport">
      <div className="absolute right-4 top-4 z-30 hidden lg:block">
        <DemoSwitcher active="web" />
      </div>
      <div className="flex h-full min-h-0">{children}</div>
    </div>
  );
}

export function DemoSwitcher({ active }: { active: "web" | "mobile" }) {
  return (
    <div className="goalos-card flex shrink-0 gap-1 p-1">
      <Link
        href="/web"
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
          active === "web"
            ? "bg-[#2be7a8]/15 text-[#2be7a8]"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <Monitor className="h-3.5 w-3.5" />
        Web
      </Link>
      <Link
        href="/mobile"
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
          active === "mobile"
            ? "bg-[#68a7ff]/15 text-[#68a7ff]"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <Smartphone className="h-3.5 w-3.5" />
        Mobile
      </Link>
    </div>
  );
}
