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
      <div className="min-w-[920px] rounded-[1.8rem] border border-[#c8925a]/35 bg-[linear-gradient(180deg,#5b2d1b_0%,#3a1b0f_100%)] p-3 shadow-[0_20px_60px_rgba(42,20,10,0.22)]">
        <div className="relative h-[18.5rem] overflow-hidden rounded-[1.2rem] border border-black/40 bg-[#14100d] p-3">
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
                    'absolute top-0 bottom-0 flex flex-col items-center justify-end rounded-b-[0.9rem] border-r border-[#2a1f1a]/30 px-1.5 pb-3 text-center transition',
                    isActive
                      ? 'translate-y-0.5 bg-[linear-gradient(180deg,#f5d09b_0%,#e5a95c_100%)]'
                      : 'bg-[linear-gradient(180deg,#fffef9_0%,#f3e7d8_100%)] hover:bg-[#fff7ed]',
                    isHighlighted ? 'ring-3 ring-[#c8633a] ring-inset' : ''
                  )}
                  style={{
                    left: `${note.whiteIndex * width}%`,
                    width: `${width}%`,
                  }}
                >
                  <span className="text-base font-bold text-[#8b2e2e]">
                    {labelMode === 'sargam' ? note.sargam : note.western}
                  </span>
                  <span className="mt-0.5 text-[11px] font-medium text-[#7a6458]">
                    {labelMode === 'sargam' ? note.western : note.sargam}
                  </span>
                  <span className="mt-2 rounded-full bg-[#2a1f1a]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#5d4a40]">
                    {note.keycap}
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
                    'absolute top-0 z-10 flex h-[56%] flex-col items-center justify-end rounded-b-[0.75rem] border border-white/10 px-1 pb-2.5 text-center transition',
                    isActive
                      ? 'translate-y-0.5 bg-[linear-gradient(180deg,#8b2e2e_0%,#2b1814_100%)]'
                      : 'bg-[linear-gradient(180deg,#302922_0%,#15120f_100%)]',
                    isHighlighted ? 'ring-2 ring-[#f3cfa0]' : ''
                  )}
                  style={{
                    left: `${left}%`,
                    width: `${blackWidth}%`,
                  }}
                >
                  <span className="text-xs font-bold text-[#f9efe4]">
                    {labelMode === 'sargam' ? note.sargam : note.western}
                  </span>
                  <span className="mt-0.5 text-[10px] text-white/70">
                    {note.keycap}
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
