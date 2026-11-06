/** SEO helpers: absolute URLs, Open Graph locale, JSON-LD payloads. */

import { htmlLang } from "./locale";
import { site } from "../site.config";

export function siteOrigin(): string {
  return (site.url || "").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const value = (path || "").trim();
  if (/^https?:\/\//i.test(value)) return value;
  const origin = siteOrigin();
  const p = value.startsWith("/") ? value : `/${value}`;
  if (!origin) return p;
  return `${origin}${p}`;
}

/** Absolute URL for an article or banner image, or "" when unset. */
export function mediaUrl(src: string | undefined | null): string {
  const value = (src || "").trim();
  if (!value) return "";
  return absoluteUrl(value);
}

export function ogLocale(language: string | undefined | null): string {
  const lang = htmlLang(language);
  const map: Record<string, string> = {
    fa: "fa_IR",
    ar: "ar_AR",
    he: "he_IL",
    ur: "ur_PK",
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
    de: "de_DE",
    tr: "tr_TR",
  };
  return map[lang] || `${lang}_${lang.toUpperCase()}`;
}

export type Crumb = { name: string; path: string };

export function websiteJsonLd() {
  const origin = siteOrigin();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    description: site.tagline,
    inLanguage: htmlLang(site.language),
  };
  if (origin) data.url = origin + "/";
  return data;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

function asGraph(...nodes: Record<string, unknown>[]) {
  const cleaned = nodes.map(({ ["@context"]: _c, ...rest }) => rest);
  return {
    "@context": "https://schema.org",
    "@graph": cleaned,
  };
}

export function collectionJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  crumbs: Crumb[];
}) {
  const page: Record<string, unknown> = {
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    inLanguage: htmlLang(site.language),
    isPartOf: { "@type": "WebSite", name: site.name },
  };
  if (siteOrigin()) page.url = absoluteUrl(opts.path);
  const crumbs = breadcrumbJsonLd(opts.crumbs) as Record<string, unknown>;
  return asGraph(page, crumbs);
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  date?: string | Date;
  language?: string;
  image?: string;
  crumbs: Crumb[];
}) {
  const article: Record<string, unknown> = {
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    inLanguage: htmlLang(opts.language || site.language),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };
  const image = mediaUrl(opts.image);
  if (image) article.image = image;
  if (siteOrigin()) article.mainEntityOfPage = absoluteUrl(opts.path);
  if (opts.date) {
    const iso =
      typeof opts.date === "string" ? opts.date.slice(0, 10) : opts.date.toISOString().slice(0, 10);
    article.datePublished = iso;
  }
  const crumbs = breadcrumbJsonLd(opts.crumbs) as Record<string, unknown>;
  return asGraph(article, crumbs);
}
