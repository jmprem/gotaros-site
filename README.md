# TAROS — Public Website

Public website for **TAROS**, an AI safety platform for the enterprise. The site communicates high-level value to enterprises: governance, oversight, and operational trust for AI-driven systems—without exposing implementation details.

## What this site is

- **Static site**: HTML, CSS, and minimal JavaScript only. No frameworks or build step.
- **Hosted on GitHub Pages**: Deploy by pushing to the repo; no server required.
- **Pages**: Home, Platform, About, Contact.

## Preview locally

1. Install dependencies (optional; only needed for the dev server):
   ```bash
   npm install
   ```
2. Run the local server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

Without npm, you can open `index.html` directly in a browser, or use any static file server (e.g. `npx serve .` or Python `http.server`).

## Deploy with GitHub Pages

1. Push this repository to GitHub.
2. In the repo: **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Select the branch (e.g. `main`) and folder **/ (root)**.
5. Save. GitHub will build and serve the site; the URL will be `https://<username>.github.io/gotaros-site/` (or your custom domain if configured).

**Note:** Because the site is static and lives at the repo root, all links use relative paths (e.g. `index.html`, `platform.html`). If you use a custom domain or project site URL, existing links will continue to work.

## Project structure

```
/
├── index.html          # Homepage
├── platform.html
├── about.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   └── icons/
├── package.json
└── README.md
```

## Scripts

| Script     | Description |
| ---------- | ----------- |
| `npm run dev` | Start local server on port 3000 (`npx serve . -p 3000`) |
| `npm run preview` | Same as `dev` |
| `npm run build` | No-op (static site; deploy as-is) |

---

© TAROS. All rights reserved.
