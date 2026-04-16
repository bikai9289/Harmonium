import { setRequestLocale } from 'next-intl/server';

import { HarmoniumNotesPage } from '@/shared/blocks/harmonium/notes-page';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Web Harmonium Notes | Learn Sargam and Keyboard Mapping',
  description:
    'Learn Web Harmonium notes with an interactive keyboard map, Sargam and western note labels, MIDI note references, and short beginner practice patterns.',
  keywords:
    'web harmonium notes, harmonium notes, sargam notes, harmonium keyboard notes, learn web harmonium',
  canonicalUrl: '/notes',
});

export default async function NotesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HarmoniumNotesPage />;
}
