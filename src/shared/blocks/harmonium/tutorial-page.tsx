'use client';

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Music2,
  RotateCcw,
  Target,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { getNoteKeyByInput, type NoteKey } from './constants';
import {
  getTutorialCatalog,
  getTutorialSongs,
  type ResolvedTutorialSong,
  type ResolvedTutorialStep,
} from './tutorial-data';
import { TutorialKeyboard } from './tutorial-keyboard';
import { useHarmoniumPlayer } from './use-harmonium-player';

type PracticeMode = 'autoplay' | 'guided' | 'step';
type Cursor = { phraseIndex: number; stepIndex: number };

const LANE_CARD_WIDTH = 92;
const LANE_GAP = 18;
const LANE_STEP_WIDTH = LANE_CARD_WIDTH + LANE_GAP;
const LANE_TRACK_PADDING = 340;
const JUDGEMENT_LINE_OFFSET = '54%';

function getCompletedSteps(song: ResolvedTutorialSong, cursor: Cursor) {
  const completedBeforePhrase = song.phrases
    .slice(0, cursor.phraseIndex)
    .reduce((sum, phrase) => sum + phrase.steps.length, 0);
  const currentPhrase = song.phrases[cursor.phraseIndex];

  if (!currentPhrase) return song.totalSteps;
  return completedBeforePhrase + Math.min(cursor.stepIndex, currentPhrase.steps.length);
}

function getNextCursor(song: ResolvedTutorialSong, cursor: Cursor) {
  const phrase = song.phrases[cursor.phraseIndex];

  if (!phrase) return { cursor, completed: true, phraseCompleted: false };

  if (cursor.stepIndex + 1 < phrase.steps.length) {
    return {
      cursor: { phraseIndex: cursor.phraseIndex, stepIndex: cursor.stepIndex + 1 },
      completed: false,
      phraseCompleted: false,
    };
  }

  if (cursor.phraseIndex + 1 < song.phrases.length) {
    return {
      cursor: { phraseIndex: cursor.phraseIndex + 1, stepIndex: 0 },
      completed: false,
      phraseCompleted: true,
    };
  }

  return {
    cursor: { phraseIndex: cursor.phraseIndex, stepIndex: phrase.steps.length },
    completed: true,
    phraseCompleted: true,
  };
}

function getPreviousCursor(song: ResolvedTutorialSong, cursor: Cursor): Cursor {
  if (cursor.stepIndex > 0) {
    return { phraseIndex: cursor.phraseIndex, stepIndex: cursor.stepIndex - 1 };
  }

  if (cursor.phraseIndex > 0) {
    const previousPhrase = song.phrases[cursor.phraseIndex - 1];
    return {
      phraseIndex: cursor.phraseIndex - 1,
      stepIndex: Math.max(previousPhrase.steps.length - 1, 0),
    };
  }

  return { phraseIndex: 0, stepIndex: 0 };
}

function getModeLabel(mode: PracticeMode) {
  if (mode === 'autoplay') return 'Auto-play';
  if (mode === 'step') return 'Step-by-step';
  return 'Guided practice';
}

function getDifficultyLabel(song: ResolvedTutorialSong) {
  if (song.difficulty === 'beginner') return 'Beginner';
  if (song.difficulty === 'medium') return 'Medium';
  return 'Easy';
}

function getAccuracy(correctCount: number, mistakeCount: number) {
  const totalAttempts = correctCount + mistakeCount;
  if (totalAttempts === 0) return 100;
  return Math.max(0, Math.round((correctCount / totalAttempts) * 100));
}

