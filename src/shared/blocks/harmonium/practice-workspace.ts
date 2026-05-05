import { nanoid } from 'nanoid';

export type PracticeSessionStatus = 'idle' | 'recording' | 'saved';
export type PracticeInputSource = 'pointer' | 'keyboard' | 'midi';
export type PracticePresetKind = 'built-in' | 'user';
export type HarmoniumLabelMode = 'western' | 'sargam';
export type ReedMode = 'single' | 'double';

export type PracticeSettingsSnapshot = {
  labelMode: HarmoniumLabelMode;
  octave: number;
  transpose: number;
  reverbEnabled: boolean;
  reedMode: ReedMode;
};

export type PracticeNoteEvent = {
  id: string;
  voiceId: string;
  source: PracticeInputSource;
  midi: number;
  western: string;
  sargam: string;
  startedAtMs: number;
  durationMs: number;
};

export type PracticeSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: PracticeSessionStatus;
  labelMode: HarmoniumLabelMode;
  octave: number;
  transpose: number;
  reverbEnabled: boolean;
  reedMode: ReedMode;
  notationText: string;
  noteEvents: PracticeNoteEvent[];
  noteCount: number;
  durationMs: number;
};

export type PracticePreset = {
  id: string;
  kind: PracticePresetKind;
  name: string;
  description: string;
  updatedAt: string;
  settings: PracticeSettingsSnapshot;
};

