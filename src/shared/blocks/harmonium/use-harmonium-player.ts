'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { NoteKey } from './constants';

type Voice = {
  sources: AudioScheduledSourceNode[];
  gain: GainNode;
};

type PlaybackMode = 'samples' | 'oscillator';

const SAMPLE_EXTENSIONS = ['mp3', 'wav', 'ogg'];
const SAMPLE_BASE_PATH = '/audio/harmonium';

function getPitchRatio(semitones: number) {
  return 2 ** (semitones / 12);
}

export function useHarmoniumPlayer({
  octave,
  transpose,
  volume,
}: {
  octave: number;
  transpose: number;
  volume: number;
}) {
  const [activeNoteIds, setActiveNoteIds] = useState<string[]>([]);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('oscillator');

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const voicesRef = useRef<Map<string, Voice>>(new Map());
  const sampleCacheRef = useRef<Map<string, Promise<AudioBuffer | null>>>(
    new Map()
  );
  const settingsRef = useRef({ octave, transpose, volume });

  useEffect(() => {
    settingsRef.current = { octave, transpose, volume };

    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!context || !masterGain) {
      return;
    }

    masterGain.gain.setTargetAtTime(volume, context.currentTime, 0.03);
  }, [octave, transpose, volume]);

  const ensureAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      const context = new AudioContextClass();
      const masterGain = context.createGain();
      masterGain.gain.value = settingsRef.current.volume;
      masterGain.connect(context.destination);

      audioContextRef.current = context;
      masterGainRef.current = masterGain;
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const loadSampleBuffer = useCallback(
    async (context: AudioContext, noteId: string) => {
      const cached = sampleCacheRef.current.get(noteId);
      if (cached) {
        return cached;
      }

      const loader = (async () => {
        for (const extension of SAMPLE_EXTENSIONS) {
          const response = await fetch(
            `${SAMPLE_BASE_PATH}/${noteId}.${extension}`,
            {
              cache: 'force-cache',
            }
          ).catch(() => null);

          if (!response?.ok) {
            continue;
          }

          const buffer = await response.arrayBuffer();
          return context.decodeAudioData(buffer.slice(0));
        }

        return null;
      })();

      sampleCacheRef.current.set(noteId, loader);
      return loader;
    },
    []
  );

  const stopNote = useCallback((noteId: string) => {
    const context = audioContextRef.current;
    const voice = voicesRef.current.get(noteId);
    if (!context || !voice) {
      return;
    }

    voice.gain.gain.cancelScheduledValues(context.currentTime);
    voice.gain.gain.setValueAtTime(
      Math.max(voice.gain.gain.value, 0.0001),
      context.currentTime
    );
    voice.gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + 0.14
    );

    for (const source of voice.sources) {
      source.stop(context.currentTime + 0.16);
    }

    voicesRef.current.delete(noteId);
    setActiveNoteIds((current) => current.filter((id) => id !== noteId));
  }, []);

  const stopAllNotes = useCallback(() => {
    for (const noteId of [...voicesRef.current.keys()]) {
      stopNote(noteId);
    }
  }, [stopNote]);

  const startNote = useCallback(
    async (note: NoteKey) => {
      if (voicesRef.current.has(note.id)) {
        return;
      }

      const context = await ensureAudio();
      const masterGain = masterGainRef.current;
      if (!context || !masterGain) {
        return;
      }

      const semitoneShift =
        (settingsRef.current.octave - 4) * 12 + settingsRef.current.transpose;
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1900;
      filter.Q.value = 0.8;

      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.13, context.currentTime + 0.12);
      filter.connect(gain);
      gain.connect(masterGain);

      const sampleBuffer = await loadSampleBuffer(context, note.id);
      if (sampleBuffer) {
        const source = context.createBufferSource();
        source.buffer = sampleBuffer;
        source.playbackRate.value = getPitchRatio(semitoneShift);
        source.connect(filter);
        source.start();

        voicesRef.current.set(note.id, {
          sources: [source],
          gain,
        });
        setPlaybackMode('samples');
      } else {
        const midi = 60 + note.offset + semitoneShift;
        const frequency = 440 * 2 ** ((midi - 69) / 12);

        const primary = context.createOscillator();
        primary.type = 'sawtooth';
        primary.frequency.value = frequency;

        const body = context.createOscillator();
        body.type = 'triangle';
        body.frequency.value = frequency * 0.5;
        body.detune.value = 3;

        primary.connect(filter);
        body.connect(filter);
        primary.start();
        body.start();

        voicesRef.current.set(note.id, {
          sources: [primary, body],
          gain,
        });
        setPlaybackMode((current) =>
          current === 'samples' ? current : 'oscillator'
        );
      }

      setActiveNoteIds((current) =>
        current.includes(note.id) ? current : [...current, note.id]
      );
    },
    [ensureAudio, loadSampleBuffer]
  );

  useEffect(() => {
    return () => {
      stopAllNotes();
      void audioContextRef.current?.close();
    };
  }, [stopAllNotes]);

  return {
    activeNoteIds,
    playbackMode,
    startNote,
    stopNote,
    stopAllNotes,
  };
}
