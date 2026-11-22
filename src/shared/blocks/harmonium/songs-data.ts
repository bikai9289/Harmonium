export type SongNoteStep = {
  noteId: string;
  durationMs: number;
};

export type SongLine = {
  label: string;
  lyricHint: string;
  steps: SongNoteStep[];
};

export type HarmoniumSong = {
  slug: string;
  title: string;
  artist: string;
  category: 'Bollywood' | 'Bhajan & Aarti' | 'Patriotic' | 'Classical';
  difficulty: 'Beginner' | 'Easy' | 'Intermediate';
  scale: string;
  ragaOrThaat: string;
  tempoBpm: number;
  transpose: number;
  summary: string;
  description: string;
  keywords: string;
  tips: string[];
  lines: SongLine[];
  faqs: Array<{ question: string; answer: string }>;
};

export const HARMONIUM_SONGS: HarmoniumSong[] = [
  {
    slug: 'tum-hi-ho',
    title: 'Tum Hi Ho',
    artist: 'Aashiqui 2 (Arijit Singh)',
    category: 'Bollywood',
    difficulty: 'Easy',
    scale: 'C / C# Minor (Komal Ga, Dha, Ni)',
    ragaOrThaat: 'Asavari Thaat',
    tempoBpm: 94,
    transpose: 0,
    summary:
      'Play the signature Tum Hi Ho chorus on web harmonium with interactive Sargam notes, laptop keycaps, and slow demo playback.',
    description:
      'Learn Tum Hi Ho harmonium notes in Sargam (Sa Re Ga Ma) and western notation. Play along directly on our free web harmonium keyboard with highlighted keys and tempo control.',
    keywords:
      'tum hi ho harmonium notes, tum hi ho sargam notes, tum hi ho web harmonium, aashiqui 2 harmonium notes',
    tips: [
      'Use Komal Ga (D# / key 5) and Komal Ni (A# / key 9) for the emotional minor feel.',
      'Start at 0.75x speed and hold the final note of each phrase smoothly before moving on.',
      'Turn on the Sa–Pa Tanpura drone to keep your pitch grounded while singing along.',
    ],
    lines: [
      {
        label: 'Line 1',
        lyricHint: 'Hum tere bin ab reh nahi sakte',
        steps: [
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'g4', durationMs: 520 },
          { noteId: 'g4', durationMs: 360 },
          { noteId: 'f4', durationMs: 380 },
          { noteId: 'dsharp4', durationMs: 420 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'c4', durationMs: 650 },
        ],
      },
      {
        label: 'Line 2',
        lyricHint: 'Tere bina kya wajood mera',
        steps: [
          { noteId: 'c4', durationMs: 380 },
          { noteId: 'd4', durationMs: 380 },
          { noteId: 'dsharp4', durationMs: 460 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'dsharp4', durationMs: 380 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'c4', durationMs: 680 },
        ],
      },
      {
        label: 'Chorus',
        lyricHint: 'Kyunki tum hi ho, ab tum hi ho',
        steps: [
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'gsharp4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'dsharp4', durationMs: 560 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'dsharp4', durationMs: 420 },
          { noteId: 'd4', durationMs: 680 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Which scale is easiest for playing Tum Hi Ho on harmonium?',
        answer:
          'Practicing with C as Sa (using Komal Ga and Komal Dha) makes the key layout easy to read on a laptop keyboard. Use Transpose +1 or +5 to match the original vocal key.',
      },
      {
        question: 'Can I play Tum Hi Ho on a laptop keyboard?',
        answer:
          'Yes. Press Play Demo above to watch the highlighted keys, then follow the QWERTY keycaps shown under each Sargam note.',
      },
    ],
  },
  {
    slug: 'kal-ho-naa-ho',
    title: 'Kal Ho Naa Ho',
    artist: 'Sonu Nigam (Shankar–Ehsaan–Loy)',
    category: 'Bollywood',
    difficulty: 'Beginner',
    scale: 'C Major (All Shuddha Swaras)',
    ragaOrThaat: 'Bilawal Thaat',
    tempoBpm: 88,
    transpose: 0,
    summary:
      'One of the easiest Bollywood melodies for harmonium beginners, using clean Shuddha (white-key) Sargam notes.',
    description:
      'Play Kal Ho Naa Ho harmonium notes online with Sa Re Ga Ma Sargam labels, western notes, and interactive keyboard playback.',
    keywords:
      'kal ho naa ho harmonium notes, kal ho naa ho sargam notes, easy bollywood harmonium notes',
    tips: [
      'Every note in this beginner arrangement sits on white keys (Bilawal Thaat), making it ideal for your first song.',
      'Focus on smooth transitions between Ga, Ma, and Pa without lifting your fingers abruptly.',
    ],
    lines: [
      {
        label: 'Line 1',
        lyricHint: 'Har ghadi badal rahi hai roop zindagi',
        steps: [
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'a4', durationMs: 520 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'e4', durationMs: 650 },
        ],
      },
      {
        label: 'Line 2',
        lyricHint: 'Chhaaon hai kabhi, kabhi hai dhoop zindagi',
        steps: [
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'a4', durationMs: 520 },
          { noteId: 'b4', durationMs: 420 },
          { noteId: 'a4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 650 },
        ],
      },
      {
        label: 'Chorus',
        lyricHint: 'Jo hai samaa, kal ho naa ho',
        steps: [
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'a4', durationMs: 460 },
          { noteId: 'c5', durationMs: 560 },
          { noteId: 'b4', durationMs: 420 },
          { noteId: 'a4', durationMs: 420 },
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 700 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Kal Ho Naa Ho good for harmonium beginners?',
        answer:
          'Yes. Its slow tempo and Bilawal Thaat (all natural notes) make it one of the best starter melodies for learning Sargam flow.',
      },
    ],
  },
  {
    slug: 'jana-gana-mana',
    title: 'Jana Gana Mana',
    artist: 'Indian National Anthem (Rabindranath Tagore)',
    category: 'Patriotic',
    difficulty: 'Beginner',
    scale: 'C Major (Bilawal Thaat)',
    ragaOrThaat: 'Raag Alhaiya Bilawal',
    tempoBpm: 100,
    transpose: 0,
    summary:
      'Practice Jana Gana Mana harmonium notes with clear Sa Re Ga Ma notation and authentic Alhaiya Bilawal phrasing.',
    description:
      'Learn Jana Gana Mana on web harmonium with complete Sargam notes (Sa Re Ga Ma Pa Dha Ni), laptop keyboard keys, and interactive audio playback.',
    keywords:
      'jana gana mana harmonium notes, national anthem harmonium notes, jana gana mana sargam notes',
    tips: [
      'Keep a steady march-like tempo so every syllable lands evenly on the beat.',
      'Practice Line 1 and Line 2 slowly until the leap from Ga to Pa feels natural.',
    ],
    lines: [
      {
        label: 'Line 1',
        lyricHint: 'Jana gana mana adhinayaka jaya he',
        steps: [
          { noteId: 'c4', durationMs: 380 },
          { noteId: 'd4', durationMs: 380 },
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'd4', durationMs: 380 },
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'f4', durationMs: 620 },
        ],
      },
      {
        label: 'Line 2',
        lyricHint: 'Bharata bhagya vidhata',
        steps: [
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'd4', durationMs: 380 },
          { noteId: 'd4', durationMs: 380 },
          { noteId: 'b3', durationMs: 420 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'c4', durationMs: 700 },
        ],
      },
      {
        label: 'Line 3',
        lyricHint: 'Punjaba Sindhu Gujarata Maratha',
        steps: [
          { noteId: 'c4', durationMs: 420 },
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'fsharp4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'a4', durationMs: 420 },
          { noteId: 'g4', durationMs: 640 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Which raga is Jana Gana Mana based on?',
        answer:
          'Jana Gana Mana is set in Raag Alhaiya Bilawal, which primarily uses Shuddha Swaras with an occasional touch of Tivra Ma or Komal Ni.',
      },
    ],
  },
  {
    slug: 'arz-kiya-hai',
    title: 'Arz Kiya Hai',
    artist: 'Popular Harmonium Practice Melody',
    category: 'Bollywood',
    difficulty: 'Easy',
    scale: 'C Major / Natural Scale',
    ragaOrThaat: 'Bilawal / Khamaj Feel',
    tempoBpm: 92,
    transpose: 0,
    summary:
      'Practice the viral Arz Kiya Hai web harmonium notes with interactive Sargam keys and laptop keyboard shortcuts.',
    description:
      'Play Arz Kiya Hai web harmonium notes online. Follow highlighted Sa Re Ga Ma keys, western notes, and QWERTY shortcuts in your browser.',
    keywords:
      'arz kiya hai web harmonium notes, arz kiya hai harmonium notes, arz kiya hai sargam notes',
    tips: [
      'Keep your right hand relaxed across middle-octave Sa, Re, Ga, Ma, and Pa.',
      'Use double-reed mode for a richer acoustic harmonium tone.',
    ],
    lines: [
      {
        label: 'Opening Phrase',
        lyricHint: 'Arz kiya hai...',
        steps: [
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'a4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 620 },
        ],
      },
      {
        label: 'Response Phrase',
        lyricHint: 'Main theme resolution',
        steps: [
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'c4', durationMs: 680 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I play Arz Kiya Hai on mobile?',
        answer:
          'Yes. Tap Play Demo to hear the melody and watch the highlighted keys, then play directly on the touch harmonium surface.',
      },
    ],
  },
  {
    slug: 'om-jai-jagdish-hare',
    title: 'Om Jai Jagdish Hare',
    artist: 'Traditional Hindu Aarti',
    category: 'Bhajan & Aarti',
    difficulty: 'Beginner',
    scale: 'C Major (Bilawal Thaat)',
    ragaOrThaat: 'Bilawal Thaat',
    tempoBpm: 96,
    transpose: 0,
    summary:
      'Play the classic Om Jai Jagdish Hare Aarti on web harmonium with easy beginner Sargam notes and live demo playback.',
    description:
      'Learn Om Jai Jagdish Hare harmonium notes in Sa Re Ga Ma Sargam notation. Practice devotional Aarti melodies free in your browser.',
    keywords:
      'om jai jagdish hare harmonium notes, aarti harmonium notes, bhajan harmonium sargam',
    tips: [
      'Aarti melodies rely on clear, steady phrasing—avoid rushing the sustained Pa and Sa notes.',
      'Enable Room Reverb and Double Reed for a warm temple-style harmonium sound.',
    ],
    lines: [
      {
        label: 'Line 1',
        lyricHint: 'Om jai Jagdish hare',
        steps: [
          { noteId: 'c4', durationMs: 520 },
          { noteId: 'c4', durationMs: 360 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'd4', durationMs: 620 },
        ],
      },
      {
        label: 'Line 2',
        lyricHint: 'Swami jai Jagdish hare',
        steps: [
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'g4', durationMs: 480 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'd4', durationMs: 620 },
        ],
      },
      {
        label: 'Line 3',
        lyricHint: 'Bhakt jano ke sankat, kshan mein door kare',
        steps: [
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'a4', durationMs: 460 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'c4', durationMs: 700 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Om Jai Jagdish Hare easy to play on harmonium?',
        answer:
          'Yes. It stays within a compact 6-note range (Sa to Dha) on all white keys, making it perfect for beginners and devotional singing.',
      },
    ],
  },
  {
    slug: 'achyutam-keshavam',
    title: 'Achyutam Keshavam',
    artist: 'Traditional Krishna Bhajan',
    category: 'Bhajan & Aarti',
    difficulty: 'Beginner',
    scale: 'C Major (Bilawal / Bhupali feel)',
    ragaOrThaat: 'Bhupali / Bilawal',
    tempoBpm: 92,
    transpose: 0,
    summary:
      'A peaceful Krishna bhajan with repetitive, meditative Sargam phrases that are easy to memorize on web harmonium.',
    description:
      'Practice Achyutam Keshavam harmonium notes with Sa Re Ga Ma Sargam labels, audio playback, and Tanpura drone support.',
    keywords:
      'achyutam keshavam harmonium notes, krishna bhajan harmonium notes, easy bhajan sargam',
    tips: [
      'Repeat each line twice while singing along to build ear-to-finger coordination.',
      'Use Transpose to shift Sa to your comfortable vocal scale before rehearsing.',
    ],
    lines: [
      {
        label: 'Line 1',
        lyricHint: 'Achyutam Keshavam Krishna Damodaram',
        steps: [
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'g4', durationMs: 400 },
          { noteId: 'g4', durationMs: 400 },
          { noteId: 'a4', durationMs: 440 },
          { noteId: 'g4', durationMs: 400 },
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'd4', durationMs: 400 },
          { noteId: 'c4', durationMs: 640 },
        ],
      },
      {
        label: 'Line 2',
        lyricHint: 'Rama Narayanam Janaki Vallabham',
        steps: [
          { noteId: 'd4', durationMs: 400 },
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'g4', durationMs: 440 },
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'd4', durationMs: 400 },
          { noteId: 'c4', durationMs: 400 },
          { noteId: 'd4', durationMs: 400 },
          { noteId: 'c4', durationMs: 680 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Which Tanpura drone works best with Achyutam Keshavam?',
        answer:
          'Use the Sa–Pa drone mode so the fifth (Pa / G) supports the bright pentatonic melody.',
      },
    ],
  },
  {
    slug: 'raghupati-raghav-raja-ram',
    title: 'Raghupati Raghav Raja Ram',
    artist: 'Traditional Ram Dhun',
    category: 'Bhajan & Aarti',
    difficulty: 'Beginner',
    scale: 'C Major (Khamaj / Bilawal)',
    ragaOrThaat: 'Raag Mishra Pilu / Bilawal',
    tempoBpm: 96,
    transpose: 0,
    summary:
      'Learn the timeless Ram Dhun bhajan on online harmonium with step-by-step Sargam notes and kirtan-ready drone.',
    description:
      'Play Raghupati Raghav Raja Ram harmonium notes in your browser with interactive Sargam keyboard highlighting and slow practice mode.',
    keywords:
      'raghupati raghav raja ram harmonium notes, ram dhun harmonium notes, kirtan harmonium notes',
    tips: [
      'Great for group kirtan call-and-response: play Line 1, pause, and repeat.',
    ],
    lines: [
      {
        label: 'Line 1',
        lyricHint: 'Raghupati Raghav Raja Ram',
        steps: [
          { noteId: 'c4', durationMs: 400 },
          { noteId: 'd4', durationMs: 400 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'f4', durationMs: 400 },
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'd4', durationMs: 620 },
        ],
      },
      {
        label: 'Line 2',
        lyricHint: 'Patita Pavan Sita Ram',
        steps: [
          { noteId: 'd4', durationMs: 400 },
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'd4', durationMs: 400 },
          { noteId: 'c4', durationMs: 680 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can beginners play Raghupati Raghav Raja Ram in 5 minutes?',
        answer:
          'Yes. It uses only five adjacent white keys (Sa, Re, Ga, Ma, Pa), making it one of the fastest bhajans to learn.',
      },
    ],
  },
  {
    slug: 'lag-ja-gale',
    title: 'Lag Ja Gale',
    artist: 'Lata Mangeshkar (Madan Mohan)',
    category: 'Bollywood',
    difficulty: 'Intermediate',
    scale: 'C / Raag Pahadi Feel',
    ragaOrThaat: 'Raag Pahadi',
    tempoBpm: 76,
    transpose: 0,
    summary:
      'Practice the expressive opening of Lag Ja Gale on web harmonium with slow, legato Sargam phrasing.',
    description:
      'Learn Lag Ja Gale harmonium notes online with Sa Re Ga Ma Sargam labels, western notes, and interactive demo playback.',
    keywords:
      'lag ja gale harmonium notes, lag ja gale sargam notes, lata mangeshkar harmonium notes',
    tips: [
      'Play at 0.75x speed first to master the smooth glide across Pa, Dha, and upper Sa.',
    ],
    lines: [
      {
        label: 'Line 1',
        lyricHint: 'Lag ja gale ke phir ye haseen raat ho na ho',
        steps: [
          { noteId: 'e4', durationMs: 460 },
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'a4', durationMs: 520 },
          { noteId: 'g4', durationMs: 440 },
          { noteId: 'e4', durationMs: 440 },
          { noteId: 'd4', durationMs: 440 },
          { noteId: 'c4', durationMs: 460 },
          { noteId: 'd4', durationMs: 460 },
          { noteId: 'e4', durationMs: 700 },
        ],
      },
      {
        label: 'Line 2',
        lyricHint: 'Shayad phir is janam mein mulaqaat ho na ho',
        steps: [
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'a4', durationMs: 460 },
          { noteId: 'c5', durationMs: 540 },
          { noteId: 'a4', durationMs: 440 },
          { noteId: 'g4', durationMs: 440 },
          { noteId: 'e4', durationMs: 440 },
          { noteId: 'd4', durationMs: 440 },
          { noteId: 'c4', durationMs: 720 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Which raga inspires Lag Ja Gale?',
        answer:
          'Lag Ja Gale draws strongly from Raag Pahadi, known for its gentle pentatonic movement and lyrical phrasing.',
      },
    ],
  },
  {
    slug: 'tujhe-dekha-to',
    title: 'Tujhe Dekha To',
    artist: 'DDLJ (Kumar Sanu & Lata Mangeshkar)',
    category: 'Bollywood',
    difficulty: 'Easy',
    scale: 'C Major (Bilawal Thaat)',
    ragaOrThaat: 'Bilawal Thaat',
    tempoBpm: 94,
    transpose: 0,
    summary:
      'Play the iconic DDLJ melody Tujhe Dekha To on web harmonium with clean Sargam keys and laptop shortcuts.',
    description:
      'Interactive Tujhe Dekha To harmonium notes in Sa Re Ga Ma Sargam and western notation. Play directly in your browser.',
    keywords:
      'tujhe dekha to harmonium notes, ddlj harmonium notes, tujhe dekha to sargam notes',
    tips: [
      'Notice how the opening leaps cleanly from middle Sa up to Pa and Dha—keep your wrist steady.',
    ],
    lines: [
      {
        label: 'Line 1',
        lyricHint: 'Tujhe dekha to ye jaana sanam',
        steps: [
          { noteId: 'c4', durationMs: 380 },
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'f4', durationMs: 380 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'c4', durationMs: 650 },
        ],
      },
      {
        label: 'Line 2',
        lyricHint: 'Pyaar hota hai deewana sanam',
        steps: [
          { noteId: 'c4', durationMs: 380 },
          { noteId: 'a4', durationMs: 480 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'd4', durationMs: 650 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I switch between Sargam and Western notes for Tujhe Dekha To?',
        answer:
          'Yes. Toggle the Labels control on the harmonium keyboard at any time to view C D E F G or Sa Re Ga Ma Pa.',
      },
    ],
  },
  {
    slug: 'channa-mereya',
    title: 'Channa Mereya',
    artist: 'Ae Dil Hai Mushkil (Arijit Singh)',
    category: 'Bollywood',
    difficulty: 'Easy',
    scale: 'C Major (Bilawal Thaat)',
    ragaOrThaat: 'Bilawal Thaat',
    tempoBpm: 92,
    transpose: 0,
    summary:
      'Learn the heartfelt Channa Mereya chorus on web harmonium with step-by-step Sargam highlights.',
    description:
      'Play Channa Mereya harmonium notes online with interactive Sa Re Ga Ma keyboard playback, western notes, and practice tips.',
    keywords:
      'channa mereya harmonium notes, channa mereya sargam notes, arijit singh harmonium notes',
    tips: [
      'Hold the repeated Ga and Pa notes smoothly so the chorus feels lyrical rather than choppy.',
    ],
    lines: [
      {
        label: 'Chorus 1',
        lyricHint: 'Accha chalta hoon, duaon mein yaad rakhna',
        steps: [
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'f4', durationMs: 400 },
          { noteId: 'g4', durationMs: 480 },
          { noteId: 'g4', durationMs: 400 },
          { noteId: 'a4', durationMs: 420 },
          { noteId: 'g4', durationMs: 400 },
          { noteId: 'f4', durationMs: 400 },
          { noteId: 'e4', durationMs: 620 },
        ],
      },
      {
        label: 'Chorus 2',
        lyricHint: 'Channa mereya mereya',
        steps: [
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'a4', durationMs: 460 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'e4', durationMs: 420 },
          { noteId: 'd4', durationMs: 420 },
          { noteId: 'c4', durationMs: 680 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Channa Mereya need black keys on harmonium?',
        answer:
          'In this C-scale beginner arrangement, all chorus notes are white keys so you can learn the melody quickly before transposing.',
      },
    ],
  },
  {
    slug: 'kesariya',
    title: 'Kesariya',
    artist: 'Brahmastra (Arijit Singh)',
    category: 'Bollywood',
    difficulty: 'Easy',
    scale: 'C Major (Bilawal Thaat)',
    ragaOrThaat: 'Bilawal Thaat',
    tempoBpm: 94,
    transpose: 0,
    summary:
      'Play the catchy Kesariya tera ishq hai piya hook on web harmonium with instant Sargam highlighting.',
    description:
      'Practice Kesariya harmonium notes online using our free web harmonium with Sa Re Ga Ma labels, western notation, and audio demo.',
    keywords:
      'kesariya harmonium notes, kesariya sargam notes, brahmastra harmonium notes',
    tips: [
      'Practice the rising Sa–Ga–Pa hook slowly before bringing it up to full tempo.',
    ],
    lines: [
      {
        label: 'Hook 1',
        lyricHint: 'Kesariya tera ishq hai piya',
        steps: [
          { noteId: 'e4', durationMs: 380 },
          { noteId: 'g4', durationMs: 420 },
          { noteId: 'a4', durationMs: 460 },
          { noteId: 'g4', durationMs: 380 },
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'd4', durationMs: 400 },
          { noteId: 'c4', durationMs: 640 },
        ],
      },
      {
        label: 'Hook 2',
        lyricHint: 'Rang jaaun jo main haath lagaaun',
        steps: [
          { noteId: 'd4', durationMs: 380 },
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'f4', durationMs: 420 },
          { noteId: 'g4', durationMs: 460 },
          { noteId: 'f4', durationMs: 400 },
          { noteId: 'e4', durationMs: 400 },
          { noteId: 'd4', durationMs: 640 },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I connect a MIDI keyboard to practice Kesariya?',
        answer:
          'Yes. Use the homepage or Practice Workbench MIDI panel on Chrome or Edge to play Kesariya with an external MIDI controller.',
      },
    ],
  },
  {
    slug: 'raag-yaman-alankar',
    title: 'Raag Yaman Aroha, Avaroha & Alankar',
    artist: 'Hindustani Classical Practice',
    category: 'Classical',
    difficulty: 'Beginner',
    scale: 'Kalyan Thaat (Tivra Ma / F#)',
    ragaOrThaat: 'Raag Yaman (Kalyan Thaat)',
    tempoBpm: 84,
    transpose: 0,
    summary:
      'Essential evening raga practice: Raag Yaman Aroha, Avaroha, Pakad, and daily Alankar drill with Tivra Ma.',
    description:
      'Practice Raag Yaman harmonium notes online. Master Aroha, Avaroha, and Pakad with Tivra Ma (F#), Tanpura drone, and interactive playback.',
    keywords:
      'raag yaman harmonium notes, yaman alankar sargam, kalyan thaat harmonium, indian classical harmonium practice',
    tips: [
      'Raag Yaman uses Tivra Ma (Ma♯ / F# / key 7) instead of Shuddha Ma.',
      'Turn on the Sa–Pa Tanpura drone and sing each swara clearly before pressing the next key.',
    ],
    lines: [
      {
        label: 'Aroha (Ascending)',
        lyricHint: 'Ni Re Ga Ma♯ Dha Ni Sa′',
        steps: [
          { noteId: 'b3', durationMs: 480 },
          { noteId: 'd4', durationMs: 480 },
          { noteId: 'e4', durationMs: 480 },
          { noteId: 'fsharp4', durationMs: 480 },
          { noteId: 'a4', durationMs: 480 },
          { noteId: 'b4', durationMs: 480 },
          { noteId: 'c5', durationMs: 700 },
        ],
      },
      {
        label: 'Avaroha (Descending)',
        lyricHint: 'Sa′ Ni Dha Pa Ma♯ Ga Re Sa',
        steps: [
          { noteId: 'c5', durationMs: 480 },
          { noteId: 'b4', durationMs: 480 },
          { noteId: 'a4', durationMs: 480 },
          { noteId: 'g4', durationMs: 480 },
          { noteId: 'fsharp4', durationMs: 480 },
          { noteId: 'e4', durationMs: 480 },
          { noteId: 'd4', durationMs: 480 },
          { noteId: 'c4', durationMs: 720 },
        ],
      },
      {
        label: 'Pakad (Signature Phrase)',
        lyricHint: 'Ni Re Ga Re Sa, Pa Ma♯ Ga Re Sa',
        steps: [
          { noteId: 'b3', durationMs: 440 },
          { noteId: 'd4', durationMs: 440 },
          { noteId: 'e4', durationMs: 480 },
          { noteId: 'd4', durationMs: 440 },
          { noteId: 'c4', durationMs: 560 },
          { noteId: 'g4', durationMs: 440 },
          { noteId: 'fsharp4', durationMs: 440 },
          { noteId: 'e4', durationMs: 440 },
          { noteId: 'd4', durationMs: 440 },
          { noteId: 'c4', durationMs: 720 },
        ],
      },
    ],
    faqs: [
      {
        question: 'What makes Raag Yaman different from Bilawal Thaat?',
        answer:
          'Raag Yaman belongs to Kalyan Thaat and replaces Shuddha Ma (F) with Tivra Ma (F# / Ma♯), giving it a bright, serene evening mood.',
      },
    ],
  },
];

export function getHarmoniumSongBySlug(slug: string) {
  return HARMONIUM_SONGS.find((song) => song.slug === slug) ?? null;
}
