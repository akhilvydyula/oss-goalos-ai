import { writeFileSync } from "node:fs";
import { getGithubPagesBasePath } from "./github-pages-base.mjs";

const base = getGithubPagesBasePath();

writeFileSync(
  "public/manifest.json",
  JSON.stringify(
    {
      name: "GoalOS AI",
      short_name: "GoalOS",
      description: "Turn screen time into goal time — AI productivity personality OS",
      start_url: `${base || ""}/web/`,
      display: "standalone",
      background_color: "#07080f",
      theme_color: "#07080f",
      orientation: "portrait",
      icons: [
        {
          src: `${base || ""}/icon.svg`,
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
      ],
    },
    null,
    2
  ) + "\n"
);
