'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Keyboard,
  Layers3,
  NotebookPen,
  SlidersHorizontal,
  Sparkles,
  Volume2,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import {
  BLACK_KEYCAP_HINT,
  getNoteKeyByInput,
  getOctaveOption,
  KEYBOARD_HELP_GROUPS,
  KEYBOARD_MIN_WIDTH,
  NOTE_KEYS,
  OCTAVE_OPTIONS,
  STORAGE_KEY,
  WHITE_KEYCAP_HINT,
} from './constants';
import { MidiPanel } from './midi-panel';
import { PracticeSummaryCard } from './practice-summary-card';
import { PracticeSettingsSnapshot } from './practice-workspace';
import { useHarmoniumPractice } from './use-harmonium-practice';
import { useMidiKeyboard } from './use-midi-keyboard';
import { useHarmoniumPlayer } from './use-harmonium-player';

type HomeCopy = {
  badge: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryHref?: string;
  trust: string[];
  featureTitle: string;
  featureDescription: string;
  features: Array<{ title: string; description: string }>;
  guideTitle: string;
  guideDescription: string;
  guides: Array<{ title: string; href: string; description: string }>;
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  seoTitle: string;
  seoDescription: string;
};

export function HarmoniumHome({
  locale,
  copy,
}: {
  locale: string;
  copy: HomeCopy;
}) {
  const [labelMode, setLabelMode] = useState<'western' | 'sargam'>('sargam');
  const [octave, setOctave] = useState(4);
  const [transpose, setTranspose] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [reedMode, setReedMode] = useState<'single' | 'double'>('single');
  const [midiInputId, setMidiInputId] = useState('');
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);

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

  const currentPracticeSettings: PracticeSettingsSnapshot = {
    labelMode,
    octave,
    transpose,
    reverbEnabled,
    reedMode,
  };

  const { isAuthenticated, latestPreset, latestSession, syncStatus } =
    useHarmoniumPractice({
      currentSettings: currentPracticeSettings,
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
  const octaveOption = getOctaveOption(octave);

  return (
    <main className="bg-[linear-gradient(180deg,#f8f1e6_0%,#f6efe6_30%,#fbfaf7_100%)] text-slate-950">
      <section
        id="play"
        className="relative overflow-hidden border-b border-black/5 pt-28 pb-16"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(190,124,62,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(35,111,103,0.18),transparent_28%)]" />
        <div className="container relative max-w-[1500px] space-y-8">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-[#b77c4a]/20 bg-white/70 px-4 py-2 text-sm font-medium text-[#8f5f33] shadow-sm backdrop-blur">
              {copy.badge}
            </span>

            <div className="space-y-4">
              <h1 className="w-full max-w-[18ch] text-4xl font-semibold leading-[0.96] text-balance sm:max-w-[20ch] sm:text-6xl 2xl:max-w-[24ch]">
                {copy.title}
              </h1>
              <p className="w-full max-w-[90rem] text-lg leading-8 text-slate-700 text-pretty">
                {copy.description}
              </p>
              <p className="w-full max-w-[90rem] text-base leading-7 text-slate-600 text-pretty">
                This Web Harmonium homepage explains the tool first, then opens
                into a full play surface below so the instrument stays readable
                and the keyboard remains the visual priority.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-[#1f6b64] px-5 text-white hover:bg-[#17544f]"
              >
                <Link href="/keyboard" title="Open the Web Harmonium keyboard">{copy.primaryCta}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#b77c4a]/30 bg-white/75 px-5 text-[#7f4e2a]"
              >
                <Link
                  href={copy.secondaryHref || '/blog'}
                  title="Open the next learning step"
                >
                  {copy.secondaryCta}
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {copy.trust.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            {locale === 'en' ? (
              <div className="grid gap-4 pt-2 md:grid-cols-3">
                <QuickStartLink
                  description="Open the full keyboard immediately if you already know the note map."
                  href="/keyboard"
                  icon={<Keyboard className="size-5" />}
                  title="Play"
                />
                <QuickStartLink
                  description="Review note labels, shortcuts, and beginner patterns before you start."
                  href="/notes"
                  icon={<NotebookPen className="size-5" />}
                  title="Notes"
                />
                <QuickStartLink
                  description="Follow highlighted notes with a guided lesson and autoplay demo."
                  href="/tutorial"
                  icon={<Sparkles className="size-5" />}
                  title="Tutorial"
                />
              </div>
            ) : null}
          </div>

          <div
            id="keyboard"
            className="scroll-mt-28 rounded-[2rem] border border-black/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(248,239,226,0.94))] p-5 shadow-[0_24px_80px_rgba(79,48,16,0.12)] backdrop-blur"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
                  Web Harmonium play surface
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Play with your keyboard or touch after the introduction above,
                  while keeping the full keyboard visible below.
                </p>
              </div>
              <div className="rounded-full border border-[#1f6b64]/15 bg-[#1f6b64]/8 px-3 py-2 text-sm text-[#1f6b64]">
                {playbackMode === 'samples'
                  ? 'Reference sample'
                  : 'Fallback synth'}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
                value={`C${octave} · ${octaveOption.description}`}
              >
                <div className="flex flex-wrap gap-2">
                  {OCTAVE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setOctave(option.value)}
                      className={cn(
                        'rounded-full px-3 py-1 text-sm transition',
                        octave === option.value
                          ? 'bg-[#1f6b64] text-white'
                          : 'bg-white text-slate-700 hover:bg-[#f0e0cf]'
                      )}
                    >
                      {option.shortLabel}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-500">
                  Lower settings suit accompaniment and slower alap phrases. Higher settings keep melodic practice brighter and more cutting.
                </p>
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

              <ControlCard
                icon={<Sparkles className="size-4" />}
                title="Reverb"
                value={reverbEnabled ? 'Room' : 'Dry'}
              >
                <div className="flex gap-2">
                  {[
                    { label: 'Dry', value: false },
                    { label: 'Room', value: true },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setReverbEnabled(option.value)}
                      className={cn(
                        'rounded-full px-3 py-1 text-sm transition',
                        reverbEnabled === option.value
                          ? 'bg-[#8f5f33] text-white'
                          : 'bg-white text-slate-700 hover:bg-[#f0e0cf]'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </ControlCard>

              <ControlCard
                icon={<Layers3 className="size-4" />}
                title="Reeds"
                value={reedMode === 'double' ? 'Double' : 'Single'}
              >
                <div className="flex gap-2">
                  {[
                    { label: 'Single', value: 'single' as const },
                    { label: 'Double', value: 'double' as const },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setReedMode(option.value)}
                      className={cn(
                        'rounded-full px-3 py-1 text-sm transition',
                        reedMode === option.value
                          ? 'bg-[#1f6b64] text-white'
                          : 'bg-white text-slate-700 hover:bg-[#f0e0cf]'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </ControlCard>
            </div>

            <div className="mt-4 rounded-3xl border border-black/8 bg-[#efe4d2] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
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

              <div className="overflow-x-auto pb-2">
                <div
                  className="rounded-[1.75rem] bg-[#f7f1e8] p-3 shadow-inner"
                  style={{ minWidth: `${KEYBOARD_MIN_WIDTH}px` }}
                >
                  <div className="relative h-64 overflow-hidden rounded-[1.4rem] border border-black/8 bg-[linear-gradient(180deg,#fbfaf8_0%,#f2eadf_100%)] px-3 pt-3 pb-4 sm:h-72">
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
                              <p className="text-sm font-semibold text-slate-900 sm:text-base lg:text-lg">
                                {labelMode === 'sargam' ? note.sargam : note.western}
                              </p>
                              <p className="text-[11px] text-slate-500 sm:text-xs">
                                {labelMode === 'sargam' ? note.western : note.sargam}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-950/6 px-2 py-1 text-[10px] font-medium text-slate-600 sm:text-xs">
                              {note.keycap}
                            </span>
                          </button>
                        );
                      })}

                      {blackKeys.map((note) => {
                        const width = 100 / whiteKeys.length;
                        const blackWidth = width * 0.62;
                        const left = (note.whiteIndex + 1) * width - blackWidth / 2;

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
                              'absolute top-0 z-10 flex h-[58%] flex-col justify-between rounded-b-[1rem] border border-black/10 px-2 pt-3 pb-2 text-left shadow-[0_14px_30px_rgba(15,23,42,0.24)] transition',
                              activeNoteIds.includes(note.id)
                                ? 'bg-[linear-gradient(180deg,#16655e_0%,#0e3f3b_100%)]'
                                : 'bg-[linear-gradient(180deg,#334155_0%,#111827_100%)]'
                            )}
                            style={{
                              left: `${left}%`,
                              width: `${blackWidth}%`,
                            }}
                          >
                            <div>
                              <p className="text-xs font-semibold text-white sm:text-sm">
                                {labelMode === 'sargam' ? note.sargam : note.western}
                              </p>
                              <p className="text-[10px] text-white/70 sm:text-[11px]">
                                {labelMode === 'sargam' ? note.western : note.sargam}
                              </p>
                            </div>
                            <span className="rounded-full bg-white/12 px-2 py-1 text-[10px] font-medium text-white/80 sm:text-[11px]">
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
                  {WHITE_KEYCAP_HINT}
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1.5">
                  {BLACK_KEYCAP_HINT}
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1.5">
                  Scroll horizontally on smaller screens to access the full 23-key range.
                </span>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-black/7 bg-white/75 p-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowShortcutHelp((current) => !current)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                  aria-expanded={showShortcutHelp}
                >
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8f5f33]">
                      Desktop shortcuts
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Quick help for the expanded 23-key layout.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#1f6b64]/10 px-3 py-2 text-sm font-medium text-[#1f6b64]">
                    {showShortcutHelp ? 'Hide map' : 'Show map'}
                    <ChevronDown
                      className={cn(
                        'size-4 transition-transform',
                        showShortcutHelp ? 'rotate-180' : ''
                      )}
                    />
                  </span>
                </button>

                {showShortcutHelp ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {KEYBOARD_HELP_GROUPS.map((group) => (
                      <div
                        key={group.title}
                        className="rounded-[1.2rem] border border-black/6 bg-[#fcfaf6] p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {group.title}
                        </p>
                        <p className="mt-1 text-xs leading-6 text-slate-600">
                          {group.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {group.notes.map((note) => (
                            <span
                              key={note.id}
                              className={cn(
                                'inline-flex min-w-11 items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium',
                                note.kind === 'white'
                                  ? 'bg-[#efe3d5] text-slate-700'
                                  : 'bg-slate-900 text-white'
                              )}
                            >
                              {note.keycap}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/5 py-16">
        <div className="container">
          <PracticeSummaryCard
            isAuthenticated={isAuthenticated}
            latestPreset={latestPreset}
            latestSession={latestSession}
            syncStatus={syncStatus}
          />
        </div>
      </section>

      <section className="border-b border-black/5 py-16">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
              Web Harmonium search intent
            </p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
              What people mean when they search Web Harmonium
            </h2>
            <p className="max-w-xl text-lg leading-8 text-slate-700">
              Most users searching for Web Harmonium do not want a gated app.
              They want a browser instrument that opens fast, plays notes
              immediately, and explains the layout clearly enough for practice.
            </p>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              In practice, Web Harmonium usually means a simple browser
              instrument, a clear Web Harmonium keyboard, and quick access to
              the controls needed for daily practice.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-black/7 bg-white/85 p-5 shadow-sm">
              <h3 className="text-lg font-semibold">
                Play Web Harmonium online without downloads
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A useful Web Harmonium should load in one tab, support touch and
                keyboard input, and let beginners start with the visible middle
                octave instead of forcing account setup first.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-black/7 bg-white/85 p-5 shadow-sm">
              <h3 className="text-lg font-semibold">
                Learn Sargam and western labels on the same page
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The strongest landing pages for this keyword explain both note
                systems, because many harmonium learners switch between Sargam
                notation and western note names while practicing online.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-black/7 bg-white/85 p-5 shadow-sm">
              <h3 className="text-lg font-semibold">
                Use the keyboard page as the core tool page
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The dedicated keyboard route gives search engines and users a
                clearer destination for phrases like Web Harmonium keyboard,
                play Web Harmonium online, and virtual harmonium keyboard.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-black/7 bg-white/85 p-5 shadow-sm">
              <h3 className="text-lg font-semibold">
                Support the homepage with specific guides
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Supporting articles like how to play Web Harmonium online and
                beginner keyboard-note explainers help the homepage rank for the
                main term while the blog absorbs longer-tail searches.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-black/5 py-16">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
              {copy.featureTitle}
            </p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
              {copy.seoTitle}
            </h2>
            <p className="max-w-xl text-lg leading-8 text-slate-700">
              {copy.featureDescription}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {copy.features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-[1.6rem] border border-black/7 bg-white/85 p-5 shadow-sm"
              >
                <div className="mb-4 inline-flex rounded-full bg-[#1f6b64]/10 p-2 text-[#1f6b64]">
                  {index === 0 ? (
                    <Keyboard className="size-5" />
                  ) : index === 1 ? (
                    <SlidersHorizontal className="size-5" />
                  ) : (
                    <NotebookPen className="size-5" />
                  )}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/5 py-16">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
              {copy.guideTitle}
            </p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
              Use the homepage for Web Harmonium intent, blog posts for depth
            </h2>
            <p className="max-w-xl text-lg leading-8 text-slate-700">
              {copy.guideDescription}
            </p>
          </div>

          <div className="grid gap-4">
            {copy.guides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group rounded-[1.5rem] border border-black/7 bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{guide.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                      {guide.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#1f6b64]/10 p-2 text-[#1f6b64] transition group-hover:bg-[#1f6b64] group-hover:text-white">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
              {copy.faqTitle}
            </p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
              Questions a Web Harmonium landing page should answer up front
            </h2>
            <p className="max-w-xl text-lg leading-8 text-slate-700">
              {copy.seoDescription}
            </p>
          </div>

          <div className="grid gap-4">
            {copy.faqs.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.5rem] border border-black/7 bg-white/85 p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.answer}
                </p>
              </div>
            ))}
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
    <div className="rounded-[1.4rem] border border-black/7 bg-white/80 p-4 shadow-sm">
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

function QuickStartLink({
  description,
  href,
  icon,
  title,
}: {
  description: string;
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[1.4rem] border border-black/7 bg-white/82 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="inline-flex rounded-full bg-[#1f6b64]/10 p-3 text-[#1f6b64]">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#1f6b64]">
        Open
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
