"use client";

import { DemoSwitcher } from "./WebShell";
import { AmbientScene3D } from "@/components/three/lazy";

export function MobileDemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="goalos-page-bg goalos-app-viewport relative flex items-center justify-center">
      <AmbientScene3D className="opacity-40" />
      <div className="goalos-phone-frame relative z-10 w-full max-w-[430px]">
        {children}
      </div>
      <div className="absolute right-4 top-4 z-30 lg:hidden">
        <DemoSwitcher active="mobile" />
      </div>
    </div>
  );
}

/** @deprecated Use MobileDemoShell */
export const AppShell = MobileDemoShell;
