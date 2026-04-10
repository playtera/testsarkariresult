import { SmartTags } from '../components/SmartTags'

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
      components: {
        input: SmartTags
      },
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image (Social Media)',
      type: 'image',
      description: 'Optional. If left empty, the website will automatically use the Main Image of the post.',
      options: {
        hotspot: true
      }
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Optional. If left empty, the website will automatically generate it using your slug (e.g. https://sarkariresultcorner.com/your-slug).'
    }
  ]
}
