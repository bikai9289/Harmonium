import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';

import { envConfigs } from '@/config';
import { routing } from '@/core/i18n/config';
import { Link } from '@/core/i18n/navigation';
import { OnlineFlutePlayer } from '@/shared/blocks/harmonium/online-flute-player';
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
  title: 'Online Flute - Free Virtual Indian Bansuri Flute Simulator',
  description:
    'Play a free online flute (Indian Bansuri simulator) in your browser. Interactive finger-hole chart, Sa Re Ga Ma Sargam labels, laptop keys, and Tanpura drone.',
  keywords:
    'online flute, flute simulator, virtual flute, bansuri online, play flute online, indian bamboo flute simulator, sargam flute notes',
  canonicalUrl: '/online-flute',
});

const faqs = [
  {
    question: 'How do I play the online flute on my laptop keyboard?',
    answer:
      'Press keys A through apostrophe (A S D F G H J K L ; \') to play from lower Pa up to upper Sa, and press U for Tivra Ma♯. You can also tap or click the note pads directly.',
  },
  {
    question: 'What do the filled and hollow circles on the Bansuri diagram mean?',
    answer:
      'Filled dark circles show closed finger holes on a 6-hole Indian Bansuri flute, while hollow light circles show open holes for the active Sargam note.',
  },
  {
    question: 'Can I practice online flute with a Tanpura drone?',
    answer:
      'Yes. Click the Tanpura button in the top control bar to enable a continuous Sa–Pa or Sa–Ma drone synced to your chosen Bansuri scale (C, D, E, F, G, or A).',
  },
];

export default async function OnlineFlutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pageUrl = absoluteUrl(envConfigs.app_url, '/online-flute');

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: 'Play Harmonium', url: absoluteUrl(envConfigs.app_url, '/') },
          { name: 'Online Flute (Bansuri)', url: pageUrl },
        ])}
      />
      <JsonLd data={createFaqJsonLd(faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Online Flute Simulator (Indian Bansuri)',
          url: pageUrl,
          applicationCategory: 'MusicApplication',
          operatingSystem: 'Web Browser',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <main className="min-h-screen bg-[#faf7f2] font-sans text-[#2a1f1a]">
        <section className="border-b border-[#2a1f1a]/10 bg-white/75 px-4 pt-24 pb-10 sm:pt-28">
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-[#8b2e2e] uppercase">
                Free Virtual Indian Bansuri
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-tight font-bold text-[#2a1f1a] sm:text-5xl">
                Online Flute – Virtual Bansuri Simulator
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#5d4a40] sm:text-lg">
                Play a warm Indian bamboo Bansuri flute directly in your
                browser. Follow live 6-hole fingering positions, switch between
                Sa Re Ga Ma Sargam and Western note names, choose your flute
                scale, and practice with a built-in Tanpura drone.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-[#8b2e2e]/15 bg-[#fffdf8] shadow-[0_20px_50px_rgba(83,45,24,0.14)]">
              <img
                alt="Handcrafted Indian bamboo Bansuri flutes with maroon silk threads in warm morning light"
                className="aspect-video w-full object-cover"
                src="/imgs/harmonium/indian-bansuri-flute.jpg"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-10">
          <div className="mx-auto max-w-6xl">
            <OnlineFlutePlayer />

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-[#8b2e2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6f2424]"
                href="/"
              >
                Play Web Harmonium
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
                href="/shruti-box"
              >
                Online Shruti Box &amp; Tanpura
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
                href="/songs"
              >
                Browse 27 Song Notes
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-[#2a1f1a]/10 bg-white/75 px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl font-bold text-[#2a1f1a]">
              Online Flute &amp; Bansuri FAQ
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
