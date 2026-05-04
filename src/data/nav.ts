/**
 * Canonical route list for Nav, Footer, and sitemap. Keep this in sync
 * with folders under `src/app/` — adding a route here plus creating the
 * page folder is enough for it to appear in nav, footer, and sitemap.
 */

export interface NavRoute {
  label: string;
  href: string;
  /** Omit from the top nav. */
  hideInNav?: boolean;
  /** Omit from the footer link row. */
  hideInFooter?: boolean;
  sitemapPriority: number;
  sitemapChangeFrequency: 'weekly' | 'monthly' | 'daily';
}

export const ROUTES: NavRoute[] = [
  { label: 'HOME',     href: '/',         hideInFooter: true, sitemapPriority: 1.0, sitemapChangeFrequency: 'weekly' },
  { label: 'TEAM',     href: '/team',     sitemapPriority: 0.8, sitemapChangeFrequency: 'monthly' },
  { label: 'GALLERY',  href: '/gallery',  sitemapPriority: 0.7, sitemapChangeFrequency: 'weekly' },
  { label: 'SERVICES', href: '/services', sitemapPriority: 0.9, sitemapChangeFrequency: 'weekly' },
  { label: 'CONTACT',  href: '/contact',  sitemapPriority: 0.8, sitemapChangeFrequency: 'monthly' },
  // GIFT route disabled pending owner approval — see src/app/_disabled/gift/
];

export const NAV_ROUTES = ROUTES.filter((r) => !r.hideInNav);
export const FOOTER_ROUTES = ROUTES.filter((r) => !r.hideInFooter);
