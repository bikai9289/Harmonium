export type HarmoniumSeoLandingContent = {
  canonicalUrl: string;
  description: string;
  eyebrow: string;
  faqs: Array<{ question: string; answer: string }>;
  keywords: string;
  primaryHref?: string;
  primaryLabel?: string;
  quickPath?: string[];
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
      'Play online harmonium with instant browser play, no download, and no sign-up. Use laptop shortcuts, touch controls, Sa Re Ga Ma labels, and optional MIDI input.',
    eyebrow: 'Online harmonium',
    keywords:
      'online harmonium, play harmonium online, web harmonium, harmonium online, no download harmonium, Sa Re Ga Ma keyboard',
    primaryHref: '/keyboard?practice=riyaz',
    primaryLabel: 'Start riyaz',
    quickPath: [
      'Instant browser play with no download and no sign-up.',
      'Use laptop shortcuts, touch controls, or explicit MIDI input when you need a controller.',
      'Move from quick play into Set Sa, Sargam labels, and a short guided riyaz loop.',
    ],
    title: 'Online Harmonium - Instant Browser Play',
    sections: [
      {
        title: 'Start without installing anything',
        description:
          'The online harmonium opens directly in the browser, so instant browser play can start without an app, emulator, or account.',
        points: [
          'Instant browser play',
          'No download',
          'No sign-up',
          'Works with browser audio',
        ],
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
          'Switch between Sargam and western note labels while connecting visible keys to harmonium notes, short riyaz loops, and alankar patterns.',
        points: [
          'Sa Re Ga Ma labels',
          'Western note names',
          'Beginner practice patterns',
          'Alankar-friendly note movement',
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
          'Yes. Play Harmonium runs in the browser, so you can open the page for instant browser play without installing an app or emulator.',
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
      'Use a virtual harmonium in your browser for quick pitch reference, Sargam learning, laptop keyboard practice, touch input, optional MIDI control, and clear real harmonium limitations.',
    eyebrow: 'Virtual harmonium',
    keywords:
      'virtual harmonium, browser harmonium, web harmonium, online harmonium keyboard, virtual harmonium keyboard',
    primaryHref: '/keyboard?practice=find-sa',
    primaryLabel: 'Find Sa',
    quickPath: [
      'Use the virtual harmonium for pitch reference, Sargam learning, and short riyaz sessions.',
      'A real harmonium still gives bellows, reed response, and touch; this browser tool is for fast practice access.',
      'Continue into Set Sa, shruti reference, notes, tutorial, or the practice workbench when you want structure.',
    ],
    title: 'Virtual Harmonium Keyboard for Browser Practice',
    sections: [
      {
        title: 'A browser-based practice instrument',
        description:
          'The virtual harmonium gives singers and learners a fast pitch reference with Sargam labels and a familiar keyboard layout while staying honest about what a real harmonium does better.',
      },
      {
        title: 'Built for short daily riyaz sessions',
        description:
          'Use it for vocal warm-ups, bhajan or kirtan lines, raga exploration, alankar drills, ear training, and quick melody checks.',
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
          'No. A real harmonium has bellows, physical reeds, touch response, and acoustic depth. A virtual harmonium is useful for quick practice, note learning, Sa reference, and browser-based repetition.',
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
      'Learn harmonium notes with Sa Re Ga Ma, western note names, white and black key mapping, MIDI references, alankar drills, and beginner practice patterns.',
    eyebrow: 'Harmonium notes',
    keywords:
      'harmonium notes, Sargam notes, Sa Re Ga Ma, harmonium keyboard notes, web harmonium notes, alankar',
    primaryHref: '/keyboard?practice=alankar',
    primaryLabel: 'Practice alankar',
    quickPath: [
      'Review Sa Re Ga Ma, western note names, and Komal or Tivra variants.',
      'Play each note, then rehearse ascending, descending, and alankar patterns.',
      'Open the keyboard workbench when you are ready to use the notes in a guided alankar exercise.',
    ],
    title: 'Harmonium Notes - Sa Re Ga Ma, Alankar, and Keyboard Mapping',
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
          'Short ascending, descending, and alankar patterns help beginners memorize the keyboard without needing a full song first.',
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
      {
        question: 'Can I practice alankar with these notes?',
        answer:
          'Yes. Start with short ascending and descending Sargam movements, then repeat compact alankar patterns on the playable keyboard.',
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
    primaryHref: '/keyboard?practice=sargam',
    primaryLabel: 'Practice alankar',
    quickPath: [
      'Use printed keycaps to turn your laptop keyboard into a practice controller.',
      'Start with Sa Re Ga Ma, then add black keys and alankar movement gradually.',
      'No emulator or app install is required before practice.',
    ],
    title: 'Laptop Harmonium - Play with Your Keyboard',
    sections: [
      {
        title: '30-second quick start',
        description:
          'Open the practice workbench, focus the browser tab, start with the middle row, and play Sa Re Ga Ma with the printed keycaps.',
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
