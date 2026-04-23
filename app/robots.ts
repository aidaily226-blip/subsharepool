import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/admin',
          '/api/',
          '/messages',
          '/profile',
          '/setup',
        ],
      },
    ],
    sitemap: 'https://subsharepool.com/sitemap.xml',
    host: 'https://subsharepool.com',
  }
}