import { setRequestLocale } from 'next-intl/server';

import { HarmoniumHome } from '@/shared/blocks/harmonium/home';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Web Harmonium Online for Daily Practice | Play Harmonium',
  description:
    'Play Web Harmonium online in your browser with keyboard shortcuts, touch controls, Sargam labels, octave switching, transpose, and beginner-friendly guides.',
  keywords:
    'web harmonium, web harmonium online, online harmonium, play harmonium online, virtual harmonium, harmonium keyboard, sargam notes',
  canonicalUrl: '/',
});

const copy = {
  en: {
    badge: 'Web Harmonium practice tool',
    title: 'Web Harmonium Online for Daily Practice',
    description:
      'Use a clean, responsive Web Harmonium online with keyboard shortcuts, touch controls, Sargam labels, octave switching, transpose, and quick settings for daily practice.',
    primaryCta: 'Start Playing',
    secondaryCta: 'Read Guides',
    trust: [
      'No download required',
      'Works on desktop and mobile',
      'Built for practice-first SEO traffic',
    ],
    featureTitle: 'Why people search Web Harmonium',
    featureDescription:
      'People searching for Web Harmonium want an instrument they can use immediately. A strong Web Harmonium landing page should feel like a useful practice surface, not a gated SaaS dashboard.',
    features: [
      {
        title: 'Instant interaction',
        description:
          'The first screen opens directly into a playable keyboard so search intent and landing-page experience stay aligned.',
      },
      {
        title: 'Practice-focused controls',
        description:
          'Octave, transpose, and label toggles are surfaced up front because they matter more than account setup.',
      },
      {
        title: 'SEO-friendly structure',
        description:
          'The page keeps visible text, FAQs, and guide links around the tool so it can rank as a real content page.',
      },
    ],
    guideTitle: 'Build Web Harmonium content around the tool',
    guideDescription:
      'Use a few practical pages to cover adjacent intent while the homepage targets the main Web Harmonium keyword cluster and the exact Web Harmonium phrase.',
    guides: [
      {
        title: 'How to play Web Harmonium online for free',
        href: '/blog/how-to-play-harmonium-online-for-free',
        description:
          'A beginner-friendly walkthrough for first-time visitors who need context before they play.',
      },
      {
        title: 'Web Harmonium keyboard notes for beginners',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description:
          'Map the visual keys to note names and common practice patterns for SEO and retention.',
      },
      {
        title: 'Sargam notes guide for Web Harmonium practice',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description:
          'Bridge western note labels and Indian notation so the tool feels useful for both audiences.',
      },
    ],
    faqTitle: 'Web Harmonium FAQ',
    faqs: [
      {
        question: 'Is this a downloadable app?',
        answer:
          'No. The goal of this version is to keep practice inside the browser so users can start playing right away.',
      },
      {
        question: 'Do I need an account to use the harmonium?',
        answer:
          'No account is needed for the core experience. Authentication and paid features can be layered in later if the traffic sustains.',
      },
      {
        question: 'Why include Sargam and transpose controls on the homepage?',
        answer:
          'They match real practice intent better than generic SaaS actions and make the instrument useful much sooner.',
      },
      {
        question: 'Can this later become a paid product?',
        answer:
          'Yes. The current template already has auth, payments, blog, and settings pages, so premium features can be added after demand is validated.',
      },
    ],
    seoTitle: 'Built to validate the Web Harmonium keyword before heavy product work',
    seoDescription:
      'This first pass deliberately keeps the experience simple: playable Web Harmonium instrument first, useful search text second, SaaS features later.',
  },
  zh: {
    badge: 'Web Harmonium practice tool',
    title: 'Web Harmonium Online for Daily Practice',
    description:
      'Use a clean, responsive Web Harmonium online with keyboard shortcuts, touch controls, Sargam labels, octave switching, transpose, and quick settings for daily practice.',
    primaryCta: 'Start Playing',
    secondaryCta: 'Read Guides',
    trust: [
      'No download required',
      'Works on desktop and mobile',
      'Built for practice-first SEO traffic',
    ],
    featureTitle: 'Why people search Web Harmonium',
    featureDescription:
      'People searching for Web Harmonium want an instrument they can use immediately. A strong Web Harmonium landing page should feel like a useful practice surface, not a gated SaaS dashboard.',
    features: [
      {
        title: 'Instant interaction',
        description:
          'The first screen opens directly into a playable keyboard so search intent and landing-page experience stay aligned.',
      },
      {
        title: 'Practice-focused controls',
        description:
          'Octave, transpose, and label toggles are surfaced up front because they matter more than account setup.',
      },
      {
        title: 'SEO-friendly structure',
        description:
          'The page keeps visible text, FAQs, and guide links around the tool so it can rank as a real content page.',
      },
    ],
    guideTitle: 'Build Web Harmonium content around the tool',
    guideDescription:
      'Use a few practical pages to cover adjacent intent while the homepage targets the main Web Harmonium keyword cluster and the exact Web Harmonium phrase.',
    guides: [
      {
        title: 'How to play Web Harmonium online for free',
        href: '/blog/how-to-play-harmonium-online-for-free',
        description:
          'A beginner-friendly walkthrough for first-time visitors who need context before they play.',
      },
      {
        title: 'Web Harmonium keyboard notes for beginners',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description:
          'Map the visual keys to note names and common practice patterns for SEO and retention.',
      },
      {
        title: 'Sargam notes guide for Web Harmonium practice',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description:
          'Bridge western note labels and Indian notation so the tool feels useful for both audiences.',
      },
    ],
    faqTitle: 'Web Harmonium FAQ',
    faqs: [
      {
        question: 'Is this a downloadable app?',
        answer:
          'No. The goal of this version is to keep practice inside the browser so users can start playing right away.',
      },
      {
        question: 'Do I need an account to use the harmonium?',
        answer:
          'No account is needed for the core experience. Authentication and paid features can be layered in later if the traffic sustains.',
      },
      {
        question: 'Why include Sargam and transpose controls on the homepage?',
        answer:
          'They match real practice intent better than generic SaaS actions and make the instrument useful much sooner.',
      },
      {
        question: 'Can this later become a paid product?',
        answer:
          'Yes. The current template already has auth, payments, blog, and settings pages, so premium features can be added after demand is validated.',
      },
    ],
    seoTitle: 'Built to validate the Web Harmonium keyword before heavy product work',
    seoDescription:
      'This first pass deliberately keeps the experience simple: playable Web Harmonium instrument first, useful search text second, SaaS features later.',
  },
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <HarmoniumHome locale={locale} copy={locale === 'zh' ? copy.zh : copy.en} />
  );
}