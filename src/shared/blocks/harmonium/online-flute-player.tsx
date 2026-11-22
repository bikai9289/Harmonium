'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Radio, Volume2 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { DroneMode, useTanpuraDrone } from './use-tanpura-drone';

type FluteNote = {
  id: string;
  sargam: string;
  western: string;
  keycap: string;
  midiOffset: number;
  holes: [boolean, boolean, boolean, boolean, boolean, boolean]; // true = closed
};

const FLUTE_NOTES: FluteNote[] = [
  { id: 'pa_low', sargam: 'Pa.', western: 'G3', keycap: 'A', midiOffset: -5, holes: [true, true, true, true, true, true] },
  { id: 'dha_low', sargam: 'Dha.', western: 'A3', keycap: 'S', midiOffset: -3, holes: [true, true, true, true, true, false] },
  { id: 'ni_low', sargam: 'Ni.', western: 'B3', keycap: 'D', midiOffset: -1, holes: [true, true, true, true, false, false] },
  { id: 'sa', sargam: 'Sa', western: 'C4', keycap: 'F', midiOffset: 0, holes: [true, true, true, false, false, false] },
  { id: 're', sargam: 'Re', western: 'D4', keycap: 'G', midiOffset: 2, holes: [true, true, false, false, false, false] },
  { id: 'ga', sargam: 'Ga', western: 'E4', keycap: 'H', midiOffset: 4, holes: [true, false, false, false, false, false] },
  { id: 'ma', sargam: 'Ma', western: 'F4', keycap: 'J', midiOffset: 5, holes: [false, false, false, false, false, false] },
  { id: 'ma_sharp', sargam: 'Ma♯', western: 'F#4', keycap: 'U', midiOffset: 6, holes: [false, false, false, false, false, false] },
  { id: 'pa', sargam: 'Pa', western: 'G4', keycap: 'K', midiOffset: 7, holes: [true, true, true, true, true, true] },
  { id: 'dha', sargam: 'Dha', western: 'A4', keycap: 'L', midiOffset: 9, holes: [true, true, true, true, true, false] },
  { id: 'ni', sargam: 'Ni', western: 'B4', keycap: ';', midiOffset: 11, holes: [true, true, true, true, false, false] },
  { id: 'sa_high', sargam: 'Sa′', western: 'C5', keycap: "'", midiOffset: 12, holes: [true, true, true, false, false, false] },
];

const FLUTE_SCALES = [
  { label: 'C Middle', rootMidi: 60 },
  { label: 'D Bansuri', rootMidi: 62 },
  { label: 'E Bass', rootMidi: 64 },
  { label: 'F Middle', rootMidi: 65 },
  { label: 'G Bass', rootMidi: 67 },
  { label: 'A Middle', rootMidi: 69 },
];

type ActiveVoice = {
  osc: OscillatorNode;
  overtone: OscillatorNode;
  vibrato: OscillatorNode;
  gain: GainNode;
};

