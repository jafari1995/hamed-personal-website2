# Content Engine blog

Simple Astro Markdown blog scaffolded by `content-engine`.

## Features

- Home: latest posts + browse by **category / subcategory**
- Category pages: `/category/<category>/`
- Subcategory pages: `/category/<category>/<subcategory>/`
- Article pages with breadcrumb chips back to taxonomy
- Theme via `src/styles/theme.css` (chosen at init)

Categories come from article frontmatter (`category`, `subcategory`) written by the publisher into `content/`.

## Local

```bash
npm install
npm run dev
```

## Deploy

Push to GitHub, import in Vercel (Astro). Commit published Markdown yourself — content-engine does not auto-push.
