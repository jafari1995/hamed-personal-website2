import type { APIRoute } from "astro";
import { site } from "../site.config";

export const GET: APIRoute = () => {
  const lines = ["User-agent: *", "Allow: /"];
  const origin = (site.url || "").replace(/\/$/, "");
  if (origin) {
    lines.push("", `Sitemap: ${origin}/sitemap-index.xml`);
  }
  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
