'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, NotebookPen, Play } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';

import { HarmoniumNoteGrid } from './harmonium-note-grid';
import { NOTE_KEYS, NoteKey } from './constants';
import { useHarmoniumPlayer } from './use-harmonium-player';

const PRACTICE_PATTERNS = [
  {
    id: 'ascending-middle',
    title: 'Ascending middle line',
    description: 'A simple middle-register climb to connect note names with the visible layout.',
    steps: ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5'],
  },
  {
    id: 'descending-middle',
    title: 'Descending return',
    description: 'Come back down after the ascent so the mapping sticks in both directions.',
    steps: ['c5', 'b4', 'a4', 'g4', 'f4', 'e4', 'd4', 'c4'],
  },
  {
    id: 'sargam-core',
    title: 'Sa Re Ga Ma Pa',
    description: 'A short Sargam-friendly phrase for beginners who want the central anchors first.',
    steps: ['c4', 'd4', 'e4', 'f4', 'g4'],
  },
] as const;

const CORE_NOTE_IDS = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5'] as const;
const ALTERED_NOTE_IDS = ['csharp4', 'dsharp4', 'fsharp4', 'gsharp4', 'asharp4'] as const;

const ALTERED_LABELS: Record<string, string> = {
  csharp4: 'Komal Re',
  dsharp4: 'Komal Ga',
  fsharp4: 'Tivra Ma',
  gsharp4: 'Komal Dha',
  asharp4: 'Komal Ni',
};

function getNotesByIds(ids: readonly string[]) {
  return ids
    .map((id) => NOTE_KEYS.find((note) => note.id === id))
    .filter((note): note is NoteKey => !!note);
}

