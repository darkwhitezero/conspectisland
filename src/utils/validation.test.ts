import { describe, expect, it } from 'vitest';
import { validateLogin, validatePassword } from './validation';

describe('validateLogin', () => {
  it.each(['abc', 'danis_a', 'DANIS_A', 'user_2026', 'a'.repeat(32)])('принимает «%s»', (login) => {
    expect(validateLogin(login)).toBeNull();
  });

  it.each([
    ['пустой', ''],
    ['короче 3', 'ab'],
    ['длиннее 32', 'a'.repeat(33)],
    ['кириллица', 'данис'],
    ['пробел', 'danis a'],
    ['дефис', 'danis-a'],
    ['точка', 'danis.a'],
  ])('отклоняет: %s', (_, login) => {
    expect(validateLogin(login)).toEqual(expect.any(String));
  });

  it('объясняет разные нарушения разными словами', () => {
    expect(validateLogin('ab')).not.toEqual(validateLogin('данис'));
  });
});

describe('validatePassword', () => {
  it.each(['a'.repeat(8), 'a'.repeat(64), 'пароль с пробелами'])('принимает пароль длиной %#', (password) => {
    expect(validatePassword(password)).toBeNull();
  });

  it.each(['', 'a'.repeat(7), 'a'.repeat(65)])('отклоняет пароль %#', (password) => {
    expect(validatePassword(password)).toEqual(expect.any(String));
  });
});
