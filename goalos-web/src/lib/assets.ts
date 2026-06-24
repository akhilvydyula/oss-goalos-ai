/** Public asset path — respects GitHub Pages basePath at build time. */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const MEDIA = {
  webPreview: "/media/web-preview.png",
  mobilePreview: "/media/mobile-preview.png",
  coachPreview: "/media/coach-preview.png",
  androidPreview: "/media/android-preview.png",
} as const;