function midiToFreq(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function OnlineFlutePlayer() {
  const [scaleMidi, setScaleMidi] = useState(60);
  const [labelMode, setLabelMode] = useState<'sargam' | 'western'>('sargam');
  const [droneMode, setDroneMode] = useState<DroneMode>('off');
  const [volume, setVolume] = useState(0.32);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const voicesRef = useRef<Map<string, ActiveVoice>>(new Map());

  useTanpuraDrone({
    mode: droneMode,
    rootMidi: scaleMidi,
    volume: Math.min(0.22, volume * 0.55),
  });

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stopNote = useCallback((noteId: string) => {
    const voice = voicesRef.current.get(noteId);
    const ctx = audioCtxRef.current;
    if (!voice || !ctx) return;
    voicesRef.current.delete(noteId);
    const now = ctx.currentTime;
    try {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
      voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      voice.osc.stop(now + 0.16);
      voice.overtone.stop(now + 0.16);
      voice.vibrato.stop(now + 0.16);
    } catch {
      // ignore stop race
    }
    setActiveNoteId((cur) => (cur === noteId ? null : cur));
  }, []);

  const startNote = useCallback(
    (note: FluteNote) => {
      if (voicesRef.current.has(note.id)) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const freq = midiToFreq(scaleMidi + note.midiOffset);
      const now = ctx.currentTime;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.08);
      gain.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = Math.min(3400, freq * 3.8);
      filter.connect(gain);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(filter);

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.value = 0.18;
      const overtone = ctx.createOscillator();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now);
      overtone.connect(overtoneGain);
      overtoneGain.connect(filter);

      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 5.2;
      vibratoGain.gain.value = freq * 0.008;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      osc.start(now);
      overtone.start(now);
      vibrato.start(now);

      voicesRef.current.set(note.id, { osc, overtone, vibrato, gain });
      setActiveNoteId(note.id);
    },
    [getAudioContext, scaleMidi, volume]
  );

  useEffect(() => {
    const byKey = new Map(
      FLUTE_NOTES.map((n) => [n.keycap.toLowerCase(), n])
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const note = byKey.get(event.key.toLowerCase());
      if (!note) return;
      event.preventDefault();
      startNote(note);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const note = byKey.get(event.key.toLowerCase());
      if (!note) return;
      stopNote(note.id);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      for (const id of Array.from(voicesRef.current.keys())) {
        stopNote(id);
      }
    };
  }, [startNote, stopNote]);

  const activeNote =
    FLUTE_NOTES.find((n) => n.id === activeNoteId) ?? FLUTE_NOTES[3];

  return (
    <div className="rounded-[1.8rem] border border-[#c8925a]/35 bg-[linear-gradient(180deg,#5b2d1b_0%,#3a1b0f_100%)] p-4 text-[#f9efe4] shadow-[0_24px_70px_rgba(42,20,10,0.24)] sm:p-6">
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-[#e3b57d]/20 bg-[#26120b]/85 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {FLUTE_SCALES.map((scale) => (
            <button
              key={scale.label}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold transition',
                scaleMidi === scale.rootMidi
                  ? 'bg-[#c8633a] text-white'
                  : 'border border-[#e3b57d]/20 bg-[#3a1c11] text-[#e8d5c4] hover:bg-white/10'
              )}
              onClick={() => setScaleMidi(scale.rootMidi)}
              type="button"
            >
              {scale.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
              droneMode !== 'off'
                ? 'border-[#e3b57d] bg-[#c8633a] text-white'
                : 'border-[#e3b57d]/20 bg-[#3a1c11] text-[#f9efe4]'
            )}
            onClick={() =>
              setDroneMode((cur) =>
                cur === 'off' ? 'sa-pa' : cur === 'sa-pa' ? 'sa-ma' : 'off'
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
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e3b57d]/25 bg-[#3a1c11] px-3 py-1.5 text-xs font-semibold text-[#f9efe4]"
            onClick={() =>
              setLabelMode((cur) => (cur === 'sargam' ? 'western' : 'sargam'))
            }
            type="button"
          >
            <Keyboard className="size-3.5 text-[#f3cfa0]" />
            {labelMode === 'sargam' ? 'Sargam' : 'Western'}
          </button>

          <div className="flex items-center gap-2 rounded-full border border-[#e3b57d]/20 bg-[#3a1c11] px-3 py-1.5">
            <Volume2 className="size-3.5 text-[#e3b57d]" />
            <input
              aria-label="Flute volume"
              className="w-20 accent-[#e3b57d]"
              max="0.6"
              min="0.05"
              onChange={(event) => setVolume(Number(event.target.value))}
              step="0.01"
              type="range"
              value={volume}
            />
          </div>
        </div>
      </div>

      {/* Visual Bamboo Bansuri Finger-Hole Indicator */}
      <div className="mt-5 rounded-2xl border border-[#e3b57d]/25 bg-[#201009] px-5 py-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#e8d5c4]">
          <span>
            Active Note:{' '}
            <strong className="text-base text-[#f3cfa0]">
              {activeNote.sargam} ({activeNote.western})
            </strong>
          </span>
          <span className="text-[#e8d5c4]/75">
            Filled circles = closed finger holes · Hollow = open
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-full border border-[#d6a366]/50 bg-[linear-gradient(180deg,#dfb16d_0%,#b97f3c_55%,#8f5a22_100%)] px-6 py-4 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#8b2e2e]" />
            <span
              className="size-5 rounded-full border-2 border-[#3a1b0f] bg-[#1b0e08]"
              title="Blowing hole"
            />
            <span className="h-5 w-1.5 rounded-full bg-[#8b2e2e]" />
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {activeNote.holes.map((closed, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    'size-5 rounded-full border-2 border-[#3a1b0f] transition sm:size-6',
                    closed ? 'bg-[#2a120a]' : 'bg-[#f6dec0]'
                  )}
                />
              </div>
            ))}
          </div>

          <span className="h-5 w-2 rounded-full bg-[#8b2e2e]" />
        </div>
      </div>

      {/* Playable Note Pads */}
      <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-6 lg:grid-cols-12">
        {FLUTE_NOTES.map((note) => {
          const active = activeNoteId === note.id;
          return (
            <button
              key={note.id}
              className={cn(
                'flex flex-col items-center justify-center rounded-2xl border px-2 py-4 text-center transition select-none',
                active
                  ? 'translate-y-0.5 border-[#f3cfa0] bg-[#c8633a] text-white shadow-inner'
                  : 'border-[#e3b57d]/25 bg-[#fffdf8] text-[#2a1f1a] hover:bg-[#fff4e8]'
              )}
              onPointerCancel={() => stopNote(note.id)}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                startNote(note);
              }}
              onPointerLeave={() => stopNote(note.id)}
              onPointerUp={() => stopNote(note.id)}
              type="button"
            >
              <span
                className={cn(
                  'text-base font-bold',
                  active ? 'text-white' : 'text-[#8b2e2e]'
                )}
              >
                {labelMode === 'sargam' ? note.sargam : note.western}
              </span>
              <span
                className={cn(
                  'mt-0.5 text-xs',
                  active ? 'text-white/85' : 'text-[#6d5549]'
                )}
              >
                {labelMode === 'sargam' ? note.western : note.sargam}
              </span>
              <span
                className={cn(
                  'mt-2 rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold',
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-[#2a1f1a]/10 text-[#5d4a40]'
                )}
              >
                {note.keycap}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-[#e8d5c4]/85">
        Tip: use laptop keys{' '}
        <span className="font-mono font-semibold text-[#f3cfa0]">
          A S D F G H J K L ; &apos;
        </span>{' '}
        (plus <span className="font-mono font-semibold text-[#f3cfa0]">U</span>{' '}
        for Tivra Ma♯) or tap any note pad on mobile.
      </p>
    </div>
  );
}
