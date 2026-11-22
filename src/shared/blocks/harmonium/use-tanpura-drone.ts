'use client';

import { useEffect, useRef } from 'react';

export type DroneMode = 'off' | 'sa-pa' | 'sa-ma' | 'sa-only';

type DroneNodes = {
  masterGain: GainNode;
  oscillators: OscillatorNode[];
  lfo: OscillatorNode;
  context: AudioContext;
};

function midiToFrequency(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function getDroneIntervals(mode: Exclude<DroneMode, 'off'>): number[] {
  if (mode === 'sa-pa') {
    return [-12, 0, 7, 12];
  }
  if (mode === 'sa-ma') {
    return [-12, 0, 5, 12];
  }
  return [-12, 0, 12];
}

export function useTanpuraDrone({
  mode,
  rootMidi,
  volume = 0.22,
}: {
  mode: DroneMode;
  rootMidi: number;
  volume?: number;
}) {
  const nodesRef = useRef<DroneNodes | null>(null);

  const stopDrone = () => {
    const nodes = nodesRef.current;
    if (!nodes) {
      return;
    }

    nodesRef.current = null;
    const now = nodes.context.currentTime;
    try {
      nodes.masterGain.gain.cancelScheduledValues(now);
      nodes.masterGain.gain.setValueAtTime(nodes.masterGain.gain.value, now);
      nodes.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    } catch {
      // Ignore audio teardown race conditions
    }

    window.setTimeout(() => {
      for (const osc of nodes.oscillators) {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore already stopped oscillators
        }
      }
      try {
        nodes.lfo.stop();
        nodes.lfo.disconnect();
        nodes.masterGain.disconnect();
        void nodes.context.close();
      } catch {
        // Ignore close errors
      }
    }, 220);
  };

  useEffect(() => {
    stopDrone();

    if (mode === 'off' || typeof window === 'undefined') {
      return;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtx) {
      return;
    }

    const context = new AudioCtx();
    const masterGain = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;
    filter.Q.value = 1.2;

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.22;
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    masterGain.gain.setValueAtTime(0.0001, context.currentTime);
    masterGain.gain.linearRampToValueAtTime(
      Math.max(0.02, Math.min(0.45, volume)),
      context.currentTime + 0.35
    );

    filter.connect(masterGain);
    masterGain.connect(context.destination);

    const intervals = getDroneIntervals(mode);
    const oscillators: OscillatorNode[] = [];

    intervals.forEach((interval, index) => {
      const baseFreq = midiToFrequency(rootMidi + interval);
      const voiceGain = context.createGain();
      voiceGain.gain.value = index === 0 ? 0.26 : index === 1 ? 0.34 : 0.2;
      voiceGain.connect(filter);

      const saw = context.createOscillator();
      saw.type = 'sawtooth';
      saw.frequency.value = baseFreq;
      saw.detune.value = index % 2 === 0 ? -3 : 3;
      saw.connect(voiceGain);
      saw.start();

      const tri = context.createOscillator();
      tri.type = 'triangle';
      tri.frequency.value = baseFreq;
      tri.connect(voiceGain);
      tri.start();

      oscillators.push(saw, tri);
    });

    if (context.state === 'suspended') {
      void context.resume();
    }

    nodesRef.current = {
      masterGain,
      oscillators,
      lfo,
      context,
    };

    return () => {
      stopDrone();
    };
  }, [mode, rootMidi]);

  useEffect(() => {
    const nodes = nodesRef.current;
    if (!nodes) {
      return;
    }

    const now = nodes.context.currentTime;
    nodes.masterGain.gain.setTargetAtTime(
      Math.max(0.02, Math.min(0.45, volume)),
      now,
      0.08
    );
  }, [volume]);
}
