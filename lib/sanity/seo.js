import { client } from './client'

export async function getPageMetadata(slug) {
  const query = `*[_type == "post" && (lower(slug.current) == lower($slug) || lower(slug.current) == lower($slug) + "/")][0] {
    title,
    author,
    publishedAt,
    _updatedAt,
    seo {
      ...,
      "ogImage": ogImage.asset->url
    },
    "mainImage": mainImage.asset->url
  }`
  const data = await client.fetch(query, { slug })

  if (!data) return null
  
  const { seo = {}, mainImage, title, author, publishedAt, _updatedAt } = data
  const finalImage = seo.ogImage || mainImage

  // Auto-generate canonical if missing
  const cleanSlug = slug.replace(/^\/+/, '').replace(/\/+$/, '')
  const canonical = seo.canonicalUrl || `https://sarkariresultcorner.com/${cleanSlug}`

  // Robust fallbacks for Title and Description
  const finalTitle = seo.title || `${title} - SarkariResultCorner`
  const finalDescription = seo.description || `Get the latest updates, vacancy details, eligibility, and online application links for ${title}.`
  const finalAuthor = author || 'SarkariResultCorner Editorial Team'

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: seo.keywords || [],
    // Store extra data for JSON-LD (not standard Next.js metadata but readable by our page)
    other: {
      'article:author': finalAuthor,
      'article:published_time': publishedAt || '',
      'article:modified_time': _updatedAt || '',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      type: 'article',
      siteName: 'SarkariResultCorner',
      images: finalImage ? [{ url: finalImage, width: 1200, height: 630, alt: finalTitle }] : [{ url: 'https://sarkariresultcorner.com/og-image.jpg', width: 1200, height: 630 }],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalImage || 'https://sarkariresultcorner.com/twitter-image.jpg'],
      site: '@SarkariResultCorner',
    },
    alternates: {
      canonical: canonical,
    }
  }
}

// Separate function to get full post data for JSON-LD schemas
export async function getPostSchemaData(slug) {
  const query = `*[_type == "post" && (lower(slug.current) == lower($slug) || lower(slug.current) == lower($slug) + "/")][0] {
    title,
    author,
    publishedAt,
    _updatedAt,
    _createdAt,
    "slug": slug.current,
    seo { description, keywords },
    "mainImageUrl": mainImage.asset->url
  }`
  return await client.fetch(query, { slug })
}
