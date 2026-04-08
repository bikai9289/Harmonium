import { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { pagesSource, postsSource } from '@/core/docs/source';
import { getPosts, PostStatus, PostType } from '@/shared/models/post';
import {
  getTaxonomies,
  TaxonomyStatus,
  TaxonomyType,
} from '@/shared/models/taxonomy';

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/keyboard', changeFrequency: 'daily', priority: 0.9 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/pricing', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/showcases', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/updates', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/ai-image-generator', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/ai-music-generator', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/ai-video-generator', changeFrequency: 'weekly', priority: 0.7 },
];

function buildAbsoluteUrl(path: string) {
  const appUrl = envConfigs.app_url.replace(/\/$/, '');
  return `${appUrl}${path === '/' ? '' : path}`;
}

function normalizePublicPath(path: string) {
  if (!path.startsWith('/')) {
    return `/${path}`;
  }

  if (defaultLocale === 'en') {
    if (path === `/${defaultLocale}`) {
      return '/';
    }

    if (path.startsWith(`/${defaultLocale}/`)) {
      return path.slice(defaultLocale.length + 1) || '/';
    }
  }

  return path;
}

function parseLastModified(value: unknown, fallback: Date) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const sitemapEntries = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const route of staticRoutes) {
    sitemapEntries.set(route.path, {
      url: buildAbsoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  for (const page of pagesSource.getPages(defaultLocale)) {
    const pagePath = normalizePublicPath(page.url);
    sitemapEntries.set(pagePath, {
      url: buildAbsoluteUrl(pagePath),
      lastModified: parseLastModified((page.data as any).created_at, now),
      changeFrequency: 'monthly',
      priority: 0.3,
    });
  }

  for (const post of postsSource.getPages(defaultLocale)) {
    const postPath = normalizePublicPath(post.url);
    sitemapEntries.set(postPath, {
      url: buildAbsoluteUrl(postPath),
      lastModified: parseLastModified((post.data as any).created_at, now),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  try {
    const [remotePosts, categories] = await Promise.all([
      getPosts({
        type: PostType.ARTICLE,
        status: PostStatus.PUBLISHED,
        limit: 500,
      }),
      getTaxonomies({
        type: TaxonomyType.CATEGORY,
        status: TaxonomyStatus.PUBLISHED,
        limit: 500,
      }),
    ]);

    for (const post of remotePosts) {
      sitemapEntries.set(`/blog/${post.slug}`, {
        url: buildAbsoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt || post.createdAt || now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    for (const category of categories) {
      sitemapEntries.set(`/blog/category/${category.slug}`, {
        url: buildAbsoluteUrl(`/blog/category/${category.slug}`),
        lastModified: category.updatedAt || category.createdAt || now,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  } catch (error) {
    console.log('sitemap generation skipped remote content:', error);
  }

  return Array.from(sitemapEntries.values());
}
