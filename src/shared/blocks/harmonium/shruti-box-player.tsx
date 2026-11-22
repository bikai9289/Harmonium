'use client';

import { useState } from 'react';
import { Play, Radio, Square, Volume2 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { DroneMode, useTanpuraDrone } from './use-tanpura-drone';

const SCALES = [
  { label: 'C', indian: 'Safed 1', midi: 60 },
  { label: 'C#', indian: 'Kali 1', midi: 61 },
  { label: 'D', indian: 'Safed 2', midi: 62 },
  { label: 'D#', indian: 'Kali 2', midi: 63 },
  { label: 'E', indian: 'Safed 3', midi: 64 },
  { label: 'F', indian: 'Safed 4', midi: 65 },
  { label: 'F#', indian: 'Kali 3', midi: 66 },
  { label: 'G', indian: 'Safed 5', midi: 67 },
  { label: 'G#', indian: 'Kali 4', midi: 68 },
  { label: 'A', indian: 'Safed 6', midi: 69 },
  { label: 'A#', indian: 'Kali 5', midi: 70 },
  { label: 'B', indian: 'Safed 7', midi: 71 },
];

export function ShrutiBoxPlayer() {
  const [selectedMidi, setSelectedMidi] = useState(60);
  const [octaveShift, setOctaveShift] = useState<-12 | 0>(0);
  const [tuning, setTuning] = useState<Exclude<DroneMode, 'off'>>('sa-pa');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.24);

  useTanpuraDrone({
    mode: isPlaying ? tuning : 'off',
    rootMidi: selectedMidi + octaveShift,
    volume,
  });

  const activeScale =
    SCALES.find((scale) => scale.midi === selectedMidi) ?? SCALES[0];

  return (
    <div className="rounded-3xl border border-[#8b2e2e]/18 bg-[#fffdf8] p-6 shadow-[0_18px_60px_rgba(83,45,24,0.1)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2a1f1a]/10 pb-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#8b2e2e] uppercase">
            Online Shruti Box &amp; Tanpura Drone
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-[#2a1f1a]">
            Sa = {activeScale.label}{' '}
            <span className="text-lg font-normal text-[#6d5549]">
              ({activeScale.indian})
            </span>
          </p>
        </div>

        <button
          className={cn(
            'inline-flex min-h-12 items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-sm transition',
            isPlaying
              ? 'bg-[#c8633a] hover:bg-[#a9502d]'
              : 'bg-[#8b2e2e] hover:bg-[#6f2424]'
          )}
          onClick={() => setIsPlaying((current) => !current)}
          type="button"
        >
          {isPlaying ? (
            <>
              <Square className="size-4" />
              Stop Drone
            </>
          ) : (
            <>
              <Play className="size-4" />
              Start Drone
            </>
          )}
        </button>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold tracking-wider text-[#6d5549] uppercase">
          1. Choose Your Sa (Tonic Scale)
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {SCALES.map((scale) => {
            const active = scale.midi === selectedMidi;
            return (
              <button
                key={scale.label}
                className={cn(
                  'rounded-xl border px-3 py-3 text-center transition',
                  active
                    ? 'border-[#8b2e2e] bg-[#8b2e2e] text-white shadow-sm'
                    : 'border-[#2a1f1a]/12 bg-white text-[#2a1f1a] hover:border-[#c8633a]/45 hover:bg-[#fff4e8]'
                )}
                onClick={() => setSelectedMidi(scale.midi)}
                type="button"
              >
                <div className="text-base font-bold">{scale.label}</div>
                <div
                  className={cn(
                    'mt-0.5 text-[11px]',
                    active ? 'text-white/80' : 'text-[#6d5549]'
                  )}
                >
                  {scale.indian}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#2a1f1a]/10 bg-[#f8f2ea] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8b2e2e] uppercase">
            <Radio className="size-4" />
            Drone Tuning
          </div>
          <div className="mt-3 flex gap-1.5">
            {(
              [
                { id: 'sa-pa', label: 'Sa – Pa' },
                { id: 'sa-ma', label: 'Sa – Ma' },
                { id: 'sa-only', label: 'Sa Only' },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                className={cn(
                  'flex-1 rounded-full py-2 text-xs font-semibold transition',
                  tuning === option.id
                    ? 'bg-[#8b2e2e] text-white'
                    : 'bg-white text-[#5d4a40] hover:bg-[#fff4e8]'
                )}
                onClick={() => setTuning(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#2a1f1a]/10 bg-[#f8f2ea] p-4">
          <div className="text-xs font-semibold text-[#8b2e2e] uppercase">
            Vocal Register
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className={cn(
                'flex-1 rounded-full py-2 text-xs font-semibold transition',
                octaveShift === -12
                  ? 'bg-[#8b2e2e] text-white'
                  : 'bg-white text-[#5d4a40] hover:bg-[#fff4e8]'
              )}
              onClick={() => setOctaveShift(-12)}
              type="button"
            >
              Male / Low
            </button>
            <button
              className={cn(
                'flex-1 rounded-full py-2 text-xs font-semibold transition',
                octaveShift === 0
                  ? 'bg-[#8b2e2e] text-white'
                  : 'bg-white text-[#5d4a40] hover:bg-[#fff4e8]'
              )}
              onClick={() => setOctaveShift(0)}
              type="button"
            >
              Female / Mid
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#2a1f1a]/10 bg-[#f8f2ea] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8b2e2e] uppercase">
            <Volume2 className="size-4" />
            Drone Volume
          </div>
          <input
            aria-label="Drone Volume"
            className="mt-4 w-full accent-[#8b2e2e]"
            max="0.45"
            min="0.04"
            onChange={(event) => setVolume(Number(event.target.value))}
            step="0.01"
            type="range"
            value={volume}
          />
        </div>
      </div>
    </div>
  );
}
