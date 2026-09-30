import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/content';

export async function GET(context) {
  const posts = (await getPosts()).filter((post) => !post.data.draft);
  return rss({
    title: 'TAROS blog',
    description: 'Notes on runtime monitoring and oversight for autonomous systems and AI/SI.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  });
}
