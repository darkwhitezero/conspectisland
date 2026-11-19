import { db } from '../mocks/db';
import type { Conspect } from '../types';
import { requireProjectAccess } from './access';
import { delay } from './client';

export async function listConspects(projectId: string): Promise<Conspect[]> {
  await delay();
  requireProjectAccess(projectId, 'viewConspects');
  return structuredClone(db.conspects.filter((c) => c.projectId === projectId));
}
