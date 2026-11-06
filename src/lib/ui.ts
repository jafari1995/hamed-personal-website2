/** Chrome UI strings — English by default, Persian when lang is fa. */

import { htmlLang } from "./locale";

type UiKey =
  | "skip"
  | "menu"
  | "topics"
  | "subtopics"
  | "home"
  | "browseTopics"
  | "moreGuides"
  | "related"
  | "breadcrumb"
  | "learnMore"
  | "latestGuide"
  | "browse"
  | "whySite"
  | "startHere"
  | "latestArticles"
  | "inThisTopic"
  | "allGuides"
  | "seeAll"
  | "moreInTopic"
  | "noArticlesTopic"
  | "noArticlesHere"
  | "guidesAppear"
  | "moreComing"
  | "topic"
  | "readGuide"
  | "minRead"
  | "continueIn"
  | "backToTop"
  | "educational";

const EN: Record<UiKey, string> = {
  skip: "Skip to content",
  menu: "Menu",
  topics: "Topics",
  subtopics: "Subtopics",
  home: "Home",
  browseTopics: "Browse by topic",
  moreGuides: "More guides",
  related: "Related guides",
  breadcrumb: "Breadcrumb",
  learnMore: "Learn more",
  latestGuide: "Read latest guide",
  browse: "Browse",
  whySite: "Why this site exists",
  startHere: "Start here",
  latestArticles: "Latest articles",
  inThisTopic: "In this topic",
  allGuides: "All guides",
  seeAll: "See all",
  moreInTopic: "More in this topic",
  noArticlesTopic: "No articles in this topic yet.",
  noArticlesHere: "No articles here yet.",
  guidesAppear: "Guides will appear here as they are published.",
  moreComing: "More articles will show up here as you publish.",
  topic: "Topic",
  readGuide: "Read the guide",
  minRead: "min read",
  continueIn: "Continue in this topic",
  backToTop: "Back to top",
  educational: "Educational content — not medical advice.",
};

const FA: Record<UiKey, string> = {
  skip: "پرش به محتوا",
  menu: "منو",
  topics: "موضوعات",
  subtopics: "زیرموضوعات",
  home: "خانه",
  browseTopics: "مرور بر اساس موضوع",
  moreGuides: "راهنماهای بیشتر",
  related: "راهنماهای مرتبط",
  breadcrumb: "مسیر صفحه",
  learnMore: "بیشتر بدانید",
  latestGuide: "خواندن آخرین راهنما",
  browse: "مرور",
  whySite: "چرا این سایت",
  startHere: "از اینجا شروع کنید",
  latestArticles: "آخرین مقالات",
  inThisTopic: "در این موضوع",
  allGuides: "همه راهنماها",
  seeAll: "مشاهده همه",
  moreInTopic: "بقیه این موضوع",
  noArticlesTopic: "هنوز مقاله‌ای در این موضوع نیست.",
  noArticlesHere: "هنوز مقاله‌ای اینجا نیست.",
  guidesAppear: "راهنماها پس از انتشار اینجا نمایش داده می‌شوند.",
  moreComing: "با انتشار مقالات بیشتر، اینجا تکمیل می‌شود.",
  topic: "موضوع",
  readGuide: "خواندن راهنما",
  minRead: "دقیقه مطالعه",
  continueIn: "ادامه در این موضوع",
  backToTop: "بازگشت به بالا",
  educational: "محتوای آموزشی — مشاوره پزشکی نیست.",
};

export function ui(language: string | undefined | null): Record<UiKey, string> {
  return htmlLang(language) === "fa" ? FA : EN;
}

const REGION_EN = {
  header: "Announcements",
  footer: "Footer promotions",
  article_bottom: "Article promotions",
  article_middle: "In-article promotions",
  page_middle: "Page promotions",
} as const;

const REGION_FA = {
  header: "اطلاعیه‌ها",
  footer: "پیشنهادهای پاورقی",
  article_bottom: "پیشنهادهای مقاله",
  article_middle: "پیشنهاد میانی مقاله",
  page_middle: "پیشنهادهای صفحه",
} as const;

export function regionLabel(language: string | undefined | null, area: string | undefined | null): string {
  const table = htmlLang(language) === "fa" ? REGION_FA : REGION_EN;
  if (
    area === "footer" ||
    area === "article_bottom" ||
    area === "article_middle" ||
    area === "page_middle"
  ) {
    return table[area];
  }
  return table.header;
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Western digits in English; Persian digits when lang is fa. */
export function formatCount(language: string | undefined | null, value: number): string {
  const raw = String(value);
  if (htmlLang(language) !== "fa") return raw;
  return raw.replace(/\d/g, (digit) => FA_DIGITS[Number(digit)] ?? digit);
}

export function guideCountLabel(language: string | undefined | null, count: number): string {
  const n = formatCount(language, count);
  if (htmlLang(language) === "fa") return `${n} راهنما`;
  return count === 1 ? `${n} guide` : `${n} guides`;
}
