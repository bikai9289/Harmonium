import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { HarmoniumHome } from '@/shared/blocks/harmonium/home';
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createFaqJsonLd,
  JsonLd,
} from '@/shared/components/seo/json-ld';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title:
    'Free Web Harmonium - Online & Virtual Harmonium Keyboard | Play Harmonium',
  description:
    'Play a free web harmonium online with no download and no sign-up. Use laptop keyboard shortcuts, Sargam labels, optional MIDI input, touch controls, and beginner practice guides.',
  keywords:
    'web harmonium, free web harmonium, online harmonium, play harmonium online, virtual harmonium, laptop harmonium, harmonium notes, Sa Re Ga Ma, sargam notes, no download harmonium',
  canonicalUrl: '/',
});

const copy = {
  en: {
    badge: 'Free browser instrument',
    title: 'Free Web Harmonium Online',
    description:
      'Play a free online harmonium and virtual harmonium in your browser with no download, no sign-up, Sargam labels, laptop keyboard shortcuts, MIDI support, transpose, and touch-friendly keys.',
    heroNote:
      'Use your laptop keyboard, touch screen, or MIDI keyboard to play a clear harmonium layout with Sa Re Ga Ma and western note labels.',
    primaryCta: 'Start Playing',
    secondaryCta: 'Learn Notes',
    secondaryHref: '/tutorial',
    trust: [
      'No download',
      'No sign-up',
      'Laptop keyboard shortcuts',
      'Works on desktop, tablet, and mobile',
      'Sargam and western labels',
    ],
    useCases: [
      'Indian Classical',
      'Vocal Warm-Ups',
      'Raga Exploration',
      'Bhajan & Kirtan',
      'Ear Training',
    ],
    quickStartOpen: 'Open',
    quickStarts: [
      {
        title: 'Online Harmonium',
        href: '/online-harmonium',
        description:
          'Play harmonium online with no download, no sign-up, keyboard shortcuts, and optional MIDI.',
      },
      {
        title: 'Harmonium Notes',
        href: '/harmonium-notes',
        description:
          'Review Sa Re Ga Ma, western notes, shortcuts, and beginner note patterns.',
      },
      {
        title: 'Laptop Harmonium',
        href: '/laptop-harmonium',
        description:
          'Learn how to use a laptop keyboard as a browser harmonium controller.',
      },
    ],
    keyboardEyebrow: 'Web Harmonium play surface',
    keyboardDescription:
      'Play with your laptop keyboard, touch screen, or MIDI controller while the full 23-key range stays close at hand.',
    playbackSample: 'Reference sample',
    playbackSynth: 'Fallback synth',
    featureTitle: 'Real practice features',
    featureHeading: 'Controls that match daily harmonium practice',
    featureDescription:
      'Play naturally in the browser with the controls singers, students, and harmonium players reach for during practice.',
    features: [
      {
        title: 'MIDI Support',
        description:
          'Use a MIDI keyboard after an explicit connect action, or keep playing with laptop shortcuts and touch controls.',
      },
      {
        title: 'Sargam + Western Labels',
        description:
          'Switch between Sa Re Ga Ma and western note names when learning raga phrases or simple melodies.',
      },
      {
        title: 'Reed + Reverb Layers',
        description:
          'Blend single or double reed tone and add room ambience when you want a fuller practice sound.',
      },
      {
        title: 'Transpose + Octave',
        description:
          'Move the instrument into a comfortable vocal range without relearning the visible key layout.',
      },
      {
        title: 'Mobile Touch',
        description:
          'Play on phones and tablets with touch-friendly keys and horizontal scrolling for the full range.',
      },
      {
        title: 'Local Sessions',
        description:
          'Keep your label mode, octave, transpose, volume, reed, reverb, and MIDI input ready for the next visit.',
      },
    ],
    intentTitle: 'Practice uses',
    intentHeading: 'A web harmonium for quick, focused music practice',
    intentDescription:
      'Open the instrument for a short vocal warm-up, a Sargam exercise, a bhajan melody, or a quick raga idea without setting up a full studio session.',
    intentCards: [
      {
        title: 'Find your Sa before singing',
        description:
          'Use transpose and octave controls to settle into a comfortable tonic before vocal practice.',
      },
      {
        title: 'Learn Sargam on the keyboard',
        description:
          'See Sa Re Ga Ma labels directly on the keys while you connect notation to sound.',
      },
      {
        title: 'Sketch raga and melody ideas',
        description:
          'Try phrases quickly with a warm harmonium tone, then repeat them with steadier timing.',
      },
      {
        title: 'Practice bhajan and kirtan lines',
        description:
          'Use the browser instrument for simple melodic support when rehearsing devotional songs.',
      },
    ],
    guideTitle: 'Learning paths',
    guideHeading: 'Move from first notes to steadier practice',
    guideDescription:
      'Start with the keyboard, learn the note layout, then use guided exercises when you want more structure.',
    guides: [
      {
        title: 'Harmonium notes and key mapping',
        href: '/harmonium-notes',
        description:
          'Review Sa Re Ga Ma, western note names, the 23-key layout, and shortcut map.',
      },
      {
        title: 'Laptop harmonium keyboard map',
        href: '/laptop-harmonium',
        description:
          'Learn the QWERTY key map for playing harmonium directly on a laptop keyboard.',
      },
      {
        title: 'Virtual harmonium browser practice',
        href: '/virtual-harmonium',
        description:
          'Understand how the browser instrument works for quick pitch reference and daily practice.',
      },
    ],
    faqTitle: 'Web Harmonium FAQ',
    faqHeading: 'Questions before you start playing',
    faqDescription:
      'A few quick answers for singers, learners, and keyboard players using Play Harmonium in the browser.',
    faqs: [
      {
        question: 'Can I play harmonium online without download or sign-up?',
        answer:
          'Yes. The core web harmonium opens in the browser with no download and no sign-up, so you can start with laptop keyboard or touch controls immediately.',
      },
      {
        question: 'Can I play harmonium on a laptop keyboard?',
        answer:
          'Yes. The keyboard page shows QWERTY shortcuts, and the laptop harmonium guide explains how to use those keys for daily practice.',
      },
      {
        question: 'What is Sa Re Ga Ma?',
        answer:
          'Sa Re Ga Ma is the Sargam note system used in Indian classical and devotional music. You can show those labels on the keys while you play.',
      },
      {
        question: 'How do I find Sa for my voice?',
        answer:
          'Start in the middle octave, hold a comfortable note, then use transpose until the pitch matches your singing range.',
      },
      {
        question: 'Can I use my MIDI keyboard?',
        answer:
          'Yes, on browsers that support Web MIDI. Connect your keyboard, choose the input, and play the harmonium sound from your controller.',
      },
      {
        question: 'Does it work on iPad and mobile?',
        answer:
          'Yes. The harmonium supports touch input and horizontal scrolling for smaller screens.',
      },
      {
        question: 'Is this suitable for kirtan and bhajan?',
        answer:
          'Yes. It works well as a quick pitch and melody reference for bhajan, kirtan, and other devotional singing practice.',
      },
      {
        question: 'How is this different from a real harmonium?',
        answer:
          'A real harmonium gives physical bellows and reed response. This web harmonium is for instant pitch reference, Sargam learning, MIDI practice, and quick daily repetition.',
      },
    ],
  },
  zh: {
    badge: '免费浏览器乐器',
    title: '免费在线 Harmonium',
    description:
      '直接在浏览器里弹奏，支持 MIDI、Sargam 和移调，适合印度古典、声乐热身、Bhajan 与 Kirtan。',
    heroNote:
      '你可以用电脑键盘、触控屏或 MIDI 键盘演奏，并在 Sargam 与西方音名之间自由切换。',
    primaryCta: '开始弹奏',
    secondaryCta: '学习音名',
    secondaryHref: '/tutorial',
    trust: ['无需下载', '桌面、平板、手机都可用', '支持 Sargam 和西方音名'],
    useCases: [
      '印度古典',
      '声乐热身',
      'Raga 探索',
      'Bhajan & Kirtan',
      '听音训练',
    ],
    quickStartOpen: '打开',
    quickStarts: [
      {
        title: '弹奏',
        href: '/keyboard',
        description: '已经熟悉键位时，直接打开完整 harmonium 键盘。',
      },
      {
        title: '音名',
        href: '/notes',
        description: '查看 Sargam、西方音名、快捷键和入门练习方式。',
      },
      {
        title: '教程',
        href: '/tutorial',
        description: '跟随高亮音符和自动示范进行基础练习。',
      },
    ],
    keyboardEyebrow: 'Web Harmonium 演奏区',
    keyboardDescription:
      '使用电脑键盘、触控屏或 MIDI 控制器演奏，完整 23 键范围就在页面中。',
    playbackSample: '采样音色',
    playbackSynth: '合成音色',
    featureTitle: '真实练习功能',
    featureHeading: '围绕日常 harmonium 练习设计的控制项',
    featureDescription:
      '无论是声乐学习者、印度古典音乐学生，还是需要快速找旋律的人，都可以在浏览器里直接开始。',
    features: [
      {
        title: 'MIDI 支持',
        description: '根据练习场景选择 MIDI 键盘、笔记本快捷键或手机触控。',
      },
      {
        title: 'Sargam + 西方音名',
        description:
          '练习 Raga 片段或简单旋律时，可以在 Sa Re Ga Ma 与西方音名之间切换。',
      },
      {
        title: '簧片 + 混响层次',
        description:
          '选择单簧片或双簧片音色，也可以加入房间混响，让练习声音更丰满。',
      },
      {
        title: '移调 + 八度',
        description: '不用重新记键位，也能把音高移动到更适合自己声区的位置。',
      },
      {
        title: '移动端触控',
        description: '手机和平板也能触控演奏，小屏幕可以横向滚动查看完整键盘。',
      },
      {
        title: '本地练习设置',
        description:
          '标签、八度、移调、音量、簧片、混响和 MIDI 输入会保留到下次访问。',
      },
    ],
    intentTitle: '练习场景',
    intentHeading: '适合快速、专注练习的 Web Harmonium',
    intentDescription:
      '打开页面就能做声乐热身、Sargam 练习、Bhajan 旋律复习，或快速尝试一个 Raga 乐句。',
    intentCards: [
      {
        title: '唱歌前找到主音 Sa',
        description: '用八度和移调控制找到舒服的音高，再开始声乐练习。',
      },
      {
        title: '在键盘上学习 Sargam',
        description: '直接在琴键上看到 Sa Re Ga Ma，把记谱和声音连接起来。',
      },
      {
        title: '快速记录 Raga 与旋律想法',
        description: '用温暖的 harmonium 音色试弹短句，再反复练稳。',
      },
      {
        title: '练习 Bhajan 和 Kirtan 旋律',
        description: '排练 devotional song 时，用网页乐器做简单旋律支撑。',
      },
    ],
    guideTitle: '学习路径',
    guideHeading: '从第一组音开始，逐步进入稳定练习',
    guideDescription:
      '先打开键盘，再熟悉音名和快捷键，需要结构化练习时进入教程模式。',
    guides: [
      {
        title: 'Web Harmonium 键位与音名',
        href: '/notes',
        description: '查看 23 键布局、快捷键，以及 Sargam 和西方音名关系。',
      },
      {
        title: '新手引导练习',
        href: '/tutorial',
        description: '跟随高亮音符、自动示范和基础短句一步步练习。',
      },
      {
        title: 'Web Harmonium 入门指南',
        href: '/blog/harmonium-keyboard-notes-for-beginners',
        description: '阅读键位、音名和日常练习建议，建立简单练习流程。',
      },
    ],
    faqTitle: 'Web Harmonium 常见问题',
    faqHeading: '开始弹奏前的几个问题',
    faqDescription: '给声乐学习者、键盘玩家和 harmonium 初学者的快速说明。',
    faqs: [
      {
        question: '什么是 Sa Re Ga Ma？',
        answer:
          'Sa Re Ga Ma 是印度古典和 devotional music 中常用的 Sargam 音名系统。你可以直接把这些标注显示在琴键上。',
      },
      {
        question: '怎样找到适合自己声音的 Sa？',
        answer:
          '从中间八度开始，按住一个舒服的音，再用移调功能调整到适合你声区的位置。',
      },
      {
        question: '可以连接 MIDI 键盘吗？',
        answer:
          '可以，在支持 Web MIDI 的浏览器中连接键盘，选择输入设备后就能用 MIDI 控制 harmonium 音色。',
      },
      {
        question: 'iPad 和手机能用吗？',
        answer: '可以。页面支持触控输入，小屏幕上可以横向滚动查看完整键盘。',
      },
      {
        question: '适合 Kirtan 和 Bhajan 吗？',
        answer:
          '适合。它可以作为快速音高参考和旋律练习工具，用于 Bhajan、Kirtan 和 devotional singing。',
      },
      {
        question: '它和实体 Harmonium 有什么不同？',
        answer:
          '实体 harmonium 有风箱、触感和真实簧片反应；Web Harmonium 更适合快速找音、学习 Sargam、连接 MIDI 和日常短时间重复练习。',
      },
    ],
  },
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pageCopy = locale === 'zh' ? copy.zh : copy.en;
  const homepageUrl = absoluteUrl(
    envConfigs.app_url,
    locale === envConfigs.locale ? '/' : `/${locale}`
  );
  const keyboardUrl = absoluteUrl(
    envConfigs.app_url,
    locale === envConfigs.locale ? '/keyboard' : `/${locale}/keyboard`
  );

  const webApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Play Harmonium',
    alternateName: 'Free Web Harmonium',
    url: homepageUrl,
    applicationCategory: 'MusicApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires a modern browser with Web Audio support.',
    description: pageCopy.description,
    inLanguage: locale,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      ...pageCopy.useCases,
      'Sargam note labels',
      'Western note labels',
      'MIDI keyboard input',
      'Touch controls',
      'Transpose',
      'Reed and reverb settings',
    ],
    potentialAction: {
      '@type': 'PlayAction',
      target: keyboardUrl,
    },
  };

  return (
    <>
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={createFaqJsonLd(pageCopy.faqs)} />
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: 'Play Harmonium', url: homepageUrl },
        ])}
      />
      <HarmoniumHome copy={pageCopy} />
    </>
  );
}
