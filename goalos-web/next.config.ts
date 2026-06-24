import type { NextConfig } from "next";
import { getGithubPagesBasePath } from "./scripts/github-pages-base.mjs";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? getGithubPagesBasePath() : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: isGithubPages ? basePath : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

export default nextConfig;
