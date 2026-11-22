import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { envConfigs } from '@/config';
import { routing } from '@/core/i18n/config';
import { Link } from '@/core/i18n/navigation';
import { SongHarmoniumPlayer } from '@/shared/blocks/harmonium/song-player';
import {
  getHarmoniumSongBySlug,
  HARMONIUM_SONGS,
} from '@/shared/blocks/harmonium/songs-data';
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createFaqJsonLd,
  JsonLd,
} from '@/shared/components/seo/json-ld';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    HARMONIUM_SONGS.map((song) => ({
      locale,
      slug: song.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const song = getHarmoniumSongBySlug(slug);
  if (!song) {
    return {};
  }

  return getMetadata({
    title: `${song.title} Harmonium Notes (Sargam) | Play Harmonium`,
    description: song.description,
    keywords: song.keywords,
    canonicalUrl: `/songs/${song.slug}`,
  })({ params: Promise.resolve({ locale }) });
}

export default async function SongDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const song = getHarmoniumSongBySlug(slug);
  if (!song) {
    notFound();
  }

  const pageUrl = absoluteUrl(envConfigs.app_url, `/songs/${song.slug}`);
  const relatedSongs = HARMONIUM_SONGS.filter((s) => s.slug !== song.slug).slice(
    0,
    4
  );

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: 'Play Harmonium', url: absoluteUrl(envConfigs.app_url, '/') },
          {
            name: 'Harmonium Song Notes',
            url: absoluteUrl(envConfigs.app_url, '/songs'),
          },
          { name: `${song.title} Harmonium Notes`, url: pageUrl },
        ])}
      />
      <JsonLd data={createFaqJsonLd(song.faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: `How to Play ${song.title} on Web Harmonium`,
          description: song.description,
          step: song.lines.map((line, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: `${line.label}: ${line.lyricHint}`,
            text: `Practice ${line.lyricHint} on the online harmonium keyboard following the highlighted Sargam keys.`,
          })),
        }}
      />

      <main className="min-h-screen bg-[#faf7f2] font-sans text-[#2a1f1a]">
        <section className="border-b border-[#2a1f1a]/10 bg-white/75 px-4 pt-24 pb-10 sm:pt-28">
          <div className="mx-auto max-w-6xl">
            <Link
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8b2e2e] hover:underline"
              href="/songs"
            >
              <ArrowLeft className="size-4" />
              All Harmonium Song Notes
            </Link>

            <h1 className="mt-4 font-serif text-3xl leading-tight font-bold text-[#2a1f1a] sm:text-5xl">
              {song.title} — Harmonium Notes (Sa Re Ga Ma)
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#5d4a40]">
              {song.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-[#8b2e2e]/20 bg-[#fffdf8] px-3 py-1.5 text-[#8b2e2e]">
                {song.artist}
              </span>
              <span className="rounded-full border border-[#2a1f1a]/12 bg-white px-3 py-1.5 text-[#5d4a40]">
                Scale: {song.scale}
              </span>
              <span className="rounded-full border border-[#2a1f1a]/12 bg-white px-3 py-1.5 text-[#5d4a40]">
                Raga / Thaat: {song.ragaOrThaat}
              </span>
              <span className="rounded-full border border-[#2a1f1a]/12 bg-white px-3 py-1.5 text-[#5d4a40]">
                Difficulty: {song.difficulty}
              </span>
            </div>
          </div>
        </section>

        <section className="px-4 py-10">
          <div className="mx-auto max-w-6xl">
            <SongHarmoniumPlayer song={song} />
          </div>
        </section>

        <section className="border-t border-[#2a1f1a]/10 bg-white/75 px-4 py-12">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2a1f1a]">
                Practice Tips for {song.title}
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5d4a40]">
                {song.tips.map((tip) => (
                  <li
                    key={tip}
                    className="rounded-xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-4"
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2a1f1a]">
                Frequently Asked Questions
              </h2>
              <div className="mt-4 space-y-3">
                {song.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-4"
                  >
                    <h3 className="text-sm font-semibold text-[#2a1f1a]">
                      {faq.question}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-[#5d4a40]">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#2a1f1a]/10 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-2xl font-bold text-[#2a1f1a]">
              More Harmonium Song Notes
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedSongs.map((item) => (
                <Link
                  key={item.slug}
                  className="rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-4 transition hover:border-[#c8633a]/45"
                  href={`/songs/${item.slug}`}
                >
                  <p className="text-xs font-semibold text-[#8b2e2e]">
                    {item.category}
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold text-[#2a1f1a]">
                    {item.title}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8b2e2e]">
                    Play notes <ArrowRight className="size-3.5" />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
