# TAROS — Public Website

Public website for **TAROS**, the Trusted Autonomous Runtime Oversight System by jamberi. TAROS monitors autonomous systems and AI/SI (Artificial Intelligence or Super Intelligence) agents while they run. The site explains that value at a high level (runtime monitoring, policy control, and a recorded reason for every decision) without exposing implementation details.

## What this site is

- **Static site built with [Astro](https://astro.build)**: pages are plain HTML and CSS with minimal JavaScript. Astro adds a shared layout (header, nav, footer) and turns Markdown files into blog posts and case studies. The output is static HTML; no JavaScript framework ships to visitors.
- **Hosted on GitHub Pages**: a GitHub Actions workflow builds and publishes the site on every push to `main`.
- **Pages**: Home, Platform, Blog, Case studies (appears in the nav once one is published), About, Contact.

## Preview locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server reloads as you edit, and shows **draft** posts (marked "Draft — not published").

To check the production output exactly as it will be published (drafts excluded):

```bash
npm run build
npm run preview
```

## Writing a blog post

1. Create a Markdown file in `src/content/blog/`. The file name becomes the URL: `my-post.md` → `/blog/my-post.html`.
2. Start it with this front matter:
   ```yaml
   ---
   title: Why autonomous systems need runtime monitoring
   description: One or two sentences shown in the post list, search results and RSS.
   pubDate: 2026-09-30
   tags: [runtime monitoring]
   draft: true
   ---
   ```
3. Write the post in Markdown below the front matter.
4. Preview it with `npm run dev`. When it's ready, set `draft: false` (or delete the line), commit and push to `main`.

Published posts appear on `/blog/`, in the RSS feed (`/rss.xml`) and in the sitemap.

## Writing a case study

Copy `src/content/case-studies/_template.md` to a new file without the leading underscore (e.g. `acme-warehouse-fleet.md`) and fill it in. Keep `draft: true` until the partner has approved the final text in writing. Files starting with `_` are never published.

The **Case studies** nav item appears automatically once the first case study is published.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.

One-time setup: in the repo, **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**. The custom domain comes from `public/CNAME` (www.gotaros.com).

## Project structure

```
/
├── src/
│   ├── pages/                  # One file per page; the file path is the URL
│   │   ├── index.astro         # Homepage (hero, intro animation, overview)
│   │   ├── platform.astro      # → /platform.html
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── 404.astro
│   │   ├── blog/               # → /blog/ (list) and /blog/<post>.html
│   │   ├── case-studies/       # → /case-studies/ (list) and /case-studies/<study>.html
│   │   └── rss.xml.js          # Blog RSS feed
│   ├── layouts/
│   │   └── BaseLayout.astro    # Shared <head>, header/nav and footer
│   ├── content/
│   │   ├── blog/               # Blog posts (Markdown)
│   │   └── case-studies/       # Case studies (Markdown) + _template.md
│   ├── content.config.ts       # Front matter fields for posts and case studies
│   └── lib/content.ts          # Draft filtering, sorting, URLs, date formatting
├── public/                     # Copied to the site as-is
│   ├── animations/
│   │   └── taros_introduction.html   # Self-contained intro animation with voice-over, embedded on the homepage
│   ├── css/styles.css
│   ├── js/main.js              # Mobile nav, lazy-loading and sizing of the intro animation frame
│   ├── assets/                 # images/ and icons/ (empty placeholders)
│   └── CNAME                   # Custom domain (www.gotaros.com)
├── .github/workflows/deploy.yml
├── astro.config.mjs            # Site URL, output format, sitemap
├── package.json
├── LICENSE
└── README.md
```

Page URLs are unchanged from the original static site (`/platform.html`, `/about.html`, …) because `build.format` is set to `'preserve'`.

The intro animation is loaded in an iframe. It reports the height its tallest scene needs (via `postMessage`), and `public/js/main.js` sizes the frame to fit: wide screens show the desktop layout scaled down, while tablets and phones use the animation's own single-column layout at full size.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Local dev server on port 3000, with drafts shown |
| `npm run build` | Build the published site into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

---

© TAROS. All rights reserved.
