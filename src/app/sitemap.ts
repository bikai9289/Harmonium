import { MetadataRoute } from 'next';

import { envConfigs } from '@/config';

const staticRoutes = ['/', '/keyboard', '/blog', '/pricing', '/showcases', '/updates'];

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = envConfigs.app_url.replace(/\/$/, '');
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${appUrl}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: route === '/' || route === '/keyboard' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : route === '/keyboard' ? 0.9 : 0.7,
  }));
}
