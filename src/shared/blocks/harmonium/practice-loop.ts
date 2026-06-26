import { NOTE_KEYS } from './constants';

export type RiyazPracticeIntent =
  | 'sa'
  | 'riyaz'
  | 'alankar'
  | 'raga'
  | 'devotional';

export type RiyazPracticeErrorCode =
  | 'invalid-sa-value'
  | 'missing-exercise-field'
  | 'audio-blocked'
  | 'duplicate-completion'
  | 'storage-unavailable'
  | 'midi-unavailable';

export type SaTonicOption = {
  id: string;
  western: string;
  sargam: string;
  midi: number;
};

export type RiyazPracticeExercise = {
  id: string;
  title: string;
  intent: RiyazPracticeIntent;
  summary: string;
  pattern: string;
  saRelationship: string;
  cta: string;
  nextAction: string;
  recommendedSaId?: string;
};

export type RiyazPracticeLoopState = {
  selectedSaId: string;
  selectedExerciseId: string;
  droneActive: boolean;
  completedExerciseIds: string[];
  lastErrorCode: RiyazPracticeErrorCode | '';
};

export const SA_TONIC_OPTIONS: SaTonicOption[] = [
  { id: 'C', western: 'C', sargam: 'Sa', midi: 60 },
  { id: 'C#', western: 'C#', sargam: 'Re flat / Sa raised', midi: 61 },
  { id: 'D', western: 'D', sargam: 'Re', midi: 62 },
  { id: 'D#', western: 'D#', sargam: 'Ga flat', midi: 63 },
  { id: 'E', western: 'E', sargam: 'Ga', midi: 64 },
  { id: 'F', western: 'F', sargam: 'Ma', midi: 65 },
  { id: 'F#', western: 'F#', sargam: 'Ma sharp', midi: 66 },
  { id: 'G', western: 'G', sargam: 'Pa', midi: 67 },
  { id: 'G#', western: 'G#', sargam: 'Dha flat', midi: 68 },
  { id: 'A', western: 'A', sargam: 'Dha', midi: 69 },
  { id: 'A#', western: 'A#', sargam: 'Ni flat', midi: 70 },
  { id: 'B', western: 'B', sargam: 'Ni', midi: 71 },
];

export const RIYAZ_PRACTICE_EXERCISES: RiyazPracticeExercise[] = [
  {
    id: 'sa-hold',
    title: 'Find Sa and hold steady',
    intent: 'sa',
    summary:
      'Choose a comfortable Sa, start shruti, and hold the tonic before moving.',
    pattern: 'Sa - Sa - Sa',
    saRelationship: 'Uses the selected Sa as the pitch center.',
    cta: 'Find Sa',
    nextAction: 'Hold Sa for one slow breath, then repeat without rushing.',
    recommendedSaId: 'C',
  },
  {
    id: 'sargam-alankar',
    title: 'Practice alankar in Sargam',
    intent: 'alankar',
    summary:
      'Repeat a compact ascending and descending movement for note confidence.',
    pattern: 'Sa Re Ga Re - Sa Re Ga Ma - Ga Ma Pa Ma',
    saRelationship: 'Every note is read relative to the selected Sa.',
    cta: 'Practice alankar',
    nextAction: 'Play the pattern slowly, then record one clean take.',
  },
  {
    id: 'raga-phrase',
    title: 'Try a raga phrase',
    intent: 'raga',
    summary:
      'Sketch a beginner-safe phrase while keeping Sa and Pa as anchors.',
    pattern: 'Sa Re Ga Ma - Pa Ma Ga Re - Sa',
    saRelationship: 'Sa and Pa stay stable while the phrase moves around them.',
    cta: 'Try a raga phrase',
    nextAction: 'Play the phrase twice, then change only one ending note.',
  },
  {
    id: 'bhajan-kirtan',
    title: 'Rehearse bhajan or kirtan',
    intent: 'devotional',
    summary:
      'Use the harmonium as a pitch reference for a short devotional line.',
    pattern: 'Sa Sa Re Ga - Ga Re Sa',
    saRelationship: 'Start and resolve on the selected Sa for steadier singing.',
    cta: 'Rehearse bhajan or kirtan',
    nextAction: 'Sing the line once with shruti, then play it on the keys.',
  },
];

export function getDefaultRiyazPracticeState(): RiyazPracticeLoopState {
  return {
    selectedSaId: 'C',
    selectedExerciseId: 'sa-hold',
    droneActive: false,
    completedExerciseIds: [],
    lastErrorCode: '',
  };
}

export function getSaTonicOption(value?: string | null) {
  if (!value) {
    return null;
  }

  return SA_TONIC_OPTIONS.find((option) => option.id === value) ?? null;
}

export function getRiyazPracticeExercise(value?: string | null) {
  if (!value) {
    return null;
  }

  return (
    RIYAZ_PRACTICE_EXERCISES.find((exercise) => exercise.id === value) ?? null
  );
}

export function getExerciseIdFromPracticeParam(value?: string | null) {
  if (!value) {
    return '';
  }

  const normalized = value.toLowerCase();
  const aliases: Record<string, string> = {
    'find-sa': 'sa-hold',
    sa: 'sa-hold',
    riyaz: 'sa-hold',
    alankar: 'sargam-alankar',
    sargam: 'sargam-alankar',
    raga: 'raga-phrase',
    bhajan: 'bhajan-kirtan',
    kirtan: 'bhajan-kirtan',
    devotional: 'bhajan-kirtan',
  };

  return aliases[normalized] ?? normalized;
}

export function getKeyboardNoteForSa(saId: string) {
  const option = getSaTonicOption(saId);
  if (!option) {
    return null;
  }

  return NOTE_KEYS.find((note) => note.midi % 12 === option.midi % 12) ?? null;
}

export function validateRiyazPracticeExercises(
  exercises: RiyazPracticeExercise[] = RIYAZ_PRACTICE_EXERCISES
) {
  const errors: Array<{ code: RiyazPracticeErrorCode; message: string }> = [];
  const seenIds = new Set<string>();

  for (const exercise of exercises) {
    if (
      !exercise.id ||
      !exercise.title ||
      !exercise.intent ||
      !exercise.pattern ||
      !exercise.cta
    ) {
      errors.push({
        code: 'missing-exercise-field',
        message: `Exercise ${exercise.id || '(missing id)'} is incomplete.`,
      });
    }

    if (seenIds.has(exercise.id)) {
      errors.push({
        code: 'duplicate-completion',
        message: `Exercise ${exercise.id} appears more than once.`,
      });
    }

    seenIds.add(exercise.id);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
