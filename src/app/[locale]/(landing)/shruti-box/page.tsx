import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';

import { envConfigs } from '@/config';
import { routing } from '@/core/i18n/config';
import { Link } from '@/core/i18n/navigation';
import { ShrutiBoxPlayer } from '@/shared/blocks/harmonium/shruti-box-player';
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
  title: 'Shruti Box Online & Free Tanpura Drone | Play Harmonium',
  description:
    'Free online Shruti Box and Tanpura drone for Indian classical vocal riyaz, harmonium practice, bhajan, and meditation. Choose Sa–Pa or Sa–Ma across all 12 scales.',
  keywords:
    'shruti box online, tanpura online, free shruti box, online tanpura drone, vocal riyaz drone, indian classical shruti box',
  canonicalUrl: '/shruti-box',
});

const faqs = [
  {
    question: 'What is the difference between Sa–Pa and Sa–Ma drone tuning?',
    answer:
      'Sa–Pa (tonic and fifth) is the standard drone for most ragas and vocal warm-ups. Switch to Sa–Ma (tonic and fourth) when practicing ragas that omit Pa, such as Raag Malkauns or Raag Bageshri.',
  },
  {
    question: 'How do I pick my Safed or Kali scale on the Shruti Box?',
    answer:
      'Many male singers start around C (Safed 1) or C# (Kali 1) in Male/Low register, while many female singers start around G (Safed 5), G# (Kali 4), or A (Safed 6). Pick the scale where holding Sa feels effortless.',
  },
  {
    question: 'Can I use the Tanpura drone while playing the web harmonium?',
    answer:
      'Yes. You can also turn on the built-in Tanpura drone directly on our Web Harmonium homepage or any Song Notes page.',
  },
];

export default async function ShrutiBoxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pageUrl = absoluteUrl(envConfigs.app_url, '/shruti-box');

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: 'Play Harmonium', url: absoluteUrl(envConfigs.app_url, '/') },
          { name: 'Shruti Box Online', url: pageUrl },
        ])}
      />
      <JsonLd data={createFaqJsonLd(faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Online Shruti Box & Tanpura Drone',
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
                Free Vocal Riyaz Companion
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-tight font-bold text-[#2a1f1a] sm:text-5xl">
                Shruti Box Online &amp; Tanpura Drone
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#5d4a40] sm:text-lg">
                Play a continuous, warm Shruti Box and Tanpura drone right in
                your browser. Choose any of the 12 Indian scales (Safed 1 to
                Kali 5), switch between Sa–Pa, Sa–Ma, or Sa-only tuning, and
                practice daily vocal riyaz with zero downloads.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-[#8b2e2e]/15 bg-[#fffdf8] shadow-[0_20px_50px_rgba(83,45,24,0.14)]">
              <img
                alt="Traditional Indian tanpura and rosewood harmonium in morning light for vocal riyaz"
                className="aspect-video w-full object-cover"
                src="/imgs/harmonium/vocal-riyaz-tanpura.jpg"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <ShrutiBoxPlayer />

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
                href="/songs"
              >
                Practice Harmonium Song Notes
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-[#2a1f1a]/10 bg-white/75 px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl font-bold text-[#2a1f1a]">
              Shruti Box &amp; Tanpura FAQ
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
