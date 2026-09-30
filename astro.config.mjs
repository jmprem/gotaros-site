// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.gotaros.com',
  // 'preserve' keeps the original page URLs (e.g. /platform.html) while
  // section index pages get clean URLs (e.g. /blog/).
  build: { format: 'preserve' },
  integrations: [sitemap()],
  server: { port: 3000 },
});
