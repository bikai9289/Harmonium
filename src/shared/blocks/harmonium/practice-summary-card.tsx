'use client';

import { ArrowRight, Cloud, HardDriveDownload, Music4 } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { PracticePreset, PracticeSession } from './practice-workspace';

function getSyncCopy({
  isAuthenticated,
  syncStatus,
}: {
  isAuthenticated: boolean;
  syncStatus: 'loading' | 'local' | 'syncing' | 'synced' | 'error';
}) {
  if (!isAuthenticated) {
    return {
      label: 'Local only',
      description: 'Saved on this device. Sign in from the header to sync across devices.',
      icon: HardDriveDownload,
    };
  }

  if (syncStatus === 'syncing') {
    return {
      label: 'Syncing',
      description: 'Updating your latest practice data in the cloud.',
      icon: Cloud,
    };
  }

  if (syncStatus === 'error') {
    return {
      label: 'Sync issue',
      description: 'Local data is safe. Sign-in sync will retry as the workspace changes.',
      icon: Cloud,
    };
  }

  return {
    label: 'Synced',
    description: 'Your latest sessions and presets can follow you after sign-in.',
    icon: Cloud,
  };
}

function getNotationPreview(session: PracticeSession | null) {
  if (!session?.notationText.trim()) {
    return 'Add manual notation on the keyboard page to keep Sargam or western note reminders beside each take.';
  }

  return session.notationText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(' / ');
}

export function PracticeSummaryCard({
  isAuthenticated,
  latestPreset,
  latestSession,
  syncStatus,
  className,
}: {
  isAuthenticated: boolean;
  latestPreset: PracticePreset | null;
  latestSession: PracticeSession | null;
  syncStatus: 'loading' | 'local' | 'syncing' | 'synced' | 'error';
  className?: string;
}) {
  const syncCopy = getSyncCopy({ isAuthenticated, syncStatus });
  const SyncIcon = syncCopy.icon;

  return (
    <div
      className={cn(
        'rounded-[1.8rem] border border-black/7 bg-white/82 p-5 shadow-sm',
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#8f5f33]">
            Practice summary
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950">
            Keep your latest take in reach
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            The focused practice studio lives on the keyboard page. This card
            shows the last session and preset state without turning the homepage
            into a full editor.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[#8b2e2e]/10 px-3 py-2 text-sm font-medium text-[#8b2e2e]">
          <SyncIcon className="size-4" />
          {syncCopy.label}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.2rem] border border-black/6 bg-[#fcfaf6] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Latest session
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {latestSession?.title ?? 'No session saved yet'}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {latestSession
              ? `${latestSession.noteCount} notes captured across ${Math.round(
                  latestSession.durationMs / 1000
                )} seconds.`
              : 'Start one recording on /keyboard and your latest take will appear here.'}
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-black/6 bg-[#fcfaf6] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Notation preview
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {getNotationPreview(latestSession)}
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-black/6 bg-[#fcfaf6] p-4">
          <div className="flex items-center gap-2 text-[#8f5f33]">
            <Music4 className="size-4" />
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Latest preset
            </p>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {latestPreset?.name ?? 'No preset loaded yet'}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {latestPreset?.description ??
              'Load one of the focused presets or save your own practice setup from the keyboard page.'}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-[#8b2e2e]/10 bg-[#8b2e2e]/6 px-4 py-3">
        <p className="text-sm text-slate-600">{syncCopy.description}</p>
        <Button asChild className="bg-[#8b2e2e] text-white hover:bg-[#6f2424]">
          <Link href="/keyboard">
            Open Practice Studio
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
