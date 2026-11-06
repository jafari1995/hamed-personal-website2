import { experimental_AstroContainer as AstroContainer } from "astro/container";

type ArticleContent = Parameters<
  Awaited<ReturnType<typeof AstroContainer.create>>["renderToString"]
>[0];

let container: Awaited<ReturnType<typeof AstroContainer.create>> | undefined;

/**
 * HTML for a content-collection entry.
 * Astro 4 entries expose render(), not compiledContent(). The container renders
 * the same Content component, so syntax highlighting and Markdown plugins match.
 */
export async function renderArticleHtml(Content: ArticleContent): Promise<string> {
  container ??= await AstroContainer.create();
  const html = (await container.renderToString(Content)).trim();
  return html.replace(/^<!doctype html>/i, "").trim();
}

/** Cut rendered Markdown HTML after the Nth paragraph so a banner can sit in the flow. */

export function splitAfterParagraph(
  html: string,
  paragraph = 3,
): { before: string; after: string } | null {
  if (paragraph < 1) return null;
  const re = /<\/p>/gi;
  let count = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    count += 1;
    if (count === paragraph) {
      const cut = match.index + match[0].length;
      const after = html.slice(cut).trim();
      if (!after) return null;
      return { before: html.slice(0, cut), after };
    }
  }
  return null;
}
