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
    'Play a free online flute (Indian Bansuri simulator) in your browser. Interactive 6-hole fingering chart, Sa Re Ga Ma Sargam labels, laptop keys, and Tanpura drone.',
  keywords:
    'online flute, flute simulator, virtual flute, bansuri online, play flute online, indian bamboo flute simulator, sargam flute notes',
  canonicalUrl: '/online-flute',
});

const fingeringChart = [
  {
    sargam: 'Sa',
    western: 'C4 (Middle)',
    holes: 'Top 3 closed · Bottom 3 open',
    keycap: 'F',
    tip: 'Your tonic reference note. Keep breath gentle and steady for a warm center.',
  },
  {
    sargam: 'Re',
    western: 'D4',
    holes: 'Top 2 closed · Bottom 4 open',
    keycap: 'G',
    tip: 'Lift the third finger smoothly to move from Sa to Shuddha Re.',
  },
  {
    sargam: 'Ga',
    western: 'E4',
    holes: 'Top 1 closed · Bottom 5 open',
    keycap: 'H',
    tip: 'Keep your index finger sealing the first hole cleanly while opening the rest.',
  },
  {
    sargam: 'Ma',
    western: 'F4',
    holes: 'Top 1 half-open · Rest open',
    keycap: 'J',
    tip: 'On a real Bansuri, Shuddha Ma uses a half-hole opening on the first finger.',
  },
  {
    sargam: 'Ma♯ (Tivra)',
    western: 'F#4',
    holes: 'All 6 holes open',
    keycap: 'U',
    tip: 'Essential for evening ragas like Raag Yaman and Kalyan Thaat melodies.',
  },
  {
    sargam: 'Pa',
    western: 'G4',
    holes: 'All 6 holes closed (medium breath)',
    keycap: 'K',
    tip: 'Close all six holes with slightly firmer air speed for middle-octave Pa.',
  },
  {
    sargam: 'Dha',
    western: 'A4',
    holes: 'Top 5 closed · Bottom 1 open',
    keycap: 'L',
    tip: 'Lift the bottom-most finger to move smoothly from Pa to Shuddha Dha.',
  },
  {
    sargam: 'Ni',
    western: 'B4',
    holes: 'Top 4 closed · Bottom 2 open',
    keycap: ';',
    tip: 'Leads naturally upward into Tar Saptak Sa′ with a gentle breath increase.',
  },
];

const scaleGuide = [
  {
    name: 'C Middle Bansuri',
    pitch: 'Balanced beginner scale',
    use: 'The most popular choice for first-time learners because finger spacing is comfortable and C matches standard keyboard and harmonium Sa.',
  },
  {
    name: 'D & F Middle Bansuri',
    pitch: 'Bright melodic tone',
    use: 'Great for light classical bhajans, Bollywood melodies, and accompaniment with higher vocal scales.',
  },
  {
    name: 'E Bass & G Bass Bansuri',
    pitch: 'Deep meditative concert tone',
    use: 'Preferred for slow Hindustani classical alap, evening ragas like Yaman or Bhupali, and deep breath control.',
  },
  {
    name: 'A Middle Bansuri',
    pitch: 'Crisp folk & devotional sound',
    use: 'Cuts clearly through group kirtan and pairs smoothly with higher female vocal scales.',
  },
];

const warmups = [
  {
    step: '01 · Long-Tone Sa Stability (2 min)',
    detail:
      'Turn on the Sa–Pa Tanpura drone and hold Sa (key F) for slow, even breaths. Listen for zero pitch wavering before moving to the next swara.',
  },
  {
    step: '02 · Basic Sargam Ascent & Descent (3 min)',
    detail:
      'Play Sa Re Ga Ma Pa Dha Ni Sa′ (F G H J K L ; \') slowly at a steady pulse, then descend cleanly back to Sa while watching the 6-hole diagram.',
  },
  {
    step: '03 · Raag Bhupali Pentatonic Phrases (3 min)',
    detail:
      'Practice Sa Re Ga Pa Dha Sa′ (F G H K L \')—skipping Ma and Ni gives instant, lyrical Bansuri phrasing without awkward finger jumps.',
  },
  {
    step: '04 · Harmonium + Bansuri Ear Training (2 min)',
    detail:
      'Alternate short phrases between this Bansuri simulator and our Web Harmonium to lock Sargam intervals into muscle memory.',
  },
];