export function HarmoniumTutorialPage() {
  const catalog = useMemo(() => getTutorialCatalog(), []);
  const songs = useMemo(() => getTutorialSongs(), []);
  const [labelMode, setLabelMode] = useState<'western' | 'sargam'>('sargam');
  const [activeSongId, setActiveSongId] = useState(songs[0]?.id ?? 'two-tigers');
  const [cursor, setCursor] = useState<Cursor>({ phraseIndex: 0, stepIndex: 0 });
  const [mode, setMode] = useState<PracticeMode>('guided');
  const [tempoBpm, setTempoBpm] = useState(songs[0]?.bpm ?? 86);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completedRuns, setCompletedRuns] = useState(0);
  const [statusText, setStatusText] = useState(
    'Start with Two Tigers. Listen to the phrase first, then match each note on the keyboard.'
  );
  const [isAutoplaying, setIsAutoplaying] = useState(false);
  const [previewStepIndex, setPreviewStepIndex] = useState<number | null>(null);
  const [lastInputLabel, setLastInputLabel] = useState('Waiting for input');
  const [lastInputState, setLastInputState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const timersRef = useRef<number[]>([]);
  const playbackTokenRef = useRef(0);

  const song =
    songs.find((item) => item.id === activeSongId) ??
    songs[0];
  const currentSongMeta =
    catalog.find((item) => item.id === song.id) ??
    catalog[0];
  const phrase = song.phrases[cursor.phraseIndex];
  const currentStep =
    cursor.stepIndex < phrase.steps.length ? phrase.steps[cursor.stepIndex] : null;
  const activeLaneIndex =
    previewStepIndex !== null
      ? previewStepIndex
      : Math.min(cursor.stepIndex, Math.max(phrase.steps.length - 1, 0));
  const completedSteps = getCompletedSteps(song, cursor);
  const songProgressPercent = Math.round((completedSteps / song.totalSteps) * 100);
  const phraseProgressPercent = Math.round(
    (Math.min(cursor.stepIndex, phrase.steps.length) / phrase.steps.length) * 100
  );
  const accuracy = getAccuracy(correctCount, mistakeCount);
  const highlightedNoteIds =
    previewStepIndex !== null
      ? [phrase.steps[previewStepIndex]?.note.id].filter(
          (value): value is string => Boolean(value)
        )
      : currentStep
        ? [currentStep.note.id]
        : [];
  const laneTransform = `translateX(calc(${JUDGEMENT_LINE_OFFSET} - ${
    LANE_TRACK_PADDING + activeLaneIndex * LANE_STEP_WIDTH + LANE_CARD_WIDTH / 2
  }px))`;
  const nextCursorState = currentStep ? getNextCursor(song, cursor) : null;
  const nextTargetStep =
    nextCursorState && !nextCursorState.completed
      ? song.phrases[nextCursorState.cursor.phraseIndex]?.steps[nextCursorState.cursor.stepIndex] ??
        null
      : null;
  const practiceStateLabel = isAutoplaying
    ? 'Listening'
    : currentStep === null
      ? 'Phrase complete'
      : mode === 'step'
        ? 'Manual'
        : completedSteps === 0
          ? 'Ready'
          : 'Guided';
  const transportIndex =
    previewStepIndex !== null
      ? previewStepIndex + 1
      : currentStep
        ? cursor.stepIndex + 1
        : phrase.steps.length;
  const transportProgressPercent = Math.max(
    4,
    Math.min(100, Math.round((transportIndex / phrase.steps.length) * 100))
  );

  const { activeNoteIds, startNote, stopAllNotes, stopNote } = useHarmoniumPlayer({
    octave: 4,
    transpose: 0,
    volume: 0.34,
    reverbEnabled: false,
    reedMode: 'single',
  });

  const clearPlaybackQueue = useCallback(() => {
    playbackTokenRef.current += 1;
    for (const timerId of timersRef.current) window.clearTimeout(timerId);
    timersRef.current = [];
    setIsAutoplaying(false);
    setPreviewStepIndex(null);
    stopAllNotes();
  }, [stopAllNotes]);

  const queueTimer = useCallback((callback: () => void, delayMs: number) => {
    const timerId = window.setTimeout(callback, delayMs);
    timersRef.current.push(timerId);
  }, []);

  const playStepNote = useCallback(
    async (step: ResolvedTutorialStep, durationMs: number) => {
      await startNote(step.note);
      queueTimer(() => stopNote(step.note.id), durationMs);
    },
    [queueTimer, startNote, stopNote]
  );

  const resetCurrentSong = useCallback(
    (nextMode: PracticeMode = mode) => {
      clearPlaybackQueue();
      setCursor({ phraseIndex: 0, stepIndex: 0 });
      setMode(nextMode);
      setCorrectCount(0);
      setMistakeCount(0);
      setStreak(0);
      setBestStreak(0);
      setCompletedRuns(0);
      setLastInputLabel('Waiting for input');
      setLastInputState('idle');
      setStatusText(
        nextMode === 'step'
          ? 'Step-by-step mode is ready. Match one note at a time and use the labels as your guide.'
          : 'Guided practice is ready. Match the highlighted note and stay near the center of the keyboard.'
      );
    },
    [clearPlaybackQueue, mode]
  );

  const autoplayPhrase = useCallback(async () => {
    clearPlaybackQueue();
    setMode('autoplay');
    setIsAutoplaying(true);
    setLastInputLabel('Auto-play preview');
    setLastInputState('idle');
    setStatusText(
      `Listening to ${song.title} ${phrase.title.toLowerCase()}. Watch the moving score first, then practice it yourself.`
    );

    const token = playbackTokenRef.current;
    const msPerBeat = 60000 / tempoBpm;
    let accumulatedDelay = 0;

    phrase.steps.forEach((step, index) => {
      queueTimer(async () => {
        if (token !== playbackTokenRef.current) return;
        setPreviewStepIndex(index);
        const durationMs = Math.max(260, Math.round(step.durationBeats * msPerBeat * 0.82));
        await playStepNote(step, durationMs);
      }, accumulatedDelay);

      accumulatedDelay += Math.round(step.durationBeats * msPerBeat);
    });

    queueTimer(() => {
      if (token !== playbackTokenRef.current) return;
      setIsAutoplaying(false);
      setPreviewStepIndex(null);
      setStatusText(
        'Phrase demo complete. Switch to Guided practice or Step-by-step and start matching the notes yourself.'
      );
    }, accumulatedDelay + 120);
  }, [clearPlaybackQueue, phrase, playStepNote, song.title, tempoBpm]);

  const moveBackward = useCallback(() => {
    clearPlaybackQueue();
    setCursor((current) => getPreviousCursor(song, current));
    setLastInputLabel('Waiting for input');
    setLastInputState('idle');
    setStatusText('Moved back one note. Re-center on the next highlighted key.');
  }, [clearPlaybackQueue, song]);

  const moveForward = useCallback(() => {
    clearPlaybackQueue();
    setCursor((current) => getNextCursor(song, current).cursor);
    setLastInputLabel('Waiting for input');
    setLastInputState('idle');
    setStatusText('Moved forward. Keep your eyes on the next target note.');
  }, [clearPlaybackQueue, song]);

  const completeSuccessfulStep = useCallback(
    (note: NoteKey) => {
      const result = getNextCursor(song, cursor);
      setCorrectCount((current) => current + 1);
      setStreak((current) => {
        const next = current + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
      setCursor(result.cursor);

      if (result.completed) {
        setCompletedRuns((current) => current + 1);
        setStatusText(
          `${song.title} complete. Listen again or restart to improve your timing and accuracy.`
        );
        return;
      }

      if (result.phraseCompleted) {
        const nextPhrase = song.phrases[result.cursor.phraseIndex];
        setStatusText(`Phrase complete. Next up: ${nextPhrase.title}. Keep going.`);
        return;
      }

      setStatusText(
        `Correct: ${note.sargam} / ${note.western}. ${
          mode === 'step' ? 'Step-by-step keeps the pace calm.' : 'Stay with the moving score.'
        }`
      );
    },
    [cursor, mode, song]
  );

  const handleIncorrectAttempt = useCallback(
    (played: NoteKey) => {
      setMistakeCount((current) => current + 1);
      setStreak(0);

      if (!currentStep) {
        setStatusText('This phrase is complete. Reset or jump to another phrase.');
        return;
      }

      setStatusText(
        `That was ${played.sargam} / ${played.western}. The target is ${currentStep.note.sargam} / ${currentStep.note.western}.`
      );
    },
    [currentStep]
  );

  const handleNoteAttempt = useCallback(
    async (note: NoteKey, source: 'pointer' | 'keyboard') => {
      if (isAutoplaying || mode === 'autoplay') return;
      if (source === 'pointer') await startNote(note);
      setLastInputLabel(`${note.sargam} / ${note.western}`);

      if (!currentStep) {
        setLastInputState('wrong');
        handleIncorrectAttempt(note);
        return;
      }

      if (note.id === currentStep.note.id) {
        setLastInputState('correct');
        completeSuccessfulStep(note);
        return;
      }

      setLastInputState('wrong');
      handleIncorrectAttempt(note);
    },
    [completeSuccessfulStep, currentStep, handleIncorrectAttempt, isAutoplaying, mode, startNote]
  );

  const selectSong = useCallback(
    (songId: string) => {
      clearPlaybackQueue();
      const nextSong = songs.find((item) => item.id === songId);

      if (!nextSong) {
        const reservedSong = catalog.find((item) => item.id === songId);
        setStatusText(
          reservedSong?.availabilityNote ??
            'This lesson is reserved for the first batch library and is not playable yet.'
        );
        return;
      }

      setActiveSongId(songId);
      setTempoBpm(nextSong.bpm);
      setCursor({ phraseIndex: 0, stepIndex: 0 });
      setMode('guided');
      setCorrectCount(0);
      setMistakeCount(0);
      setStreak(0);
      setBestStreak(0);
      setCompletedRuns(0);
      setLastInputLabel('Waiting for input');
      setLastInputState('idle');
      setStatusText(
        `${nextSong.title} is ready. Listen to phrase 1 first, then start guided practice.`
      );
    },
    [catalog, clearPlaybackQueue, songs]
  );

  const selectPhrase = useCallback(
    (index: number) => {
      clearPlaybackQueue();
      setCursor({ phraseIndex: index, stepIndex: 0 });
      setLastInputLabel('Waiting for input');
      setLastInputState('idle');
      setStatusText(
        `${song.phrases[index].title} selected. Start with the first highlighted note in this phrase.`
      );
    },
    [clearPlaybackQueue, song]
  );

  const switchMode = useCallback(
    (nextMode: PracticeMode) => {
      clearPlaybackQueue();
      setMode(nextMode);
      setLastInputLabel('Waiting for input');
      setLastInputState('idle');
      setStatusText(
        nextMode === 'step'
          ? 'Step-by-step mode active. Match one note, then move to the next target.'
          : 'Guided practice active. Follow the highlighted target and keep the phrase flowing.'
      );
    },
    [clearPlaybackQueue]
  );

  useEffect(() => () => clearPlaybackQueue(), [clearPlaybackQueue]);

  useEffect(() => {
    const pressedNoteIds = new Set<string>();

    function releaseAllPressedNotes() {
      for (const noteId of pressedNoteIds) stopNote(noteId);
      pressedNoteIds.clear();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;
      const note = getNoteKeyByInput(event.key);
      if (!note) return;

      event.preventDefault();
      if (pressedNoteIds.has(note.id)) return;

      pressedNoteIds.add(note.id);
      void startNote(note);
      void handleNoteAttempt(note, 'keyboard');
    }

    function handleKeyUp(event: KeyboardEvent) {
      const note = getNoteKeyByInput(event.key);
      if (!note) return;
      pressedNoteIds.delete(note.id);
      stopNote(note.id);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseAllPressedNotes);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseAllPressedNotes);
      releaseAllPressedNotes();
    };
  }, [handleNoteAttempt, startNote, stopNote]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4ead8_0%,#f8f2e7_35%,#fbfaf7_100%)] text-slate-950">
      <section className="border-b border-black/6 bg-white/65 pt-24 pb-10 backdrop-blur sm:pt-28">
        <div className="container max-w-[1440px] space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] xl:items-center">
            <div className="max-w-4xl">
              <span className="inline-flex rounded-full border border-[#f0c97d] bg-[#fff7e7] px-5 py-2 text-sm font-medium uppercase tracking-[0.24em] text-[#ca8a04]">
                Practice mode
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.96] tracking-tight sm:text-6xl">
                Web harmonium songs: guided practice and harmonium song keys
              </h1>
            </div>

            <div className="space-y-5">
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                This page is for practice, not note reference. Use auto-play to hear the phrase,
                switch to guided practice to follow the moving score, or play manually and
                advance note by note.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-[#1f6b64] text-white hover:bg-[#17544f]">
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
                  <Link href="/notes">Open Harmonium Notes</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/7 bg-white/88 p-5 shadow-sm sm:p-7">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
              <div className="rounded-[1.6rem] border border-black/6 bg-[#fcfaf6] p-6">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#6f86a6]">
                  Tutorial mode
                </p>
                <h2 className="mt-4 text-5xl font-semibold leading-none tracking-tight text-slate-950">
                  {song.title}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-9 text-slate-600">
                  {song.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#8f5f33] shadow-sm">
                    {getDifficultyLabel(song)}
                  </span>
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                    {song.meter}
                  </span>
                </div>
                <p className="mt-6 text-sm leading-7 text-slate-500">
                  {currentSongMeta.description}
                </p>
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.6rem] border border-black/6 bg-[#f7f9fc] p-4">
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#6f86a6]">
                    Songs
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {catalog.map((item) => {
                      const isActive = item.id === song.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectSong(item.id)}
                          className={cn(
                            'rounded-[1.3rem] border p-4 text-left transition',
                            isActive
                              ? 'border-[#f0c97d] bg-[#fff8e8] shadow-[0_10px_28px_rgba(240,201,125,0.16)]'
                              : 'border-black/8 bg-white hover:border-[#d3aa55]/50'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                            <span
                              className={cn(
                                'rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em]',
                                item.status === 'ready'
                                  ? 'bg-[#eef7f4] text-[#1f6b64]'
                                  : 'bg-[#f6ebde] text-[#8f5f33]'
                              )}
                            >
                              {item.status === 'ready' ? 'Ready' : 'Planned'}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{item.subtitle}</p>
                          {item.status === 'planned' ? (
                            <p className="mt-3 text-xs leading-6 text-[#8f5f33]">
                              {item.availabilityNote}
                            </p>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCard label="Tempo" value={`${tempoBpm} BPM`} />
                  <MetricCard label="Progress" value={`${songProgressPercent}%`} />
                  <MetricCard label="Mode" value={practiceStateLabel} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="container max-w-[1600px] space-y-8">
          <div className="space-y-6">
            <section className="rounded-[1.75rem] border border-black/7 bg-white/82 p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#8f5f33]">
                    <span>Phrase practice</span>
                    <span className="rounded-full bg-[#f6ebde] px-3 py-1 text-[11px] text-[#8f5f33]">
                      {getModeLabel(mode)}
                    </span>
                  </div>
                  <h2 className="mt-3 text-3xl font-semibold">
                    Start with Phrase 1, then work through the whole song
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Use the phrase cards below to repeat one section until it feels natural,
                    then continue through the full melody with the moving score.
                  </p>
                </div>

                <div className="flex gap-2">
                  {(['sargam', 'western'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setLabelMode(value)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm transition',
                        labelMode === value
                          ? 'bg-[#1f6b64] text-white'
                          : 'bg-[#f5ede1] text-slate-700 hover:bg-[#eadcc7]'
                      )}
                    >
                      {value === 'sargam' ? 'Sargam' : 'Western'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">
                      Jump into any phrase of the song
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#f6ebde] px-3 py-1 text-xs font-medium text-[#8f5f33]">
                    {song.phrases.length} phrases
                  </span>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {song.phrases.map((item, index) => {
                    const isActive = index === cursor.phraseIndex;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectPhrase(index)}
                        className={cn(
                          'rounded-[1.2rem] border p-4 text-left transition',
                          isActive
                            ? 'border-[#1f6b64]/30 bg-[#f3fbf8]'
                            : 'border-black/6 bg-[#fcfaf6] hover:border-[#8f5f33]/25'
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-base font-semibold text-slate-950">{item.title}</h4>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm">
                            {item.steps.length} notes
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-black/7 bg-white/82 p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#8f5f33]">
                    Moving score
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Follow the judgement line, then press the matching key right below it
                  </h2>
                </div>
                <div className="rounded-full bg-[#f6ebde] px-4 py-2 text-sm font-medium text-[#8f5f33]">
                  {phrase.title}
                </div>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-black/6 bg-[#fcfaf6] p-4">
                <div className="flex flex-col gap-3 rounded-[1.2rem] border border-black/6 bg-[#f5f7fb] p-3">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          void autoplayPhrase();
                        }}
                        className="rounded-[1rem] bg-[#ea8700] px-5 text-white hover:bg-[#d97900]"
                      >
                        <Music2 className="size-4" />
                        {isAutoplaying ? 'Playing phrase...' : 'Play with sound'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => switchMode('guided')}
                        className={cn(
                          'rounded-[1rem] border-[#d8dde8] bg-white text-slate-900 shadow-none hover:bg-white',
                          mode === 'guided' ? 'border-[#f0c97d] bg-[#fff8e8] text-[#8a4d00]' : ''
                        )}
                      >
                        Guided practice
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => resetCurrentSong(mode === 'autoplay' ? 'guided' : mode)}
                        className="rounded-[1rem] border-[#d8dde8] bg-white text-slate-900 shadow-none hover:bg-white"
                      >
                        <RotateCcw className="size-4" />
                        Reset
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={moveBackward}
                        className="rounded-[1rem] border-[#d8dde8] bg-white text-slate-900 shadow-none hover:bg-white"
                      >
                        <ChevronLeft className="size-4" />
                        Step back
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={moveForward}
                        className="rounded-[1rem] border-[#d8dde8] bg-white text-slate-900 shadow-none hover:bg-white"
                      >
                        Step forward
                      </Button>
                    </div>

                    <div className="flex min-w-[240px] flex-1 items-center gap-4 xl:max-w-[340px] xl:justify-end">
                      <span className="text-sm font-medium text-slate-600">Tempo</span>
                      <input
                        type="range"
                        min={54}
                        max={132}
                        step={2}
                        value={tempoBpm}
                        onChange={(event) => {
                          clearPlaybackQueue();
                          setTempoBpm(Number(event.target.value));
                          setStatusText('Tempo updated. Listen again or continue practicing at the new speed.');
                        }}
                        className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[#2f3440]"
                      />
                      <span className="w-16 text-right text-sm font-semibold text-slate-900">
                        {tempoBpm}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.16em]',
                          mode === 'step'
                            ? 'bg-[#eef7f4] text-[#1f6b64]'
                            : 'bg-white text-slate-600'
                        )}
                      >
                        Step-by-step available
                      </span>
                      <button
                        type="button"
                        onClick={() => resetCurrentSong('step')}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] transition',
                          mode === 'step'
                            ? 'border-[#1f6b64] bg-[#eef7f4] text-[#1f6b64]'
                            : 'border-[#d8dde8] bg-white text-slate-600 hover:border-[#1f6b64]/35'
                        )}
                      >
                        Switch to step-by-step
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span>{phrase.description}</span>
                      <span>
                        Target note:{' '}
                        {currentStep
                          ? `${labelMode === 'sargam' ? currentStep.note.sargam : currentStep.note.western}`
                          : 'Phrase complete'}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#dfe5ef]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#f59e0b_0%,#f472b6_18%,#8b5cf6_36%,#60a5fa_56%,#34d399_100%)] transition-[width] duration-300"
                      style={{ width: `${transportProgressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="relative mt-5 overflow-hidden rounded-[1.8rem] border border-[#3b2f24] bg-[linear-gradient(180deg,#2b241d_0%,#0f0f10_100%)] px-4 py-7 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <div className="absolute right-5 top-5 z-20 flex gap-3">
                    <FloatingCounter label="Streak" value={streak} />
                    <FloatingCounter label="Best" value={bestStreak} />
                  </div>
                  <div className="absolute inset-x-7 top-1/2 h-px bg-white/10" />
                  <div
                    className="absolute top-0 bottom-0 w-px bg-[#f3bf6c] shadow-[0_0_18px_rgba(243,191,108,0.8)]"
                    style={{ left: JUDGEMENT_LINE_OFFSET }}
                  />
                  <div className="absolute inset-y-0 z-20" style={{ left: `calc(${JUDGEMENT_LINE_OFFSET} - 56px)` }}>
                    <div className="flex h-full items-center">
                      <span className="rounded-full bg-[#f3bf6c] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#432606]">
                        Hit line
                      </span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'flex items-center gap-[18px] transition-transform duration-500 ease-out',
                      mode === 'step' ? 'duration-200' : ''
                    )}
                    style={{ transform: laneTransform }}
                  >
                    <div style={{ width: `${LANE_TRACK_PADDING}px` }} />
                    {phrase.steps.map((step, index) => {
                      const isPreview = previewStepIndex === index;
                      const isCurrent = !isPreview && currentStep?.id === step.id;
                      const isPassed =
                        previewStepIndex === null &&
                        (index < cursor.stepIndex ||
                          (currentStep === null && index <= phrase.steps.length - 1));

                      return (
                        <div
                          key={step.id}
                          className={cn(
                            'shrink-0 rounded-[1.35rem] border px-3 py-4 transition',
                            isPreview || isCurrent
                              ? 'border-[#f3bf6c]/60 bg-[linear-gradient(180deg,#ffcb57_0%,#8a4700_100%)] text-white shadow-[0_0_35px_rgba(255,196,88,0.34)]'
                              : isPassed
                                ? 'border-[#3f4f67] bg-[linear-gradient(180deg,#16181d_0%,#050608_100%)] text-white/82'
                                : 'border-[#374151] bg-[linear-gradient(180deg,#22252c_0%,#07080a_100%)] text-white'
                          )}
                          style={{ width: `${LANE_CARD_WIDTH}px`, minHeight: '8.5rem' }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={cn('text-xs uppercase tracking-[0.18em]', isPreview || isCurrent ? 'text-white/75' : 'text-white/45')}>
                                {step.durationBeats === 2 ? 'Hold 2 beats' : '1 beat'}
                              </p>
                              <h3 className="mt-2 text-2xl font-semibold">
                                {labelMode === 'sargam' ? step.note.sargam : step.note.western}
                              </h3>
                              <p className={cn('mt-1 text-sm', isPreview || isCurrent ? 'text-white/75' : 'text-white/62')}>
                                {labelMode === 'sargam' ? step.note.western : step.note.sargam}
                              </p>
                            </div>
                            <span
                              className={cn(
                                'rounded-full px-3 py-1 text-xs font-medium',
                                isPreview || isCurrent ? 'bg-white/16 text-white' : 'bg-white/8 text-white/80'
                              )}
                            >
                              {step.note.keycap}
                            </span>
                          </div>

                          <div className="mt-5 flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                'rounded-full px-3 py-1 text-xs font-medium',
                                isPreview || isCurrent
                                  ? 'bg-white/14 text-white'
                                  : isPassed
                                    ? 'bg-white/14 text-white'
                                    : 'bg-white/8 text-white/72'
                              )}
                            >
                              {step.lyric || 'Instrumental'}
                            </span>
                            <span className={cn('text-xs', isPreview || isCurrent ? 'text-white/72' : 'text-white/55')}>
                              {index + 1}/{phrase.steps.length}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ width: `${LANE_TRACK_PADDING}px` }} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <p className="text-slate-600">{statusText}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[#8f5f33]">
                    Phrase progress {phraseProgressPercent}%
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-black/7 bg-white/82 p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#8f5f33]">
                    Keyboard sync
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Match the highlighted note on the live keyboard
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                    Use your mouse or the browser keyboard shortcuts. The gold target is the next note to hit.
                  </p>
                </div>

                <div className="rounded-[1.15rem] border border-black/6 bg-[#fcfaf6] px-4 py-3 text-sm text-slate-600">
                  Keyboard input: use the printed keycaps on each key.
                </div>
              </div>

              <div className="mt-5">
                <TutorialKeyboard
                  activeNoteIds={activeNoteIds}
                  highlightedNoteIds={highlightedNoteIds}
                  labelMode={labelMode}
                  onNotePress={(note) => {
                    void handleNoteAttempt(note, 'pointer');
                  }}
                  onNoteRelease={stopNote}
                />
              </div>
            </section>
          </div>

          <aside className="grid gap-6 xl:grid-cols-3">
            <section className="rounded-[1.75rem] border border-black/7 bg-white/82 p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#8f5f33]">
                    Session snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Stay oriented while you practice
                  </h2>
                </div>
                <Target className="size-5 text-[#8f5f33]" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <StatCard label="Status" value={practiceStateLabel} />
                <StatCard label="Manual input" value={lastInputLabel} compact />
                <StatCard
                  label="Current note"
                  value={
                    currentStep
                      ? `${currentStep.note.sargam} / ${currentStep.note.western}`
                      : 'Complete'
                  }
                  compact
                />
                <StatCard
                  label="Next target"
                  value={
                    nextTargetStep
                      ? `${nextTargetStep.note.sargam} / ${nextTargetStep.note.western}`
                      : 'End of phrase'
                  }
                  compact
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <StatCard label="Streak" value={String(streak)} />
                <StatCard label="Best" value={String(bestStreak)} />
                <StatCard label="Correct" value={String(correctCount)} />
                <StatCard label="Mistakes" value={String(mistakeCount)} />
                <StatCard label="Accuracy" value={`${accuracy}%`} />
                <StatCard label="Runs" value={String(completedRuns)} />
              </div>

              <div className="mt-5 rounded-[1.35rem] border border-black/6 bg-[#fcfaf6] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8f5f33]">
                      Status
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{statusText}</p>
                  </div>
                  <span
                    className={cn(
                      'mt-1 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.16em]',
                      lastInputState === 'correct'
                        ? 'bg-[#e8f8ef] text-[#1e9142]'
                        : lastInputState === 'wrong'
                          ? 'bg-[#fff0ea] text-[#b45309]'
                          : 'bg-white text-slate-600'
                    )}
                  >
                    {lastInputState === 'correct'
                      ? 'Correct input'
                      : lastInputState === 'wrong'
                        ? 'Wrong key'
                        : 'Waiting'}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-black/7 bg-white/82 p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#8f5f33]">
                How to use it
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                A simple beginner loop
              </h2>

              <div className="mt-5 space-y-3">
                <TipCard
                  title="1. Play the phrase once"
                  description="Start with Play with sound so the melody and keyboard position settle in your ear."
                />
                <TipCard
                  title="2. Switch to guided practice"
                  description="Follow the highlighted note and keep your right hand near the center C area."
                />
                <TipCard
                  title="3. Slow down when needed"
                  description="Use Step-by-step or lower BPM to remove pressure and focus on note matching."
                />
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-black/7 bg-white/82 p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#8f5f33]">
                Lesson map
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Why Two Tigers works well for beginners
              </h2>

              <div className="mt-5 space-y-4">
                <InfoRow label="Pattern">
                  Repeated opening phrases make it easy to lock the first four notes into memory.
                </InfoRow>
                <InfoRow label="Range">
                  The melody stays in a comfortable, visible part of the current 23-note keyboard.
                </InfoRow>
                <InfoRow label="Transfer">
                  Once this lesson feels stable, the same tutorial system can scale to more songs.
                </InfoRow>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function FloatingCounter({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/6 px-4 py-3 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white/82">{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-black/6 bg-[#f7f9fc] p-5">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#6f86a6]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function StatCard({
  compact,
  label,
  value,
}: {
  compact?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-black/6 bg-[#fcfaf6] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8f5f33]">{label}</p>
      <p className={cn('mt-3 font-semibold text-slate-950', compact ? 'text-base leading-7' : 'text-2xl')}>
        {value}
      </p>
    </div>
  );
}

function TipCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-black/6 bg-[#fcfaf6] p-4">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.2rem] border border-black/6 bg-[#fcfaf6] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8f5f33]">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{children}</p>
    </div>
  );
}
