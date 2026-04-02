'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Keyboard,
  Layers3,
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
import { PracticeStudio } from './practice-studio';
import { PracticeSettingsSnapshot } from './practice-workspace';
import { useHarmoniumPractice } from './use-harmonium-practice';
import { useMidiKeyboard } from './use-midi-keyboard';
import { useHarmoniumPlayer } from './use-harmonium-player';

export function HarmoniumKeyboardPage() {
  const [labelMode, setLabelMode] = useState<'western' | 'sargam'>('sargam');
  const [octave, setOctave] = useState(4);
  const [transpose, setTranspose] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [reedMode, setReedMode] = useState<'single' | 'double'>('single');
  const [midiInputId, setMidiInputId] = useState('');
  const [showShortcutHelp, setShowShortcutHelp] = useState(true);

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

  const applyPracticeSettings = useCallback(
    (snapshot: PracticeSettingsSnapshot) => {
      setLabelMode(snapshot.labelMode);
      setOctave(getOctaveOption(snapshot.octave).value);
      setTranspose(snapshot.transpose);
      setReverbEnabled(snapshot.reverbEnabled);
      setReedMode(snapshot.reedMode);
    },
    []
  );

  const {
    applyPreset,
    captureAllActiveNotes,
    captureNoteStart,
    captureNoteStop,
    deleteSession,
    deleteUserPreset,
    isAuthenticated,
    isRecording,
    presets,
    renameCurrentSession,
    renameUserPreset,
    resetCurrentTake,
    saveCurrentSession,
    saveUserPreset,
    savedSessions,
    selectedSession,
    selectSession,
    startRecording,
    stopRecording,
    syncStatus,
    updateCurrentNotation,
  } = useHarmoniumPractice({
    currentSettings: currentPracticeSettings,
    applySettingsSnapshot: applyPracticeSettings,
  });

  const handlePlayableNoteStart = useCallback(
    async (
      note: (typeof NOTE_KEYS)[number],
      source: 'pointer' | 'keyboard' = 'pointer'
    ) => {
      captureNoteStart({
        voiceId: note.id,
        source,
        midi: note.midi + (octave - 4) * 12 + transpose,
      });
      await startNote(note);
    },
    [captureNoteStart, octave, startNote, transpose]
  );

  const handlePlayableNoteStop = useCallback(
    (noteId: string) => {
      stopNote(noteId);
      captureNoteStop(noteId);
    },
    [captureNoteStop, stopNote]
  );

  const handleMidiNoteStart = useCallback(
    (voiceId: string, midi: number) => {
      captureNoteStart({
        voiceId,
        source: 'midi',
        midi: midi + transpose,
      });
      void startMidiNote(voiceId, midi);
    },
    [captureNoteStart, startMidiNote, transpose]
  );

  const handleMidiNoteStop = useCallback(
    (voiceId: string) => {
      stopMidiNote(voiceId);
      captureNoteStop(voiceId);
    },
    [captureNoteStop, stopMidiNote]
  );

  const handleStopAllNotes = useCallback(() => {
    stopAllNotes();
    captureAllActiveNotes();
  }, [captureAllActiveNotes, stopAllNotes]);

  const {
    midiInputs,
    refreshMidi,
    selectedInputId,
    setSelectedInputId,
    supportState,
  } = useMidiKeyboard({
    onNoteOn: handleMidiNoteStart,
    onNoteOff: handleMidiNoteStop,
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
      void handlePlayableNoteStart(note, 'keyboard');
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = getNoteKeyByInput(event.key);

      if (!note) {
        return;
      }

      handlePlayableNoteStop(note.id);
    };

    const handleBlur = () => handleStopAllNotes();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      handleStopAllNotes();
    };
  }, [handlePlayableNoteStart, handlePlayableNoteStop, handleStopAllNotes]);

  const whiteKeys = NOTE_KEYS.filter((note) => note.kind === 'white');
  const blackKeys = NOTE_KEYS.filter((note) => note.kind === 'black');
  const octaveOption = getOctaveOption(octave);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6efe2_0%,#f8f4ec_40%,#fbfaf7_100%)] text-slate-950">
      <section className="border-b border-black/5 bg-white/70 pt-24 pb-8 backdrop-blur sm:pt-28">
        <div className="container max-w-[1500px] space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
                Web Harmonium practice mode
              </p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">
                Play Web Harmonium Online on a full keyboard practice page
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                This Web Harmonium page keeps the keyboard front and center, so
                you can play online with touch, desktop shortcuts, MIDI input,
                Sargam labels, octave control, transpose, and saved practice
                settings without squeezing the instrument into a side column.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="border-[#b77c4a]/30 bg-white/85 text-[#7f4e2a]"
              >
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back Home
                </Link>
              </Button>
              <Button asChild className="bg-[#1f6b64] text-white hover:bg-[#17544f]">
                <Link href="/blog" title="Read Web Harmonium guides">
                  Read Guides
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
              Full-width Web Harmonium keyboard first
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
              {WHITE_KEYCAP_HINT}
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
              {BLACK_KEYCAP_HINT}
            </span>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container grid max-w-[1500px] gap-6">
          <aside className="order-2 grid gap-4 lg:grid-cols-[0.92fr_1.08fr] xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[1.6rem] border border-black/7 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
                Web Harmonium setup
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Ready to play</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use your keyboard or tap the keys. This Web Harmonium keyboard
                keeps your volume, octave, transpose, and label mode ready for
                the next practice session without crowding the play surface.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-black/7 bg-white/85 p-5 shadow-sm">
              <button
                type="button"
                onClick={() => setShowShortcutHelp((current) => !current)}
                className="flex w-full items-start justify-between gap-3 text-left"
                aria-expanded={showShortcutHelp}
              >
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
                    Web Harmonium shortcut guide
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">Desktop key map</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Use the full desktop layout to move from the lower octave
                    through the middle register and into the upper notes without
                    pushing the keyboard into a narrow side panel.
                  </p>
                </div>
                <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#1f6b64]/10 px-3 py-2 text-sm font-medium text-[#1f6b64]">
                  {showShortcutHelp ? 'Collapse' : 'Expand'}
                  <ChevronDown
                    className={cn(
                      'size-4 transition-transform',
                      showShortcutHelp ? 'rotate-180' : ''
                    )}
                  />
                </span>
              </button>

              {showShortcutHelp ? (
                <div className="mt-5 space-y-4">
                  {KEYBOARD_HELP_GROUPS.map((group) => (
                    <div
                      key={group.title}
                      className="rounded-[1.2rem] border border-black/6 bg-[#fcfaf6] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {group.title}
                          </p>
                          <p className="mt-1 text-xs leading-6 text-slate-600">
                            {group.description}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#b77c4a]/10 px-2.5 py-1 text-xs font-medium text-[#8f5f33]">
                          {group.notes.length} keys
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.notes.map((note) => (
                          <div
                            key={note.id}
                            className={cn(
                              'rounded-[1rem] border px-3 py-2 text-xs shadow-sm',
                              note.kind === 'white'
                                ? 'border-[#dcc9b2] bg-[#efe3d5] text-slate-700'
                                : 'border-slate-900 bg-slate-900 text-white'
                            )}
                          >
                            <p className="font-semibold">{note.keycap}</p>
                            <p className={cn(note.kind === 'white' ? 'text-slate-500' : 'text-white/70')}>
                              {note.western}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <MidiPanel
              midiInputs={midiInputs}
              onRefresh={() => {
                void refreshMidi();
              }}
              onSelectedInputIdChange={setSelectedInputId}
              selectedInputId={selectedInputId}
              supportState={supportState}
            />

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
                Move down for accompaniment-style practice, stay at middle for default learning, or go higher for brighter lead phrases.
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
          </aside>

          <div className="order-1 rounded-[2rem] border border-black/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(248,239,226,0.94))] p-5 shadow-[0_24px_80px_rgba(79,48,16,0.12)] backdrop-blur sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
                  Web Harmonium play surface
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Keep the keyboard fully readable on desktop, then scroll only
                  on smaller screens when needed.
                </p>
              </div>
              <div className="rounded-full border border-[#1f6b64]/15 bg-[#1f6b64]/8 px-3 py-2 text-sm text-[#1f6b64]">
                {playbackMode === 'samples'
                  ? 'Reference sample'
                  : 'Fallback synth'}
              </div>
            </div>

            <div className="mb-4 rounded-3xl border border-black/8 bg-[#efe4d2] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#7f4e2a]">Transpose</p>
                  <p className="text-xs text-slate-600">
                    Shift the Web Harmonium pitch in semitones to match your
                    range.
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
              <div
                className="rounded-[1.75rem] bg-[#f7f1e8] p-3 shadow-inner"
                style={{ minWidth: `${KEYBOARD_MIN_WIDTH}px` }}
              >
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
                            void handlePlayableNoteStart(note, 'pointer');
                          }}
                          onPointerUp={() => handlePlayableNoteStop(note.id)}
                          onPointerLeave={() => handlePlayableNoteStop(note.id)}
                          onPointerCancel={() => handlePlayableNoteStop(note.id)}
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
                            void handlePlayableNoteStart(note, 'pointer');
                          }}
                          onPointerUp={() => handlePlayableNoteStop(note.id)}
                          onPointerLeave={() => handlePlayableNoteStop(note.id)}
                          onPointerCancel={() => handlePlayableNoteStop(note.id)}
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
                Scroll horizontally on mobile to keep the full Web Harmonium
                keyboard playable.
              </span>
            </div>

          </div>

          <div className="order-3">
            <PracticeStudio
              isAuthenticated={isAuthenticated}
              isRecording={isRecording}
              presets={presets}
              savedSessions={savedSessions}
              selectedSession={selectedSession}
              syncStatus={syncStatus}
              onApplyPreset={applyPreset}
              onDeletePreset={deleteUserPreset}
              onDeleteSession={deleteSession}
              onRenamePreset={renameUserPreset}
              onRenameSession={renameCurrentSession}
              onResetCurrentTake={resetCurrentTake}
              onSavePreset={saveUserPreset}
              onSaveSession={saveCurrentSession}
              onSelectSession={selectSession}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onUpdateNotation={updateCurrentNotation}
            />
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



