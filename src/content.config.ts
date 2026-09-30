import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Files starting with "_" (e.g. _template.md) are ignored.
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Drafts are shown by `npm run dev` but left out of the published site.
    draft: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    partner: z.string(),
    industry: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, caseStudies };
