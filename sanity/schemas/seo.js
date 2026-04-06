export default {
  name: 'seo',
  title: 'SEO & Social',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Browser Title',
      type: 'string',
      description: 'The title displayed in the browser tab and search results.',
      validation: Rule => Rule.max(60).warning('Titles should be under 60 characters.')
    },
    {
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'A brief summary of the page for search engines.',
      validation: Rule => Rule.max(160).warning('Descriptions should be under 160 characters.')
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'The image shown when the page is shared on social media.'
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'The primary URL for this page (helps avoid duplicate content).'
    }
  ]
}
