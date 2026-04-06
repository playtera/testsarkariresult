export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Body (Rich Text)',
      type: 'blockContent',
    },
    {
      name: 'htmlBody',
      title: 'HTML Body (Raw Code)',
      type: 'text',
      description: 'Paste your raw HTML code here.',
      rows: 20,
    },
    {
      name: 'seo',
      title: 'SEO Fields',
      type: 'seo',
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
}
