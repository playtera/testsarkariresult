import { FileText } from 'lucide-react'
import { HtmlBodyEditor } from '../components/HtmlBodyEditor'

export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: FileText,
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
      description: 'Leave blank to publish now, or set a future date to schedule.',
    },
    {
      name: 'status',
      title: 'Post Status',
      type: 'string',
      options: {
        list: [
          { title: 'Live / Complete', value: 'published' },
          { title: 'Pending / Update Later (Coming Soon)', value: 'pending' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
    },
    {
      name: 'body',
      title: 'Body (Visual / Rich Text)',
      type: 'blockContent',
      description: 'Use this for simple text and basic formatting.',
    },
    {
      name: 'htmlBody',
      title: 'HTML / Code Editor (WordPress-style)',
      type: 'text',
      description: 'Paste your raw HTML tables and links here. Use the Live Preview to visualise.',
      components: {
        input: HtmlBodyEditor
      }
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
      status: 'status',
    },
    prepare({ title, media, status }) {
      return {
        title: title || 'Untitled',
        media,
        subtitle: status === 'pending' ? '⚠️ PENDING UPDATE' : null,
      };
    },
  },
}
