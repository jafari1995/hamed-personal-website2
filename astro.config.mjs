import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "node:url";
import { site } from "./src/site.config.ts";

const siteUrl = (site.url || "").replace(/\/$/, "") || undefined;
// @astrojs/sitemap can crash on local/dev origins; only enable for public hosts.
const publicSite =
  siteUrl &&
  /^https:\/\//i.test(siteUrl) &&
  !/localhost|127\.0\.0\.1/i.test(siteUrl)
    ? siteUrl
    : undefined;

// Static site for Vercel. Articles are published into ./content (repo root).
export default defineConfig({
  site: publicSite || siteUrl,
  output: "static",
  integrations: publicSite ? [sitemap()] : [],
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },
  vite: {
    resolve: {
      alias: {
        // Let Astro content collections resolve repo-root `content/` as the articles source.
        "@content": fileURLToPath(new URL("./content", import.meta.url)),
      },
    },
  },
});
