import { describe, expect, it } from 'vitest';
import { DEMO_PASSWORD } from '../mocks/seed/users';
import { login, register } from './auth';
import { ApiError } from './client';

describe('auth (моки)', () => {
  it('входит без учёта регистра логина и не отдаёт пароль', async () => {
    const user = await login('DANIS_A', DEMO_PASSWORD);
    expect(user.login).toBe('danis_a');
    expect(user).not.toHaveProperty('password');
  });

  it('отклоняет неверный пароль', async () => {
    await expect(login('danis_a', 'wrong-password')).rejects.toMatchObject({
      code: 'invalid_credentials',
      message: 'Неверный логин или пароль',
    });
  });

  it('не регистрирует занятый логин в другом регистре', async () => {
    const attempt = register('Kirill_M', 'new-password');
    await expect(attempt).rejects.toBeInstanceOf(ApiError);
    await expect(attempt).rejects.toMatchObject({ message: 'Этот логин уже занят' });
  });

  it('регистрирует нового пользователя с ролью «Пользователь»', async () => {
    const user = await register('new_student', 'new-password');
    expect(user.systemRole).toBe('user');
    await expect(login('new_student', 'new-password')).resolves.toMatchObject({ id: user.id });
  });
});
