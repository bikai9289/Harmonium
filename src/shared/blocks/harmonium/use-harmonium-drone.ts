'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type DroneStatus = 'idle' | 'active' | 'error';
export type DroneErrorCode = '' | 'audio-blocked';

type DroneVoice = {
  context: AudioContext;
  gain: GainNode;
  oscillators: OscillatorNode[];
};

function midiToFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function useHarmoniumDrone() {
  const [status, setStatus] = useState<DroneStatus>('idle');
  const [errorCode, setErrorCode] = useState<DroneErrorCode>('');
  const [activeMidi, setActiveMidi] = useState<number | null>(null);
  const voiceRef = useRef<DroneVoice | null>(null);

  const stopDrone = useCallback(() => {
    const voice = voiceRef.current;
    if (!voice) {
      setStatus('idle');
      setActiveMidi(null);
      return;
    }

    for (const oscillator of voice.oscillators) {
      try {
        oscillator.stop();
      } catch {
        // The browser can throw if an oscillator was already stopped.
      }
      oscillator.disconnect();
    }

    voice.gain.disconnect();
    void voice.context.close();
    voiceRef.current = null;
    setStatus('idle');
    setActiveMidi(null);
  }, []);

  const startDrone = useCallback(
    async ({ midi, volume = 0.08 }: { midi: number; volume?: number }) => {
      if (!Number.isFinite(midi)) {
        setStatus('error');
        setErrorCode('audio-blocked');
        return false;
      }

      stopDrone();

      try {
        const AudioContextCtor =
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;

        if (!AudioContextCtor) {
          throw new Error('AudioContext unavailable');
        }

        const context = new AudioContextCtor();
        if (context.state === 'suspended') {
          await context.resume();
        }

        const gain = context.createGain();
        gain.gain.value = Math.max(0.02, Math.min(0.16, volume));
        gain.connect(context.destination);

        const rootFrequency = midiToFrequency(midi);
        const fifthFrequency = midiToFrequency(midi + 7);
        const oscillators = [rootFrequency, fifthFrequency].map(
          (frequency, index) => {
            const oscillator = context.createOscillator();
            oscillator.type = index === 0 ? 'sine' : 'triangle';
            oscillator.frequency.value = frequency;
            oscillator.connect(gain);
            oscillator.start();
            return oscillator;
          }
        );

        voiceRef.current = {
          context,
          gain,
          oscillators,
        };
        setErrorCode('');
        setStatus('active');
        setActiveMidi(midi);
        return true;
      } catch (error) {
        console.error('Failed to start harmonium shruti drone', error);
        setStatus('error');
        setErrorCode('audio-blocked');
        setActiveMidi(null);
        return false;
      }
    },
    [stopDrone]
  );

  useEffect(() => stopDrone, [stopDrone]);

  return {
    activeMidi,
    errorCode,
    isDroneActive: status === 'active',
    startDrone,
    status,
    stopDrone,
  };
}
