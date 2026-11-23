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

const scaleReference = [
  {
    western: 'C / C#',
    indian: 'Safed 1 / Kali 1',
    fit: 'Most common male vocal scales for Hindustani classical riyaz, bhajan, and kirtan.',
  },
  {
    western: 'D / D#',
    indian: 'Safed 2 / Kali 2',
    fit: 'Bright tenor male range or deep alto female vocal warm-ups.',
  },
  {
    western: 'F / F#',
    indian: 'Safed 4 / Kali 3',
    fit: 'Comfortable lower-mid female vocal range and solo Bansuri flute practice.',
  },
  {
    western: 'G / G# / A',
    indian: 'Safed 5 / Kali 4 / Safed 6',
    fit: 'Standard female vocal scales for classical khayal, thumri, and devotional singing.',
  },
];

const riyazSteps = [
  {
    title: '1. Kharaj & Sustained Sa (3 min)',
    text: 'Start the Sa–Pa drone at a gentle volume, close your eyes, and sing a long, relaxed Sa until your voice blends seamlessly into the harmonic overtones.',
  },
  {
    title: '2. Slow Mandra (Lower Octave) Descent (3 min)',
    text: 'Step slowly down from Sa to Ni., Dha., and Pa. without pushing your throat. Steady low-register practice strengthens morning vocal resonance.',
  },
  {
    title: '3. Alankar & Sargam Precision (4 min)',
    text: 'Sing basic Bilawal or Kalyan Alankars while checking tricky intervals like Komal Ga or Tivra Ma on the Web Harmonium.',
  },
  {
    title: '4. Raga & Bhajan Phrasing (5 min)',
    text: 'Switch to Sa–Ma tuning for ragas that omit Pa (like Malkauns or Bageshri), or keep Sa–Pa for Yaman, Bhupali, Bhairav, and devotional melodies.',
  },
];

const faqs = [
  {
    question: 'What is the difference between Sa–Pa and Sa–Ma drone tuning?',
    answer:
      'Sa–Pa (tonic and fifth) is the standard drone for most Hindustani and Carnatic ragas as well as daily vocal warm-ups. Switch to Sa–Ma (tonic and fourth) when practicing ragas that omit Pa, such as Raag Malkauns, Raag Bageshri, or Raag Chandrakauns.',
  },
  {
    question: 'How do I pick my Safed or Kali scale on the Shruti Box?',
    answer:
      'Many male singers start around C (Safed 1) or C# (Kali 1) in Male/Low register, while many female singers start around G (Safed 5), G# (Kali 4), or A (Safed 6). Pick the tonic where sustaining Sa feels effortless and resonant.',
  },
  {
    question: 'Can I use the Tanpura drone while playing the web harmonium?',
    answer:
      'Yes. Both our Web Harmonium homepage and all 27 interactive Song Notes pages include a built-in Tanpura drone toggle synced directly to your transpose setting.',
  },
  {
    question: 'How is an online Shruti Box different from a physical Shruti Box?',
    answer:
      'A traditional wooden Shruti Box uses hand-pumped bellows over brass reeds to sustain a continuous chord. This browser version recreates that warm, breathing harmonic drone instantly with zero setup or tuning drift.',
  },
  {
    question: 'Can I use this drone for yoga, chanting, and meditation?',
    answer:
      'Yes. Select Sa Only or Sa–Pa in Male/Low register and lower the volume slightly to create a steady, grounding ambient backdrop for mantra chanting, pranayama, or sound meditation.',
  },
  {
    question: 'Does the online Shruti Box work on phones and tablets?',
    answer:
      'Yes. It runs directly in mobile browsers using the Web Audio API with no app download or sign-up required.',
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
                height={720}
                src="/imgs/harmonium/vocal-riyaz-tanpura.jpg"
                width={1280}
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
                Practice 27 Song Notes
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
                href="/online-flute"
              >
                Online Flute (Bansuri)
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-[#2a1f1a]/10 bg-white/80 px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-3xl font-bold text-[#2a1f1a] sm:text-4xl">
              How Indian Classical Singers Use a Shruti Box &amp; Tanpura
            </h2>
            <p className="mt-3 text-base leading-8 text-[#5d4a40]">
              In Hindustani and Carnatic music, melody is always heard against a
              steady tonal center called <em>Sa</em> (Shadja). A traditional{' '}
              <a
                className="font-medium text-[#8b2e2e] underline decoration-[#8b2e2e]/40 hover:decoration-[#8b2e2e]"
                href="https://en.wikipedia.org/wiki/Shruti_box"
                rel="noopener noreferrer"
                target="_blank"
              >
                Shruti box
              </a>{' '}
              or Tanpura anchors your ear continuously so you can feel whether
              Re, Ga, Ma, Pa, Dha, and Ni sit in pure, resonant alignment. Even
              ten minutes of daily drone practice noticeably improves pitch
              stability, breath control, and vocal tone.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {scaleReference.map((item) => (
                <div
                  key={item.western}
                  className="rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold text-[#8b2e2e] uppercase">
                    {item.indian}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[#2a1f1a]">
                    Scale {item.western}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#5d4a40]">
                    {item.fit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#2a1f1a]/10 px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-3xl font-bold text-[#2a1f1a] sm:text-4xl">
              15-Minute Daily Vocal Riyaz Routine with Online Drone
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {riyazSteps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-[#8b2e2e]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#5d4a40]">
                    {step.text}
                  </p>
                </div>
              ))}
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
