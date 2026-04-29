import type { MetadataRoute } from 'next';
import { ROUTES } from '@/data/nav';

const BASE_URL = 'https://siedels.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ROUTES.map((r) => ({
    url: r.href === '/' ? BASE_URL : `${BASE_URL}${r.href}`,
    lastModified: new Date(),
    changeFrequency: r.sitemapChangeFrequency,
    priority: r.sitemapPriority,
  }));

  // Sub-pages not in the nav but still publicly indexable
  const extras: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/gift/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [...routes, ...extras];
}
