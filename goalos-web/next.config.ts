import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? "/goalos-ai" : "",
  assetPrefix: isGithubPages ? "/goalos-ai" : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/goalos-ai" : "",
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

export default nextConfig;
