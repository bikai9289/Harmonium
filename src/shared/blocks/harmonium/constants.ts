export type NoteKey = {
  id: string;
  western: string;
  sargam: string;
  keycap: string;
  offset: number;
  kind: 'white' | 'black';
  whiteIndex: number;
};

export const NOTE_KEYS: NoteKey[] = [
  {
    id: 'c4',
    western: 'C',
    sargam: 'Sa',
    keycap: 'A',
    offset: 0,
    kind: 'white',
    whiteIndex: 0,
  },
  {
    id: 'csharp4',
    western: 'C#',
    sargam: 'Re b',
    keycap: 'W',
    offset: 1,
    kind: 'black',
    whiteIndex: 0,
  },
  {
    id: 'd4',
    western: 'D',
    sargam: 'Re',
    keycap: 'S',
    offset: 2,
    kind: 'white',
    whiteIndex: 1,
  },
  {
    id: 'dsharp4',
    western: 'D#',
    sargam: 'Ga b',
    keycap: 'E',
    offset: 3,
    kind: 'black',
    whiteIndex: 1,
  },
  {
    id: 'e4',
    western: 'E',
    sargam: 'Ga',
    keycap: 'D',
    offset: 4,
    kind: 'white',
    whiteIndex: 2,
  },
  {
    id: 'f4',
    western: 'F',
    sargam: 'Ma',
    keycap: 'F',
    offset: 5,
    kind: 'white',
    whiteIndex: 3,
  },
  {
    id: 'fsharp4',
    western: 'F#',
    sargam: 'Ma #',
    keycap: 'T',
    offset: 6,
    kind: 'black',
    whiteIndex: 3,
  },
  {
    id: 'g4',
    western: 'G',
    sargam: 'Pa',
    keycap: 'G',
    offset: 7,
    kind: 'white',
    whiteIndex: 4,
  },
  {
    id: 'gsharp4',
    western: 'G#',
    sargam: 'Dha b',
    keycap: 'Y',
    offset: 8,
    kind: 'black',
    whiteIndex: 4,
  },
  {
    id: 'a4',
    western: 'A',
    sargam: 'Dha',
    keycap: 'H',
    offset: 9,
    kind: 'white',
    whiteIndex: 5,
  },
  {
    id: 'asharp4',
    western: 'A#',
    sargam: 'Ni b',
    keycap: 'U',
    offset: 10,
    kind: 'black',
    whiteIndex: 5,
  },
  {
    id: 'b4',
    western: 'B',
    sargam: 'Ni',
    keycap: 'J',
    offset: 11,
    kind: 'white',
    whiteIndex: 6,
  },
  {
    id: 'c5',
    western: 'C',
    sargam: 'Sa',
    keycap: 'K',
    offset: 12,
    kind: 'white',
    whiteIndex: 7,
  },
];

export const STORAGE_KEY = 'harmonium-home-controls';
