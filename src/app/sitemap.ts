import type { MetadataRoute } from 'next';

const BASE_URL = 'https://siedels.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/team`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/schedule`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
