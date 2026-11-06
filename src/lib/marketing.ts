import headers from "../data/marketing.json";

export type MarketingBannerItem = {
  id?: string;
  text?: string;
  link_url?: string;
  link_label?: string;
  style?: string;
  image_url?: string;
  area?: string;
  category?: string;
  subcategory?: string;
};

/** Banners for one area, matching the same category rules as the live component. */
export function bannersFor(
  area: string,
  activeCategory = "",
  activeSubcategory = "",
): MarketingBannerItem[] {
  return (headers as MarketingBannerItem[]).filter((item) => {
    // No configured promo → render nothing (empty / whitespace text).
    if (!(item?.text || "").trim()) return false;
    const itemArea = (item.area || "header").trim() || "header";
    if (itemArea !== area) return false;
    const cat = (item.category || "").trim();
    const sub = (item.subcategory || "").trim();
    if (!cat) return true;
    if (cat !== activeCategory) return false;
    if (!sub) return true;
    return sub === activeSubcategory;
  });
}
