import { getCollection, type CollectionEntry } from "astro:content";
import { site } from "../site.config";
import { htmlLang } from "./locale";
import taxonomy from "../data/taxonomy.json";

export type Post = CollectionEntry<"articles">;

export type CategoryBucket = {
  id: string;
  label: string;
  description: string;
  count: number;
  subcategories: { id: string; label: string; description: string; count: number }[];
};

type TaxonomyFile = {
  categories?: {
    id: string;
    name: string;
    description?: string;
    subcategories?: { id: string; name: string; description?: string }[];
  }[];
};

function clean(value: string | undefined | null): string {
  return (value || "").trim().replace(/^"|"$/g, "");
}

/** Turn `meal-planning` into `Meal planning` for UI fallback. */
export function labelize(id: string): string {
  const raw = clean(id);
  if (!raw) return "";
  return raw
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function taxonomyIndex(): {
  categories: Map<string, string>;
  subcategories: Map<string, string>;
} {
  const categories = new Map<string, string>();
  const subcategories = new Map<string, string>();
  const file = taxonomy as TaxonomyFile;
  for (const cat of file.categories || []) {
    if (!cat?.id) continue;
    categories.set(cat.id, cat.name || labelize(cat.id));
    for (const sub of cat.subcategories || []) {
      if (!sub?.id) continue;
      subcategories.set(`${cat.id}/${sub.id}`, sub.name || labelize(sub.id));
    }
  }
  return { categories, subcategories };
}

export function categoryLabel(categoryId: string): string {
  const id = clean(categoryId);
  if (!id) return "";
  return taxonomyIndex().categories.get(id) || labelize(id);
}

export function subcategoryLabel(categoryId: string, subcategoryId: string): string {
  const cat = clean(categoryId);
  const sub = clean(subcategoryId);
  if (!sub) return "";
  if (cat) {
    const named = taxonomyIndex().subcategories.get(`${cat}/${sub}`);
    if (named) return named;
  }
  return labelize(sub);
}

export function postCategory(post: Post): string {
  return clean(post.data.category);
}

export function postSubcategory(post: Post): string {
  return clean(post.data.subcategory);
}

export function postHref(post: Post): string {
  return `/${post.slug}/`;
}

export function categoryHref(category: string, subcategory?: string): string {
  const base = `/category/${encodeURIComponent(category)}/`;
  if (!subcategory) return base;
  return `${base}${encodeURIComponent(subcategory)}/`;
}

export type DateCalendar = "auto" | "jalali" | "gregorian";

function resolveCalendar(language?: string | null, calendar?: DateCalendar | string | null): "jalali" | "gregorian" {
  const cal = ((calendar || site.dateCalendar || "auto") as string).toLowerCase();
  if (cal === "jalali" || cal === "persian" || cal === "shamsi") return "jalali";
  if (cal === "gregorian" || cal === "gregory" || cal === "miladi") return "gregorian";
  // auto
  const lang = htmlLang(language || site.language);
  return lang === "fa" || lang === "ar" ? "jalali" : "gregorian";
}

export function formatDate(
  value: string | Date | undefined,
  language?: string | null,
  calendar?: DateCalendar | string | null,
): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  const lang = htmlLang(language || site.language);
  const mode = resolveCalendar(lang, calendar);
  if (mode === "jalali") {
    const locale = lang === "ar" ? "ar-u-ca-persian" : "fa-IR-u-ca-persian";
    return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  }
  const locale = lang === "fa" ? "fa-IR-u-ca-gregory" : lang === "ar" ? "ar-u-ca-gregory" : "en-US";
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

/** Rough reading time from body markdown/plaintext. */
export function readingMinutes(post: Post): number {
  const body = typeof post.body === "string" ? post.body : "";
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("articles");
  return posts.sort((a, b) => {
    const da = String(a.data.date || "");
    const db = String(b.data.date || "");
    return db.localeCompare(da);
  });
}

export async function getCategories(): Promise<CategoryBucket[]> {
  const posts = await getPosts();
  const tax = taxonomyIndex();
  const map = new Map<string, CategoryBucket>();

  // Prefer configured taxonomy order/names even before posts exist.
  for (const cat of (taxonomy as TaxonomyFile).categories || []) {
    if (!cat?.id) continue;
    map.set(cat.id, {
      id: cat.id,
      label: cat.name || labelize(cat.id),
      description: (cat.description || "").trim(),
      count: 0,
      subcategories: (cat.subcategories || []).map((sub) => ({
        id: sub.id,
        label: sub.name || labelize(sub.id),
        description: (sub.description || "").trim(),
        count: 0,
      })),
    });
  }

  for (const post of posts) {
    const cat = postCategory(post);
    if (!cat) continue;
    let bucket = map.get(cat);
    if (!bucket) {
      bucket = {
        id: cat,
        label: tax.categories.get(cat) || labelize(cat),
        description: "",
        count: 0,
        subcategories: [],
      };
      map.set(cat, bucket);
    }
    bucket.count += 1;
    const sub = postSubcategory(post);
    if (sub) {
      const existing = bucket.subcategories.find((s) => s.id === sub);
      if (existing) existing.count += 1;
      else {
        bucket.subcategories.push({
          id: sub,
          label: tax.subcategories.get(`${cat}/${sub}`) || labelize(sub),
          description: "",
          count: 1,
        });
      }
    }
  }

  // Keep YAML order when present; append unknown cats after.
  const orderedIds = ((taxonomy as TaxonomyFile).categories || []).map((c) => c.id);
  const known = orderedIds.map((id) => map.get(id)).filter(Boolean) as CategoryBucket[];
  const rest = [...map.values()]
    .filter((c) => !orderedIds.includes(c.id))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [...known, ...rest];
}

export async function getPostsByCategory(category: string, subcategory?: string): Promise<Post[]> {
  const posts = await getPosts();
  const cat = category.trim();
  const sub = (subcategory || "").trim();
  return posts.filter((post) => {
    if (postCategory(post) !== cat) return false;
    if (sub && postSubcategory(post) !== sub) return false;
    return true;
  });
}

export async function relatedPosts(post: Post, limit = 4): Promise<Post[]> {
  const cat = postCategory(post);
  const sub = postSubcategory(post);
  const all = await getPosts();
  const others = all.filter((p) => p.slug !== post.slug);

  const sameSub = others.filter((p) => cat && postCategory(p) === cat && postSubcategory(p) === sub);
  const sameCat = others.filter(
    (p) => cat && postCategory(p) === cat && !sameSub.some((s) => s.slug === p.slug),
  );
  const rest = others.filter(
    (p) => !sameSub.some((s) => s.slug === p.slug) && !sameCat.some((s) => s.slug === p.slug),
  );

  return [...sameSub, ...sameCat, ...rest].slice(0, limit);
}
