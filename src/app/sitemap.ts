import type { MetadataRoute } from 'next';
import { ROUTES } from '@/data/nav';

const BASE_URL = 'https://siedels.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: r.href === '/' ? BASE_URL : `${BASE_URL}${r.href}`,
    changeFrequency: r.sitemapChangeFrequency,
    priority: r.sitemapPriority,
  }));
}
