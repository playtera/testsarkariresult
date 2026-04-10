import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './sanity/schema'
import { projectId, dataset } from './sanity/env'

import { myStructure } from './sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'Sarkari CMS',
  basePath: '/admin',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: myStructure,
    }),
    visionTool(),
  ],
  schema,
})
