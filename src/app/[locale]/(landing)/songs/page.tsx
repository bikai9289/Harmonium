import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, Music2 } from 'lucide-react';

import { envConfigs } from '@/config';
import { routing } from '@/core/i18n/config';
import { Link } from '@/core/i18n/navigation';
import { HARMONIUM_SONGS } from '@/shared/blocks/harmonium/songs-data';
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createFaqJsonLd,
  JsonLd,
} from '@/shared/components/seo/json-ld';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = getMetadata({
  title: 'Web Harmonium Song Notes - Free Sargam & Bollywood Notes',
  description:
    'Play popular Bollywood songs, bhajans, aartis, and Raag Yaman on our free web harmonium. Interactive Sa Re Ga Ma Sargam notes, western keys, and demo playback.',
  keywords:
    'web harmonium song notes, harmonium song notes, bollywood harmonium notes, bhajan harmonium notes, sargam notes for songs, harmonium notes in sargam',
  canonicalUrl: '/songs',
});

const faqs = [
  {
    question: 'How do I play these harmonium song notes on a laptop?',
    answer:
      'Open any song page, click Play Full Demo to hear the melody and watch the highlighted keys, then press the matching QWERTY keys shown under each Sargam note.',
  },
  {
    question: 'Are the song notes available in both Sargam and Western notation?',
    answer:
      'Yes. Every song page includes a one-click Labels toggle so you can switch between Sa Re Ga Ma (Sargam) and C D E F G (Western) notation.',
  },
  {
    question: 'Can I slow down a song while practicing?',
    answer:
      'Yes. Use the 0.6x, 0.8x, or 1x playback speed selector, or click Play Line on an individual phrase to master one line at a time.',
  },
];

export default async function SongsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pageUrl = absoluteUrl(envConfigs.app_url, '/songs');
  const categories = Array.from(
    new Set(HARMONIUM_SONGS.map((song) => song.category))
  );

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: 'Play Harmonium', url: absoluteUrl(envConfigs.app_url, '/') },
          { name: 'Harmonium Song Notes', url: pageUrl },
        ])}
      />
      <JsonLd data={createFaqJsonLd(faqs)} />

      <main className="min-h-screen bg-[#faf7f2] font-sans text-[#2a1f1a]">
        <section className="border-b border-[#2a1f1a]/10 bg-white/75 px-4 pt-24 pb-12 sm:pt-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#8b2e2e] uppercase">
              Interactive Song Library
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight font-bold text-[#2a1f1a] sm:text-5xl">
              Web Harmonium Song Notes (Sargam &amp; Western)
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#5d4a40] sm:text-lg">
              Learn popular Bollywood melodies, devotional bhajans, aartis, and
              classical ragas directly on an interactive online harmonium
              keyboard. Every song includes Sa Re Ga Ma notation, western note
              names, laptop QWERTY shortcuts, and slow demo playback.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-[#8b2e2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6f2424]"
                href="/"
              >
                Open Web Harmonium
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
                href="/harmonium-notes#sargam-pdf"
              >
                Free Sargam Notes PDF
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
                href="/shruti-box"
              >
                Online Shruti Box &amp; Tanpura
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl space-y-12">
            {categories.map((category) => {
              const songs = HARMONIUM_SONGS.filter(
                (song) => song.category === category
              );

              return (
                <div key={category}>
                  <h2 className="font-serif text-2xl font-bold text-[#2a1f1a] sm:text-3xl">
                    {category} Harmonium Notes
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {songs.map((song) => (
                      <Link
                        key={song.slug}
                        className="group flex flex-col justify-between rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8633a]/45 hover:shadow-md"
                        href={`/songs/${song.slug}`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b2e2e]">
                              <Music2 className="size-3.5" />
                              {song.difficulty}
                            </span>
                            <span className="rounded-full bg-[#f3e8dc] px-2.5 py-0.5 text-[11px] font-medium text-[#6d5549]">
                              {song.ragaOrThaat}
                            </span>
                          </div>
                          <h3 className="mt-3 text-xl font-semibold text-[#2a1f1a] group-hover:text-[#8b2e2e]">
                            {song.title} — Harmonium Notes
                          </h3>
                          <p className="mt-1 text-xs font-medium text-[#7a6458]">
                            {song.artist}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-[#5d4a40]">
                            {song.summary}
                          </p>
                        </div>

                        <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8b2e2e]">
                          Play &amp; View Sargam
                          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-[#2a1f1a]/10 bg-white/70 px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl font-bold text-[#2a1f1a]">
              Harmonium Song Notes FAQ
            </h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5"
                >
                  <h3 className="text-base font-semibold text-[#2a1f1a]">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#5d4a40]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
