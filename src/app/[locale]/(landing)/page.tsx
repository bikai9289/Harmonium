import { setRequestLocale } from 'next-intl/server';

import { HarmoniumHome } from '@/shared/blocks/harmonium/home';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Web Harmonium Online for Daily Practice | Play Harmonium',
  description:
    'Play Web Harmonium online in your browser with keyboard shortcuts, touch controls, Sargam labels, octave switching, transpose, and beginner-friendly guides.',
  keywords:
    'web harmonium, web harmonium online, online harmonium, play web harmonium online, virtual harmonium, harmonium keyboard, sargam notes',
  canonicalUrl: '/',
});

const copy = {
  en: {
    badge: 'No sign-up required',
    title: 'Play Web Harmonium Online, Then Learn It Fast',
    description:
      'Play Web Harmonium online with keyboard shortcuts, touch controls, Sargam labels, octave switching, transpose, and a clearer path into notes and tutorial practice.',
    primaryCta: 'Start Playing',
    secondaryCta: 'Start Tutorial',
    secondaryHref: '/tutorial',
    trust: [
      'No sign-up required',
      'Works on desktop and mobile',
      'Notes and tutorial included',
    ],
    featureTitle: 'Why people search Web Harmonium',
    featureDescription:
      'People searching for Web Harmonium want an instrument they can use immediately, plus a fast path into note learning. A strong landing page should feel like a playable tool with an obvious next step.',
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
        title: 'Web Harmonium notes and key mapping',
        href: '/notes',
        description:
          'Review the 23-key layout, shortcut map, and Sargam-to-western note relationships on one page.',
      },
      {
        title: 'Guided tutorial mode for beginners',
        href: '/tutorial',
        description:
          'Practice with highlighted target notes, autoplay demos, and simple note matching.',
      },
      {
        title: 'Beginner-friendly Web Harmonium guides',
        href: '/blog/how-to-play-harmonium-online-for-free',
        description:
          'Add broader context and practice tips once the user already understands the instrument.',
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
        question: 'Where should a new player start first?',
        answer:
          'Start on the notes page if you want the key map first, or use tutorial mode if you want a guided phrase to follow right away.',
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
    badge: 'Web Harmonium 在线练习工具',
    title: 'Web Harmonium 在线练习页',
    description:
      '直接在浏览器里 play Web Harmonium online，支持键盘快捷键、触控、Sargam 标注、八度切换、移调和日常练习所需的快捷设置。',
    primaryCta: '开始弹奏',
    secondaryCta: '阅读指南',
    trust: [
      '无需下载',
      '桌面和手机都可用',
      '先验证搜索需求，再扩展产品功能',
    ],
    featureTitle: '为什么用户会搜索 Web Harmonium',
    featureDescription:
      '搜索 Web Harmonium 的用户，通常想立刻打开一个可用的网页乐器，而不是先看到一个需要注册登录的 SaaS 首页。一个更强的 Web Harmonium 落地页，应该先满足演奏和练习意图。',
    features: [
      {
        title: '先弹再说',
        description:
          '首屏直接进入可演奏区域，让“搜到词”和“点进来后的体验”保持一致。',
      },
      {
        title: '围绕练习设计控制项',
        description:
          '把八度、移调、Sargam 切换这些真正影响练习体验的功能放在前面，而不是先推注册。',
      },
      {
        title: '工具页也能做 SEO',
        description:
          '页面保留清晰的可抓取文本、FAQ 和文章内链，让首页不只是工具，还能承接搜索流量。',
      },
    ],
    guideTitle: '围绕工具扩展 Web Harmonium 内容',
    guideDescription:
      '首页主打 Web Harmonium 这个新词，文章页去承接 play Web Harmonium online、键位说明、Sargam 练习等更细的搜索意图。',
    guides: [
      {
        title: '如何免费在线弹奏 Web Harmonium',
        href: '/blog/how-to-play-harmonium-online-for-free',
        description:
          '适合第一次接触这个词的用户，先解释它是什么，再引导开始练习。',
      },
      {
        title: 'Web Harmonium 键位与音名入门',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description:
          '把网页键位、音名和常见练习方式讲清楚，帮助首页承接更多长尾词。',
      },
      {
        title: 'Web Harmonium 的 Sargam 练习思路',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description:
          '把西方音名和印度记谱体系关联起来，让工具对更多学习者更有用。',
      },
    ],
    faqTitle: 'Web Harmonium 常见问题',
    faqs: [
      {
        question: '这是需要下载的软件吗？',
        answer:
          '不是。当前版本的目标就是让你在浏览器里直接开始练习，不需要额外下载安装。',
      },
      {
        question: '使用这个 harmonium 需要登录吗？',
        answer:
          '核心演奏体验不需要登录。后续如果流量和需求稳定，再考虑叠加账号和高级功能。',
      },
      {
        question: '为什么首页就放 Sargam 和移调？',
        answer:
          '因为这更贴近真实练习意图。对于搜索 Web Harmonium 的用户来说，这些控制项比 SaaS 式按钮更有价值。',
      },
      {
        question: '以后可以做成付费产品吗？',
        answer:
          '可以。现在先验证 Web Harmonium 这个词的需求强度，后面再根据搜索数据和用户行为决定是否增加会员功能。',
      },
    ],
    seoTitle: '先用 Web Harmonium 验证需求，再决定做多重产品化',
    seoDescription:
      '这一版刻意保持简单：先提供能直接弹奏的 Web Harmonium 工具，再补充可抓取的说明内容，最后再考虑更重的 SaaS 功能。',
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
