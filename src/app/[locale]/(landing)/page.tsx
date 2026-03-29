import { setRequestLocale } from 'next-intl/server';

import { HarmoniumHome } from '@/shared/blocks/harmonium/home';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Web Harmonium Online | Play Harmonium',
  description:
    'Play web harmonium online in your browser with keyboard shortcuts, touch controls, Sargam labels, octave switching, transpose, and beginner guides.',
  keywords:
    'web harmonium, online harmonium, play harmonium online, virtual harmonium, harmonium keyboard, sargam notes',
  canonicalUrl: '/',
});

const copy = {
  en: {
    badge: 'Web harmonium practice tool',
    title: 'Web Harmonium Online for Daily Practice',
    description:
      'Use a clean, responsive web harmonium online with keyboard shortcuts, touch controls, Sargam labels, octave switching, transpose, and quick settings for daily practice.',
    primaryCta: 'Start Playing',
    secondaryCta: 'Read Guides',
    trust: [
      'No download required',
      'Works on desktop and mobile',
      'Built for practice-first SEO traffic',
    ],
    featureTitle: 'Why this web harmonium fits the keyword',
    featureDescription:
      'People searching for web harmonium want an instrument they can use immediately. The first version should feel like a useful practice surface, not a gated SaaS dashboard.',
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
    guideTitle: 'Launch content around the tool',
    guideDescription:
      'Use a few practical pages to cover adjacent intent while the homepage targets the main web harmonium keyword cluster.',
    guides: [
      {
        title: 'How to play web harmonium online for free',
        href: '/blog/how-to-play-harmonium-online-for-free',
        description:
          'A beginner-friendly walkthrough for first-time visitors who need context before they play.',
      },
      {
        title: 'Web harmonium keyboard notes for beginners',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description:
          'Map the visual keys to note names and common practice patterns for SEO and retention.',
      },
      {
        title: 'Sargam notes guide for web practice',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description:
          'Bridge western note labels and Indian notation so the tool feels useful for both audiences.',
      },
    ],
    faqTitle: 'FAQ',
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
    seoTitle: 'Built to validate the web harmonium keyword before heavy product work',
    seoDescription:
      'This first pass deliberately keeps the experience simple: playable instrument first, useful search text second, SaaS features later.',
  },
  zh: {
    badge: 'Web Harmonium 练习工具',
    title: 'Web Harmonium 在线练习页',
    description:
      '用浏览器直接练习 Web Harmonium，支持键盘快捷键、触控演奏、Sargam 标注、八度切换、移调和快速设置。',
    primaryCta: '开始演奏',
    secondaryCta: '查看指南',
    trust: ['无需下载', '支持桌面和移动端', '先验证搜索需求，再扩展产品'],
    featureTitle: '为什么首页要围绕 Web Harmonium 来做',
    featureDescription:
      '搜索 Web Harmonium 的用户核心诉求不是注册账号，而是立刻找到一个能演奏、能练习、能看懂键位的在线工具。',
    features: [
      {
        title: '首屏即可使用',
        description:
          '用户进入页面后就能立刻看到可演奏键盘，让搜索意图和落地页体验保持一致。',
      },
      {
        title: '围绕练习设计',
        description:
          '八度、移调、标签切换这些控制项，比传统 SaaS 首页里的注册按钮更符合真实使用场景。',
      },
      {
        title: '更适合 SEO',
        description:
          '工具页周围保留足够的介绍文本、FAQ 和内容入口，更容易被搜索引擎理解和收录。',
      },
    ],
    guideTitle: '让内容页围绕工具展开',
    guideDescription:
      '首页主打 Web Harmonium，文章页承接长尾关键词，这样更适合新站做 SEO 验证。',
    guides: [
      {
        title: '如何免费在线使用 Web Harmonium',
        href: '/blog/how-to-play-harmonium-online-for-free',
        description: '给第一次接触这个词的用户一个清晰的上手路径。',
      },
      {
        title: 'Web Harmonium 键位与音符入门',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description: '解释键位、音名与练习路径，帮助页面覆盖更多搜索需求。',
      },
      {
        title: 'Sargam 标注如何配合网页练习',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description: '帮助用户把西方音名和 Sargam 对应起来，降低使用门槛。',
      },
    ],
    faqTitle: '常见问题',
    faqs: [
      {
        question: '这是需要下载安装的软件吗？',
        answer: '不是。这个版本的目标就是让用户直接在浏览器里开始练习。',
      },
      {
        question: '需要先注册账号吗？',
        answer: '不需要。核心演奏功能保持开放，后续再根据数据决定是否增加会员能力。',
      },
      {
        question: '为什么首页就放 Sargam 和移调？',
        answer: '因为这更符合真实练习需求，比先引导注册更有价值。',
      },
      {
        question: '后面还能做付费功能吗？',
        answer: '可以。等搜索流量和使用数据稳定后，再接入高级功能和会员能力。',
      },
    ],
    seoTitle: '先把 Web Harmonium 关键词验证出来，再决定产品投入',
    seoDescription:
      '这个首页版本故意保持轻量：先把工具做好用，再根据 GSC 和用户行为决定下一步。',
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