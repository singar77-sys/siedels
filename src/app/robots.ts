import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/redeem', '/admin'],
    },
    sitemap: 'https://www.siedels.com/sitemap.xml',
  };
}
