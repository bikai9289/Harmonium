import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { envConfigs } from '@/config';
import { harmoniumSeoLandingContent } from '@/shared/blocks/harmonium/seo-landing-content';
import { HarmoniumSeoLandingPage } from '@/shared/blocks/harmonium/seo-landing-page';
import { SargamPdfSheet } from '@/shared/blocks/harmonium/sargam-pdf-sheet';
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createFaqJsonLd,
  JsonLd,
} from '@/shared/components/seo/json-ld';
import { getMetadata } from '@/shared/lib/seo';

const content = harmoniumSeoLandingContent.notes;

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = getMetadata({
  title: 'Harmonium Notes: Sa Re Ga Ma Sargam Chart & Free PDF | Play Harmonium',
  description:
    'Learn harmonium notes with our complete Sa Re Ga Ma Sargam chart, western key equivalents, laptop shortcuts, Alankar drills, and free printable Sargam PDF.',
  keywords:
    `${content.keywords}, harmonium sargam notes pdf, sa re ga ma pa in harmonium, saregamapa harmonium notes`,
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
      <SargamPdfSheet />
    </>
  );
}
