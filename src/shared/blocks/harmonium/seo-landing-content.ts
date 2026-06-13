export type HarmoniumSeoLandingContent = {
  canonicalUrl: string;
  description: string;
  eyebrow: string;
  faqs: Array<{ question: string; answer: string }>;
  keywords: string;
  primaryHref?: string;
  primaryLabel?: string;
  sections: Array<{
    title: string;
    description: string;
    points?: string[];
  }>;
  title: string;
};

export const harmoniumSeoLandingContent = {
  online: {
    canonicalUrl: '/online-harmonium',
    description:
      'Play online harmonium in your browser with no download and no sign-up. Use laptop keyboard shortcuts, touch controls, Sa Re Ga Ma labels, and optional MIDI input.',
    eyebrow: 'Online harmonium',
    keywords:
      'online harmonium, play harmonium online, web harmonium, harmonium online, no download harmonium, Sa Re Ga Ma keyboard',
    primaryHref: '/keyboard',
    primaryLabel: 'Play Online Harmonium',
    title: 'Online Harmonium - Play in Your Browser',
    sections: [
      {
        title: 'Start without installing anything',
        description:
          'The online harmonium opens directly in the browser, so practice can start without an app, emulator, or account.',
        points: ['No download', 'No sign-up', 'Works with browser audio'],
      },
      {
        title: 'Use laptop keyboard or touch',
        description:
          'The playable keyboard supports QWERTY shortcuts and touch controls, so desktop, tablet, and mobile practice stay accessible.',
        points: [
          'Laptop keyboard shortcuts',
          'Touch-friendly keys',
          'Horizontal scrolling on small screens',
        ],
      },
      {
        title: 'Learn with Sa Re Ga Ma labels',
        description:
          'Switch between Sargam and western note labels while connecting visible keys to harmonium notes.',
        points: [
          'Sa Re Ga Ma labels',
          'Western note names',
          'Beginner practice patterns',
        ],
      },
      {
        title: 'Connect MIDI when you need it',
        description:
          'MIDI input is available after you explicitly request access, while normal touch and keyboard play remain available without permission.',
      },
    ],
    faqs: [
      {
        question: 'Can I play harmonium online without downloading an app?',
        answer:
          'Yes. Play Harmonium runs in the browser, so you can open the page and play without installing an app or emulator.',
      },
      {
        question: 'Do I need to sign up?',
        answer: 'No. The core online harmonium is available without sign-up.',
      },
      {
        question: 'Can I use a laptop keyboard?',
        answer:
          'Yes. The playable keyboard includes QWERTY shortcuts for laptop practice.',
      },
    ],
  },
  virtual: {
    canonicalUrl: '/virtual-harmonium',
    description:
      'Use a virtual harmonium in your browser for quick pitch reference, Sargam learning, laptop keyboard practice, touch input, and optional MIDI control.',
    eyebrow: 'Virtual harmonium',
    keywords:
      'virtual harmonium, browser harmonium, web harmonium, online harmonium keyboard, virtual harmonium keyboard',
    primaryHref: '/keyboard',
    primaryLabel: 'Open Virtual Harmonium',
    title: 'Virtual Harmonium Keyboard for Browser Practice',
    sections: [
      {
        title: 'A browser-based practice instrument',
        description:
          'The virtual harmonium gives singers and learners a fast pitch reference with Sargam labels and a familiar keyboard layout.',
      },
      {
        title: 'Built for short daily sessions',
        description:
          'Use it for vocal warm-ups, bhajan or kirtan lines, raga exploration, ear training, and quick melody checks.',
      },
      {
        title: 'No sign-up needed for core play',
        description:
          'Open the virtual harmonium and play immediately. MIDI remains optional and only asks for access after user intent.',
      },
      {
        title: 'Move into guided learning',
        description:
          'After exploring the virtual keyboard, continue into notes and tutorial pages for structured practice.',
        points: ['Harmonium notes', 'Guided tutorial', 'Keyboard shortcuts'],
      },
    ],
    faqs: [
      {
        question: 'What is a virtual harmonium?',
        answer:
          'A virtual harmonium is a browser-based instrument that imitates a harmonium-style keyboard for practice and pitch reference.',
      },
      {
        question: 'Is it the same as a real harmonium?',
        answer:
          'No. A real harmonium has bellows and physical reeds. A virtual harmonium is useful for quick practice, note learning, and browser-based repetition.',
      },
      {
        question: 'Can I practice Sa Re Ga Ma on it?',
        answer:
          'Yes. The keyboard can show Sargam labels so you can connect Sa Re Ga Ma to pitch and key position.',
      },
    ],
  },
  notes: {
    canonicalUrl: '/harmonium-notes',
    description:
      'Learn harmonium notes with Sa Re Ga Ma, western note names, white and black key mapping, MIDI references, and beginner practice patterns.',
    eyebrow: 'Harmonium notes',
    keywords:
      'harmonium notes, Sargam notes, Sa Re Ga Ma, harmonium keyboard notes, web harmonium notes',
    primaryHref: '/notes',
    primaryLabel: 'Open Playable Notes',
    title: 'Harmonium Notes - Sa Re Ga Ma and Keyboard Mapping',
    sections: [
      {
        title: 'The core Sa Re Ga Ma notes',
        description:
          'Start with Sa, Re, Ga, Ma, Pa, Dha, Ni, and upper Sa before adding altered notes.',
        points: [
          'Sa / C',
          'Re / D',
          'Ga / E',
          'Ma / F',
          'Pa / G',
          'Dha / A',
          'Ni / B',
        ],
      },
      {
        title: 'White and black key mapping',
        description:
          'Use the note map to connect harmonium notes, western notes, MIDI numbers, and browser keycaps.',
      },
      {
        title: 'Practice in small patterns',
        description:
          'Short ascending and descending patterns help beginners memorize the keyboard without needing a full song first.',
      },
      {
        title: 'Move from reference to playing',
        description:
          'Use this guide as the explanation layer, then open the playable notes or full keyboard for live practice.',
      },
    ],
    faqs: [
      {
        question: 'What are the basic harmonium notes?',
        answer:
          'The core notes are Sa, Re, Ga, Ma, Pa, Dha, and Ni. They correspond to western pitch names when a tonic is selected.',
      },
      {
        question: 'What are Komal and Tivra notes?',
        answer:
          'Komal notes are lowered forms and Tivra Ma is a raised Ma. They appear on black keys in the browser layout.',
      },
      {
        question: 'Can I hear each note?',
        answer:
          'Yes. Open the playable notes page to click individual notes and hear their pitch.',
      },
    ],
  },
  laptop: {
    canonicalUrl: '/laptop-harmonium',
    description:
      'Play laptop harmonium with browser keyboard shortcuts. Learn the QWERTY key map, start with Sa Re Ga Ma, and practice without an app, emulator, or download.',
    eyebrow: 'Laptop harmonium',
    keywords:
      'laptop harmonium, play harmonium on laptop, laptop keyboard harmonium, harmonium keyboard online, no emulator harmonium',
    primaryHref: '/keyboard',
    primaryLabel: 'Open Laptop Harmonium',
    title: 'Laptop Harmonium - Play with Your Keyboard',
    sections: [
      {
        title: '30-second quick start',
        description:
          'Open the keyboard page, focus the browser tab, start with the middle row, and play Sa Re Ga Ma with the printed keycaps.',
        points: [
          'Open the player',
          'Focus the browser tab',
          'Start with E R T Y U',
        ],
      },
      {
        title: 'No app or emulator required',
        description:
          'The laptop harmonium works directly in a modern browser, so there is no extra software to install before practice.',
        points: ['No app', 'No emulator', 'No download'],
      },
      {
        title: 'Learn the laptop key map',
        description:
          'White keys and black keys are printed on the harmonium surface so the laptop keyboard becomes a practice controller.',
      },
      {
        title: 'Add MIDI later if needed',
        description:
          'Laptop keys are enough to start. If you connect a MIDI controller, access is requested only after you choose to refresh or connect MIDI.',
      },
    ],
    faqs: [
      {
        question: 'Can I play harmonium on a laptop keyboard?',
        answer:
          'Yes. The web harmonium maps notes to visible QWERTY keycaps so you can practice on a laptop keyboard.',
      },
      {
        question: 'Do I need an emulator?',
        answer:
          'No. The laptop harmonium runs in the browser and does not require an emulator.',
      },
      {
        question: 'Which keys should I learn first?',
        answer:
          'Start with the middle range and follow the printed keycaps on the keyboard page before adding black keys.',
      },
    ],
  },
} satisfies Record<string, HarmoniumSeoLandingContent>;
