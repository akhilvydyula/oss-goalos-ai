import Link from "next/link";
import Image from "next/image";
import { TAGLINE } from "@/lib/constants";
import { asset, MEDIA } from "@/lib/assets";
import { Monitor, Smartphone, ArrowRight, Code2 } from "lucide-react";
import { DemoReel } from "./DemoReel";
import { MediaGallery } from "./MediaGallery";

const demos = [
  {
    href: "/web",
    title: "Web demo",
    description:
      "Desktop-first layout with sidebar navigation, wide dashboards, and a full coach workspace.",
    icon: Monitor,
    accent: "text-[#2be7a8]",
    glow: "hover:shadow-[0_0_40px_rgba(43,231,168,0.12)]",
    badge: "Best on laptop",
    preview: MEDIA.webPreview,
  },
  {
    href: "/mobile",
    title: "Mobile demo",
    description:
      "Phone-frame preview matching the Android app — bottom tabs, compact UI, and touch-first flows.",
    icon: Smartphone,
    accent: "text-[#68a7ff]",
    glow: "hover:shadow-[0_0_40px_rgba(104,167,255,0.12)]",
    badge: "Best on phone",
    preview: MEDIA.mobilePreview,
  },
] as const;

export function DemoLanding() {
  return (
    <div className="goalos-page-bg flex min-h-dvh flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#2be7a8]/80">
          GoalOS AI
        </p>
        <h1 className="mt-4 text-center text-3xl font-bold text-zinc-50 sm:text-4xl">
          <span className="goalos-gradient-text">{TAGLINE}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-zinc-400 sm:text-base">
          Open-source productivity OS with AI coaching. Watch the walkthrough, browse screenshots, or
          jump into a live demo.
        </p>

        <div className="mt-10">
          <DemoReel />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {demos.map(({ href, title, description, icon: Icon, accent, glow, badge, preview }) => (
            <Link
              key={href}
              href={href}
              className={`goalos-card goalos-card-glow group flex flex-col overflow-hidden transition-all duration-200 ${glow}`}
            >
              <div className="relative aspect-[16/10] bg-[#04050a]">
                <Image
                  src={asset(preview)}
                  alt={`${title} preview`}
                  fill
                  className="object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06070d] via-transparent to-transparent" />
                <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-300 backdrop-blur-sm">
                  {badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] ${accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 group-hover:text-[#2be7a8]">
                  Open live demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <MediaGallery />

        <p className="mt-12 text-center text-xs text-zinc-600">
          Local-first · No API key · WebLLM runs in your browser
        </p>
        <a
          href="https://github.com/akhilvydyula/goalos-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-4 flex w-fit items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <Code2 className="h-3.5 w-3.5" />
          View source on GitHub
        </a>
      </div>
    </div>
  );
}
