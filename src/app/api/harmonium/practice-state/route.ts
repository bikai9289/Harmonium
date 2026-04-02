import { createPracticeId, sanitizePracticeWorkspace } from '@/shared/blocks/harmonium/practice-workspace';
import { respData, respErr } from '@/shared/lib/resp';
import {
  getPracticeWorkspaceByUserId,
  savePracticeWorkspaceForUser,
} from '@/shared/models/harmonium-practice';
import { getUserInfo } from '@/shared/models/user';

export async function GET() {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const workspace = await getPracticeWorkspaceByUserId(user.id);

    return respData({
      workspace,
    });
  } catch (error: any) {
    console.error('get harmonium practice state failed:', error);
    return respErr(`get harmonium practice state failed: ${error.message}`);
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const body = await req.json();
    if (!body?.workspace) {
      return respErr('workspace is required');
    }

    const workspace = sanitizePracticeWorkspace(body.workspace);
    const existingWorkspace = await getPracticeWorkspaceByUserId(user.id);
    const stateId =
      typeof body.id === 'string' && body.id
        ? body.id
        : existingWorkspace
          ? undefined
          : createPracticeId('practice_state');

    const savedState = await savePracticeWorkspaceForUser({
      id: stateId ?? createPracticeId('practice_state'),
      userId: user.id,
      workspace,
    });

    return respData({
      id: savedState.id,
      workspace,
    });
  } catch (error: any) {
    console.error('save harmonium practice state failed:', error);
    return respErr(`save harmonium practice state failed: ${error.message}`);
  }
}
