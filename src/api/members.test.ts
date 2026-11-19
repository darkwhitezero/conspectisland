import { beforeAll, describe, expect, it } from 'vitest';
import { DEMO_PASSWORD } from '../mocks/seed/users';
import { login } from './auth';
import { changeMemberRole, getAccess, listMembers, removeMember, setAccessPolicy } from './members';

describe('members (моки)', () => {
  beforeAll(async () => {
    await login('danis_a', DEMO_PASSWORD);
  });

  it('владелец видит политику, ссылку и участников по порядку присоединения', async () => {
    const access = await getAccess('p_db');
    expect(access.accessPolicy).toBe('LINK');
    expect(access.inviteLink).toMatch(/\/join\/db-7f3k9q$/);
    const members = await listMembers('p_db');
    expect(members.map((m) => m.login)).toEqual(['kirill_m', 'alina_s', 'timur_g', 'sofia_v']);
  });

  it('управлять доступом может только владелец', async () => {
    await expect(listMembers('p_logic')).rejects.toMatchObject({ code: 'forbidden' });
    await expect(setAccessPolicy('p_logic', 'PRIVATE')).rejects.toMatchObject({ code: 'forbidden' });
  });

  it('меняет роль и исключает участника', async () => {
    await changeMemberRole('p_db', 'u_alina', 'editor');
    await removeMember('p_db', 'u_timur');
    const members = await listMembers('p_db');
    expect(members.find((m) => m.login === 'alina_s')?.role).toBe('editor');
    expect(members.map((m) => m.login)).not.toContain('timur_g');
  });

  it('«Только владелец» удаляет всех участников и аннулирует ссылку', async () => {
    const access = await setAccessPolicy('p_db', 'PRIVATE');
    expect(access).toEqual({ accessPolicy: 'PRIVATE' });
    expect(await listMembers('p_db')).toEqual([]);
  });

  it('повторное «По ссылке» выдаёт новую ссылку', async () => {
    const access = await setAccessPolicy('p_db', 'LINK');
    expect(access.accessPolicy).toBe('LINK');
    expect(access.inviteLink).toMatch(/\/join\/[0-9a-f]{12}$/);
    expect(access.inviteLink).not.toMatch(/db-7f3k9q/);
  });
});
