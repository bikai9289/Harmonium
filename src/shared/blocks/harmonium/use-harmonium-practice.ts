'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useSession } from '@/core/auth/client';

import {
  PracticeInputSource,
  PracticePreset,
  PracticeSession,
  PracticeSettingsSnapshot,
  PracticeWorkspace,
  PRACTICE_STORAGE_KEY,
  applySessionMetrics,
  createEmptyPracticeWorkspace,
  createPracticeId,
  createPracticeSession,
  getAllPracticePresets,
  getLatestPracticeSession,
  getNoteNamesForMidi,
  getPracticePresetById,
  getTimestampFromIso,
  sanitizePracticeWorkspace,
} from './practice-workspace';

type PracticeSyncStatus = 'loading' | 'local' | 'syncing' | 'synced' | 'error';

type ActiveCapture = {
  sessionId: string;
  voiceId: string;
  source: PracticeInputSource;
  midi: number;
  startedAtMs: number;
};

function extractSessionUser(data: any) {
  const user = data?.user ?? data?.data?.user ?? null;
  return user && typeof user === 'object' ? user : null;
}

function sortSessions(sessions: PracticeSession[]) {
  return [...sessions].sort(
    (left, right) =>
      getTimestampFromIso(right.updatedAt) - getTimestampFromIso(left.updatedAt)
  );
}

function sortPresets(presets: PracticePreset[]) {
  return [...presets].sort(
    (left, right) =>
      getTimestampFromIso(right.updatedAt) - getTimestampFromIso(left.updatedAt)
  );
}

function hasPracticeContent(workspace: PracticeWorkspace) {
  return (
    workspace.sessions.length > 0 ||
    workspace.presets.length > 0 ||
    Boolean(workspace.lastPresetId)
  );
}

function getSelectedSession(workspace: PracticeWorkspace) {
  if (workspace.lastSessionId) {
    const selected = workspace.sessions.find(
      (session) => session.id === workspace.lastSessionId
    );
    if (selected) {
      return selected;
    }
  }

  return getLatestPracticeSession(workspace);
}

