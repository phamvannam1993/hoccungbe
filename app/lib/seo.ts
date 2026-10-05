export const SITE_NAME = 'Bé Hay Học';
export const DEFAULT_SITE_URL = 'https://behayhoc.com';
export const SITE_URL = stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL);
export const DEFAULT_OG_IMAGE = '/og-home.jpg';
export const DEFAULT_LOGO = '/assets/images/logo.png';

export function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function absoluteUrl(path = '/'): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function canonical(path = '/'): string {
  if (path === '/') return SITE_URL;
  return absoluteUrl(path);
}

export function truncateDescription(value: string, max = 155): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function safeDate(value?: string | Date | null): Date {
  if (!value) return new Date();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function makeTitle(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}
