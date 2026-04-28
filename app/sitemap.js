import { client } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

export default async function sitemap() {
  // Fetch all live posts from Sanity (considering scheduling)
  const posts = await client.fetch(groq`*[_type == "post" && defined(slug.current) && !(_id in path('drafts.**')) && (publishedAt == null || publishedAt <= now())] {
    "slug": slug.current,
    _updatedAt,
    _createdAt
  }`);

  const postEntries = posts.map((post) => ({
    url: `https://sarkariresultcorner.com/${post.slug}`,
    lastModified: post._updatedAt ? new Date(post._updatedAt) : post._createdAt ? new Date(post._createdAt) : new Date(),
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
