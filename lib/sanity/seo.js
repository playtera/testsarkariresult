import { client } from './client'

export async function getPageMetadata(slug) {
  const query = `*[_type == "post" && (lower(slug.current) == lower($slug) || lower(slug.current) == lower($slug) + "/")][0] {
    seo {
      ...,
      "ogImage": ogImage.asset->url
    },
    "mainImage": mainImage.asset->url
  }`
  const data = await client.fetch(query, { slug })

  if (!data?.seo) return null

  const { seo, mainImage, title } = data
  const finalImage = seo.ogImage || mainImage
  
  // Auto-generate canonical if missing
  const cleanSlug = slug.replace(/^\/+/, '').replace(/\/+$/, '')
  const canonical = seo.canonicalUrl || `https://sarkariresultcorner.com/${cleanSlug}`

  // Robust fallbacks for Title and Description
  const finalTitle = seo.title || `${title} - SarkariResultCorner`
  const finalDescription = seo.description || `Get the latest updates, vacancy details, eligibility, and online application links for ${title}.`

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: seo.keywords || [],
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      images: finalImage ? [{ url: finalImage }] : [],
    },
    alternates: {
      canonical: canonical,
    }
  }
}
