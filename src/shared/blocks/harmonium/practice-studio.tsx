'use client';

import { useState } from 'react';
import {
  Cloud,
  ListMusic,
  NotebookPen,
  Radio,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';

import { PracticePreset, PracticeSession } from './practice-workspace';

function formatDuration(durationMs: number) {
  const seconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatSyncStatus({
  isAuthenticated,
  syncStatus,
}: {
  isAuthenticated: boolean;
  syncStatus: 'loading' | 'local' | 'syncing' | 'synced' | 'error';
}) {
  if (!isAuthenticated) {
    return 'Saved locally';
  }

  if (syncStatus === 'syncing') {
    return 'Syncing';
  }

  if (syncStatus === 'error') {
    return 'Sync issue';
  }

  if (syncStatus === 'loading') {
    return 'Loading';
  }

  return 'Synced';
}

export function PracticeStudio({
  isAuthenticated,
  isRecording,
  presets,
  savedSessions,
  selectedSession,
  syncStatus,
  onApplyPreset,
  onDeletePreset,
  onDeleteSession,
  onRenamePreset,
  onRenameSession,
  onResetCurrentTake,
  onSavePreset,
  onSaveSession,
  onSelectSession,
  onStartRecording,
  onStopRecording,
  onUpdateNotation,
}: {
  isAuthenticated: boolean;
  isRecording: boolean;
  presets: PracticePreset[];
  savedSessions: PracticeSession[];
  selectedSession: PracticeSession | null;
  syncStatus: 'loading' | 'local' | 'syncing' | 'synced' | 'error';
  onApplyPreset: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenamePreset: (presetId: string, name: string) => void;
  onRenameSession: (title: string) => void;
  onResetCurrentTake: () => void;
  onSavePreset: (name: string, presetId?: string) => void;
  onSaveSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onUpdateNotation: (value: string) => void;
}) {
  const [presetName, setPresetName] = useState('');

  const canSaveSession =
    !!selectedSession &&
    selectedSession.status !== 'saved' &&
    (selectedSession.noteEvents.length > 0 ||
      selectedSession.notationText.trim().length > 0);

  const canResetTake = !!selectedSession && selectedSession.status !== 'saved';

  return (
    <div className="mt-6 rounded-[1.75rem] border border-black/8 bg-white/82 p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
            Practice studio
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">
            Record takes, keep notation, and reuse presets
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Recording only starts when you choose it, so casual playing stays
            separate from practice notes. Pointer, desktop keys, and MIDI input
            all feed the same note capture timeline.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[#1f6b64]/10 px-3 py-2 text-sm font-medium text-[#1f6b64]">
          <Cloud className="size-4" />
          {formatSyncStatus({ isAuthenticated, syncStatus })}
        </span>
      </div>

      <Tabs defaultValue="recorder" className="mt-5">
        <TabsList className="h-auto flex-wrap rounded-2xl border border-black/8 bg-[#fcfaf6] p-1">
          <TabsTrigger value="recorder" className="rounded-xl">
            Recorder
          </TabsTrigger>
          <TabsTrigger value="notes" className="rounded-xl">
            Notes
          </TabsTrigger>
          <TabsTrigger value="presets" className="rounded-xl">
            Presets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recorder" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.4rem] border border-black/7 bg-[#fcfaf6] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 text-[#8f5f33]">
                    <Radio className="size-4" />
                    <p className="text-sm font-medium uppercase tracking-[0.18em]">
                      Current take
                    </p>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    {selectedSession?.title ?? 'No take selected'}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {selectedSession
                      ? `${selectedSession.noteCount} notes · ${formatDuration(
                          selectedSession.durationMs
                        )} · ${selectedSession.status}`
                      : 'Start recording to create a new session draft.'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isRecording ? (
                    <Button
                      type="button"
                      onClick={onStopRecording}
                      className="bg-[#8f5f33] text-white hover:bg-[#744822]"
                    >
                      Stop recording
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={onStartRecording}
                      className="bg-[#1f6b64] text-white hover:bg-[#17544f]"
                    >
                      Start recording
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (
                        canResetTake &&
                        window.confirm(
                          'Reset the current take and remove its note capture and notation draft?'
                        )
                      ) {
                        onResetCurrentTake();
                      }
                    }}
                    disabled={!canResetTake}
                    className="border-[#b77c4a]/30 bg-white text-[#7f4e2a]"
                  >
                    <RotateCcw className="size-4" />
                    Reset current take
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.1rem] border border-black/6 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Capture sources
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Pointer, QWERTY, and MIDI all write into the same session
                    timeline while recording is active.
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-black/6 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Session state
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Stop recording to finish the take, then save it into the
                    session list when you want to keep it.
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-black/6 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Device storage
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {isAuthenticated
                      ? 'Changes stay local immediately and then sync to your signed-in workspace.'
                      : 'Changes save locally right away. Sign in from the header to sync across devices later.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-black/7 bg-[#fcfaf6] p-5">
              <div className="flex items-center gap-2 text-[#8f5f33]">
                <ListMusic className="size-4" />
                <p className="text-sm font-medium uppercase tracking-[0.18em]">
                  Saved sessions
                </p>
              </div>

              <ScrollArea className="mt-4 h-[20rem] rounded-[1rem] border border-black/6 bg-white">
                <div className="space-y-3 p-3">
                  {savedSessions.length ? (
                    savedSessions.map((session) => {
                      const isSelected = selectedSession?.id === session.id;

                      return (
                        <div
                          key={session.id}
                          className={cn(
                            'rounded-[1rem] border p-3 transition',
                            isSelected
                              ? 'border-[#1f6b64]/35 bg-[#1f6b64]/8'
                              : 'border-black/6 bg-[#fcfaf6]'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {session.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {session.noteCount} notes ·{' '}
                                {formatDuration(session.durationMs)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => onSelectSession(session.id)}
                                className="border-black/10 bg-white"
                              >
                                Open
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Delete saved session "${session.title}"?`
                                    )
                                  ) {
                                    onDeleteSession(session.id);
                                  }
                                }}
                                className="border-[#b91c1c]/15 bg-white text-[#b91c1c]"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm leading-7 text-slate-600">
                      Saved sessions will appear here after you stop a take and
                      choose to keep it.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[1.4rem] border border-black/7 bg-[#fcfaf6] p-5">
              <div className="flex items-center gap-2 text-[#8f5f33]">
                <NotebookPen className="size-4" />
                <p className="text-sm font-medium uppercase tracking-[0.18em]">
                  Session details
                </p>
              </div>

              {selectedSession ? (
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Title
                    </span>
                    <input
                      type="text"
                      value={selectedSession.title}
                      onChange={(event) => onRenameSession(event.target.value)}
                      className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#1f6b64]/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Manual notation
                    </span>
                    <Textarea
                      value={selectedSession.notationText}
                      onChange={(event) => onUpdateNotation(event.target.value)}
                      placeholder="Add Sargam phrases, western notes, or short practice reminders."
                      className="min-h-[10rem] border-black/10 bg-white"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={onSaveSession}
                      disabled={!canSaveSession}
                      className="bg-[#1f6b64] text-white hover:bg-[#17544f]"
                    >
                      <Save className="size-4" />
                      Save session
                    </Button>
                    <p className="text-sm leading-7 text-slate-500">
                      Saved sessions remain editable after you reopen them from
                      the recorder tab.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Start a take or open a saved session to add notation and a
                  clearer title.
                </p>
              )}
            </div>

            <div className="rounded-[1.4rem] border border-black/7 bg-[#fcfaf6] p-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8f5f33]">
                Captured note sequence
              </p>
              <ScrollArea className="mt-4 h-[24rem] rounded-[1rem] border border-black/6 bg-white">
                <div className="space-y-3 p-3">
                  {selectedSession?.noteEvents.length ? (
                    selectedSession.noteEvents.map((noteEvent, index) => (
                      <div
                        key={noteEvent.id}
                        className="rounded-[1rem] border border-black/6 bg-[#fcfaf6] p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {index + 1}. {noteEvent.sargam} / {noteEvent.western}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              MIDI {noteEvent.midi} · {noteEvent.source}
                            </p>
                          </div>
                          <span className="rounded-full bg-[#1f6b64]/8 px-3 py-1 text-xs font-medium text-[#1f6b64]">
                            {noteEvent.durationMs} ms
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-slate-600">
                      Recorded notes will appear here in the order you played
                      them once a take is running.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[1.4rem] border border-black/7 bg-[#fcfaf6] p-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8f5f33]">
                Save current setup
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Store the current control state as a reusable user preset. You
                can also overwrite an existing custom preset from the list.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={presetName}
                  onChange={(event) => setPresetName(event.target.value)}
                  placeholder="Preset name"
                  className="h-11 flex-1 rounded-xl border border-black/10 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#1f6b64]/40"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (!presetName.trim()) {
                      return;
                    }

                    onSavePreset(presetName);
                    setPresetName('');
                  }}
                  className="bg-[#1f6b64] text-white hover:bg-[#17544f]"
                >
                  <Save className="size-4" />
                  Save current preset
                </Button>
              </div>

              <div className="mt-4 rounded-[1.1rem] border border-black/6 bg-white p-4 text-sm leading-7 text-slate-600">
                Built-in presets always stay available. User presets save your
                preferred label mode, octave, transpose, reverb, and reed mode
                without changing the 23-key layout itself.
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-black/7 bg-[#fcfaf6] p-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8f5f33]">
                Available presets
              </p>

              <ScrollArea className="mt-4 h-[24rem] rounded-[1rem] border border-black/6 bg-white">
                <div className="space-y-3 p-3">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="rounded-[1rem] border border-black/6 bg-[#fcfaf6] p-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="max-w-2xl">
                          <p className="font-semibold text-slate-900">
                            {preset.name}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {preset.description}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {preset.settings.labelMode} · octave {preset.settings.octave} ·{' '}
                            {preset.settings.transpose >= 0 ? '+' : ''}
                            {preset.settings.transpose} st ·{' '}
                            {preset.settings.reverbEnabled ? 'room' : 'dry'} ·{' '}
                            {preset.settings.reedMode}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onApplyPreset(preset.id)}
                            className="bg-[#1f6b64] text-white hover:bg-[#17544f]"
                          >
                            Load
                          </Button>

                          {preset.kind === 'user' ? (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => onSavePreset(preset.name, preset.id)}
                                className="border-black/10 bg-white"
                              >
                                Overwrite
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const nextName = window.prompt(
                                    'Rename preset',
                                    preset.name
                                  );
                                  if (nextName) {
                                    onRenamePreset(preset.id, nextName);
                                  }
                                }}
                                className="border-black/10 bg-white"
                              >
                                Rename
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Delete preset "${preset.name}"?`
                                    )
                                  ) {
                                    onDeletePreset(preset.id);
                                  }
                                }}
                                className="border-[#b91c1c]/15 bg-white text-[#b91c1c]"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
