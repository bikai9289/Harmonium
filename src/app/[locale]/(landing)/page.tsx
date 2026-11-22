import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { routing } from '@/core/i18n/config';
import { HarmoniumHome } from '@/shared/blocks/harmonium/home';
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createFaqJsonLd,
  JsonLd,
} from '@/shared/components/seo/json-ld';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;
export const dynamic = 'error';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = getMetadata({
  title: 'Web Harmonium - Play Free Online Harmonium Keyboard',
  description:
    'Play a free web harmonium online in your browser. Use laptop keyboard, touch, or MIDI with Sargam (Sa Re Ga Ma) notes, Tanpura drone, and transpose.',
  keywords:
    'web harmonium, online harmonium, harmonium keyboard online, play harmonium online, virtual harmonium, harmonium on laptop, harmonium notes, web harmonium song notes, Sa Re Ga Ma, sargam notes pdf, shruti box online, tanpura drone',
  canonicalUrl: '/',
});

const copy = {
  en: {
    badge: 'Free online harmonium keyboard',
    title: 'Web Harmonium – Play Online Harmonium Free',
    description:
      'Play a realistic web harmonium online directly in your browser with no download and no sign-up. Practice Sa Re Ga Ma Sargam notes, turn on the built-in Tanpura drone, play popular song notes, or connect a laptop keyboard, mobile touch screen, or MIDI controller.',
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
      'Find Sa',
      'Daily Riyaz',
      'Alankar Drills',
      'Indian Classical',
      'Vocal Warm-Ups',
      'Raga Exploration',
      'Bhajan & Kirtan',
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
    featureTitle: 'Web harmonium controls',
    featureHeading: 'Online harmonium keyboard features for daily practice',
    featureDescription:
      'Play naturally in the browser with the web harmonium controls singers, students, and musicians use for vocal riyaz, Sargam notes, Bollywood songs, raga practice, and devotional bhajans.',
    features: [
      {
        title: 'MIDI Support',
        description:
          'Use a MIDI keyboard after an explicit connect action, or keep playing with laptop shortcuts and touch controls.',
      },
      {
        title: 'Sargam + Western Labels',
        description:
          'Switch between Sa Re Ga Ma and western note names when learning raga phrases, alankar drills, or simple melodies.',
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
    practiceMapHeading:
      'Web harmonium practice paths for riyaz, raga, and devotional music',
    practiceMapDescription:
      'Choose a focused online harmonium path, pair your session with the Shruti Box drone, or explore interactive song notes without leaving the browser.',
    practiceMap: [
      {
        title: 'Find Sa',
        href: '/keyboard?practice=find-sa',
        description:
          'Use octave, transpose, and sustained Sargam labels to settle the tonic before singing.',
      },
      {
        title: 'Start riyaz',
        href: '/keyboard?practice=riyaz',
        description:
          'Start a short daily riyaz loop with held notes, slow movement, and pitch checks.',
      },
      {
        title: 'Try a raga phrase',
        href: '/keyboard?practice=raga',
        description:
          'Practice aroha, avaroha, and small raga phrases while keeping Sa stable.',
      },
      {
        title: 'Practice alankar',
        href: '/keyboard?practice=alankar',
        description:
          'Rehearse ascending, descending, and compact alankar patterns before moving to songs.',
      },
      {
        title: 'Rehearse bhajan or kirtan',
        href: '/keyboard?practice=bhajan',
        description:
          'Use the harmonium as a pitch and melody reference for devotional rehearsal.',
      },
      {
        title: 'Open Practice Workbench',
        href: '/keyboard',
        description:
          'Move into the focused keyboard with recording takes, notation, presets, and sessions.',
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
    guideHeading: 'Harmonium notes, laptop keyboard map, and Shruti Box',
    guideDescription:
      'Start with the web harmonium keyboard above, download the free Sargam notes PDF chart, or open the online Shruti Box for vocal riyaz.',
    guides: [
      {
        title: 'Harmonium notes & free Sargam PDF',
        href: '/harmonium-notes#sargam-pdf',
        description:
          'Review Sa Re Ga Ma, western note names, Alankar patterns, the 23-key layout, and print or download the free Sargam PDF cheat sheet.',
      },
      {
        title: 'Play harmonium on laptop keyboard',
        href: '/laptop-harmonium',
        description:
          'Learn the QWERTY key map (E R T Y U I O P) for playing web harmonium smoothly on any laptop keyboard.',
      },
      {
        title: 'Shruti Box online & Tanpura drone',
        href: '/shruti-box',
        description:
          'Practice vocal riyaz and Indian classical ragas with a continuous Sa–Pa or Sa–Ma Shruti Box drone across all 12 scales.',
      },
    ],
    faqTitle: 'Web Harmonium FAQ',
    faqHeading: 'Web harmonium & online harmonium questions',
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
          'Start in the middle octave, hold a comfortable note, then use transpose until the pitch matches your singing range. The find Sa guide gives a slower step-by-step path.',
      },
      {
        question: 'Can I use this for riyaz and alankar practice?',
        answer:
          'Yes. Use Sargam labels, octave, transpose, and short patterns to rehearse daily riyaz, alankar drills, and pitch stability before moving into longer raga phrases.',
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
    practiceMapHeading: 'Riyaz、Raga 与 devotional music 练习路径',
    practiceMapDescription:
      '选择一个具体练习方向，再进入可弹奏键盘、音名页面或教程模式。',
    practiceMap: [
      {
        title: 'Find Sa',
        href: '/keyboard?practice=find-sa',
        description: '用八度、移调和持续音找到适合自己声区的主音。',
      },
      {
        title: 'Start riyaz',
        href: '/keyboard?practice=riyaz',
        description: '用长音、慢速移动和音准检查开始日常短练习。',
      },
      {
        title: 'Try a raga phrase',
        href: '/keyboard?practice=raga',
        description: '围绕 Sa、aroha、avaroha 和短乐句做入门练习。',
      },
      {
        title: 'Practice alankar',
        href: '/keyboard?practice=alankar',
        description: '先练上行、下行和短模式，再进入歌曲或 raga。',
      },
      {
        title: 'Rehearse bhajan or kirtan',
        href: '/keyboard?practice=bhajan',
        description: '排练 devotional melody 时使用网页 harmonium 做音高参考。',
      },
      {
        title: '打开 Practice Workbench',
        href: '/keyboard',
        description: '进入完整键盘，使用 recording takes、notation、presets 和 sessions。',
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
      'Riyaz practice paths',
      'Alankar and Sargam drills',
      'Sa finding guidance',
    ],
    potentialAction: {
      '@type': 'PlayAction',
      target: homepageUrl,
    },
  };

  const serverHero = (
    <div className="mx-auto min-w-0 max-w-5xl space-y-2.5 text-center">
      <h1 className="font-serif text-3xl leading-[1.08] font-bold text-balance text-[#2a1f1a] sm:text-5xl lg:text-[46px]">
        {pageCopy.title}
      </h1>
      <p className="mx-auto max-w-3xl text-sm leading-6 text-pretty text-[#5d4a40] sm:text-base">
        {pageCopy.description}
      </p>
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-1.5">
        {pageCopy.useCases.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#c8633a]/20 bg-[#fffdf8] px-2.5 py-1 text-xs font-medium text-[#8b2e2e]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={createFaqJsonLd(pageCopy.faqs)} />
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: 'Play Harmonium', url: homepageUrl },
        ])}
      />
      <HarmoniumHome copy={pageCopy} serverHero={serverHero} />
    </>
  );
}
