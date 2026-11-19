import { describe, expect, it } from 'vitest';
import type { ProjectRole } from '../types';
import { can, type ProjectAction } from './permissions';

// Таблица domain.md, раздел 3: [действие, читатель, редактор, владелец]
const TABLE: [ProjectAction, boolean, boolean, boolean][] = [
  ['viewConspects', true, true, true],
  ['search', true, true, true],
  ['fork', true, true, true],
  ['createConspect', false, true, true],
  ['renameConspect', false, true, true],
  ['editFiles', false, true, true],
  ['runStage', false, true, true],
  ['deleteConspect', false, false, true],
  ['renameProject', false, false, true],
  ['deleteProject', false, false, true],
  ['manageAccess', false, false, true],
  ['viewStats', false, false, true],
  ['leaveProject', true, true, false],
];

const ROLES: ProjectRole[] = ['reader', 'editor', 'owner'];

describe('can', () => {
  it.each(TABLE)('%s: читатель %s, редактор %s, владелец %s', (action, ...expected) => {
    expect(ROLES.map((role) => can(role, action))).toEqual(expected);
  });
});
