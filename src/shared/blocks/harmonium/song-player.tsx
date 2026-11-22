'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Radio, RotateCcw, Square } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import {
  getNoteKeyByInput,
  KEYBOARD_MIN_WIDTH,
  NOTE_KEYS,
  NoteKey,
} from './constants';
import { HarmoniumSong, SongNoteStep } from './songs-data';
import { useHarmoniumPlayer } from './use-harmonium-player';
import { DroneMode, useTanpuraDrone } from './use-tanpura-drone';

const NOTE_BY_ID = new Map(NOTE_KEYS.map((note) => [note.id, note]));

export function SongHarmoniumPlayer({ song }: { song: HarmoniumSong }) {
  const [labelMode, setLabelMode] = useState<'sargam' | 'western'>('sargam');
  const [transpose, setTranspose] = useState(song.transpose);
  const [speed, setSpeed] = useState<0.6 | 0.8 | 1>(0.8);
  const [droneMode, setDroneMode] = useState<DroneMode>('off');
  const [playingLineIndex, setPlayingLineIndex] = useState<number | null>(null);
  const [playingStepIndex, setPlayingStepIndex] = useState<number | null>(null);

  const timersRef = useRef<number[]>([]);
  const isPlayingRef = useRef(false);

  const { activeNoteIds, startNote, stopNote, stopAllNotes } =
    useHarmoniumPlayer({
      octave: 4,
      transpose,
      volume: 0.35,
      reverbEnabled: true,
      reedMode: 'single',
    });

  useTanpuraDrone({
    mode: droneMode,
    rootMidi: 60 + transpose,
    volume: 0.18,
  });

  const clearPlayback = useCallback(() => {
    for (const timer of timersRef.current) {
      window.clearTimeout(timer);
    }
    timersRef.current = [];
    isPlayingRef.current = false;
    setPlayingLineIndex(null);
    setPlayingStepIndex(null);
    stopAllNotes();
  }, [stopAllNotes]);

  const scheduleSequence = useCallback(
    (sequence: Array<{ lineIndex: number; stepIndex: number; step: SongNoteStep }>) => {
      clearPlayback();
      isPlayingRef.current = true;

      let elapsed = 0;
      sequence.forEach(({ lineIndex, stepIndex, step }) => {
        const scaledDuration = Math.round(step.durationMs / speed);
        const note = NOTE_BY_ID.get(step.noteId);
        if (!note) {
          return;
        }

        const startTimer = window.setTimeout(() => {
          if (!isPlayingRef.current) return;
          setPlayingLineIndex(lineIndex);
          setPlayingStepIndex(stepIndex);
          void startNote(note);
        }, elapsed);

        const stopTimer = window.setTimeout(() => {
          stopNote(note.id);
        }, elapsed + Math.max(140, scaledDuration - 60));

        timersRef.current.push(startTimer, stopTimer);
        elapsed += scaledDuration;
      });

      const endTimer = window.setTimeout(() => {
        isPlayingRef.current = false;
        setPlayingLineIndex(null);
        setPlayingStepIndex(null);
      }, elapsed + 80);

      timersRef.current.push(endTimer);
    },
    [clearPlayback, speed, startNote, stopNote]
  );

  const handlePlayAll = () => {
    if (isPlayingRef.current) {
      clearPlayback();
      return;
    }

    const sequence = song.lines.flatMap((line, lineIndex) =>
      line.steps.map((step, stepIndex) => ({
        lineIndex,
        stepIndex,
        step,
      }))
    );
    scheduleSequence(sequence);
  };

  const handlePlayLine = (lineIndex: number) => {
    const line = song.lines[lineIndex];
    if (!line) return;
    scheduleSequence(
      line.steps.map((step, stepIndex) => ({
        lineIndex,
        stepIndex,
        step,
      }))
    );
  };

  const handleTapNote = (note: NoteKey) => {
    void startNote(note);
    window.setTimeout(() => stopNote(note.id), 360);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const note = getNoteKeyByInput(event.key);
      if (!note) return;
      event.preventDefault();
      void startNote(note);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = getNoteKeyByInput(event.key);
      if (!note) return;
      stopNote(note.id);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearPlayback();
    };
  }, [clearPlayback, startNote, stopNote]);

  const whiteKeys = useMemo(
    () => NOTE_KEYS.filter((note) => note.kind === 'white'),
    []
  );
  const blackKeys = useMemo(
    () => NOTE_KEYS.filter((note) => note.kind === 'black'),
    []
  );

  const isPlaying = playingLineIndex !== null;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#8b2e2e]/18 bg-[#fffdf8] p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8b2e2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f2424]"
              onClick={handlePlayAll}
              type="button"
            >
              {isPlaying ? (
                <>
                  <Square className="size-4" />
                  Stop Demo
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Play Full Demo
                </>
              )}
            </button>

            <div className="flex items-center rounded-full border border-[#8b2e2e]/20 bg-white p-1">
              {([0.6, 0.8, 1] as const).map((rate) => (
                <button
                  key={rate}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                    speed === rate
                      ? 'bg-[#8b2e2e] text-white'
                      : 'text-[#6d5549] hover:bg-[#f7eee5]'
                  )}
                  onClick={() => setSpeed(rate)}
                  type="button"
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className={cn(
                'inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                droneMode !== 'off'
                  ? 'bg-[#c8633a] text-white'
                  : 'border border-[#8b2e2e]/20 bg-white text-[#6d5549]'
              )}
              onClick={() =>
                setDroneMode((cur) =>
                  cur === 'off' ? 'sa-pa' : cur === 'sa-pa' ? 'sa-ma' : 'off'
                )
              }
              type="button"
            >
              <Radio className="size-3.5" />
              Tanpura:{' '}
              {droneMode === 'off'
                ? 'Off'
                : droneMode === 'sa-pa'
                  ? 'Sa–Pa'
                  : 'Sa–Ma'}
            </button>

            <button
              className="min-h-10 rounded-full border border-[#8b2e2e]/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#6d5549] hover:bg-[#fff4e8]"
              onClick={() =>
                setLabelMode((cur) => (cur === 'sargam' ? 'western' : 'sargam'))
              }
              type="button"
            >
              Labels: {labelMode === 'sargam' ? 'Sargam' : 'Western'}
            </button>

            <div className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#8b2e2e]/20 bg-white px-2.5 py-1 text-xs font-semibold text-[#5d4a40]">
              <RotateCcw className="size-3.5 text-[#8b2e2e]" />
              <button
                className="px-1.5 text-[#8b2e2e]"
                onClick={() => setTranspose((c) => Math.max(-6, c - 1))}
                type="button"
              >
                -
              </button>
              <span>
                {transpose > 0 ? `+${transpose}` : transpose}
              </span>
              <button
                className="px-1.5 text-[#8b2e2e]"
                onClick={() => setTranspose((c) => Math.min(6, c + 1))}
                type="button"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 max-w-full overflow-x-auto pb-2">
          <div
            className="rounded-[1.4rem] border border-[#2a1f1a]/12 bg-[#8b4a2e] p-2 shadow-inner"
            style={{ minWidth: `${KEYBOARD_MIN_WIDTH}px` }}
          >
            <div className="relative h-[260px] overflow-hidden rounded-[1rem] border border-[#1f1b17]/40 bg-[#1f1b17] px-3 pt-2 pb-3 sm:h-[300px]">
              <div className="relative h-full">
                {whiteKeys.map((note) => {
                  const width = 100 / whiteKeys.length;
                  const active = activeNoteIds.includes(note.id);

                  return (
                    <button
                      key={note.id}
                      aria-label={`${note.sargam} ${note.western}`}
                      className={cn(
                        'absolute top-0 bottom-0 flex flex-col justify-end rounded-b-[0.8rem] border-r border-[#2a1f1a]/35 px-1.5 pb-3 text-center transition duration-75',
                        active
                          ? 'translate-y-1 bg-[#f0c28f]'
                          : 'bg-[linear-gradient(180deg,#fffef9_0%,#f3e7d8_100%)] hover:bg-[#fff7ed]'
                      )}
                      onPointerCancel={() => stopNote(note.id)}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
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
                      <span className="text-sm font-bold text-[#8b2e2e]">
                        {labelMode === 'sargam' ? note.sargam : note.western}
                      </span>
                      <span className="mt-0.5 text-[11px] text-[#7a6458]">
                        {labelMode === 'sargam' ? note.western : note.sargam}
                      </span>
                      <span className="mt-2 rounded-full bg-[#2a1f1a]/8 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#6d5549]">
                        {note.keycap}
                      </span>
                    </button>
                  );
                })}

                {blackKeys.map((note) => {
                  const width = 100 / whiteKeys.length;
                  const blackWidth = width * 0.62;
                  const left = (note.whiteIndex + 1) * width - blackWidth / 2;
                  const active = activeNoteIds.includes(note.id);

                  return (
                    <button
                      key={note.id}
                      aria-label={`${note.sargam} ${note.western}`}
                      className={cn(
                        'absolute top-0 z-10 flex h-[58%] flex-col justify-end rounded-b-[0.65rem] border border-white/10 px-1 pb-2.5 text-center transition duration-75',
                        active
                          ? 'translate-y-1 bg-[linear-gradient(180deg,#8b2e2e_0%,#2b1814_100%)]'
                          : 'bg-[linear-gradient(180deg,#302922_0%,#15120f_100%)]'
                      )}
                      onPointerCancel={() => stopNote(note.id)}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        void startNote(note);
                      }}
                      onPointerLeave={() => stopNote(note.id)}
                      onPointerUp={() => stopNote(note.id)}
                      style={{ left: `${left}%`, width: `${blackWidth}%` }}
                      type="button"
                    >
                      <span className="text-xs font-bold text-[#f9efe4]">
                        {labelMode === 'sargam' ? note.sargam : note.western}
                      </span>
                      <span className="mt-0.5 text-[10px] text-white/65">
                        {note.keycap}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {song.lines.map((line, lineIndex) => (
          <div
            key={line.label}
            className="rounded-2xl border border-[#2a1f1a]/10 bg-white/90 p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#8b2e2e] uppercase">
                  {line.label}
                </p>
                <p className="mt-1 text-base font-semibold text-[#2a1f1a]">
                  {line.lyricHint}
                </p>
              </div>
              <button
                className="inline-flex items-center gap-1.5 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-3.5 py-1.5 text-xs font-semibold text-[#8b2e2e] hover:bg-[#fff4e8]"
                onClick={() => handlePlayLine(lineIndex)}
                type="button"
              >
                <Play className="size-3.5" />
                Play Line
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {line.steps.map((step, stepIndex) => {
                const note = NOTE_BY_ID.get(step.noteId);
                if (!note) return null;
                const isCurrent =
                  playingLineIndex === lineIndex &&
                  playingStepIndex === stepIndex;

                return (
                  <button
                    key={`${line.label}-${stepIndex}-${step.noteId}`}
                    className={cn(
                      'flex min-w-[62px] flex-col items-center rounded-xl border px-3 py-2 text-center transition',
                      isCurrent
                        ? 'scale-105 border-[#8b2e2e] bg-[#8b2e2e] text-white shadow-sm'
                        : 'border-[#2a1f1a]/12 bg-[#faf7f2] text-[#2a1f1a] hover:border-[#c8633a]/50 hover:bg-[#fff4e8]'
                    )}
                    onClick={() => handleTapNote(note)}
                    type="button"
                  >
                    <span className="text-sm font-bold">
                      {labelMode === 'sargam' ? note.sargam : note.western}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 font-mono text-[11px]',
                        isCurrent ? 'text-white/85' : 'text-[#6d5549]'
                      )}
                    >
                      {labelMode === 'sargam' ? note.western : note.sargam} ·{' '}
                      {note.keycap}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
