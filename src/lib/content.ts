import { getCollection, type CollectionEntry } from 'astro:content';

type Entry = CollectionEntry<'blog'> | CollectionEntry<'caseStudies'>;

// Drafts are visible in `npm run dev` so they can be previewed, never in a build.
const isVisible = (entry: Entry) => import.meta.env.DEV || !entry.data.draft;

const newestFirst = (a: Entry, b: Entry) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

export async function getPosts() {
  return (await getCollection('blog', isVisible)).sort(newestFirst) as CollectionEntry<'blog'>[];
}

// Every page's nav asks for case studies, so a build loads them once (dev reloads each time).
let caseStudiesCache: Promise<CollectionEntry<'caseStudies'>[]> | undefined;

export function getCaseStudies() {
  const load = async () =>
    (await getCollection('caseStudies', isVisible)).sort(newestFirst) as CollectionEntry<'caseStudies'>[];
  if (import.meta.env.DEV) return load();
  return (caseStudiesCache ??= load());
}

export const postUrl = (post: CollectionEntry<'blog'>) => `/blog/${post.id}.html`;
export const caseStudyUrl = (study: CollectionEntry<'caseStudies'>) => `/case-studies/${study.id}.html`;

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
