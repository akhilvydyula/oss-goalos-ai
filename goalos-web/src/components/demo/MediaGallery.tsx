import Image from "next/image";
import { asset, MEDIA } from "@/lib/assets";

const shots = [
  {
    src: MEDIA.webPreview,
    title: "Web dashboard",
    caption: "Sidebar nav, alignment score, and AI next-action cards.",
  },
  {
    src: MEDIA.coachPreview,
    title: "AI Coach",
    caption: "Browser AI or smart coach — private, no API key.",
  },
  {
    src: MEDIA.mobilePreview,
    title: "Mobile demo",
    caption: "Phone-first UI with bottom tabs and focus tools.",
  },
  {
    src: MEDIA.androidPreview,
    title: "Android app",
    caption: "Native companion with real UsageStats tracking.",
  },
] as const;

export function MediaGallery() {
  return (
    <section className="mt-14">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
        Screenshots
      </p>
      <h2 className="mt-2 text-center text-xl font-semibold text-zinc-100 sm:text-2xl">
        See GoalOS in action
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {shots.map(({ src, title, caption }) => (
          <figure
            key={src}
            className="goalos-card group overflow-hidden transition hover:ring-1 hover:ring-[#2be7a8]/20"
          >
            <div className="relative aspect-[16/10] bg-[#04050a]">
              <Image
                src={asset(src)}
                alt={title}
                fill
                className="object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, 400px"
              />
            </div>
            <figcaption className="border-t border-white/5 px-4 py-3">
              <p className="text-sm font-medium text-zinc-200">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
