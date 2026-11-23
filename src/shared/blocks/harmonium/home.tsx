'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileText,
  Keyboard,
  Layers3,
  Music2,
  NotebookPen,
  Radio,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Smartphone,
  Volume2,
  Waves,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

import {
  getNoteKeyByInput,
  getOctaveOption,
  KEYBOARD_MIN_WIDTH,
  NOTE_KEYS,
  OCTAVE_OPTIONS,
  STORAGE_KEY,
} from './constants';
import { MidiPanel } from './midi-panel';
import { HARMONIUM_SONGS } from './songs-data';
import { useHarmoniumPlayer } from './use-harmonium-player';
import { useMidiKeyboard } from './use-midi-keyboard';
import { DroneMode, useTanpuraDrone } from './use-tanpura-drone';

type HomeCopy = {
  title: string;
  description: string;
  useCases: string[];
  keyboardDescription: string;
  playbackSample: string;
  playbackSynth: string;
  featureHeading: string;
  featureDescription: string;
  features: Array<{ title: string; description: string }>;
  practiceMapHeading: string;
  practiceMapDescription: string;
  practiceMap: Array<{ title: string; href: string; description: string }>;
  guideHeading: string;
  guideDescription: string;
  guides: Array<{ title: string; href: string; description: string }>;
  faqHeading: string;
  faqDescription: string;
  faqs: Array<{ question: string; answer: string }>;
};

const featureIcons = [Keyboard, Music2, Layers3, RotateCcw, Smartphone, Save];

const practiceSteps = [
  {
    title: '01 Open & Play',
    description:
      'The harmonium is ready in the browser with touch and keyboard input.',
  },
  {
    title: '02 Set Your Tonic',
    description:
      'Use octave and transpose to place Sa where your voice feels steady.',
  },
  {
    title: '03 Shape Your Sound',
    description:
      'Choose reed layers, reverb, labels, and MIDI input for practice.',
  },
];

