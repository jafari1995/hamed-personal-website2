/** Language + text direction helpers for the Astro site template. */

export type TextDirection = "ltr" | "rtl" | "auto";

const RTL_LANGS = new Set([
  "persian",
  "farsi",
  "fa",
  "فارسی",
  "پارسی",
  "arabic",
  "ar",
  "العربية",
  "hebrew",
  "he",
  "urdu",
  "ur",
]);

export function normalizeLanguage(language: string | undefined | null): string {
  return (language || "en").trim() || "en";
}

/** BCP 47-ish lang for <html lang=""> */
export function htmlLang(language: string | undefined | null): string {
  const key = normalizeLanguage(language).toLowerCase();
  const map: Record<string, string> = {
    persian: "fa",
    farsi: "fa",
    fa: "fa",
    فارسی: "fa",
    پارسی: "fa",
    english: "en",
    en: "en",
    arabic: "ar",
    ar: "ar",
    hebrew: "he",
    he: "he",
    urdu: "ur",
    ur: "ur",
    spanish: "es",
    es: "es",
    french: "fr",
    fr: "fr",
    german: "de",
    de: "de",
    turkish: "tr",
    tr: "tr",
  };
  if (map[key]) return map[key];
  if (/^[a-z]{2}(-[a-z0-9]+)?$/i.test(key)) return key.toLowerCase();
  return key.slice(0, 2).toLowerCase() || "en";
}

export function inferDirection(language: string | undefined | null): "ltr" | "rtl" {
  const key = normalizeLanguage(language).toLowerCase();
  if (RTL_LANGS.has(key)) return "rtl";
  // Also catch "persian (fa)" style values
  for (const rtl of RTL_LANGS) {
    if (key.includes(rtl)) return "rtl";
  }
  return "ltr";
}

export function resolveDirection(
  direction: TextDirection | string | undefined | null,
  language: string | undefined | null,
): "ltr" | "rtl" {
  const d = (direction || "auto").toString().trim().toLowerCase();
  if (d === "rtl" || d === "ltr") return d;
  return inferDirection(language);
}
