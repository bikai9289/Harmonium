import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { HarmoniumTutorialPage } from '@/shared/blocks/harmonium/tutorial-page';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = getMetadata({
  title: 'Web Harmonium Tutorial | Guided Beginner Practice',
  description:
    'Follow a guided Web Harmonium tutorial with autoplay demos, highlighted target notes, and beginner-friendly note matching for the browser keyboard.',
  keywords:
    'web harmonium tutorial, harmonium tutorial, guided harmonium practice, note matching harmonium, learn harmonium online',
  canonicalUrl: '/tutorial',
});

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HarmoniumTutorialPage />;
}
