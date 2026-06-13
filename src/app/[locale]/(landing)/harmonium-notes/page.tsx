import { setRequestLocale } from 'next-intl/server';

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

const content = harmoniumSeoLandingContent.notes;

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: `${content.title} | Play Harmonium`,
  description: content.description,
  keywords: content.keywords,
  canonicalUrl: content.canonicalUrl,
});

export default async function HarmoniumNotesPage({
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
          '@type': 'Article',
          headline: content.title,
          description: content.description,
          mainEntityOfPage: pageUrl,
          author: {
            '@type': 'Organization',
            name: 'Play Harmonium',
          },
        }}
      />
      <HarmoniumSeoLandingPage {...content} />
    </>
  );
}
