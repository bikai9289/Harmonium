'use client';

import { KEYBOARD_HELP_GROUPS, NOTE_KEYS, NoteKey } from './constants';
import { cn } from '@/shared/lib/utils';

export function HarmoniumNoteGrid({
  activeNoteIds,
  highlightedNoteIds = [],
  labelMode,
  onNotePress,
}: {
  activeNoteIds: string[];
  highlightedNoteIds?: string[];
  labelMode: 'western' | 'sargam';
  onNotePress: (note: NoteKey) => void;
}) {
  return (
    <div className="space-y-4">
      {KEYBOARD_HELP_GROUPS.map((group) => (
        <section
          key={group.title}
          className="rounded-[1.5rem] border border-black/7 bg-white/80 p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {group.title}
              </p>
              <p className="mt-1 text-sm text-slate-600">{group.description}</p>
            </div>
            <span className="rounded-full bg-[#1f6b64]/10 px-3 py-1.5 text-xs font-medium text-[#1f6b64]">
              {group.notes.length} keys
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {group.notes.map((note) => {
              const isActive = activeNoteIds.includes(note.id);
              const isHighlighted = highlightedNoteIds.includes(note.id);

              return (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => onNotePress(note)}
                  className={cn(
                    'rounded-[1.2rem] border p-4 text-left transition',
                    note.kind === 'white'
                      ? 'bg-[#fcfaf6]'
                      : 'bg-[linear-gradient(180deg,#243141_0%,#121c28_100%)] text-white',
                    isActive
                      ? note.kind === 'white'
                        ? 'border-[#b77c4a]/50 bg-[#f6d2aa]'
                        : 'border-[#1f6b64] bg-[linear-gradient(180deg,#16655e_0%,#0e3f3b_100%)]'
                      : 'border-black/8',
                    isHighlighted ? 'ring-2 ring-[#1f6b64]/45' : ''
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        className={cn(
                          'text-lg font-semibold',
                          note.kind === 'white' ? 'text-slate-950' : 'text-white'
                        )}
                      >
                        {labelMode === 'sargam' ? note.sargam : note.western}
                      </p>
                      <p
                        className={cn(
                          'mt-1 text-sm',
                          note.kind === 'white'
                            ? 'text-slate-500'
                            : 'text-white/70'
                        )}
                      >
                        {labelMode === 'sargam' ? note.western : note.sargam}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-medium',
                        note.kind === 'white'
                          ? 'bg-slate-950/6 text-slate-600'
                          : 'bg-white/12 text-white/80'
                      )}
                    >
                      {note.keycap}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'mt-4 flex flex-wrap gap-2 text-xs',
                      note.kind === 'white'
                        ? 'text-slate-500'
                        : 'text-white/70'
                    )}
                  >
                    <span className="rounded-full bg-black/5 px-2.5 py-1">
                      MIDI {note.midi}
                    </span>
                    <span className="rounded-full bg-black/5 px-2.5 py-1">
                      {note.kind === 'white' ? 'White key' : 'Black key'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <section className="rounded-[1.5rem] border border-black/7 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Full note list</p>
            <p className="mt-1 text-sm text-slate-600">
              Every key in the current 23-note browser layout.
            </p>
          </div>
          <span className="rounded-full bg-[#b77c4a]/10 px-3 py-1.5 text-xs font-medium text-[#8f5f33]">
            {NOTE_KEYS.length} total notes
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr className="border-b border-black/7">
                <th className="px-3 py-2 font-medium">Key</th>
                <th className="px-3 py-2 font-medium">Western</th>
                <th className="px-3 py-2 font-medium">Sargam</th>
                <th className="px-3 py-2 font-medium">MIDI</th>
                <th className="px-3 py-2 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {NOTE_KEYS.map((note) => (
                <tr
                  key={note.id}
                  className={cn(
                    'border-b border-black/5',
                    highlightedNoteIds.includes(note.id) ? 'bg-[#1f6b64]/6' : ''
                  )}
                >
                  <td className="px-3 py-2 font-medium text-slate-900">
                    {note.keycap}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{note.western}</td>
                  <td className="px-3 py-2 text-slate-700">{note.sargam}</td>
                  <td className="px-3 py-2 text-slate-600">{note.midi}</td>
                  <td className="px-3 py-2 text-slate-600">
                    {note.kind === 'white' ? 'White' : 'Black'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
