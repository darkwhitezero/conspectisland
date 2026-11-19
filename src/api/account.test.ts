import { describe, expect, it } from 'vitest';
import { DEMO_PASSWORD } from '../mocks/seed/users';
import { changePassword, deleteAccount, getCurrentUser, login } from './auth';
import { listConspects } from './conspects';
import { listMembers } from './members';
import { getProject } from './projects';

describe('учётная запись (моки)', () => {
  it('смена пароля: неверный текущий отклоняется, новый начинает работать', async () => {
    await login('sofia_v', DEMO_PASSWORD);
    await expect(changePassword('wrong-password', 'new-password-1')).rejects.toMatchObject({
      message: 'Неверный текущий пароль',
    });
    await changePassword(DEMO_PASSWORD, 'new-password-1');
    await expect(login('sofia_v', DEMO_PASSWORD)).rejects.toMatchObject({ code: 'invalid_credentials' });
    await expect(login('sofia_v', 'new-password-1')).resolves.toMatchObject({ login: 'sofia_v' });
  });

  it('удаление с неверным паролем ничего не удаляет', async () => {
    await login('danis_a', DEMO_PASSWORD);
    await expect(deleteAccount('wrong-password')).rejects.toMatchObject({ message: 'Неверный пароль' });
    await expect(getCurrentUser()).resolves.toMatchObject({ login: 'danis_a' });
  });

  it('удаление убирает проекты владельца целиком и членство в чужих', async () => {
    await login('danis_a', DEMO_PASSWORD);
    await deleteAccount(DEMO_PASSWORD);
    expect(await getCurrentUser()).toBeNull();
    await expect(login('danis_a', DEMO_PASSWORD)).rejects.toMatchObject({ code: 'invalid_credentials' });

    // Владелец «Неклассических логик» больше не видит danis_a среди участников.
    await login('kirill_m', DEMO_PASSWORD);
    expect((await listMembers('p_logic')).map((m) => m.login)).not.toContain('danis_a');
    // «Базы данных» (владелец — danis_a) удалены вместе с конспектами.
    await expect(getProject('p_db')).rejects.toMatchObject({ code: 'not_found' });
    await expect(listConspects('p_db')).rejects.toMatchObject({ code: 'not_found' });
  });
});
