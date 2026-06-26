'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Keyboard,
  Layers3,
  Music2,
  Play,
  SlidersHorizontal,
  Sparkles,
  Square,
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
import {
  getDefaultRiyazPracticeState,
  getExerciseIdFromPracticeParam,
  getKeyboardNoteForSa,
  getRiyazPracticeExercise,
  getSaTonicOption,
  RIYAZ_PRACTICE_EXERCISES,
  SA_TONIC_OPTIONS,
} from './practice-loop';
import { useHarmoniumDrone } from './use-harmonium-drone';
import { useHarmoniumPlayer } from './use-harmonium-player';
import { useHarmoniumPractice } from './use-harmonium-practice';
import { useMidiKeyboard } from './use-midi-keyboard';

export function HarmoniumKeyboardPage() {
  const [labelMode, setLabelMode] = useState<'western' | 'sargam'>('sargam');
  const [octave, setOctave] = useState(4);
  const [transpose, setTranspose] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [reedMode, setReedMode] = useState<'single' | 'double'>('single');
  const [midiInputId, setMidiInputId] = useState('');
  const [showShortcutHelp, setShowShortcutHelp] = useState(true);
  const [selectedSa, setSelectedSa] = useState(
    getDefaultRiyazPracticeState().selectedSaId
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    getDefaultRiyazPracticeState().selectedExerciseId
  );
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(
    []
  );
  const [practiceMessage, setPracticeMessage] = useState('');

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
    errorCode: droneErrorCode,
    isDroneActive,
    startDrone,
    status: droneStatus,
    stopDrone,
  } = useHarmoniumDrone();

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
        selectedSa?: string;
        selectedExerciseId?: string;
        completedExerciseIds?: string[];
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
      if (parsed.selectedSa && getSaTonicOption(parsed.selectedSa)) {
        setSelectedSa(parsed.selectedSa);
      }
      if (
        parsed.selectedExerciseId &&
        getRiyazPracticeExercise(parsed.selectedExerciseId)
      ) {
        setSelectedExerciseId(parsed.selectedExerciseId);
      }
      if (Array.isArray(parsed.completedExerciseIds)) {
        setCompletedExerciseIds(
          parsed.completedExerciseIds.filter((id) =>
            Boolean(getRiyazPracticeExercise(id))
          )
        );
      }
    } catch (error) {
      console.error('Failed to read harmonium settings', error);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const exerciseId = getExerciseIdFromPracticeParam(params.get('practice'));
    if (getRiyazPracticeExercise(exerciseId)) {
      setSelectedExerciseId(exerciseId);
      setPracticeMessage('Guided riyaz loop opened from your practice path.');
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
        selectedSa,
        selectedExerciseId,
        completedExerciseIds,
      })
    );
  }, [
    completedExerciseIds,
    labelMode,
    octave,
    transpose,
    volume,
    reverbEnabled,
    reedMode,
    selectedInputId,
    selectedExerciseId,
    selectedSa,
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
  const selectedSaOption =
    getSaTonicOption(selectedSa) ?? SA_TONIC_OPTIONS[0];
  const selectedExercise =
    getRiyazPracticeExercise(selectedExerciseId) ??
    RIYAZ_PRACTICE_EXERCISES[0];
  const selectedSaKeyboardNote = getKeyboardNoteForSa(selectedSa);
  const selectedSaMidi =
    selectedSaOption.midi + (octave - 4) * 12 + transpose;
  const hasCompletedSelectedExercise = completedExerciseIds.includes(
    selectedExercise.id
  );
  const droneStatusMessage =
    droneStatus === 'error' && droneErrorCode === 'audio-blocked'
      ? 'Shruti audio could not start. Tap Start shruti again after interacting with the page, or continue without drone.'
      : isDroneActive
        ? `Shruti is holding ${selectedSaOption.western} as Sa.`
        : 'Shruti is optional and starts only after you press Start shruti.';

  const handleSelectedSaChange = useCallback(
    (nextSa: string) => {
      if (!getSaTonicOption(nextSa)) {
        setPracticeMessage('Invalid Sa value ignored; previous Sa is kept.');
        return;
      }

      setSelectedSa(nextSa);
      setPracticeMessage(`Set Sa to ${nextSa}. Exercise guidance updated.`);
      if (isDroneActive) {
        const option = getSaTonicOption(nextSa);
        if (option) {
          void startDrone({
            midi: option.midi + (octave - 4) * 12 + transpose,
          });
        }
      }
    },
    [isDroneActive, octave, startDrone, transpose]
  );

  const handleExerciseChange = useCallback((exerciseId: string) => {
    const nextExercise = getRiyazPracticeExercise(exerciseId);
    if (!nextExercise) {
      setPracticeMessage('That exercise is unavailable. Previous exercise kept.');
      return;
    }

    setSelectedExerciseId(nextExercise.id);
    setPracticeMessage(`${nextExercise.title} selected. Set Sa, then practice.`);
  }, []);

  const handleDroneToggle = useCallback(() => {
    if (isDroneActive) {
      stopDrone();
      setPracticeMessage('Shruti stopped. Free play and recording still work.');
      return;
    }

    void startDrone({ midi: selectedSaMidi }).then((started) => {
      setPracticeMessage(
        started
          ? `Start shruti: ${selectedSaOption.western} is now your Sa reference.`
          : 'Shruti could not start. Continue playing or try again after a tap.'
      );
    });
  }, [isDroneActive, selectedSaMidi, selectedSaOption.western, startDrone, stopDrone]);

  const handleMarkComplete = useCallback(() => {
    setCompletedExerciseIds((current) => {
      if (current.includes(selectedExercise.id)) {
        setPracticeMessage('This exercise is already complete. Repeat it or choose another.');
        return current;
      }

      setPracticeMessage(
        `${selectedExercise.title} complete. Repeat exercise, record a take, or choose the next path.`
      );
      return [...current, selectedExercise.id];
    });
  }, [selectedExercise.id, selectedExercise.title]);

  const handleRepeatExercise = useCallback(() => {
    setCompletedExerciseIds((current) =>
      current.filter((id) => id !== selectedExercise.id)
    );
    setPracticeMessage(`Repeat exercise: ${selectedExercise.pattern}`);
  }, [selectedExercise.id, selectedExercise.pattern]);
  const learningLinks = [
    {
      title: 'Laptop key map',
      href: '/laptop-harmonium',
    },
    {
      title: 'Harmonium notes',
      href: '/harmonium-notes',
    },
    {
      title: 'Virtual harmonium guide',
      href: '/virtual-harmonium',
    },
    {
      title: 'Sa finding',
      href: '/blog/find-your-tonic-sa-on-web-harmonium',
    },
    {
      title: 'Riyaz warm-up',
      href: '/blog/vocal-warm-up-exercises-with-web-harmonium',
    },
    {
      title: 'Raga practice',
      href: '/blog/beginner-raga-practice-with-web-harmonium',
    },
    {
      title: 'Alankar drills',
      href: '/harmonium-notes',
    },
    {
      title: 'Bhajan and kirtan',
      href: '/blog/play-bhajan-kirtan-on-web-harmonium',
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f8f4ec_40%,#fbfaf7_100%)] font-sans text-[#2a1f1a]">
      <section className="border-b border-[#2a1f1a]/10 bg-white/70 pt-20 pb-6 backdrop-blur sm:pt-24">
        <div className="container max-w-[1500px] space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl font-bold sm:text-5xl">
                Web Harmonium Practice Workbench
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6b5d52] sm:text-base">
                Use your laptop keyboard, touch screen, or MIDI controller to
                practice web harmonium online with Sargam labels, recording
                takes, notation, presets, and saved sessions.
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
              <Button
                asChild
                className="bg-[#8b2e2e] text-white hover:bg-[#6f2424]"
              >
                <Link href="/blog" title="Read Web Harmonium guides">
                  Read Guides
                </Link>
              </Button>
            </div>
          </div>

          <div
            className="rounded-[1.75rem] border border-[#8b2e2e]/12 bg-[#fffdf8] p-5 shadow-sm"
            data-practice-action="guided-riyaz-loop"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.22em] text-[#8b2e2e] uppercase">
                  Guided riyaz loop
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#2a1f1a] sm:text-3xl">
                  Set Sa, start shruti, choose an exercise, then finish a take.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6b5d52]">
                  {selectedExercise.summary} {selectedExercise.saRelationship}
                </p>
              </div>
              <div className="rounded-full border border-[#8b2e2e]/15 bg-[#8b2e2e]/8 px-3 py-2 text-sm font-medium text-[#8b2e2e]">
                {hasCompletedSelectedExercise ? 'Completed once' : 'Ready'}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr_0.9fr]">
              <div className="rounded-[1.2rem] border border-black/7 bg-white p-4">
                <label
                  className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase"
                  htmlFor="set-sa"
                >
                  Set Sa
                </label>
                <select
                  id="set-sa"
                  value={selectedSa}
                  onChange={(event) => handleSelectedSaChange(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-[#b77c4a]/25 bg-[#fcfaf6] px-3 py-2 text-sm text-[#2a1f1a] outline-none focus:border-[#8b2e2e]"
                >
                  {SA_TONIC_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.western} as Sa
                    </option>
                  ))}
                </select>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Current Sa: {selectedSaOption.western}.{' '}
                  {selectedSaKeyboardNote
                    ? `Nearest visible key: ${selectedSaKeyboardNote.keycap}.`
                    : 'Use transpose if your Sa is outside this visible range.'}
                </p>
              </div>

              <div className="rounded-[1.2rem] border border-black/7 bg-white p-4">
                <label
                  className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase"
                  htmlFor="practice-exercise"
                >
                  Exercise
                </label>
                <select
                  id="practice-exercise"
                  value={selectedExercise.id}
                  onChange={(event) => handleExerciseChange(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-[#b77c4a]/25 bg-[#fcfaf6] px-3 py-2 text-sm text-[#2a1f1a] outline-none focus:border-[#8b2e2e]"
                >
                  {RIYAZ_PRACTICE_EXERCISES.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.cta}
                    </option>
                  ))}
                </select>
                <p className="mt-3 text-sm font-medium text-[#2a1f1a]">
                  {selectedExercise.pattern}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedExercise.nextAction}
                </p>
              </div>

              <div className="rounded-[1.2rem] border border-black/7 bg-white p-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Shruti reference
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={handleDroneToggle}
                    className={cn(
                      'min-h-11',
                      isDroneActive
                        ? 'bg-[#5f3820] text-white hover:bg-[#4e2d18]'
                        : 'bg-[#8b2e2e] text-white hover:bg-[#6f2424]'
                    )}
                  >
                    {isDroneActive ? (
                      <Square className="size-4" />
                    ) : (
                      <Play className="size-4" />
                    )}
                    {isDroneActive ? 'Stop shruti' : 'Start shruti'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleMarkComplete}
                    className="min-h-11 border-[#b77c4a]/30 bg-white text-[#7f4e2a]"
                  >
                    Mark complete
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRepeatExercise}
                    className="min-h-11 text-[#8b2e2e]"
                  >
                    Repeat exercise
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {droneStatusMessage}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#6b5d52]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#8b2e2e]/8 px-3 py-1.5 text-[#8b2e2e]">
                <Music2 className="size-4" />
                {selectedExercise.title}
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
                Record this loop in Practice studio when ready.
              </span>
              {practiceMessage ? (
                <span className="rounded-full bg-[#f5e7d7] px-3 py-1.5 text-[#7f4e2a]">
                  {practiceMessage}
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-[#2a1f1a]/10 bg-white/75 p-4 text-sm text-[#6b5d52]">
            <p className="font-semibold text-[#2a1f1a]">Learning paths</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#f7eee5] px-3 py-2 shadow-sm">
                Practice workbench with full-width keyboard first
              </span>
              {learningLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="rounded-full bg-white px-3 py-2 text-[#8b2e2e] shadow-sm hover:bg-[#fff3e7]"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container grid min-w-0 max-w-[1500px] gap-6">
          <aside className="order-2 grid min-w-0 gap-4 lg:grid-cols-[0.92fr_1.08fr] xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-lg border border-[#2a1f1a]/10 bg-white/85 p-5 shadow-sm">
              <h2 className="text-2xl font-semibold">
                Always visible practice controls
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#6b5d52]">
                Keep pitch, label, reed, reverb, and volume settings close to
                the keyboard while you work on Sa finding, riyaz, raga
                exploration, alankar, and bhajan or kirtan practice.
              </p>
            </div>

            <div className="rounded-lg border border-[#2a1f1a]/10 bg-white/85 p-5 shadow-sm">
              <button
                type="button"
                onClick={() => setShowShortcutHelp((current) => !current)}
                className="flex w-full items-start justify-between gap-3 text-left"
                aria-expanded={showShortcutHelp}
              >
                <div>
                  <h2 className="text-2xl font-semibold">Desktop key map</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Use the full desktop layout to move from the lower octave
                    through the middle register and into the upper notes without
                    pushing the keyboard into a narrow side panel.
                  </p>
                </div>
                <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#8b2e2e]/10 px-3 py-2 text-sm font-medium text-[#8b2e2e]">
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
                            <p
                              className={cn(
                                note.kind === 'white'
                                  ? 'text-slate-500'
                                  : 'text-white/70'
                              )}
                            >
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
                className="accent-[#8b2e2e]"
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
                      'min-h-10 rounded-full px-4 py-2 text-sm transition',
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
                      'min-h-10 rounded-full px-4 py-2 text-sm transition',
                      reedMode === option.value
                        ? 'bg-[#8b2e2e] text-white'
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
                      'min-h-10 min-w-10 rounded-full px-4 py-2 text-sm transition',
                      octave === option.value
                        ? 'bg-[#8b2e2e] text-white'
                        : 'bg-white text-slate-700 hover:bg-[#f0e0cf]'
                    )}
                  >
                    {option.shortLabel}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500">
                Move down for accompaniment-style practice, stay at middle for
                default learning, or go higher for brighter lead phrases.
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
                      'min-h-10 rounded-full px-4 py-2 text-sm transition',
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

          <div className="order-1 min-w-0 rounded-[2rem] border border-[#2a1f1a]/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(248,239,226,0.94))] p-5 shadow-[0_24px_80px_rgba(79,48,16,0.12)] backdrop-blur sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium tracking-[0.24em] text-[#8f5f33] uppercase">
                  Web Harmonium practice workbench
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Keep the keyboard fully readable on desktop, then scroll only
                  on smaller screens when needed. Recording takes, notation,
                  presets, and sessions stay below the play surface.
                </p>
              </div>
              <div className="rounded-full border border-[#8b2e2e]/15 bg-[#8b2e2e]/8 px-3 py-2 text-sm text-[#8b2e2e]">
                {playbackMode === 'samples'
                  ? 'Reference sample'
                  : 'Fallback synth'}
              </div>
            </div>

            <div className="mb-4 rounded-3xl border border-black/8 bg-[#f0ebe2] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#7f4e2a]">
                    Transpose
                  </p>
                  <p className="text-xs text-slate-600">
                    Shift the Web Harmonium pitch in semitones to match your
                    range.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-sm font-medium text-slate-700">
                  <button
                    type="button"
                    onClick={() =>
                      setTranspose((current) => Math.max(-6, current - 1))
                    }
                    className="min-h-10 min-w-10 rounded-full px-3 py-2 hover:bg-[#f0e0cf]"
                  >
                    -
                  </button>
                  <span>
                    {transpose > 0 ? '+' : ''}
                    {transpose}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTranspose((current) => Math.min(6, current + 1))
                    }
                    className="min-h-10 min-w-10 rounded-full px-3 py-2 hover:bg-[#f0e0cf]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div
                className="rounded-[1.75rem] border border-[#2a1f1a]/12 bg-[#8b4a2e] p-2 shadow-inner"
                style={{ minWidth: `${KEYBOARD_MIN_WIDTH}px` }}
              >
                <div className="relative h-[26rem] overflow-hidden rounded-[1.35rem] border border-[#1f1b17]/35 bg-[linear-gradient(180deg,#f3eadf_0%,#e6d2bd_100%)] px-3 pt-3 pb-4 sm:h-[32rem]">
                  <div className="absolute inset-x-0 top-0 h-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),transparent)]" />

                  <div className="relative h-full">
                    {whiteKeys.map((note) => {
                      const width = 100 / whiteKeys.length;

                      return (
                        <button
                          key={note.id}
                          type="button"
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(
                              event.pointerId
                            );
                            void handlePlayableNoteStart(note, 'pointer');
                          }}
                          onPointerUp={() => handlePlayableNoteStop(note.id)}
                          onPointerLeave={() => handlePlayableNoteStop(note.id)}
                          onPointerCancel={() =>
                            handlePlayableNoteStop(note.id)
                          }
                          className={cn(
                            'absolute top-0 bottom-0 flex flex-col justify-between rounded-b-[1.2rem] border border-[#d7c8b6] border-r-[#bfae9b] px-2 pt-4 pb-3 text-left shadow-[inset_0_-20px_34px_rgba(139,74,46,0.14),0_8px_0_rgba(42,31,26,0.14)] transition duration-75',
                            activeNoteIds.includes(note.id)
                              ? 'translate-y-1 bg-[#f1c89d] shadow-[inset_0_-8px_18px_rgba(139,74,46,0.13),0_3px_0_rgba(42,31,26,0.12)]'
                              : 'bg-[linear-gradient(180deg,#fffdfa_0%,#efe3d5_100%)]'
                          )}
                          style={{
                            left: `${note.whiteIndex * width}%`,
                            width: `${width}%`,
                          }}
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900 sm:text-base lg:text-lg">
                              {labelMode === 'sargam'
                                ? note.sargam
                                : note.western}
                            </p>
                            <p className="text-[11px] text-slate-500 sm:text-xs">
                              {labelMode === 'sargam'
                                ? note.western
                                : note.sargam}
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
                      const left =
                        (note.whiteIndex + 1) * width - blackWidth / 2;

                      return (
                        <button
                          key={note.id}
                          type="button"
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(
                              event.pointerId
                            );
                            void handlePlayableNoteStart(note, 'pointer');
                          }}
                          onPointerUp={() => handlePlayableNoteStop(note.id)}
                          onPointerLeave={() => handlePlayableNoteStop(note.id)}
                          onPointerCancel={() =>
                            handlePlayableNoteStop(note.id)
                          }
                          className={cn(
                            'absolute top-0 z-10 flex h-[58%] flex-col justify-between rounded-b-[1rem] border border-white/10 px-2 pt-3 pb-2 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_16px_28px_rgba(31,27,23,0.36)] transition duration-75',
                            activeNoteIds.includes(note.id)
                              ? 'translate-y-1 bg-[linear-gradient(180deg,#5a2620_0%,#1f1b17_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_7px_16px_rgba(31,27,23,0.3)]'
                              : 'bg-[linear-gradient(180deg,#2a2520_0%,#1f1b17_100%)]'
                          )}
                          style={{
                            left: `${left}%`,
                            width: `${blackWidth}%`,
                          }}
                        >
                          <div>
                            <p className="text-xs font-semibold text-white sm:text-sm">
                              {labelMode === 'sargam'
                                ? note.sargam
                                : note.western}
                            </p>
                            <p className="text-[10px] text-white/70 sm:text-[11px]">
                              {labelMode === 'sargam'
                                ? note.western
                                : note.sargam}
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

          <div className="order-3 min-w-0">
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
