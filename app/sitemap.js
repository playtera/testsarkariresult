import { client } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

export default async function sitemap() {
  // Fetch all published posts from Sanity
  const posts = await client.fetch(groq`*[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`);

  const postEntries = posts.map((post) => ({
    url: `https://sarkariresultcorner.com/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://sarkariresultcorner.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://sarkariresultcorner.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://sarkariresultcorner.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://sarkariresultcorner.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://sarkariresultcorner.com/terms-and-conditions',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://sarkariresultcorner.com/disclaimer',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postEntries,
  ];
}
