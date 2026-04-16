import { NOTE_KEYS, NoteKey } from './constants';

export type TutorialStep = {
  id: string;
  noteId: string;
  durationBeats: number;
  lyric?: string;
};

export type TutorialPhrase = {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
};

export type TutorialSong = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 'beginner' | 'easy' | 'medium';
  bpm: number;
  meter: string;
  phrases: TutorialPhrase[];
};

export type TutorialSongCatalogItem = Omit<TutorialSong, 'phrases'> & {
  status: 'ready' | 'planned';
  availabilityNote?: string;
};

export type ResolvedTutorialStep = TutorialStep & {
  note: NoteKey;
};

export type ResolvedTutorialPhrase = Omit<TutorialPhrase, 'steps'> & {
  steps: ResolvedTutorialStep[];
};

export type ResolvedTutorialSong = Omit<TutorialSong, 'phrases'> & {
  phrases: ResolvedTutorialPhrase[];
  totalSteps: number;
};

function getNoteById(noteId: string) {
  return NOTE_KEYS.find((note) => note.id === noteId) ?? null;
}

function createStep(
  id: string,
  noteId: string,
  durationBeats = 1,
  lyric?: string
): TutorialStep {
  return {
    id,
    noteId,
    durationBeats,
    lyric,
  };
}

const tutorialCatalog: TutorialSongCatalogItem[] = [
  {
    id: 'two-tigers',
    slug: 'two-tigers',
    title: 'Two Tigers',
    subtitle: 'A familiar beginner melody for steady step-by-step note matching.',
    description:
      'Use this first song to practice repeated phrases, short stepwise motion, and confident matching between the moving score and the keyboard.',
    difficulty: 'beginner',
    bpm: 86,
    meter: '4/4',
    status: 'ready',
  },
  {
    id: 'mo-li-hua',
    slug: 'mo-li-hua',
    title: 'Mo Li Hua (Jasmine Flower)',
    subtitle: 'A standard Jiangsu folk-song teaching score in 1=E, 2/4 meter.',
    description:
      'Reserved for the first batch library. This lesson will focus on clean phrase endings and lyrical stepwise motion.',
    difficulty: 'easy',
    bpm: 76,
    meter: '2/4',
    status: 'planned',
    availabilityNote: 'Reserved for the first batch library. Full guided practice comes next.',
  },
  {
    id: 'twinkle-little-star',
    slug: 'twinkle-twinkle-little-star',
    title: 'Twinkle, Twinkle, Little Star',
    subtitle:
      'A globally familiar beginner melody with clear repetition and stable phrase shapes.',
    description:
      'Reserved for the first batch library. It will be used to teach repetition, leaps, and phrase memory.',
    difficulty: 'beginner',
    bpm: 84,
    meter: '4/4',
    status: 'planned',
    availabilityNote: 'Reserved for the first batch library. Full guided practice comes next.',
  },
  {
    id: 'ode-to-joy',
    slug: 'ode-to-joy',
    title: 'Ode to Joy',
    subtitle:
      'A public-domain classical melody with slightly longer phrases and clean stepwise motion.',
    description:
      'Reserved for the first batch library. It will introduce longer melodic lines after the first beginner songs are stable.',
    difficulty: 'easy',
    bpm: 92,
    meter: '4/4',
    status: 'planned',
    availabilityNote: 'Reserved for the first batch library. Full guided practice comes next.',
  },
];

const tutorialSongs: TutorialSong[] = [
  {
    id: 'two-tigers',
    slug: 'two-tigers',
    title: 'Two Tigers',
    subtitle: 'A familiar beginner melody for steady step-by-step note matching.',
    description:
      'Use this first song to practice repeated phrases, short stepwise motion, and confident matching between the moving score and the keyboard.',
    difficulty: 'beginner',
    bpm: 86,
    meter: '4/4',
    phrases: [
      {
        id: 'phrase-1',
        title: 'Phrase 1',
        description: 'The opening line climbs gently, then returns to the start.',
        steps: [
          createStep('p1-1', 'c4', 1, 'Two'),
          createStep('p1-2', 'd4', 1, 'ti'),
          createStep('p1-3', 'e4', 1, 'gers'),
          createStep('p1-4', 'c4', 1, ''),
          createStep('p1-5', 'c4', 1, 'two'),
          createStep('p1-6', 'd4', 1, 'ti'),
          createStep('p1-7', 'e4', 1, 'gers'),
          createStep('p1-8', 'c4', 1, ''),
        ],
      },
      {
        id: 'phrase-2',
        title: 'Phrase 2',
        description: 'The middle phrase rises to a slightly brighter top note.',
        steps: [
          createStep('p2-1', 'e4', 1, 'run'),
          createStep('p2-2', 'f4', 1, 'so'),
          createStep('p2-3', 'g4', 2, 'fast'),
          createStep('p2-4', 'e4', 1, 'run'),
          createStep('p2-5', 'f4', 1, 'so'),
          createStep('p2-6', 'g4', 2, 'fast'),
        ],
      },
      {
        id: 'phrase-3',
        title: 'Phrase 3',
        description: 'This phrase introduces a longer descent with one higher step.',
        steps: [
          createStep('p3-1', 'g4', 1, 'one'),
          createStep('p3-2', 'a4', 1, 'is'),
          createStep('p3-3', 'g4', 1, 'fat'),
          createStep('p3-4', 'f4', 1, 'one'),
          createStep('p3-5', 'e4', 1, 'is'),
          createStep('p3-6', 'c4', 2, 'thin'),
          createStep('p3-7', 'g4', 1, 'one'),
          createStep('p3-8', 'a4', 1, 'is'),
          createStep('p3-9', 'g4', 1, 'fat'),
          createStep('p3-10', 'f4', 1, 'one'),
          createStep('p3-11', 'e4', 1, 'is'),
          createStep('p3-12', 'c4', 2, 'thin'),
        ],
      },
      {
        id: 'phrase-4',
        title: 'Phrase 4',
        description: 'A short closing phrase that lands home with a simple leap.',
        steps: [
          createStep('p4-1', 'c4', 1, 'where'),
          createStep('p4-2', 'g3', 1, 'did'),
          createStep('p4-3', 'c4', 2, 'they'),
          createStep('p4-4', 'c4', 1, 'go'),
          createStep('p4-5', 'c4', 1, 'where'),
          createStep('p4-6', 'g3', 1, 'did'),
          createStep('p4-7', 'c4', 2, 'they'),
          createStep('p4-8', 'c4', 2, 'go'),
        ],
      },
    ],
  },
];

export function getTutorialCatalog() {
  return tutorialCatalog;
}

export function getTutorialSongs(): ResolvedTutorialSong[] {
  return tutorialSongs.map((song) => {
    const phrases = song.phrases.map((phrase) => ({
      ...phrase,
      steps: phrase.steps.map((step) => {
        const note = getNoteById(step.noteId);

        if (!note) {
          throw new Error(
            `Tutorial step "${step.id}" references missing note "${step.noteId}".`
          );
        }

        return {
          ...step,
          note,
        };
      }),
    }));

    return {
      ...song,
      phrases,
      totalSteps: phrases.reduce((sum, phrase) => sum + phrase.steps.length, 0),
    };
  });
}
