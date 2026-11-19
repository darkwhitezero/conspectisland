import { beforeAll, describe, expect, it } from 'vitest';
import { DEMO_PASSWORD } from '../mocks/seed/users';
import { login } from './auth';
import { listConspects } from './conspects';
import {
  createProject,
  deleteProject,
  forkProject,
  getProject,
  leaveProject,
  listMyProjects,
  renameProject,
} from './projects';

describe('projects (моки)', () => {
  beforeAll(async () => {
    await login('danis_a', DEMO_PASSWORD);
  });

  it('возвращает только проекты, где у пользователя есть роль', async () => {
    const projects = await listMyProjects();
    const roles = Object.fromEntries(projects.map((p) => [p.name, p.myRole]));
    expect(roles).toEqual({
      'Базы данных': 'owner',
      'Неклассические логики': 'editor',
      'ЭВМ и периферийные устройства': 'reader',
      'Интернет-программирование': 'owner',
    });
  });

  it('отдаёт ссылку-приглашение только владельцу проекта с политикой LINK', async () => {
    const projects = await listMyProjects();
    expect(projects.filter((p) => p.inviteLink).map((p) => p.name)).toEqual(['Базы данных']);
  });

  it('не открывает чужой проект', async () => {
    await expect(getProject('p_law')).rejects.toMatchObject({ code: 'not_found' });
    await expect(listConspects('p_law')).rejects.toMatchObject({ code: 'not_found' });
  });

  it('создаёт проект владельца с политикой «Только владелец» и ставит его первым', async () => {
    const created = await createProject('Социальное взаимодействие');
    expect(created).toMatchObject({ myRole: 'owner', accessPolicy: 'PRIVATE' });
    expect(created.inviteLink).toBeUndefined();
    const [first] = await listMyProjects();
    expect(first.id).toBe(created.id);
  });

  it('переименовывать может только владелец', async () => {
    await expect(renameProject('p_logic', 'Логики')).rejects.toMatchObject({ code: 'forbidden' });
    const renamed = await renameProject('p_web', 'Интернет-программирование (весна)');
    expect(renamed.name).toBe('Интернет-программирование (весна)');
  });

  it('форк копирует конспекты, а владельцем становится создавший', async () => {
    const fork = await forkProject('p_logic', 'Неклассические логики — мой форк');
    expect(fork).toMatchObject({ myRole: 'owner', accessPolicy: 'PRIVATE' });
    const [original, copy] = await Promise.all([listConspects('p_logic'), listConspects(fork.id)]);
    expect(copy.map((c) => c.name)).toEqual(original.map((c) => c.name));
    expect(copy.every((c) => c.projectId === fork.id)).toBe(true);
  });

  it('покинуть можно чужой проект, но не свой', async () => {
    await expect(leaveProject('p_db')).rejects.toMatchObject({ code: 'forbidden' });
    await leaveProject('p_evm');
    await expect(getProject('p_evm')).rejects.toMatchObject({ code: 'not_found' });
  });

  it('удаление проекта убирает и его конспекты', async () => {
    await deleteProject('p_db');
    await expect(getProject('p_db')).rejects.toMatchObject({ code: 'not_found' });
    await expect(listConspects('p_db')).rejects.toMatchObject({ code: 'not_found' });
  });
});