const faqs = [
  {
    question: 'How do I play the online flute on my laptop keyboard?',
    answer:
      "Press keys A through apostrophe (A S D F G H J K L ; ') to play from lower Pa up to upper Sa′, and press U for Tivra Ma♯. You can also tap or click the note pads directly on desktop, tablet, or mobile.",
  },
  {
    question: 'What do the filled and hollow circles on the Bansuri diagram mean?',
    answer:
      'Filled dark circles represent closed finger holes on a traditional 6-hole Indian Bansuri bamboo flute, while hollow light circles show open holes for the active Sargam note.',
  },
  {
    question: 'Can I practice online flute with a Tanpura drone?',
    answer:
      'Yes. Click the Tanpura button in the top control bar to enable a continuous Sa–Pa or Sa–Ma drone automatically synced to your selected Bansuri scale (C, D, E, F, G, or A).',
  },
  {
    question: 'Which Bansuri scale is best for beginners?',
    answer:
      'A C Middle Bansuri is widely recommended for beginners because its pitch aligns directly with standard C-scale harmonium and piano notation, making Sargam ear training straightforward.',
  },
  {
    question: 'Can I switch between Sargam (Sa Re Ga Ma) and Western notes?',
    answer:
      'Yes. Use the Sargam / Western toggle in the control deck to display either traditional Indian swaras (Sa Re Ga Ma Pa Dha Ni) or Western pitch names (C D E F G A B).',
  },
  {
    question: 'Does this virtual flute work on mobile phones and iPads?',
    answer:
      'Yes. Every note pad supports instant touch playback in mobile Chrome and Safari with no app download or sign-up required.',
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
                Sa Re Ga Ma Sargam and Western note names, choose your preferred
                concert scale, and rehearse with a built-in Tanpura drone.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-[#8b2e2e]/15 bg-[#fffdf8] shadow-[0_20px_50px_rgba(83,45,24,0.14)]">
              <img
                alt="Handcrafted Indian bamboo Bansuri flutes with maroon silk threads in warm morning light"
                className="aspect-video w-full object-cover"
                height={720}
                src="/imgs/harmonium/indian-bansuri-flute.jpg"
                width={1280}
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

        <section className="border-t border-[#2a1f1a]/10 bg-white/80 px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-3xl font-bold text-[#2a1f1a] sm:text-4xl">
              6-Hole Indian Bansuri Fingering &amp; Sargam Chart
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#5d4a40]">
              Traditional Hindustani bamboo flutes (
              <a
                className="font-medium text-[#8b2e2e] underline decoration-[#8b2e2e]/40 hover:decoration-[#8b2e2e]"
                href="https://en.wikipedia.org/wiki/Bansuri"
                rel="noopener noreferrer"
                target="_blank"
              >
                Bansuri
              </a>
              ) use six primary finger holes to produce the full Sargam scale.
              Closing the top three holes sounds tonic Sa, while progressively
              lifting or covering holes shapes Re, Ga, Ma, Pa, Dha, and Ni. Use
              the reference table below to connect each finger position to its
              Western pitch and laptop keyboard shortcut.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2a1f1a]/12 text-xs font-semibold text-[#8b2e2e] uppercase">
                    <th className="py-2.5 pr-4">Sargam</th>
                    <th className="py-2.5 pr-4">Western</th>
                    <th className="py-2.5 pr-4">6-Hole Fingering</th>
                    <th className="py-2.5 pr-4">Laptop Key</th>
                    <th className="py-2.5">Playing Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a1f1a]/8 text-[#5d4a40]">
                  {fingeringChart.map((row) => (
                    <tr key={row.sargam}>
                      <td className="py-3 pr-4 font-bold text-[#2a1f1a]">
                        {row.sargam}
                      </td>
                      <td className="py-3 pr-4">{row.western}</td>
                      <td className="py-3 pr-4 font-medium text-[#2a1f1a]">
                        {row.holes}
                      </td>
                      <td className="py-3 pr-4 font-mono font-bold text-[#8b2e2e]">
                        {row.keycap}
                      </td>
                      <td className="py-3 leading-6">{row.tip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-t border-[#2a1f1a]/10 px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-3xl font-bold text-[#2a1f1a] sm:text-4xl">
              Choosing Your Bansuri Scale &amp; Daily Practice Routine
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#5d4a40]">
              Different bamboo lengths produce distinct concert keys and tonal
              characters. Whether you want a mellow bass flute for evening raga
              meditation or a crisp middle-register scale for Bollywood and
              devotional melodies, switching scales above lets you hear the
              difference immediately before buying a physical instrument.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {scaleGuide.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold text-[#8b2e2e] uppercase">
                    {item.pitch}
                  </p>
                  <h3 className="mt-1.5 text-xl font-semibold text-[#2a1f1a]">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#5d4a40]">
                    {item.use}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-[#8b2e2e]/15 bg-white/90 p-6 shadow-sm sm:p-8">
              <h3 className="font-serif text-2xl font-bold text-[#2a1f1a]">
                10-Minute Beginner Bansuri Practice Flow
              </h3>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {warmups.map((item) => (
                  <div
                    key={item.step}
                    className="border-l-2 border-[#8b2e2e]/40 pl-4"
                  >
                    <h4 className="text-base font-semibold text-[#8b2e2e]">
                      {item.step}
                    </h4>
                    <p className="mt-1.5 text-sm leading-7 text-[#5d4a40]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#2a1f1a]/10 bg-white/75 px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl font-bold text-[#2a1f1a]">
              Virtual Bansuri &amp; Flute Simulator FAQ
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
