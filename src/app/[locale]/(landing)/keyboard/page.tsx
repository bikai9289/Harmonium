import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { HarmoniumKeyboardPage } from '@/shared/blocks/harmonium/keyboard-page';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = getMetadata({
  title: 'Web Harmonium Practice Workbench | Recording, Presets & Notes',
  description:
    'Use the Web Harmonium practice workbench with touch controls, laptop shortcuts, Sargam labels, transpose, recording takes, notation, presets, and saved sessions.',
  keywords:
    'web harmonium practice workbench, web harmonium keyboard, play web harmonium online, harmonium keyboard, virtual harmonium keyboard, recording takes, notation, presets, sessions, Sa finding, alankar',
  canonicalUrl: '/keyboard',
});

export default async function KeyboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HarmoniumKeyboardPage />;
}
