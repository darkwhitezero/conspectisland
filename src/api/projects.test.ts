import { beforeAll, describe, expect, it } from 'vitest';
import { DEMO_PASSWORD } from '../mocks/seed/users';
import { login } from './auth';
import { createProject, listMyProjects } from './projects';

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
    const withLink = projects.filter((p) => p.inviteLink).map((p) => p.name);
    expect(withLink).toEqual(['Базы данных']);
  });

  it('создаёт проект владельца с политикой «Только владелец» и ставит его первым', async () => {
    const created = await createProject('Социальное взаимодействие');
    expect(created).toMatchObject({ myRole: 'owner', accessPolicy: 'PRIVATE' });
    expect(created.inviteLink).toBeUndefined();
    const [first] = await listMyProjects();
    expect(first.id).toBe(created.id);
  });
});