export function useHarmoniumPractice({
  currentSettings,
  applySettingsSnapshot,
}: {
  currentSettings?: PracticeSettingsSnapshot;
  applySettingsSnapshot?: (snapshot: PracticeSettingsSnapshot) => void;
} = {}) {
  const { data: session, isPending } = useSession();
  const sessionUser = extractSessionUser(session);
  const userId = typeof sessionUser?.id === 'string' ? sessionUser.id : '';

  const [workspace, setWorkspace] = useState<PracticeWorkspace>(
    createEmptyPracticeWorkspace()
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<PracticeSyncStatus>('loading');

  const workspaceRef = useRef(workspace);
  const activeCapturesRef = useRef<Map<string, ActiveCapture>>(new Map());
  const remoteSyncedUpdatedAtRef = useRef('');
  const syncTimerRef = useRef<number | null>(null);
  const fetchedUserIdRef = useRef('');

  useEffect(() => {
    workspaceRef.current = workspace;
  }, [workspace]);

  const persistWorkspaceLocally = useCallback((nextWorkspace: PracticeWorkspace) => {
    window.localStorage.setItem(
      PRACTICE_STORAGE_KEY,
      JSON.stringify(nextWorkspace)
    );
  }, []);

  const updateWorkspace = useCallback(
    (
      updater: (current: PracticeWorkspace) => PracticeWorkspace,
      options?: { updatedAt?: string }
    ) => {
      const timestamp = options?.updatedAt ?? new Date().toISOString();
      const nextWorkspace = updater(workspaceRef.current);
      const committedWorkspace = {
        ...nextWorkspace,
        updatedAt: timestamp,
        sessions: sortSessions(nextWorkspace.sessions),
        presets: sortPresets(nextWorkspace.presets),
      };

      workspaceRef.current = committedWorkspace;
      setWorkspace(committedWorkspace);
    },
    []
  );

  const persistWorkspaceRemotely = useCallback(
    async (
      nextWorkspace: PracticeWorkspace,
      options?: { keepalive?: boolean; silent?: boolean }
    ) => {
      if (!userId) {
        return false;
      }

      if (!options?.silent) {
        setSyncStatus('syncing');
      }

      try {
        const response = await fetch('/api/harmonium/practice-state', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspace: nextWorkspace,
          }),
          keepalive: options?.keepalive,
        });
        const payload = (await response.json()) as {
          code: number;
          message: string;
          data?: {
            workspace?: PracticeWorkspace;
          };
        };

        if (payload.code !== 0) {
          setSyncStatus('error');
          return false;
        }

        const savedWorkspace = sanitizePracticeWorkspace(
          payload.data?.workspace ?? nextWorkspace
        );
        const previousUpdatedAt = workspaceRef.current.updatedAt;

        remoteSyncedUpdatedAtRef.current = savedWorkspace.updatedAt;
        persistWorkspaceLocally(savedWorkspace);
        workspaceRef.current = savedWorkspace;

        if (previousUpdatedAt !== savedWorkspace.updatedAt) {
          setWorkspace(savedWorkspace);
        }

        setSyncStatus('synced');
        return true;
      } catch (error) {
        console.error('Failed to sync harmonium practice workspace', error);
        setSyncStatus('error');
        return false;
      }
    },
    [persistWorkspaceLocally, userId]
  );

  const flushRemoteSync = useCallback(
    (options?: { keepalive?: boolean; silent?: boolean }) => {
      if (!userId) {
        return;
      }

      const currentWorkspace = workspaceRef.current;
      if (
        currentWorkspace.updatedAt === remoteSyncedUpdatedAtRef.current ||
        !hasPracticeContent(currentWorkspace)
      ) {
        return;
      }

      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }

      void persistWorkspaceRemotely(currentWorkspace, options);
    },
    [persistWorkspaceRemotely, userId]
  );

  const finalizeCaptures = useCallback(
    (sessionId: string, voiceIds?: string[]) => {
      const captures = [...activeCapturesRef.current.values()].filter(
        (capture) =>
          capture.sessionId === sessionId &&
          (!voiceIds || voiceIds.includes(capture.voiceId))
      );

      if (!captures.length) {
        return;
      }

      const endedAtMs = Date.now();
      for (const capture of captures) {
        activeCapturesRef.current.delete(capture.voiceId);
      }

      updateWorkspace((current) => {
        const session = current.sessions.find((item) => item.id === sessionId);
        if (!session) {
          return current;
        }

        const noteEvents = [...session.noteEvents];

        for (const capture of captures) {
          const names = getNoteNamesForMidi(capture.midi);

          noteEvents.push({
            id: createPracticeId('note'),
            voiceId: capture.voiceId,
            source: capture.source,
            midi: capture.midi,
            western: names.western,
            sargam: names.sargam,
            startedAtMs: capture.startedAtMs,
            durationMs: Math.max(1, endedAtMs - capture.startedAtMs),
          });
        }

        return {
          ...current,
          sessions: current.sessions.map((item) =>
            item.id === sessionId
              ? {
                  ...applySessionMetrics(item, noteEvents),
                  updatedAt: new Date().toISOString(),
                }
              : item
          ),
        };
      });
    },
    [updateWorkspace]
  );

  useEffect(() => {
    const savedWorkspace = window.localStorage.getItem(PRACTICE_STORAGE_KEY);
    let nextWorkspace = createEmptyPracticeWorkspace();

    if (savedWorkspace) {
      try {
        nextWorkspace = sanitizePracticeWorkspace(JSON.parse(savedWorkspace));
      } catch (error) {
        console.error('Failed to read harmonium practice workspace', error);
      }
    }

    setWorkspace(nextWorkspace);
    workspaceRef.current = nextWorkspace;
    setHasHydrated(true);
    setSyncStatus('local');
  }, []);

  useEffect(() => {
    if (!hasHydrated || isPending) {
      return;
    }

    if (!userId) {
      fetchedUserIdRef.current = '';
      remoteSyncedUpdatedAtRef.current = '';
      setSyncStatus('local');
      return;
    }

    if (fetchedUserIdRef.current === userId) {
      return;
    }

    fetchedUserIdRef.current = userId;

    void (async () => {
      setSyncStatus('syncing');

      try {
        const response = await fetch('/api/harmonium/practice-state', {
          cache: 'no-store',
        });
        const payload = (await response.json()) as {
          code: number;
          message: string;
          data?: {
            workspace?: PracticeWorkspace | null;
          };
        };

        if (payload.code !== 0) {
          setSyncStatus('error');
          return;
        }

        const localWorkspace = workspaceRef.current;
        const remoteWorkspace = payload.data?.workspace
          ? sanitizePracticeWorkspace(payload.data.workspace)
          : null;

        if (!remoteWorkspace) {
          remoteSyncedUpdatedAtRef.current = '';
          if (hasPracticeContent(localWorkspace)) {
            void persistWorkspaceRemotely(localWorkspace, { silent: true });
          } else {
            setSyncStatus('synced');
          }
          return;
        }

        const localTimestamp = getTimestampFromIso(localWorkspace.updatedAt);
        const remoteTimestamp = getTimestampFromIso(remoteWorkspace.updatedAt);

        remoteSyncedUpdatedAtRef.current = remoteWorkspace.updatedAt;

        if (remoteTimestamp > localTimestamp) {
          persistWorkspaceLocally(remoteWorkspace);
          workspaceRef.current = remoteWorkspace;
          setWorkspace(remoteWorkspace);
          setSyncStatus('synced');
          return;
        }

        if (localTimestamp > remoteTimestamp) {
          void persistWorkspaceRemotely(localWorkspace, { silent: true });
          return;
        }

        setSyncStatus('synced');
      } catch (error) {
        console.error('Failed to load harmonium practice workspace', error);
        setSyncStatus('error');
      }
    })();
  }, [
    hasHydrated,
    isPending,
    persistWorkspaceLocally,
    persistWorkspaceRemotely,
    userId,
  ]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    persistWorkspaceLocally(workspace);

    if (!userId) {
      setSyncStatus('local');
      return;
    }

    if (!hasPracticeContent(workspace)) {
      setSyncStatus('synced');
      return;
    }

    if (workspace.updatedAt === remoteSyncedUpdatedAtRef.current) {
      setSyncStatus('synced');
      return;
    }

    setSyncStatus('local');

    if (syncTimerRef.current) {
      window.clearTimeout(syncTimerRef.current);
    }

    syncTimerRef.current = window.setTimeout(() => {
      syncTimerRef.current = null;
      void persistWorkspaceRemotely(workspace);
    }, 2000);

    return () => {
      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current);
      }
    };
  }, [
    hasHydrated,
    persistWorkspaceLocally,
    persistWorkspaceRemotely,
    userId,
    workspace,
  ]);

  useEffect(() => {
    if (!hasHydrated || !userId) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushRemoteSync({ keepalive: true, silent: true });
      }
    };

    const handleBeforeUnload = () => {
      flushRemoteSync({ keepalive: true, silent: true });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [flushRemoteSync, hasHydrated, userId]);

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current);
      }
    };
  }, []);

  const selectedSession = getSelectedSession(workspace);
  const savedSessions = sortSessions(
    workspace.sessions.filter((session) => session.status === 'saved')
  );
  const presets = getAllPracticePresets(workspace);
  const latestSession = getLatestPracticeSession(workspace);
  const latestPreset = getPracticePresetById(workspace, workspace.lastPresetId);
  const isRecording = selectedSession?.status === 'recording';

  const startRecording = useCallback(() => {
    if (!currentSettings || isRecording) {
      return;
    }

    activeCapturesRef.current.clear();
    const session = createPracticeSession(currentSettings);

    updateWorkspace((current) => ({
      ...current,
      sessions: [session, ...current.sessions],
      lastSessionId: session.id,
    }));
  }, [currentSettings, isRecording, updateWorkspace]);

  const stopRecording = useCallback(() => {
    if (!selectedSession || selectedSession.status !== 'recording') {
      return;
    }

    finalizeCaptures(selectedSession.id);
    updateWorkspace((current) => ({
      ...current,
      sessions: current.sessions.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              status: 'idle',
              updatedAt: new Date().toISOString(),
            }
          : session
      ),
    }));
    flushRemoteSync();
  }, [finalizeCaptures, flushRemoteSync, selectedSession, updateWorkspace]);

  const saveCurrentSession = useCallback(() => {
    if (!selectedSession) {
      return;
    }

    updateWorkspace((current) => ({
      ...current,
      sessions: current.sessions.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              status: 'saved',
              updatedAt: new Date().toISOString(),
            }
          : session
      ),
      lastSessionId: selectedSession.id,
    }));
    flushRemoteSync();
  }, [flushRemoteSync, selectedSession, updateWorkspace]);

  const resetCurrentTake = useCallback(() => {
    if (!selectedSession || selectedSession.status === 'saved') {
      return;
    }

    activeCapturesRef.current.clear();
    updateWorkspace((current) => {
      const remainingSessions = current.sessions.filter(
        (session) => session.id !== selectedSession.id
      );

      return {
        ...current,
        sessions: remainingSessions,
        lastSessionId: remainingSessions[0]?.id ?? '',
      };
    });
    flushRemoteSync();
  }, [flushRemoteSync, selectedSession, updateWorkspace]);

  const selectSession = useCallback(
    (sessionId: string) => {
      updateWorkspace((current) => ({
        ...current,
        lastSessionId: sessionId,
      }));
    },
    [updateWorkspace]
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      activeCapturesRef.current.forEach((capture, voiceId) => {
        if (capture.sessionId === sessionId) {
          activeCapturesRef.current.delete(voiceId);
        }
      });

      updateWorkspace((current) => {
        const remainingSessions = current.sessions.filter(
          (session) => session.id !== sessionId
        );
        const nextSelectedId =
          current.lastSessionId === sessionId
            ? remainingSessions[0]?.id ?? ''
            : current.lastSessionId;

        return {
          ...current,
          sessions: remainingSessions,
          lastSessionId: nextSelectedId,
        };
      });
    },
    [updateWorkspace]
  );

  const renameCurrentSession = useCallback(
    (title: string) => {
      if (!selectedSession) {
        return;
      }

      updateWorkspace((current) => ({
        ...current,
        sessions: current.sessions.map((session) =>
          session.id === selectedSession.id
            ? {
                ...session,
                title: title.trim() || session.title,
                updatedAt: new Date().toISOString(),
              }
            : session
        ),
      }));
    },
    [selectedSession, updateWorkspace]
  );

  const updateCurrentNotation = useCallback(
    (notationText: string) => {
      if (!selectedSession) {
        return;
      }

      updateWorkspace((current) => ({
        ...current,
        sessions: current.sessions.map((session) =>
          session.id === selectedSession.id
            ? {
                ...session,
                notationText,
                updatedAt: new Date().toISOString(),
              }
            : session
        ),
      }));
    },
    [selectedSession, updateWorkspace]
  );

  const captureNoteStart = useCallback(
    ({
      voiceId,
      source,
      midi,
    }: {
      voiceId: string;
      source: PracticeInputSource;
      midi: number;
    }) => {
      const session = getSelectedSession(workspaceRef.current);
      if (!session || session.status !== 'recording') {
        return;
      }

      if (activeCapturesRef.current.has(voiceId)) {
        return;
      }

      activeCapturesRef.current.set(voiceId, {
        sessionId: session.id,
        voiceId,
        source,
        midi,
        startedAtMs: Date.now(),
      });
    },
    []
  );

  const captureNoteStop = useCallback(
    (voiceId: string) => {
      const capture = activeCapturesRef.current.get(voiceId);
      if (!capture) {
        return;
      }

      finalizeCaptures(capture.sessionId, [voiceId]);
    },
    [finalizeCaptures]
  );

  const captureAllActiveNotes = useCallback(() => {
    const captures = [...activeCapturesRef.current.values()];
    if (!captures.length) {
      return;
    }

    const sessionIds = [...new Set(captures.map((capture) => capture.sessionId))];
    for (const sessionId of sessionIds) {
      finalizeCaptures(sessionId);
    }
  }, [finalizeCaptures]);

  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = getPracticePresetById(workspaceRef.current, presetId);
      if (!preset) {
        return;
      }

      applySettingsSnapshot?.(preset.settings);
      updateWorkspace((current) => ({
        ...current,
        lastPresetId: preset.id,
      }));
    },
    [applySettingsSnapshot, updateWorkspace]
  );

  const saveUserPreset = useCallback(
    (name: string, presetId?: string) => {
      if (!currentSettings) {
        return;
      }

      const trimmedName = name.trim();
      if (!trimmedName) {
        return;
      }

      const timestamp = new Date().toISOString();

      updateWorkspace((current) => {
        const existingPreset = presetId
          ? current.presets.find((preset) => preset.id === presetId)
          : null;
        const nextPreset: PracticePreset = existingPreset
          ? {
              ...existingPreset,
              name: trimmedName,
              updatedAt: timestamp,
              settings: currentSettings,
            }
          : {
              id: createPracticeId('preset'),
              kind: 'user',
              name: trimmedName,
              description: 'Saved from the current harmonium control state.',
              updatedAt: timestamp,
              settings: currentSettings,
            };

        const remainingPresets = current.presets.filter(
          (preset) => preset.id !== nextPreset.id
        );

        return {
          ...current,
          presets: [nextPreset, ...remainingPresets],
          lastPresetId: nextPreset.id,
        };
      });
      flushRemoteSync();
    },
    [currentSettings, flushRemoteSync, updateWorkspace]
  );

  const renameUserPreset = useCallback(
    (presetId: string, name: string) => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return;
      }

      updateWorkspace((current) => ({
        ...current,
        presets: current.presets.map((preset) =>
          preset.id === presetId
            ? {
                ...preset,
                name: trimmedName,
                updatedAt: new Date().toISOString(),
              }
            : preset
        ),
      }));
      flushRemoteSync();
    },
    [flushRemoteSync, updateWorkspace]
  );

  const deleteUserPreset = useCallback(
    (presetId: string) => {
      updateWorkspace((current) => ({
        ...current,
        presets: current.presets.filter((preset) => preset.id !== presetId),
        lastPresetId:
          current.lastPresetId === presetId ? '' : current.lastPresetId,
      }));
    },
    [updateWorkspace]
  );

  return {
    hasHydrated,
    isAuthenticated: Boolean(userId),
    isRecording,
    latestPreset,
    latestSession,
    presets,
    savedSessions,
    selectedSession,
    syncStatus,
    workspace,
    applyPreset,
    captureAllActiveNotes,
    captureNoteStart,
    captureNoteStop,
    deleteSession,
    deleteUserPreset,
    flushRemoteSync,
    renameCurrentSession,
    renameUserPreset,
    resetCurrentTake,
    saveCurrentSession,
    saveUserPreset,
    selectSession,
    startRecording,
    stopRecording,
    updateCurrentNotation,
  };
}
