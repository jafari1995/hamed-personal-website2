import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    seo_title: z.string().optional(),
    description: z.string().optional(),
    date: z.union([z.string(), z.date()]).optional(),
    keywords: z.array(z.string()).optional(),
    primary_keyword: z.string().optional(),
    language: z.string().optional(),
    topic: z.string().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    primary_search_intent: z.string().optional(),
    status: z.string().optional(),
    content_id: z.string().optional(),
    theme: z.string().optional(),
    /** Public path or URL for an optional hero image. Omitted articles stay text-only. */
    image: z.string().optional(),
    image_alt: z.string().optional(),
  }),
});

export const collections = { articles };
