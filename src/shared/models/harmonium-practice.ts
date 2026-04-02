import { eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { harmoniumPracticeState } from '@/config/db/schema';

import {
  PracticeWorkspace,
  sanitizePracticeWorkspace,
} from '../blocks/harmonium/practice-workspace';

export type HarmoniumPracticeState = typeof harmoniumPracticeState.$inferSelect;
export type NewHarmoniumPracticeState =
  typeof harmoniumPracticeState.$inferInsert;

export async function getHarmoniumPracticeStateByUserId(userId: string) {
  const [result] = await db()
    .select()
    .from(harmoniumPracticeState)
    .where(eq(harmoniumPracticeState.userId, userId))
    .limit(1);

  return result;
}

export async function getPracticeWorkspaceByUserId(userId: string) {
  const state = await getHarmoniumPracticeStateByUserId(userId);
  if (!state) {
    return null;
  }

  try {
    return sanitizePracticeWorkspace(JSON.parse(state.workspace));
  } catch (error) {
    console.error('Failed to parse harmonium practice workspace', error);
    return null;
  }
}

export async function savePracticeWorkspaceForUser({
  id,
  userId,
  workspace,
}: {
  id: string;
  userId: string;
  workspace: PracticeWorkspace;
}) {
  const serializedWorkspace = JSON.stringify(workspace);

  const [result] = await db()
    .insert(harmoniumPracticeState)
    .values({
      id,
      userId,
      workspace: serializedWorkspace,
    })
    .onConflictDoUpdate({
      target: harmoniumPracticeState.userId,
      set: {
        workspace: serializedWorkspace,
        updatedAt: new Date(),
      },
    })
    .returning();

  return result;
}
