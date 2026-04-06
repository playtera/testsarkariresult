import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../../sanity/env'

const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source) => builder.image(source)
