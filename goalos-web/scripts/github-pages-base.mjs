/** GitHub Pages subpath — must match the repository name (e.g. /oss-goalos-ai). */
export function getGithubPagesBasePath() {
  if (process.env.GITHUB_PAGES !== "true") return "";

  const explicit = process.env.GITHUB_PAGES_BASE_PATH?.trim();
  if (explicit) {
    return explicit.startsWith("/") ? explicit : `/${explicit}`;
  }

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (repo) return `/${repo}`;

  return "/oss-goalos-ai";
}
