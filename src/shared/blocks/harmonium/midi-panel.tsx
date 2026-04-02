'use client';

import { Cable, RefreshCw } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

type MidiSupportState = 'checking' | 'supported' | 'unsupported' | 'error';

type MidiInputSummary = {
  id: string;
  name: string;
  manufacturer: string;
};

function getStatusLabel(state: MidiSupportState, count: number) {
  if (state === 'checking') return 'Checking';
  if (state === 'unsupported') return 'Unavailable';
  if (state === 'error') return 'Retry needed';
  if (!count) return 'No devices';
  return 'Ready';
}

function getDescription(state: MidiSupportState, count: number) {
  if (state === 'checking') {
    return 'Looking for browser MIDI support and connected devices.';
  }

  if (state === 'unsupported') {
    return 'This browser does not expose Web MIDI, so only touch and QWERTY input are available.';
  }

  if (state === 'error') {
    return 'Browser MIDI is present, but device access failed. Try refreshing after reconnecting your controller.';
  }

  if (!count) {
    return 'Web MIDI is available. Connect a keyboard and press refresh if it does not appear yet.';
  }

  return 'Select a MIDI controller to play live notes, sustain-pedal phrases, and CC7 volume control through the harmonium engine.';
}

export function MidiPanel({
  compact = false,
  midiInputs,
  onRefresh,
  onSelectedInputIdChange,
  selectedInputId,
  supportState,
}: {
  compact?: boolean;
  midiInputs: MidiInputSummary[];
  onRefresh: () => void;
  onSelectedInputIdChange: (value: string) => void;
  selectedInputId: string;
  supportState: MidiSupportState;
}) {
  return (
    <div
      className={cn(
        'rounded-[1.6rem] border border-black/7 bg-white/85 p-5 shadow-sm',
        compact ? 'mt-4' : ''
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
            MIDI input
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">
            Browser keyboard support
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {getDescription(supportState, midiInputs.length)}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[#1f6b64]/10 px-3 py-2 text-sm font-medium text-[#1f6b64]">
          <Cable className="size-4" />
          {getStatusLabel(supportState, midiInputs.length)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="border-[#b77c4a]/30 bg-white text-[#7f4e2a]"
        >
          <RefreshCw className="size-4" />
          Refresh MIDI
        </Button>

        {supportState === 'supported' ? (
          <label className="min-w-[220px] flex-1">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Active device
            </span>
            <select
              value={selectedInputId}
              onChange={(event) => onSelectedInputIdChange(event.target.value)}
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#1f6b64]/40"
            >
              {midiInputs.length ? null : (
                <option value="">No MIDI devices detected</option>
              )}
              {midiInputs.map((input) => (
                <option key={input.id} value={input.id}>
                  {input.name}
                  {input.manufacturer ? ` - ${input.manufacturer}` : ''}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </div>
  );
}
