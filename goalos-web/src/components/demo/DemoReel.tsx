"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { asset, MEDIA } from "@/lib/assets";

const FRAMES = [
  { src: MEDIA.webPreview, label: "Web dashboard" },
  { src: MEDIA.coachPreview, label: "AI Coach chat" },
  { src: MEDIA.mobilePreview, label: "Mobile Today view" },
  { src: MEDIA.androidPreview, label: "Android companion" },
] as const;

const INTERVAL_MS = 3500;

export function DemoReel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % FRAMES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  const frame = FRAMES[index];

  return (
    <div className="goalos-card goalos-card-glow overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#68a7ff]/80">
            Product walkthrough
          </p>
          <p className="text-sm font-medium text-zinc-200">{frame.label}</p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300 transition hover:bg-white/10"
          aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>

      <div className="relative aspect-video w-full bg-[#04050a]">
        {FRAMES.map((f, i) => (
          <Image
            key={f.src}
            src={asset(f.src)}
            alt={f.label}
            fill
            priority={i === 0}
            className={`object-cover object-top transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, 896px"
          />
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#06070d] to-transparent" />
      </div>

      <div className="flex justify-center gap-1.5 px-4 py-3">
        {FRAMES.map((f, i) => (
          <button
            key={f.src}
            type="button"
            onClick={() => {
              setIndex(i);
              setPlaying(false);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-[#2be7a8]" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Show ${f.label}`}
          />
        ))}
      </div>
    </div>
  );
}
