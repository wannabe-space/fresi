import type { MetadataRoute } from 'next'
import { env } from '~/env'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/chat/',
    },
    sitemap: `${env.NEXT_PUBLIC_URL}/sitemap.xml`,
  }
}
