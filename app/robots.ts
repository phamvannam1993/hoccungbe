import type { MetadataRoute } from 'next';
import { SITE_URL } from './lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI search crawlers — allow discovery/citation of public educational pages.
      { userAgent: 'GPTBot', allow: ['/'] },
      { userAgent: 'OAI-SearchBot', allow: ['/'] },
      { userAgent: 'PerplexityBot', allow: ['/'] },
      { userAgent: 'ClaudeBot', allow: ['/'] },
      { userAgent: 'Google-Extended', allow: ['/'] },

      // Training-only scrapers — protect original content IP.
      { userAgent: 'CCBot', disallow: ['/'] },
      { userAgent: 'anthropic-ai', disallow: ['/'] },

      // Standard crawlers. Do not block /_next because search engines need CSS/JS to render pages.
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