export function HarmoniumHome({
  copy,
  serverHero,
}: {
  copy: HomeCopy;
  serverHero?: React.ReactNode;
}) {
  const [labelMode, setLabelMode] = useState<'western' | 'sargam'>('sargam');
  const [octave, setOctave] = useState(4);
  const [transpose, setTranspose] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [reedMode, setReedMode] = useState<'single' | 'double'>('single');
  const [droneMode, setDroneMode] = useState<DroneMode>('off');
  const [midiInputId, setMidiInputId] = useState('');
  const [showMoreControls, setShowMoreControls] = useState(false);

  useTanpuraDrone({
    mode: droneMode,
    rootMidi: (octave + 1) * 12 + transpose,
    volume: Math.min(0.28, volume * 0.65),
  });

  const {
    activeNoteIds,
    playbackMode,
    setMidiSustain,
    startMidiNote,
    startNote,
    stopMidiNote,
    stopNote,
    stopAllNotes,
  } = useHarmoniumPlayer({
    octave,
    transpose,
    volume,
    reverbEnabled,
    reedMode,
  });

  const {
    midiInputs,
    refreshMidi,
    selectedInputId,
    setSelectedInputId,
    supportState,
  } = useMidiKeyboard({
    onNoteOn: startMidiNote,
    onNoteOff: stopMidiNote,
    onSustainChange: setMidiSustain,
    onVolumeChange: setVolume,
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
        reverbEnabled?: boolean;
        reedMode?: 'single' | 'double';
        midiInputId?: string;
      };

      if (parsed.labelMode) setLabelMode(parsed.labelMode);
      if (typeof parsed.octave === 'number') {
        setOctave(getOctaveOption(parsed.octave).value);
      }
      if (typeof parsed.transpose === 'number') setTranspose(parsed.transpose);
      if (typeof parsed.volume === 'number') setVolume(parsed.volume);
      if (typeof parsed.reverbEnabled === 'boolean') {
        setReverbEnabled(parsed.reverbEnabled);
      }
      if (parsed.reedMode) setReedMode(parsed.reedMode);
      if (parsed.midiInputId) setMidiInputId(parsed.midiInputId);
    } catch (error) {
      console.error('Failed to read harmonium settings', error);
    }
  }, []);

  useEffect(() => {
    if (midiInputId) {
      setSelectedInputId(midiInputId);
    }
  }, [midiInputId, setSelectedInputId]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        labelMode,
        octave,
        transpose,
        volume,
        reverbEnabled,
        reedMode,
        midiInputId: selectedInputId,
      })
    );
  }, [
    labelMode,
    octave,
    transpose,
    volume,
    reverbEnabled,
    reedMode,
    selectedInputId,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      const note = getNoteKeyByInput(event.key);
      if (!note) {
        return;
      }

      event.preventDefault();
      void startNote(note);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = getNoteKeyByInput(event.key);
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
  const midiReady = selectedInputId || midiInputs.length > 0;

  return (
    <main className="bg-[#faf7f2] font-sans text-[#2a1f1a]">
      <section
        id="play"
        className="border-b border-[#2a1f1a]/10 px-4 pt-20 pb-8 sm:pt-22"
      >
        <div className="mx-auto flex max-w-[1440px] min-w-0 flex-col gap-4">
          {serverHero ?? (
            <div className="mx-auto min-w-0 max-w-5xl space-y-2.5 text-center">
              <h1 className="font-serif text-3xl leading-[1.08] font-bold text-balance text-[#2a1f1a] sm:text-5xl lg:text-[46px]">
                {copy.title}
              </h1>
              <p className="mx-auto max-w-3xl text-sm leading-6 text-pretty text-[#5d4a40] sm:text-base">
                {copy.description}
              </p>
              <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-1.5">
                {copy.useCases.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#c8633a]/20 bg-[#fffdf8] px-2.5 py-1 text-xs font-medium text-[#8b2e2e]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col rounded-[1.8rem] border border-[#c8925a]/35 bg-[linear-gradient(180deg,#5b2d1b_0%,#3a1b0f_100%)] p-3 shadow-[0_24px_70px_rgba(42,20,10,0.26)] sm:p-4">
            <div className="mb-3 rounded-2xl border border-[#e3b57d]/20 bg-[#26120b]/85 px-2.5 py-2 text-[#f9efe4] shadow-inner">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                <div className="flex items-center gap-1.5 rounded-full border border-[#e3b57d]/20 bg-[#3a1c11] px-2.5 py-1">
                  <SlidersHorizontal className="size-3.5 text-[#e3b57d]" />
                  <span className="text-[11px] font-semibold tracking-wider text-[#e3b57d] uppercase">
                    Oct
                  </span>
                  <button
                    aria-label="Decrease octave"
                    className="size-6 rounded-full text-xs font-bold text-[#f9efe4] hover:bg-white/10"
                    onClick={() =>
                      setOctave((current) =>
                        Math.max(OCTAVE_OPTIONS[0].value, current - 1)
                      )
                    }
                    type="button"
                  >
                    -
                  </button>
                  <span className="min-w-4 text-center text-xs font-bold">
                    {octave}
                  </span>
                  <button
                    aria-label="Increase octave"
                    className="size-6 rounded-full text-xs font-bold text-[#f9efe4] hover:bg-white/10"
                    onClick={() =>
                      setOctave((current) =>
                        Math.min(
                          OCTAVE_OPTIONS[OCTAVE_OPTIONS.length - 1].value,
                          current + 1
                        )
                      )
                    }
                    type="button"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-[#e3b57d]/20 bg-[#3a1c11] px-2.5 py-1">
                  <RotateCcw className="size-3.5 text-[#e3b57d]" />
                  <span className="text-[11px] font-semibold tracking-wider text-[#e3b57d] uppercase">
                    Trans
                  </span>
                  <button
                    aria-label="Decrease transpose"
                    className="size-6 rounded-full text-xs font-bold text-[#f9efe4] hover:bg-white/10"
                    onClick={() =>
                      setTranspose((current) => Math.max(-6, current - 1))
                    }
                    type="button"
                  >
                    -
                  </button>
                  <span className="min-w-5 text-center text-xs font-bold">
                    {transpose > 0 ? `+${transpose}` : transpose}
                  </span>
                  <button
                    aria-label="Increase transpose"
                    className="size-6 rounded-full text-xs font-bold text-[#f9efe4] hover:bg-white/10"
                    onClick={() =>
                      setTranspose((current) => Math.min(6, current + 1))
                    }
                    type="button"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center rounded-full border border-[#e3b57d]/20 bg-[#3a1c11] p-0.5">
                  {(['single', 'double'] as const).map((value) => (
                    <button
                      key={value}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold capitalize transition',
                        reedMode === value
                          ? 'bg-[#c8633a] text-white shadow-sm'
                          : 'text-[#e8d5c4] hover:bg-white/10'
                      )}
                      onClick={() => setReedMode(value)}
                      type="button"
                    >
                      {value} reed
                    </button>
                  ))}
                </div>

                <button
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                    droneMode !== 'off'
                      ? 'border-[#e3b57d] bg-[#c8633a] text-white'
                      : 'border-[#e3b57d]/20 bg-[#3a1c11] text-[#f9efe4] hover:bg-white/10'
                  )}
                  onClick={() =>
                    setDroneMode((current) =>
                      current === 'off'
                        ? 'sa-pa'
                        : current === 'sa-pa'
                          ? 'sa-ma'
                          : 'off'
                    )
                  }
                  type="button"
                >
                  <Radio className="size-3.5 text-[#f3cfa0]" />
                  Tanpura:{' '}
                  {droneMode === 'off'
                    ? 'Off'
                    : droneMode === 'sa-pa'
                      ? 'Sa–Pa'
                      : 'Sa–Ma'}
                </button>

                <button
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                    reverbEnabled
                      ? 'border-[#e3b57d] bg-[#c8633a] text-white'
                      : 'border-[#e3b57d]/20 bg-[#3a1c11] text-[#f9efe4] hover:bg-white/10'
                  )}
                  onClick={() => setReverbEnabled((current) => !current)}
                  type="button"
                >
                  <Waves className="size-3.5 text-[#f3cfa0]" />
                  {reverbEnabled ? 'Room' : 'Dry'}
                </button>

                <button
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                    labelMode === 'sargam'
                      ? 'border-[#e3b57d]/60 bg-[#8b2e2e] text-white'
                      : 'border-[#e3b57d]/20 bg-[#3a1c11] text-[#f9efe4] hover:bg-white/10'
                  )}
                  onClick={() =>
                    setLabelMode((current) =>
                      current === 'sargam' ? 'western' : 'sargam'
                    )
                  }
                  type="button"
                >
                  <Keyboard className="size-3.5 text-[#f3cfa0]" />
                  {labelMode === 'sargam' ? 'Sargam' : 'Western'}
                </button>

                <div className="flex items-center gap-2 rounded-full border border-[#e3b57d]/20 bg-[#3a1c11] px-3 py-1.5">
                  <Volume2 className="size-3.5 text-[#e3b57d]" />
                  <input
                    aria-label="Volume"
                    className="w-20 accent-[#e3b57d]"
                    max="0.9"
                    min="0.05"
                    onChange={(event) => setVolume(Number(event.target.value))}
                    step="0.01"
                    type="range"
                    value={volume}
                  />
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <Link
                    href="/songs"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e3b57d]/35 bg-[#e3b57d]/15 px-3 py-1.5 text-xs font-semibold text-[#f9efe4] transition hover:bg-[#e3b57d]/25"
                  >
                    <Music2 className="size-3.5 text-[#f3cfa0]" />
                    27 Song Notes
                  </Link>
                  <button
                    className="inline-flex items-center gap-1 rounded-full border border-[#e3b57d]/20 bg-[#3a1c11] px-3 py-1.5 text-xs font-semibold text-[#e8d5c4] hover:bg-white/10"
                    onClick={() => setShowMoreControls((current) => !current)}
                    type="button"
                  >
                    MIDI
                    <ChevronDown
                      className={cn(
                        'size-3.5 transition-transform',
                        showMoreControls ? 'rotate-180' : ''
                      )}
                    />
                  </button>
                </div>
              </div>

              {showMoreControls ? (
                <div className="mt-2.5 rounded-xl border border-[#e3b57d]/20 bg-[#fffdf8] px-3 py-2 text-[#2a1f1a]">
                  <MidiPanel
                    compact
                    midiInputs={midiInputs}
                    onRefresh={() => {
                      void refreshMidi();
                    }}
                    onSelectedInputIdChange={setSelectedInputId}
                    selectedInputId={selectedInputId}
                    supportState={supportState}
                  />
                </div>
              ) : null}
            </div>

            <div className="max-w-full overflow-x-auto pb-1">
              <div
                className="rounded-[1.2rem] border border-[#e3b57d]/25 bg-[#1b1410] p-2 shadow-inner"
                style={{ minWidth: `${KEYBOARD_MIN_WIDTH}px` }}
              >
                <div className="relative h-[clamp(270px,40svh,390px)] overflow-hidden rounded-[0.9rem] border border-black/50 bg-[#14100d] px-2.5 pt-2.5 pb-3.5">
                  <div className="absolute inset-x-0 top-0 h-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent)]" />

                  <div className="relative h-full">
                    {whiteKeys.map((note) => {
                      const width = 100 / whiteKeys.length;
                      const active = activeNoteIds.includes(note.id);

                      return (
                        <button
                          key={note.id}
                          aria-label={`Play ${note.sargam} ${note.western}`}
                          className={cn(
                            'absolute top-0 bottom-0 flex flex-col justify-end rounded-b-[0.8rem] border-r border-[#2a1f1a]/35 px-2 pb-4 text-center shadow-[inset_0_-18px_28px_rgba(92,52,24,0.16),0_8px_0_rgba(42,31,26,0.18)] transition duration-75',
                            active
                              ? 'translate-y-1 bg-[linear-gradient(180deg,#f5d09b_0%,#e5a95c_100%)] shadow-[inset_0_-8px_18px_rgba(92,52,24,0.14),0_3px_0_rgba(42,31,26,0.18)]'
                              : 'bg-[linear-gradient(180deg,#fffef9_0%,#f3e7d8_100%)] hover:bg-[#fff7ed]'
                          )}
                          onPointerCancel={() => stopNote(note.id)}
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(
                              event.pointerId
                            );
                            void startNote(note);
                          }}
                          onPointerLeave={() => stopNote(note.id)}
                          onPointerUp={() => stopNote(note.id)}
                          style={{
                            left: `${note.whiteIndex * width}%`,
                            width: `${width}%`,
                          }}
                          type="button"
                        >
                          <span className="text-base font-bold text-[#8b2e2e]">
                            {labelMode === 'sargam'
                              ? note.sargam
                              : note.western}
                          </span>
                          <span className="mt-1 text-xs font-medium text-[#7a6458]">
                            {labelMode === 'sargam'
                              ? note.western
                              : note.sargam}
                          </span>
                          <span className="mt-3 rounded-full bg-[#2a1f1a]/8 px-2 py-1 font-mono text-[11px] font-semibold text-[#6d5549]">
                            {note.keycap}
                          </span>
                        </button>
                      );
                    })}

                    {blackKeys.map((note) => {
                      const width = 100 / whiteKeys.length;
                      const blackWidth = width * 0.62;
                      const left =
                        (note.whiteIndex + 1) * width - blackWidth / 2;
                      const active = activeNoteIds.includes(note.id);

                      return (
                        <button
                          key={note.id}
                          aria-label={`Play ${note.sargam} ${note.western}`}
                          className={cn(
                            'absolute top-0 z-10 flex h-[58%] flex-col justify-end rounded-b-[0.75rem] border border-white/10 px-2 pb-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_24px_rgba(31,27,23,0.38)] transition duration-75',
                            active
                              ? 'translate-y-1 bg-[linear-gradient(180deg,#5a2620_0%,#1f1b17_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_5px_12px_rgba(31,27,23,0.28)]'
                              : 'bg-[linear-gradient(180deg,#302922_0%,#15120f_100%)]'
                          )}
                          onPointerCancel={() => stopNote(note.id)}
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(
                              event.pointerId
                            );
                            void startNote(note);
                          }}
                          onPointerLeave={() => stopNote(note.id)}
                          onPointerUp={() => stopNote(note.id)}
                          style={{ left: `${left}%`, width: `${blackWidth}%` }}
                          type="button"
                        >
                          <span className="text-sm font-bold text-[#f9efe4]">
                            {labelMode === 'sargam'
                              ? note.sargam
                              : note.western}
                          </span>
                          <span className="mt-1 text-[11px] font-medium text-white/62">
                            {labelMode === 'sargam'
                              ? note.western
                              : note.sargam}
                          </span>
                          <span className="mt-3 rounded-full bg-white/10 px-2 py-1 font-mono text-[10px] font-semibold text-white/78">
                            {note.keycap}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2.5 px-1 text-center text-xs text-[#e8d5c4]/85">
              <p>
                Tip: press{' '}
                <span className="font-mono font-semibold text-[#f3cfa0]">
                  E R T Y U I O P
                </span>{' '}
                on a laptop keyboard for middle-octave Sa–Sa′, or swipe
                horizontally to play all 23 keys on mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-b border-[#2a1f1a]/10 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#8b2e2e] uppercase">
                Authentic Indian Harmonium Tone
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#2a1f1a] sm:text-5xl">
                {copy.featureHeading}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6d5549]">
                {copy.featureDescription}
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-[#8b2e2e]/15 bg-[#fffdf8] shadow-[0_20px_50px_rgba(83,45,24,0.14)]">
              <img
                alt="Handcrafted Indian rosewood harmonium with ivory keys, brass stops, and bellows"
                className="aspect-video w-full object-cover"
                height={720}
                loading="lazy"
                src="/imgs/harmonium/indian-harmonium-hero.jpg"
                width={1280}
              />
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.features.slice(0, 6).map((feature, index) => {
              const Icon = featureIcons[index] ?? Keyboard;

              return (
                <div
                  key={feature.title}
                  className="rounded-lg border border-[#2a1f1a]/10 bg-[#fffdf8] p-6 shadow-sm"
                >
                  <Icon className="size-7 stroke-[1.5] text-[#8b2e2e]" />
                  <h3 className="mt-5 text-xl font-semibold text-[#2a1f1a]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#6d5549]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#2a1f1a]/10 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-3xl border border-[#8b2e2e]/15 bg-[#fffdf8] shadow-[0_20px_50px_rgba(83,45,24,0.14)]">
              <img
                alt="Harmonium keyboard with brass kartal cymbals and cream music notebook for Sargam song notes"
                className="aspect-video w-full object-cover"
                height={720}
                loading="lazy"
                src="/imgs/harmonium/sargam-song-notes.jpg"
                width={1280}
              />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#8b2e2e] uppercase">
                Interactive Song Library
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#2a1f1a] sm:text-5xl">
                Popular Web Harmonium Song Notes
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6d5549]">
                Practice popular Bollywood melodies, devotional bhajans, aartis,
                and classical ragas directly on the web harmonium with
                interactive Sargam notes and slow demo playback.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HARMONIUM_SONGS.slice(0, 6).map((song) => (
              <Link
                key={song.slug}
                className="group flex flex-col justify-between rounded-xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8633a]/40 hover:shadow-md"
                href={`/songs/${song.slug}`}
              >
                <div>
                  <span className="text-xs font-semibold text-[#8b2e2e]">
                    {song.category} · {song.difficulty}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-[#2a1f1a] group-hover:text-[#8b2e2e]">
                    {song.title} — Harmonium Notes
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#6d5549]">
                    {song.summary}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#8b2e2e]">
                  Play interactive notes <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-[#8b2e2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6f2424]"
              href="/songs"
            >
              Browse All 27 Song Notes
              <ArrowRight className="size-4" />
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
              href="/online-flute"
            >
              Online Flute (Bansuri)
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
              href="/harmonium-notes#sargam-pdf"
            >
              <FileText className="size-4" />
              Free Sargam Notes PDF
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
              href="/shruti-box"
            >
              <Radio className="size-4" />
              Online Shruti Box &amp; Tanpura
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#2a1f1a]/10 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#8b2e2e] uppercase">
                Laptop, Touch &amp; MIDI Ready
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#2a1f1a] sm:text-5xl">
                How to play web harmonium in 3 steps
              </h2>
              <div className="mt-8 space-y-5">
                {practiceSteps.map((step) => (
                  <div
                    key={step.title}
                    className="border-l-2 border-[#8b2e2e]/45 pl-4"
                  >
                    <h3 className="text-lg font-semibold text-[#8b2e2e]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-7 text-[#6d5549]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-[#8b2e2e]/15 bg-[#fffdf8] shadow-[0_20px_50px_rgba(83,45,24,0.14)]">
              <img
                alt="Musician practicing web harmonium on a laptop and compact MIDI keyboard at a warm wooden desk"
                className="aspect-video w-full object-cover"
                height={720}
                loading="lazy"
                src="/imgs/harmonium/laptop-midi-practice.jpg"
                width={1280}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#2a1f1a]/10 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-3xl border border-[#8b2e2e]/15 bg-[#fffdf8] shadow-[0_20px_50px_rgba(83,45,24,0.14)]">
              <img
                alt="Indian classical vocal riyaz setting with tanpura, rosewood harmonium, and morning light"
                className="aspect-video w-full object-cover"
                height={720}
                loading="lazy"
                src="/imgs/harmonium/vocal-riyaz-tanpura.jpg"
                width={1280}
              />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#8b2e2e] uppercase">
                Riyaz, Raga &amp; Devotional Practice
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#2a1f1a] sm:text-5xl">
                {copy.practiceMapHeading}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6d5549]">
                {copy.practiceMapDescription}
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {copy.practiceMap.map((item) => (
              <Link
                key={item.title}
                className="group rounded-lg border border-[#2a1f1a]/10 bg-[#fffdf8] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8633a]/40 hover:shadow-md"
                href={item.href}
              >
                <NotebookPen className="size-7 stroke-[1.5] text-[#8b2e2e]" />
                <h3 className="mt-5 text-xl font-semibold text-[#2a1f1a]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#6d5549]">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#2a1f1a]/10 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionIntro
            description={copy.guideDescription}
            title={copy.guideHeading}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {copy.guides.slice(0, 3).map((guide, index) => {
              const guideImages = [
                {
                  src: '/imgs/harmonium/sargam-song-notes.jpg',
                  alt: 'Harmonium Sargam notes chart and music journal',
                },
                {
                  src: '/imgs/harmonium/laptop-midi-practice.jpg',
                  alt: 'Playing harmonium on a laptop keyboard and MIDI controller',
                },
                {
                  src: '/imgs/harmonium/vocal-riyaz-tanpura.jpg',
                  alt: 'Shruti Box and Tanpura drone setup for vocal riyaz',
                },
              ];
              const media = guideImages[index % guideImages.length];

              return (
                <Link
                  key={guide.title}
                  className="group overflow-hidden rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8633a]/40 hover:shadow-md"
                  href={guide.href}
                >
                  <img
                    alt={media.alt}
                    className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    height={720}
                    loading="lazy"
                    src={media.src}
                    width={1280}
                  />
                  <div className="p-6">
                    <BookOpen className="size-6 stroke-[1.5] text-[#c8633a]" />
                    <h3 className="mt-3 text-xl font-semibold text-[#2a1f1a] group-hover:text-[#8b2e2e]">
                      {guide.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-7 text-[#6d5549]">
                      {guide.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <SectionIntro
            description={copy.faqDescription}
            title={copy.faqHeading}
          />
          <div className="mt-10 divide-y divide-[#2a1f1a]/10 rounded-lg border border-[#2a1f1a]/10 bg-[#fffdf8]">
            {copy.faqs.map((item, index) => (
              <details
                key={item.question}
                className="group"
                open={index < 3}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left">
                  <span className="text-base font-semibold text-[#2a1f1a]">
                    {item.question}
                  </span>
                  <ChevronDown className="size-5 shrink-0 stroke-[1.5] text-[#8b2e2e] transition group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-7 text-[#6d5549]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionIntro({
  description,
  title,
}: {
  description?: string;
  title: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="font-serif text-4xl font-bold text-[#2a1f1a] sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-[#6d5549]">{description}</p>
      ) : null}
    </div>
  );
}
