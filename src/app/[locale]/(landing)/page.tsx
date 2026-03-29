import { setRequestLocale } from 'next-intl/server';

import { HarmoniumHome } from '@/shared/blocks/harmonium/home';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Play Harmonium Online | Web Harmonium',
  description:
    'Practice harmonium in your browser with touch, keyboard shortcuts, Sargam labels, octave controls, and transpose.',
  keywords:
    'web harmonium, online harmonium, play harmonium online, virtual harmonium, harmonium keyboard, sargam notes',
  canonicalUrl: '/',
});

const copy = {
  en: {
    badge: 'Browser-based practice tool',
    title: 'Play Harmonium Online Without Downloads',
    description:
      'Use a clean, responsive web harmonium with keyboard shortcuts, touch controls, Sargam labels, and quick settings for daily practice.',
    primaryCta: 'Start Playing',
    secondaryCta: 'Read Guides',
    trust: [
      'No download required',
      'Works on desktop and mobile',
      'Built for practice-first SEO traffic',
    ],
    featureTitle: 'Why this format fits the keyword',
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
      'Use a few practical pages to cover adjacent intent while the homepage targets the main keyword cluster.',
    guides: [
      {
        title: 'How to play harmonium online for free',
        href: '/blog',
        description:
          'A beginner-friendly walkthrough for first-time visitors who need context before they play.',
      },
      {
        title: 'Harmonium keyboard notes for beginners',
        href: '/blog',
        description:
          'Map the visual keys to note names and common practice patterns for SEO and retention.',
      },
      {
        title: 'Sargam notes guide for web practice',
        href: '/blog',
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
    seoTitle: 'Built to validate the keyword before heavy product work',
    seoDescription:
      'This first pass deliberately keeps the experience simple: playable instrument first, content second, SaaS features later.',
  },
  zh: {
    badge: '浏览器练习工具',
    title: '直接在线弹 Harmonium，不用下载',
    description:
      '这个版本优先解决搜索用户“马上能弹”的需求，提供键盘快捷键、触控演奏、Sargam 标注、八度和移调设置。',
    primaryCta: '开始演奏',
    secondaryCta: '查看指南',
    trust: ['免下载', '支持桌面和移动端', '先验证搜索需求，再加 SaaS'],
    featureTitle: '为什么首页要先做成工具页',
    featureDescription:
      '搜 web harmonium 的用户，核心诉求不是注册账号，而是立刻使用。首页先给可演奏键盘，才符合关键词意图。',
    features: [
      {
        title: '首屏直接可用',
        description:
          '用户进入页面后不用找入口，马上就能点按或用键盘演奏，减少流失。',
      },
      {
        title: '围绕练习场景设计',
        description:
          '八度、移调、标签切换这些控制项，比默认的 SaaS CTA 更符合真实使用场景。',
      },
      {
        title: '对 SEO 更友好',
        description:
          '工具页周围保留足够的可见文本、FAQ 和指南入口，更容易成为能收录和排名的页面。',
      },
    ],
    guideTitle: '内容页围绕工具展开',
    guideDescription:
      '首页打主词，文章页补长尾，这样最省事，也更适合你现有模板的博客能力。',
    guides: [
      {
        title: 'How to play harmonium online for free',
        href: '/blog',
        description: '承接第一次接触这个词的用户，告诉他怎么开始用。',
      },
      {
        title: 'Harmonium keyboard notes for beginners',
        href: '/blog',
        description: '解释键位、音名和基础映射，兼顾留存和长尾 SEO。',
      },
      {
        title: 'Sargam notes guide for web practice',
        href: '/blog',
        description: '把西方音名和 Sargam 联系起来，让页面更贴近真实练习。',
      },
    ],
    faqTitle: '常见问题',
    faqs: [
      {
        question: '这是要下载安装的软件吗？',
        answer: '不是。这个版本的目标就是让用户直接在浏览器里开始练习。',
      },
      {
        question: '需要注册账号才能使用吗？',
        answer: '核心演奏功能不需要。后续如果数据表现好，再接保存设置和会员能力。',
      },
      {
        question: '为什么首页就要放 Sargam 和移调？',
        answer: '因为这更符合真实练习需求，比先引导注册更有价值。',
      },
      {
        question: '后面还能接付费功能吗？',
        answer: '可以。这套模板已经有登录、支付、博客和设置页，等流量验证后再加就行。',
      },
    ],
    seoTitle: '先验证关键词，再决定要不要重投入',
    seoDescription:
      '这个首页版本刻意保持轻量：先把乐器做好用，再根据 GSC 和用户行为决定下一步。',
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
