import { setRequestLocale } from 'next-intl/server';

import { HarmoniumKeyboardPage } from '@/shared/blocks/harmonium/keyboard-page';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Web Harmonium Keyboard | Practice Mode',
  description:
    'Play Web Harmonium online on a focused keyboard page with touch controls, keyboard shortcuts, Sargam labels, octave switching, and transpose.',
  keywords:
    'web harmonium keyboard, play web harmonium online, harmonium keyboard, virtual harmonium keyboard',
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
