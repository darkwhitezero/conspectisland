import { db } from '../mocks/db';
import { queueStages, syncProcessing } from '../mocks/processing';
import type { Conspect, ProjectRole, StageType } from '../types';
import { can } from '../utils/permissions';
import { requireConspectAccess, requireProjectAccess } from './access';
import { ApiError, delay } from './client';

/** Текст ошибки этапа видят только те, кто может его перезапустить. */
function toConspect(record: Conspect, role: ProjectRole): Conspect {
  const conspect = structuredClone(record);
  if (!can(role, 'runStage')) {
    conspect.stages.forEach((stage) => delete stage.errorMessage);
  }
  return conspect;
}

export async function listConspects(projectId: string): Promise<Conspect[]> {
  await delay();
  const { role } = requireProjectAccess(projectId, 'viewConspects');
  return db.conspects
    .filter((c) => c.projectId === projectId)
    .map((c) => {
      syncProcessing(c);
      return toConspect(c, role);
    });
}

export async function getConspect(conspectId: string): Promise<Conspect> {
  await delay();
  const { conspect, role } = requireConspectAccess(conspectId, 'viewConspects');
  syncProcessing(conspect);
  return toConspect(conspect, role);
}

export async function renameConspect(conspectId: string, name: string): Promise<Conspect> {
  await delay();
  const { conspect, role } = requireConspectAccess(conspectId, 'renameConspect');
  conspect.name = name;
  conspect.updatedAt = new Date().toISOString();
  return toConspect(conspect, role);
}

/** Удаляет конспект вместе с файлами и HTML-представлением. */
export async function deleteConspect(conspectId: string): Promise<void> {
  await delay();
  requireConspectAccess(conspectId, 'deleteConspect');
  db.conspects = db.conspects.filter((c) => c.id !== conspectId);
  db.files = db.files.filter((f) => f.conspectId !== conspectId);
  delete db.html[conspectId];
  delete db.stageTimers[conspectId];
}

/** Запустить этап, который не запрашивался, или повторить после ошибки. */
export async function startStage(conspectId: string, type: StageType): Promise<Conspect> {
  await delay();
  const { conspect, role } = requireConspectAccess(conspectId, 'runStage');
  const stage = conspect.stages.find((s) => s.type === type);
  if (!stage || (stage.status !== 'not_requested' && stage.status !== 'failed')) {
    throw new ApiError('forbidden', 'Этап уже выполняется или готов');
  }
  queueStages(conspect, [type]);
  return toConspect(conspect, role);
}
