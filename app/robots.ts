import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI search crawlers — allow for citation visibility
      { userAgent: 'GPTBot',          allow: ['/'] },
      { userAgent: 'OAI-SearchBot',   allow: ['/'] },
      { userAgent: 'PerplexityBot',   allow: ['/'] },
      { userAgent: 'ClaudeBot',       allow: ['/'] },
      { userAgent: 'Google-Extended', allow: ['/'] },
      // Training-only scrapers — protect content IP
      { userAgent: 'CCBot',           disallow: ['/'] },
      { userAgent: 'anthropic-ai',    disallow: ['/'] },
      // Standard crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/_next/',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