export type PracticeWorkspace = {
  version: number;
  updatedAt: string;
  sessions: PracticeSession[];
  presets: PracticePreset[];
  lastSessionId: string;
  lastPresetId: string;
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

export const PRACTICE_WORKSPACE_VERSION = 1;
export const PRACTICE_STORAGE_KEY = 'harmonium-practice-workspace';

function nowIso() {
  return new Date().toISOString();
}

function toFiniteNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function toPracticeStatus(value: unknown): PracticeSessionStatus {
  return value === 'recording' || value === 'saved' ? value : 'idle';
}

function toLabelMode(value: unknown): HarmoniumLabelMode {
  return value === 'western' ? 'western' : 'sargam';
}

function toReedMode(value: unknown): ReedMode {
  return value === 'double' ? 'double' : 'single';
}

function compareIsoDates(left: string, right: string) {
  return getTimestampFromIso(left) - getTimestampFromIso(right);
}

export function getTimestampFromIso(value?: string | null) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function createPracticeId(prefix: string) {
  return `${prefix}_${nanoid(10)}`;
}

export function createEmptyPracticeWorkspace(): PracticeWorkspace {
  return {
    version: PRACTICE_WORKSPACE_VERSION,
    updatedAt: nowIso(),
    sessions: [],
    presets: [],
    lastSessionId: '',
    lastPresetId: '',
  };
}

export function getNoteNamesForMidi(midi: number) {
  const pitchClass = ((Math.round(midi) % 12) + 12) % 12;

  return {
    western: WESTERN_NAMES[pitchClass],
    sargam: SWARAM_NAMES[pitchClass],
  };
}

export function summarizeNoteEvents(noteEvents: PracticeNoteEvent[]) {
  if (!noteEvents.length) {
    return {
      noteCount: 0,
      durationMs: 0,
    };
  }

  let minStart = Number.POSITIVE_INFINITY;
  let maxEnd = 0;

  for (const event of noteEvents) {
    minStart = Math.min(minStart, event.startedAtMs);
    maxEnd = Math.max(maxEnd, event.startedAtMs + event.durationMs);
  }

  return {
    noteCount: noteEvents.length,
    durationMs: Math.max(0, maxEnd - minStart),
  };
}

export function createPracticeSession(
  settings: PracticeSettingsSnapshot
): PracticeSession {
  const timestamp = nowIso();

  return {
    id: createPracticeId('session'),
    title: formatPracticeSessionTitle(timestamp),
    createdAt: timestamp,
    updatedAt: timestamp,
    status: 'recording',
    labelMode: settings.labelMode,
    octave: settings.octave,
    transpose: settings.transpose,
    reverbEnabled: settings.reverbEnabled,
    reedMode: settings.reedMode,
    notationText: '',
    noteEvents: [],
    noteCount: 0,
    durationMs: 0,
  };
}

export function applySessionMetrics(
  session: PracticeSession,
  noteEvents: PracticeNoteEvent[]
) {
  const summary = summarizeNoteEvents(noteEvents);

  return {
    ...session,
    noteEvents,
    noteCount: summary.noteCount,
    durationMs: summary.durationMs,
  };
}

export function getBuiltInPracticePresets(): PracticePreset[] {
  const timestamp = '1970-01-01T00:00:00.000Z';

  return [
    {
      id: 'builtin-beginner-sargam',
      kind: 'built-in',
      name: 'Beginner Sargam',
      description:
        'Middle octave, dry single-reed practice for steady scale work.',
      updatedAt: timestamp,
      settings: {
        labelMode: 'sargam',
        octave: 4,
        transpose: 0,
        reverbEnabled: false,
        reedMode: 'single',
      },
    },
    {
      id: 'builtin-lower-accompaniment',
      kind: 'built-in',
      name: 'Lower Accompaniment',
      description:
        'A warmer lower register for accompaniment phrases and drone feel.',
      updatedAt: timestamp,
      settings: {
        labelMode: 'sargam',
        octave: 3,
        transpose: 0,
        reverbEnabled: false,
        reedMode: 'double',
      },
    },
    {
      id: 'builtin-bright-melody',
      kind: 'built-in',
      name: 'Bright Melody',
      description:
        'Higher octave with room reverb and double reeds for lead runs.',
      updatedAt: timestamp,
      settings: {
        labelMode: 'sargam',
        octave: 5,
        transpose: 0,
        reverbEnabled: true,
        reedMode: 'double',
      },
    },
    {
      id: 'builtin-western-note-drill',
      kind: 'built-in',
      name: 'Western Note Drill',
      description:
        'Middle octave with western labels for note-name repetition.',
      updatedAt: timestamp,
      settings: {
        labelMode: 'western',
        octave: 4,
        transpose: 0,
        reverbEnabled: false,
        reedMode: 'single',
      },
    },
  ];
}

export function getAllPracticePresets(workspace: PracticeWorkspace) {
  return [...getBuiltInPracticePresets(), ...workspace.presets];
}

export function getPracticePresetById(
  workspace: PracticeWorkspace,
  presetId?: string | null
) {
  if (!presetId) {
    return null;
  }

  return (
    getAllPracticePresets(workspace).find((preset) => preset.id === presetId) ??
    null
  );
}

export function getLatestPracticeSession(workspace: PracticeWorkspace) {
  return (
    [...workspace.sessions].sort((left, right) =>
      compareIsoDates(right.updatedAt, left.updatedAt)
    )[0] ?? null
  );
}

export function formatPracticeSessionTitle(value = nowIso()) {
  const date = new Date(value);

  return `Session ${new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)}`;
}

export function sanitizePracticeWorkspace(input: unknown): PracticeWorkspace {
  const base = createEmptyPracticeWorkspace();

  if (!input || typeof input !== 'object') {
    return base;
  }

  const data = input as Partial<PracticeWorkspace> & {
    sessions?: unknown[];
    presets?: unknown[];
  };

  const sessions = Array.isArray(data.sessions)
    ? data.sessions
        .map((session): PracticeSession | null => {
          if (!session || typeof session !== 'object') {
            return null;
          }

          const nextSession = session as Partial<PracticeSession> & {
            noteEvents?: unknown[];
          };
          const createdAt =
            typeof nextSession.createdAt === 'string'
              ? nextSession.createdAt
              : nowIso();
          const updatedAt =
            typeof nextSession.updatedAt === 'string'
              ? nextSession.updatedAt
              : createdAt;

          const noteEvents = Array.isArray(nextSession.noteEvents)
            ? nextSession.noteEvents
                .map((noteEvent): PracticeNoteEvent | null => {
                  if (!noteEvent || typeof noteEvent !== 'object') {
                    return null;
                  }

                  const nextEvent = noteEvent as Partial<PracticeNoteEvent>;
                  if (typeof nextEvent.voiceId !== 'string') {
                    return null;
                  }

                  const source =
                    nextEvent.source === 'keyboard' ||
                    nextEvent.source === 'midi'
                      ? nextEvent.source
                      : 'pointer';
                  const midi = Math.round(toFiniteNumber(nextEvent.midi, 60));
                  const names = getNoteNamesForMidi(midi);

                  return {
                    id:
                      typeof nextEvent.id === 'string'
                        ? nextEvent.id
                        : createPracticeId('note'),
                    voiceId: nextEvent.voiceId,
                    source,
                    midi,
                    western:
                      typeof nextEvent.western === 'string'
                        ? nextEvent.western
                        : names.western,
                    sargam:
                      typeof nextEvent.sargam === 'string'
                        ? nextEvent.sargam
                        : names.sargam,
                    startedAtMs: toFiniteNumber(nextEvent.startedAtMs),
                    durationMs: Math.max(
                      0,
                      toFiniteNumber(nextEvent.durationMs)
                    ),
                  };
                })
                .filter((event): event is PracticeNoteEvent => !!event)
            : [];

          const metrics = summarizeNoteEvents(noteEvents);

          return {
            id:
              typeof nextSession.id === 'string'
                ? nextSession.id
                : createPracticeId('session'),
            title:
              typeof nextSession.title === 'string' && nextSession.title.trim()
                ? nextSession.title.trim()
                : formatPracticeSessionTitle(createdAt),
            createdAt,
            updatedAt,
            status: toPracticeStatus(nextSession.status),
            labelMode: toLabelMode(nextSession.labelMode),
            octave: Math.round(toFiniteNumber(nextSession.octave, 4)),
            transpose: Math.round(toFiniteNumber(nextSession.transpose)),
            reverbEnabled: !!nextSession.reverbEnabled,
            reedMode: toReedMode(nextSession.reedMode),
            notationText:
              typeof nextSession.notationText === 'string'
                ? nextSession.notationText
                : '',
            noteEvents,
            noteCount: metrics.noteCount,
            durationMs: metrics.durationMs,
          };
        })
        .filter((session): session is PracticeSession => !!session)
        .sort((left, right) => compareIsoDates(right.updatedAt, left.updatedAt))
    : [];

  const presets = Array.isArray(data.presets)
    ? data.presets
        .map((preset): PracticePreset | null => {
          if (!preset || typeof preset !== 'object') {
            return null;
          }

          const nextPreset = preset as Partial<PracticePreset>;
          const settings =
            nextPreset.settings && typeof nextPreset.settings === 'object'
              ? (nextPreset.settings as Partial<PracticeSettingsSnapshot>)
              : {};

          if (typeof nextPreset.name !== 'string' || !nextPreset.name.trim()) {
            return null;
          }

          return {
            id:
              typeof nextPreset.id === 'string'
                ? nextPreset.id
                : createPracticeId('preset'),
            kind: nextPreset.kind === 'built-in' ? 'built-in' : 'user',
            name: nextPreset.name.trim(),
            description:
              typeof nextPreset.description === 'string'
                ? nextPreset.description
                : '',
            updatedAt:
              typeof nextPreset.updatedAt === 'string'
                ? nextPreset.updatedAt
                : nowIso(),
            settings: {
              labelMode: toLabelMode(settings.labelMode),
              octave: Math.round(toFiniteNumber(settings.octave, 4)),
              transpose: Math.round(toFiniteNumber(settings.transpose)),
              reverbEnabled: !!settings.reverbEnabled,
              reedMode: toReedMode(settings.reedMode),
            },
          };
        })
        .filter((preset): preset is PracticePreset => !!preset)
        .sort((left, right) => compareIsoDates(right.updatedAt, left.updatedAt))
    : [];

  return {
    version:
      typeof data.version === 'number'
        ? data.version
        : PRACTICE_WORKSPACE_VERSION,
    updatedAt:
      typeof data.updatedAt === 'string' ? data.updatedAt : base.updatedAt,
    sessions,
    presets,
    lastSessionId:
      typeof data.lastSessionId === 'string' ? data.lastSessionId : '',
    lastPresetId:
      typeof data.lastPresetId === 'string' ? data.lastPresetId : '',
  };
}
