"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AlignmentGauge } from "@/components/ui/MiniCharts";

export const AmbientScene3D = dynamic(
  () => import("./AmbientScene3D").then((m) => m.AmbientScene3D),
  { ssr: false }
);

const ScoreRing3D = dynamic(
  () => import("./ScoreRing3D").then((m) => m.ScoreRing3D),
  { ssr: false }
);

function usePrefer3D(): boolean {
  const [prefer3d, setPrefer3d] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefer3d(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return prefer3d;
}

export function AlignmentGauge3D({
  score,
  size = "lg",
  className,
}: {
  score: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  const prefer3d = usePrefer3D();
  const dim = size === "lg" ? 160 : 120;

  if (!prefer3d) {
    return <AlignmentGauge score={score} size={size} />;
  }

  return (
    <div className={`relative ${className ?? ""}`} style={{ width: dim, height: dim }}>
      <ScoreRing3D score={score} size={size} className="absolute inset-0" />
      <div className="sr-only">Goal alignment score {score} out of 100</div>
    </div>
  );
}
