import { client } from './client'

export async function getPageMetadata(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0].seo {
    ...,
    "ogImage": ogImage.asset->url
  }`
  const seo = await client.fetch(query, { slug })

  if (!seo) return null

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
    },
    alternates: {
      canonical: seo.canonicalUrl,
    }
  }
}
