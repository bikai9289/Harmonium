import {
  ArrowRight,
  Keyboard,
  Music2,
  NotebookPen,
  Sparkles,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';

type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  quickPath?: string[];
  sections: Array<{
    title: string;
    description: string;
    points?: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

const icons = [Keyboard, NotebookPen, Sparkles, Music2];

export function HarmoniumSeoLandingPage({
  description,
  eyebrow,
  faqs,
  primaryHref = '/keyboard',
  primaryLabel = 'Open Web Harmonium Keyboard',
  quickPath = [
    'No download. No sign-up. Open the browser harmonium and play.',
    'Use laptop keyboard shortcuts, touch controls, or explicit MIDI connection when you need a controller.',
    'Switch between Sa Re Ga Ma and western note names while practicing.',
  ],
  sections,
  title,
}: SeoLandingPageProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#fbfaf7_100%)] font-sans text-[#2a1f1a]">
      <section className="border-b border-[#2a1f1a]/10 bg-white/72 px-4 pt-24 pb-12 sm:pt-28">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-[#8b2e2e] uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight font-bold text-[#2a1f1a] sm:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5d4a40] sm:text-lg">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-[#8b2e2e] text-white hover:bg-[#6f2424]"
              >
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#b77c4a]/30 bg-white text-[#7f4e2a]"
              >
                <Link href="/songs">Play Song Notes</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-[#8b2e2e]/15 bg-[#fffdf8] shadow-sm">
            <img
              alt="Traditional Indian handcrafted rosewood harmonium with ivory keys and brass stops"
              className="aspect-video w-full object-cover"
              src="/imgs/harmonium/indian-harmonium-hero.jpg"
            />
            <div className="p-5">
              <p className="text-sm font-semibold text-[#8b2e2e]">
                Quick practice path
              </p>
              <div className="mt-3 space-y-2.5 text-sm leading-6 text-[#6d5549]">
                {quickPath.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-18">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          {sections.map((section, index) => {
            const Icon = icons[index % icons.length];
            return (
              <article
                key={section.title}
                className="rounded-lg border border-[#2a1f1a]/10 bg-white/86 p-6 shadow-sm"
              >
                <Icon className="size-7 stroke-[1.5] text-[#8b2e2e]" />
                <h2 className="mt-5 text-2xl font-semibold text-[#2a1f1a]">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6d5549]">
                  {section.description}
                </p>
                {section.points?.length ? (
                  <ul className="mt-4 space-y-2 text-sm leading-7 text-[#6d5549]">
                    {section.points.map((point) => (
                      <li key={point}>- {point}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[#2a1f1a]/10 px-4 py-14 sm:py-18">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-4xl font-bold text-[#2a1f1a]">
            Common questions
          </h2>
          <div className="mt-8 divide-y divide-[#2a1f1a]/10 rounded-lg border border-[#2a1f1a]/10 bg-[#fffdf8]">
            {faqs.map((faq) => (
              <div key={faq.question} className="p-5">
                <h3 className="text-base font-semibold text-[#2a1f1a]">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#6d5549]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
