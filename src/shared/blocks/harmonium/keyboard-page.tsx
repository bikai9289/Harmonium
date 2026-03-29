'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Keyboard,
  SlidersHorizontal,
  Volume2,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { NOTE_KEYS, STORAGE_KEY } from './constants';
import { useHarmoniumPlayer } from './use-harmonium-player';

export function HarmoniumKeyboardPage() {
  const [labelMode, setLabelMode] = useState<'western' | 'sargam'>('sargam');
  const [octave, setOctave] = useState(4);
  const [transpose, setTranspose] = useState(0);
  const [volume, setVolume] = useState(0.45);

  const { activeNoteIds, playbackMode, startNote, stopNote, stopAllNotes } =
    useHarmoniumPlayer({
      octave,
      transpose,
      volume,
    });

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        labelMode?: 'western' | 'sargam';
        octave?: number;
        transpose?: number;
        volume?: number;
      };

      if (parsed.labelMode) setLabelMode(parsed.labelMode);
      if (typeof parsed.octave === 'number') setOctave(parsed.octave);
      if (typeof parsed.transpose === 'number') setTranspose(parsed.transpose);
      if (typeof parsed.volume === 'number') setVolume(parsed.volume);
    } catch (error) {
      console.error('Failed to read harmonium settings', error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ labelMode, octave, transpose, volume })
    );
  }, [labelMode, octave, transpose, volume]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      const note = NOTE_KEYS.find(
        (candidate) => candidate.keycap.toLowerCase() === event.key.toLowerCase()
      );

      if (!note) {
        return;
      }

      event.preventDefault();
      void startNote(note);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = NOTE_KEYS.find(
        (candidate) => candidate.keycap.toLowerCase() === event.key.toLowerCase()
      );

      if (!note) {
        return;
      }

      stopNote(note.id);
    };

    const handleBlur = () => stopAllNotes();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      stopAllNotes();
    };
  }, [startNote, stopAllNotes, stopNote]);

  const whiteKeys = NOTE_KEYS.filter((note) => note.kind === 'white');
  const blackKeys = NOTE_KEYS.filter((note) => note.kind === 'black');

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6efe2_0%,#f8f4ec_40%,#fbfaf7_100%)] text-slate-950">
      <section className="border-b border-black/5 bg-white/70 pt-24 backdrop-blur sm:pt-28">
        <div className="container flex flex-wrap items-center justify-between gap-4 pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
              Practice mode
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Web Harmonium Keyboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              A focused Web Harmonium keyboard practice page with keyboard
              shortcuts, touch controls, Sargam labels, and saved local settings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="border-[#b77c4a]/30 bg-white/85 text-[#7f4e2a]">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back Home
              </Link>
            </Button>
            <Button asChild className="bg-[#1f6b64] text-white hover:bg-[#17544f]">
              <Link href="/blog" title="Read Web Harmonium guides">Read Guides</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
          <aside className="order-2 space-y-4 xl:order-1">
            <div className="rounded-[1.6rem] border border-black/7 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
                Session setup
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Ready to play</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use your keyboard or tap the keys. This Web Harmonium keyboard
                keeps your last volume, octave, transpose, and label mode saved
                in local storage.
              </p>
            </div>

            <ControlCard
              icon={<Volume2 className="size-4" />}
              title="Volume"
              value={`${Math.round(volume * 100)}%`}
            >
              <input
                aria-label="Volume"
                type="range"
                min="0.05"
                max="0.9"
                step="0.01"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="accent-[#1f6b64]"
              />
            </ControlCard>

            <ControlCard
              icon={<SlidersHorizontal className="size-4" />}
              title="Octave"
              value={`C${octave}`}
            >
              <div className="flex gap-2">
                {[3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setOctave(value)}
                    className={cn(
                      'rounded-full px-3 py-1 text-sm transition',
                      octave === value
                        ? 'bg-[#1f6b64] text-white'
                        : 'bg-white text-slate-700 hover:bg-[#f0e0cf]'
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </ControlCard>

            <ControlCard
              icon={<Keyboard className="size-4" />}
              title="Labels"
              value={labelMode === 'sargam' ? 'Sargam' : 'Western'}
            >
              <div className="flex gap-2">
                {(['sargam', 'western'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLabelMode(value)}
                    className={cn(
                      'rounded-full px-3 py-1 text-sm transition',
                      labelMode === value
                        ? 'bg-[#b77c4a] text-white'
                        : 'bg-white text-slate-700 hover:bg-[#f0e0cf]'
                    )}
                  >
                    {value === 'sargam' ? 'Sargam' : 'Western'}
                  </button>
                ))}
              </div>
            </ControlCard>
          </aside>

          <div className="order-1 rounded-[2rem] border border-black/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(248,239,226,0.94))] p-5 shadow-[0_24px_80px_rgba(79,48,16,0.12)] backdrop-blur sm:p-6 xl:order-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
                  Play surface
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  White keys: A S D F G H J K. Black keys: W E T Y U.
                </p>
              </div>
              <div className="rounded-full border border-[#1f6b64]/15 bg-[#1f6b64]/8 px-3 py-2 text-sm text-[#1f6b64]">
                {playbackMode === 'samples' ? 'Sample audio' : 'Oscillator fallback'}
              </div>
            </div>

            <div className="mb-4 rounded-3xl border border-black/8 bg-[#efe4d2] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#7f4e2a]">Transpose</p>
                  <p className="text-xs text-slate-600">
                    Shift the pitch in semitones to match your range.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-sm font-medium text-slate-700">
                  <button
                    type="button"
                    onClick={() => setTranspose((current) => Math.max(-6, current - 1))}
                    className="rounded-full px-2 py-1 hover:bg-[#f0e0cf]"
                  >
                    -
                  </button>
                  <span>
                    {transpose > 0 ? '+' : ''}
                    {transpose}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTranspose((current) => Math.min(6, current + 1))}
                    className="rounded-full px-2 py-1 hover:bg-[#f0e0cf]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[720px] rounded-[1.75rem] bg-[#f7f1e8] p-3 shadow-inner">
                <div className="relative h-[26rem] overflow-hidden rounded-[1.4rem] border border-black/8 bg-[linear-gradient(180deg,#fbfaf8_0%,#f2eadf_100%)] px-3 pt-3 pb-4 sm:h-[32rem]">
                  <div className="absolute inset-x-0 top-0 h-6 bg-[radial-gradient(circle_at_top,rgba(183,124,74,0.24),transparent_70%)]" />

                  <div className="relative h-full">
                    {whiteKeys.map((note) => {
                      const width = 100 / whiteKeys.length;

                      return (
                        <button
                          key={note.id}
                          type="button"
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(event.pointerId);
                            void startNote(note);
                          }}
                          onPointerUp={() => stopNote(note.id)}
                          onPointerLeave={() => stopNote(note.id)}
                          onPointerCancel={() => stopNote(note.id)}
                          className={cn(
                            'absolute top-0 bottom-0 flex flex-col justify-between rounded-b-[1.2rem] border border-black/8 px-2 pt-4 pb-3 text-left shadow-[inset_0_-10px_24px_rgba(183,124,74,0.10)] transition',
                            activeNoteIds.includes(note.id)
                              ? 'bg-[#f6d2aa]'
                              : 'bg-[linear-gradient(180deg,#fffdfa_0%,#efe3d5_100%)]'
                          )}
                          style={{
                            left: `${note.whiteIndex * width}%`,
                            width: `${width}%`,
                          }}
                        >
                          <div>
                            <p className="text-lg font-semibold text-slate-900">
                              {labelMode === 'sargam' ? note.sargam : note.western}
                            </p>
                            <p className="text-xs text-slate-500">
                              {labelMode === 'sargam' ? note.western : note.sargam}
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-950/6 px-2 py-1 text-xs font-medium text-slate-600">
                            {note.keycap}
                          </span>
                        </button>
                      );
                    })}

                    {blackKeys.map((note) => {
                      const width = 100 / whiteKeys.length;
                      const left = (note.whiteIndex + 1) * width - width * 0.3;

                      return (
                        <button
                          key={note.id}
                          type="button"
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(event.pointerId);
                            void startNote(note);
                          }}
                          onPointerUp={() => stopNote(note.id)}
                          onPointerLeave={() => stopNote(note.id)}
                          onPointerCancel={() => stopNote(note.id)}
                          className={cn(
                            'absolute top-0 z-10 flex h-[58%] w-[12%] flex-col justify-between rounded-b-[1rem] border border-black/10 px-2 pt-3 pb-2 text-left shadow-[0_14px_30px_rgba(15,23,42,0.24)] transition',
                            activeNoteIds.includes(note.id)
                              ? 'bg-[linear-gradient(180deg,#16655e_0%,#0e3f3b_100%)]'
                              : 'bg-[linear-gradient(180deg,#334155_0%,#111827_100%)]'
                          )}
                          style={{ left: `${left}%` }}
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {labelMode === 'sargam' ? note.sargam : note.western}
                            </p>
                            <p className="text-[11px] text-white/70">
                              {labelMode === 'sargam' ? note.western : note.sargam}
                            </p>
                          </div>
                          <span className="rounded-full bg-white/12 px-2 py-1 text-[11px] font-medium text-white/80">
                            {note.keycap}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-white/70 px-3 py-1.5">
                White keys: A S D F G H J K
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1.5">
                Black keys: W E T Y U
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1.5">
                Swipe horizontally on mobile to keep full-size keys.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ControlCard({
  icon,
  title,
  value,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.4rem] border border-black/7 bg-white/85 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-[#b77c4a]/10 p-2 text-[#8f5f33]">
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-600">{value}</span>
      </div>
      <p className="mb-3 text-sm font-medium text-slate-800">{title}</p>
      {children}
    </div>
  );
}



