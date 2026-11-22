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
        className="border-b border-[#2a1f1a]/10 px-4 pt-20 pb-6 sm:pt-24 lg:min-h-[calc(100svh-56px)]"
      >
        <div className="mx-auto flex max-w-[1440px] min-w-0 flex-col gap-3">
          {serverHero ?? (
            <div className="mx-auto min-w-0 max-w-5xl space-y-4 text-center">
              <h1 className="font-serif text-4xl leading-[1.05] font-bold text-balance text-[#2a1f1a] sm:text-6xl lg:text-[56px]">
                {copy.title}
              </h1>
              <p className="mx-auto max-w-4xl text-lg leading-7 text-pretty text-[#5d4a40]">
                {copy.description}
              </p>
              <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2 overflow-x-visible pb-0 sm:flex-nowrap sm:overflow-x-auto">
                {copy.useCases.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#c8633a]/20 bg-[#fffdf8] px-3 py-1.5 text-sm font-medium text-[#8b2e2e] transition hover:border-[#c8633a]/45 hover:bg-[#fff4e8]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col rounded-3xl border border-[#8b2e2e]/18 bg-[#fffdf8]/92 p-3 shadow-[0_20px_70px_rgba(83,45,24,0.14)] backdrop-blur sm:p-4">
            <div className="order-2 mt-3 rounded-2xl border border-[#2a1f1a]/10 bg-[#f3e8dc] p-3">
              <div className="grid gap-3 lg:grid-cols-[0.85fr_0.9fr_1fr_1.1fr]">
                <ControlGroup
                  icon={<Music2 className="size-4" />}
                  label="Tonic"
                >
                  <button className="rounded-full border border-[#8b2e2e]/20 bg-white px-3 py-1.5 text-sm font-semibold text-[#2a1f1a]">
                    C
                  </button>
                </ControlGroup>

                <ControlGroup
                  icon={<SlidersHorizontal className="size-4" />}
                  label="Octave"
                >
                  <Stepper
                    onDown={() =>
                      setOctave((current) =>
                        Math.max(OCTAVE_OPTIONS[0].value, current - 1)
                      )
                    }
                    onUp={() =>
                      setOctave((current) =>
                        Math.min(
                          OCTAVE_OPTIONS[OCTAVE_OPTIONS.length - 1].value,
                          current + 1
                        )
                      )
                    }
                    value={String(octave)}
                  />
                </ControlGroup>

                <ControlGroup
                  icon={<RotateCcw className="size-4" />}
                  label="Transpose"
                >
                  <Stepper
                    onDown={() =>
                      setTranspose((current) => Math.max(-6, current - 1))
                    }
                    onUp={() =>
                      setTranspose((current) => Math.min(6, current + 1))
                    }
                    value={`${transpose > 0 ? '+' : ''}${transpose}`}
                  />
                </ControlGroup>

                <ControlGroup
                  icon={<Layers3 className="size-4" />}
                  label="Reed"
                >
                  <div className="flex rounded-full border border-[#8b2e2e]/18 bg-white p-1">
                    {(['single', 'double'] as const).map((value) => (
                      <button
                        key={value}
                        className={cn(
                          'min-h-10 rounded-full px-4 py-2 text-xs font-semibold capitalize transition',
                          reedMode === value
                            ? 'bg-[#8b2e2e] text-white shadow-sm'
                            : 'text-[#6d5549] hover:bg-[#f7eee5]'
                        )}
                        onClick={() => setReedMode(value)}
                        type="button"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </ControlGroup>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <ControlGroup
                  icon={<Radio className="size-4" />}
                  label="Tanpura"
                >
                  <button
                    className={cn(
                      'min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition',
                      droneMode !== 'off'
                        ? 'bg-[#c8633a] text-white'
                        : 'border border-[#8b2e2e]/18 bg-white text-[#6d5549]'
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
                    {droneMode === 'off'
                      ? 'Off'
                      : droneMode === 'sa-pa'
                        ? 'Sa–Pa'
                        : 'Sa–Ma'}
                  </button>
                </ControlGroup>

                <ControlGroup
                  icon={<Waves className="size-4" />}
                  label="Reverb"
                >
                  <button
                    className={cn(
                      'min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition',
                      reverbEnabled
                        ? 'bg-[#c8633a] text-white'
                        : 'border border-[#8b2e2e]/18 bg-white text-[#6d5549]'
                    )}
                    onClick={() => setReverbEnabled((current) => !current)}
                    type="button"
                  >
                    {reverbEnabled ? 'Room' : 'Dry'}
                  </button>
                </ControlGroup>

                <ControlGroup
                  icon={<Keyboard className="size-4" />}
                  label="Labels"
                >
                  <button
                    className={cn(
                      'min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition',
                      labelMode === 'sargam'
                        ? 'bg-[#8b2e2e] text-white'
                        : 'border border-[#8b2e2e]/18 bg-white text-[#6d5549]'
                    )}
                    onClick={() =>
                      setLabelMode((current) =>
                        current === 'sargam' ? 'western' : 'sargam'
                      )
                    }
                    type="button"
                  >
                    {labelMode === 'sargam' ? 'Sargam' : 'Western'}
                  </button>
                </ControlGroup>
              </div>

              <button
                className="mt-3 inline-flex min-h-10 w-fit items-center gap-2 rounded-full border border-[#8b2e2e]/18 bg-white px-4 py-2 text-sm font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
                onClick={() => setShowMoreControls((current) => !current)}
                type="button"
              >
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform',
                    showMoreControls ? 'rotate-180' : ''
                  )}
                />
                More controls (Volume, MIDI input)
              </button>

              {showMoreControls ? (
                <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_2fr]">
                  <ControlGroup
                    icon={<Volume2 className="size-4" />}
                    label="Volume"
                  >
                    <input
                      aria-label="Volume"
                      className="w-full accent-[#8b2e2e]"
                      max="0.9"
                      min="0.05"
                      onChange={(event) =>
                        setVolume(Number(event.target.value))
                      }
                      step="0.01"
                      type="range"
                      value={volume}
                    />
                  </ControlGroup>
                  <div className="rounded-2xl border border-[#8b2e2e]/14 bg-white/70 px-3 py-2">
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
                </div>
              ) : null}
            </div>

            <div className="order-1 max-w-full overflow-x-auto pb-2">
              <div
                className="rounded-[1.6rem] border border-[#2a1f1a]/12 bg-[#8b4a2e] p-2 shadow-inner"
                style={{ minWidth: `${KEYBOARD_MIN_WIDTH}px` }}
              >
                <div className="relative h-[clamp(280px,42svh,420px)] overflow-hidden rounded-[1.2rem] border border-[#1f1b17]/40 bg-[#1f1b17] px-3 pt-3 pb-4">
                  <div className="absolute inset-x-0 top-0 h-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]" />

                  <div className="relative h-full">
                    {whiteKeys.map((note) => {
                      const width = 100 / whiteKeys.length;
                      const active = activeNoteIds.includes(note.id);

                      return (
                        <button
                          key={note.id}
                          aria-label={`Play ${note.sargam} ${note.western}`}
                          className={cn(
                            'absolute top-0 bottom-0 flex flex-col justify-end rounded-b-[0.9rem] border-r border-[#2a1f1a]/35 px-2 pb-4 text-center shadow-[inset_0_-18px_28px_rgba(92,52,24,0.16),0_8px_0_rgba(42,31,26,0.18)] transition duration-75',
                            active
                              ? 'translate-y-1 bg-[#f0c28f] shadow-[inset_0_-8px_18px_rgba(92,52,24,0.14),0_3px_0_rgba(42,31,26,0.18)]'
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

            <div className="order-3 mt-3 px-1 text-center text-sm text-[#6d5549]">
              <p>
                Tip: press{' '}
                <span className="font-mono font-semibold text-[#8b2e2e]">
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
          <SectionIntro
            description={copy.featureDescription}
            title={copy.featureHeading}
          />
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
          <SectionIntro
            description="Practice popular Bollywood melodies, devotional bhajans, aartis, and classical ragas directly on the web harmonium with interactive Sargam notes and slow demo playback."
            title="Popular Web Harmonium Song Notes"
          />
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
              Browse All 12 Song Notes
              <ArrowRight className="size-4" />
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
          <SectionIntro title="How to play web harmonium in 3 steps" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {practiceSteps.map((step) => (
              <div
                key={step.title}
                className="border-t border-[#8b2e2e]/35 pt-5"
              >
                <h3 className="text-lg font-semibold text-[#8b2e2e]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#6d5549]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#2a1f1a]/10 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionIntro
            description={copy.practiceMapDescription}
            title={copy.practiceMapHeading}
          />
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
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.guides.slice(0, 3).map((guide) => (
              <Link
                key={guide.title}
                className="group rounded-lg border border-[#2a1f1a]/10 bg-[#fffdf8] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8633a]/40 hover:shadow-md"
                href={guide.href}
              >
                <BookOpen className="size-7 stroke-[1.5] text-[#c8633a]" />
                <h3 className="mt-5 text-xl font-semibold text-[#2a1f1a]">
                  {guide.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#6d5549]">
                  {guide.description}
                </p>
              </Link>
            ))}
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

function ControlGroup({
  children,
  icon,
  label,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#fffdf8]/72 px-3 py-2">
      <span className="text-[#8b2e2e]">{icon}</span>
      <span className="text-sm font-semibold text-[#5d4a40]">{label}</span>
      <div className="ml-auto min-w-0">{children}</div>
    </div>
  );
}

function Stepper({
  onDown,
  onUp,
  value,
}: {
  onDown: () => void;
  onUp: () => void;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#8b2e2e]/18 bg-white px-2 py-1">
      <button
        aria-label="Decrease"
        className="min-h-10 min-w-10 rounded-full px-3 py-2 text-[#8b2e2e] hover:bg-[#f7eee5]"
        onClick={onDown}
        type="button"
      >
        -
      </button>
      <span className="min-w-6 text-center text-sm font-bold text-[#2a1f1a]">
        {value}
      </span>
      <button
        aria-label="Increase"
        className="min-h-10 min-w-10 rounded-full px-3 py-2 text-[#8b2e2e] hover:bg-[#f7eee5]"
        onClick={onUp}
        type="button"
      >
        +
      </button>
    </div>
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
