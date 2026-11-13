import type { MetadataRoute } from 'next'
import { PROJECTS, SITE_URL } from './data'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...PROJECTS.filter((project) => project.selected).map((project) => ({
      url: `${SITE_URL}/projects/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ]
}