export function HarmoniumNotesPage() {
  const [labelMode, setLabelMode] = useState<'western' | 'sargam'>('sargam');
  const [playingPatternId, setPlayingPatternId] = useState<string | null>(null);

  const timersRef = useRef<number[]>([]);
  const playbackTokenRef = useRef(0);

  const { activeNoteIds, startNote, stopAllNotes, stopNote } = useHarmoniumPlayer({
    octave: 4,
    transpose: 0,
    volume: 0.34,
    reverbEnabled: false,
    reedMode: 'single',
  });

  const clearPlaybackQueue = useCallback(() => {
    playbackTokenRef.current += 1;
    for (const timerId of timersRef.current) {
      window.clearTimeout(timerId);
    }
    timersRef.current = [];
    setPlayingPatternId(null);
    stopAllNotes();
  }, [stopAllNotes]);

  const queueTimer = useCallback((callback: () => void, delayMs: number) => {
    const timerId = window.setTimeout(callback, delayMs);
    timersRef.current.push(timerId);
  }, []);

  const previewNote = useCallback(
    async (note: NoteKey) => {
      clearPlaybackQueue();
      await startNote(note);
      queueTimer(() => stopNote(note.id), 430);
    },
    [clearPlaybackQueue, queueTimer, startNote, stopNote]
  );

  const playPattern = useCallback(
    async (patternId: string, steps: readonly string[]) => {
      clearPlaybackQueue();
      setPlayingPatternId(patternId);
      const token = playbackTokenRef.current;
      const notes = getNotesByIds(steps);

      notes.forEach((note, index) => {
        queueTimer(async () => {
          if (token !== playbackTokenRef.current) {
            return;
          }

          await startNote(note);
          queueTimer(() => {
            if (token === playbackTokenRef.current) {
              stopNote(note.id);
            }
          }, 360);
        }, index * 520);
      });

      queueTimer(() => {
        if (token === playbackTokenRef.current) {
          setPlayingPatternId(null);
        }
      }, Math.max(notes.length - 1, 0) * 520 + 460);
    },
    [clearPlaybackQueue, queueTimer, startNote, stopNote]
  );

  useEffect(() => {
    return () => {
      clearPlaybackQueue();
    };
  }, [clearPlaybackQueue]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f8f4ec_40%,#fbfaf7_100%)] font-sans text-[#2a1f1a]">
      <section className="border-b border-[#2a1f1a]/10 bg-white/70 pt-20 pb-10 backdrop-blur sm:pt-24">
        <div className="container max-w-[1400px] space-y-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-serif text-4xl font-bold sm:text-5xl">
              Harmonium Notes - Sargam & Western
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#6b5d52]">
              Every key on the harmonium with Sa Re Ga Ma and C D E F labels,
              plus a playable example for every note.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-[#8b2e2e] text-white hover:bg-[#6f2424]">
              <Link href="/keyboard">
                Open Keyboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#b77c4a]/30 bg-white text-[#7f4e2a]"
            >
              <Link href="/tutorial">Start Tutorial</Link>
            </Button>
          </div>

          <section className="rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b2e2e]">
              Note map
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
              {getNotesByIds(CORE_NOTE_IDS).map((note) => (
                <NoteMapButton
                  key={note.id}
                  active={activeNoteIds.includes(note.id)}
                  label={note.sargam}
                  note={note}
                  onPress={() => {
                    void previewNote(note);
                  }}
                />
              ))}
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-[#8b2e2e]">
              Komal and Tivra variants
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
              {getNotesByIds(ALTERED_NOTE_IDS).map((note) => (
                <NoteMapButton
                  key={note.id}
                  active={activeNoteIds.includes(note.id)}
                  label={ALTERED_LABELS[note.id] || note.sargam}
                  note={note}
                  onPress={() => {
                    void previewNote(note);
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="container max-w-[1400px] space-y-8">
          <div className="rounded-[1.7rem] border border-black/7 bg-white/82 p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#8f5f33]">
                  Label mode
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Toggle the notation you want to memorize first
                </h2>
              </div>

              <div className="flex gap-2">
                {(['sargam', 'western'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLabelMode(mode)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      labelMode === mode
                        ? 'bg-[#8b2e2e] text-white'
                        : 'bg-[#f5ede1] text-slate-700 hover:bg-[#eadcc7]'
                    }`}
                  >
                    {mode === 'sargam' ? 'Sargam' : 'Western'}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              Every note card below is playable. Click any note to hear the
              pitch, then use the patterns section to rehearse the most common
              beginner movements.
            </p>
          </div>

          <HarmoniumNoteGrid
            activeNoteIds={activeNoteIds}
            labelMode={labelMode}
            onNotePress={(note) => {
              void previewNote(note);
            }}
          />

          <section className="rounded-[1.75rem] border border-black/7 bg-white/82 p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#8f5f33]">
                  Practice patterns
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Rehearse the note map in short musical chunks
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  These are not full songs. They are compact drills that help
                  you connect the visual keyboard to note names before moving
                  into the full practice page.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={clearPlaybackQueue}
                className="border-[#b77c4a]/30 bg-white text-[#7f4e2a]"
              >
                Stop preview
              </Button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {PRACTICE_PATTERNS.map((pattern) => (
                <div
                  key={pattern.id}
                  className="rounded-[1.3rem] border border-black/6 bg-[#fcfaf6] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        {pattern.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {pattern.description}
                      </p>
                    </div>
                    <NotebookPen className="mt-1 size-5 text-[#8f5f33]" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {getNotesByIds(pattern.steps).map((note) => (
                      <span
                        key={`${pattern.id}-${note.id}`}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                      >
                        {labelMode === 'sargam' ? note.sargam : note.western}
                      </span>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      void playPattern(pattern.id, pattern.steps);
                    }}
                    className="mt-5 bg-[#8b2e2e] text-white hover:bg-[#6f2424]"
                  >
                    {playingPatternId === pattern.id ? 'Playing...' : 'Play pattern'}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function NoteMapButton({
  active,
  label,
  note,
  onPress,
}: {
  active: boolean;
  label: string;
  note: NoteKey;
  onPress: () => void;
}) {
  return (
    <button
      className={`rounded-lg border p-4 text-left transition ${
        active
          ? 'border-[#8b2e2e] bg-[#fff0e5]'
          : 'border-[#e8dfd2] bg-white hover:border-[#c8633a]/50 hover:bg-[#fff8f1]'
      }`}
      onClick={onPress}
      type="button"
    >
      <span className="block text-lg font-semibold text-[#8b2e2e]">{label}</span>
      <span className="mt-1 block font-mono text-sm text-[#6b5d52]">
        {note.western}
      </span>
      <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#c8633a]/10 px-2 py-1 text-xs font-medium text-[#8b2e2e]">
        <Play className="size-3 fill-current" />
        Play
      </span>
    </button>
  );
}
