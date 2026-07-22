import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { envConfigs } from '@/config';
import { harmoniumSeoLandingContent } from '@/shared/blocks/harmonium/seo-landing-content';
import { HarmoniumSeoLandingPage } from '@/shared/blocks/harmonium/seo-landing-page';
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createFaqJsonLd,
  JsonLd,
} from '@/shared/components/seo/json-ld';
import { getMetadata } from '@/shared/lib/seo';

const content = harmoniumSeoLandingContent.virtual;

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = getMetadata({
  title: `${content.title} | Play Harmonium`,
  description: content.description,
  keywords: content.keywords,
  canonicalUrl: content.canonicalUrl,
});

export default async function VirtualHarmoniumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pageUrl = absoluteUrl(envConfigs.app_url, content.canonicalUrl);

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          {
            name: 'Play Harmonium',
            url: absoluteUrl(envConfigs.app_url, '/'),
          },
          {
            name: content.title,
            url: pageUrl,
          },
        ])}
      />
      <JsonLd data={createFaqJsonLd(content.faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: content.title,
          url: pageUrl,
          applicationCategory: 'MusicApplication',
          operatingSystem: 'Web browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          description: content.description,
        }}
      />
      <HarmoniumSeoLandingPage {...content} />
    </>
  );
}
