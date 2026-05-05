'use client';

import { cn } from '@/shared/lib/utils';

import { NOTE_KEYS, NoteKey } from './constants';

export function TutorialKeyboard({
  activeNoteIds,
  highlightedNoteIds,
  labelMode,
  onNotePress,
  onNoteRelease,
}: {
  activeNoteIds: string[];
  highlightedNoteIds: string[];
  labelMode: 'western' | 'sargam';
  onNotePress: (note: NoteKey) => void;
  onNoteRelease: (noteId: string) => void;
}) {
  const whiteKeys = NOTE_KEYS.filter((note) => note.kind === 'white');
  const blackKeys = NOTE_KEYS.filter((note) => note.kind === 'black');

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1100px] rounded-[2rem] border border-black/8 bg-[#08101d] p-4 shadow-[0_20px_60px_rgba(12,18,28,0.24)]">
        <div className="relative h-[20rem] overflow-hidden rounded-[1.6rem] border border-white/6 bg-[linear-gradient(180deg,#101b2d_0%,#060b14_100%)] p-4">
          <div className="absolute inset-x-6 top-1/2 h-px bg-white/10" />

          <div className="relative h-full">
            {whiteKeys.map((note) => {
              const width = 100 / whiteKeys.length;
              const isActive = activeNoteIds.includes(note.id);
              const isHighlighted = highlightedNoteIds.includes(note.id);

              return (
                <button
                  key={note.id}
                  type="button"
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    onNotePress(note);
                  }}
                  onPointerUp={() => onNoteRelease(note.id)}
                  onPointerLeave={() => onNoteRelease(note.id)}
                  onPointerCancel={() => onNoteRelease(note.id)}
                  className={cn(
                    'absolute top-0 bottom-0 flex flex-col justify-between rounded-b-[1.3rem] border px-2 pt-4 pb-3 text-left transition',
                    isActive
                      ? 'border-[#c8633a] bg-[linear-gradient(180deg,#fff0e5_0%,#efc09a_100%)]'
                      : 'border-white/15 bg-[linear-gradient(180deg,#ffffff_0%,#eef2f8_100%)]',
                    isHighlighted ? 'ring-4 ring-[#c8633a]/35' : ''
                  )}
                  style={{
                    left: `${note.whiteIndex * width}%`,
                    width: `${width}%`,
                  }}
                >
                  <div>
                    <span className="rounded-full bg-slate-950 px-2 py-1 text-xs font-semibold text-white">
                      {note.keycap}
                    </span>
                    <p className="mt-4 text-2xl font-semibold text-[#2759d8]">
                      {labelMode === 'sargam' ? note.sargam : note.western}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {labelMode === 'sargam' ? note.western : note.sargam}
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-md bg-[#d4f4db] px-3 py-1 text-xs font-medium text-[#1e9142]">
                    {note.western}
                  </span>
                </button>
              );
            })}

            {blackKeys.map((note) => {
              const width = 100 / whiteKeys.length;
              const blackWidth = width * 0.62;
              const left = (note.whiteIndex + 1) * width - blackWidth / 2;
              const isActive = activeNoteIds.includes(note.id);
              const isHighlighted = highlightedNoteIds.includes(note.id);

              return (
                <button
                  key={note.id}
                  type="button"
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    onNotePress(note);
                  }}
                  onPointerUp={() => onNoteRelease(note.id)}
                  onPointerLeave={() => onNoteRelease(note.id)}
                  onPointerCancel={() => onNoteRelease(note.id)}
                  className={cn(
                    'absolute top-0 z-10 flex h-[60%] flex-col justify-between rounded-b-[1.1rem] border px-2 pt-3 pb-2 text-left transition',
                    isActive
                      ? 'border-[#c8633a]/60 bg-[linear-gradient(180deg,#c8633a_0%,#7d3320_100%)]'
                      : 'border-white/10 bg-[linear-gradient(180deg,#25354a_0%,#0a111d_100%)]',
                    isHighlighted ? 'ring-4 ring-[#c8633a]/35' : ''
                  )}
                  style={{
                    left: `${left}%`,
                    width: `${blackWidth}%`,
                  }}
                >
                  <div>
                    <span className="rounded-full bg-white/14 px-2 py-1 text-xs font-semibold text-white">
                      {note.keycap}
                    </span>
                    <p className="mt-4 text-xl font-semibold text-white">
                      {labelMode === 'sargam' ? note.sargam : note.western}
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      {labelMode === 'sargam' ? note.western : note.sargam}
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-md bg-white/8 px-3 py-1 text-xs font-medium text-white/80">
                    {note.western}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
