export type NoteKey = {
  id: string;
  western: string;
  sargam: string;
  keycap: string;
  midi: number;
  kind: 'white' | 'black';
  whiteIndex: number;
};

const WESTERN_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

const SWARAM_NAMES = [
  'Sa',
  'Re♭',
  'Re',
  'Ga♭',
  'Ga',
  'Ma',
  'Ma♯',
  'Pa',
  'Dha♭',
  'Dha',
  'Ni♭',
  'Ni',
];

const NOTE_ID_PREFIXES = [
  'c',
  'csharp',
  'd',
  'dsharp',
  'e',
  'f',
  'fsharp',
  'g',
  'gsharp',
  'a',
  'asharp',
  'b',
];

const KEYBOARD_LAYOUT: Array<{
  midi: number;
  keycap: string;
  kind: 'white' | 'black';
}> = [
  { midi: 55, keycap: '`', kind: 'white' },
  { midi: 56, keycap: '1', kind: 'black' },
  { midi: 57, keycap: 'Q', kind: 'white' },
  { midi: 58, keycap: '2', kind: 'black' },
  { midi: 59, keycap: 'W', kind: 'white' },
  { midi: 60, keycap: 'E', kind: 'white' },
  { midi: 61, keycap: '4', kind: 'black' },
  { midi: 62, keycap: 'R', kind: 'white' },
  { midi: 63, keycap: '5', kind: 'black' },
  { midi: 64, keycap: 'T', kind: 'white' },
  { midi: 65, keycap: 'Y', kind: 'white' },
  { midi: 66, keycap: '7', kind: 'black' },
  { midi: 67, keycap: 'U', kind: 'white' },
  { midi: 68, keycap: '8', kind: 'black' },
  { midi: 69, keycap: 'I', kind: 'white' },
  { midi: 70, keycap: '9', kind: 'black' },
  { midi: 71, keycap: 'O', kind: 'white' },
  { midi: 72, keycap: 'P', kind: 'white' },
  { midi: 73, keycap: '-', kind: 'black' },
  { midi: 74, keycap: '[', kind: 'white' },
  { midi: 75, keycap: '=', kind: 'black' },
  { midi: 76, keycap: ']', kind: 'white' },
  { midi: 77, keycap: '\\', kind: 'white' },
];

function noteIdFromMidi(midi: number) {
  const pitchClass = midi % 12;
  const octave = Math.floor(midi / 12) - 1;

  return `${NOTE_ID_PREFIXES[pitchClass]}${octave}`;
}

let whiteKeyCount = -1;

export const NOTE_KEYS: NoteKey[] = KEYBOARD_LAYOUT.map((note) => {
  if (note.kind === 'white') {
    whiteKeyCount += 1;
  }

  return {
    id: noteIdFromMidi(note.midi),
    western: WESTERN_NAMES[note.midi % 12],
    sargam: SWARAM_NAMES[note.midi % 12],
    keycap: note.keycap,
    midi: note.midi,
    kind: note.kind,
    whiteIndex: whiteKeyCount,
  };
});

export const KEYBOARD_MIN_WIDTH = 1020;

export const OCTAVE_OPTIONS = [
  { value: 2, shortLabel: '2', description: 'Low' },
  { value: 3, shortLabel: '3', description: 'Warm' },
  { value: 4, shortLabel: '4', description: 'Middle' },
  { value: 5, shortLabel: '5', description: 'Bright' },
  { value: 6, shortLabel: '6', description: 'High' },
] as const;

export function getOctaveOption(value: number) {
  return (
    OCTAVE_OPTIONS.find((option) => option.value === value) ?? OCTAVE_OPTIONS[2]
  );
}

export const WHITE_KEYCAP_HINT = `White keys: ${NOTE_KEYS.filter(
  (note) => note.kind === 'white'
)
  .map((note) => note.keycap)
  .join(' ')}`;

export const BLACK_KEYCAP_HINT = `Black keys: ${NOTE_KEYS.filter(
  (note) => note.kind === 'black'
)
  .map((note) => note.keycap)
  .join(' ')}`;

const KEYCAP_LOOKUP = new Map(
  NOTE_KEYS.map((note) => [note.keycap.toLowerCase(), note])
);

export function getNoteKeyByInput(input: string) {
  return KEYCAP_LOOKUP.get(input.toLowerCase()) ?? null;
}

export const KEYBOARD_HELP_GROUPS = [
  {
    title: 'Lower octave',
    description:
      'Start here when you want the softer lower register before the middle range.',
    notes: NOTE_KEYS.slice(0, 5),
  },
  {
    title: 'Middle octave',
    description:
      'This is the easiest range for first-time visitors and daily practice patterns.',
    notes: NOTE_KEYS.slice(5, 17),
  },
  {
    title: 'Upper octave',
    description:
      'Use the last keys for ascending phrases and higher melodic runs.',
    notes: NOTE_KEYS.slice(17),
  },
] as const;

export const STORAGE_KEY = 'harmonium-home-controls';
