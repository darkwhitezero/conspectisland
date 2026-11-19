import { describe, expect, it } from 'vitest';
import { DEFAULT_AFTER_LOGIN, loginPathFor, safeRedirect } from './redirect';

describe('safeRedirect', () => {
  it('пропускает внутренний путь с параметрами', () => {
    expect(safeRedirect('/projects/p1/members?tab=1')).toBe('/projects/p1/members?tab=1');
  });

  it.each([null, '', 'https://evil.com', '//evil.com', '/\\evil.com', 'projects'])(
    'заменяет «%s» на путь по умолчанию',
    (target) => {
      expect(safeRedirect(target)).toBe(DEFAULT_AFTER_LOGIN);
    },
  );
});

describe('loginPathFor', () => {
  it('кодирует исходный путь', () => {
    expect(loginPathFor('/account?x=1')).toBe('/login?redirect=%2Faccount%3Fx%3D1');
  });
});
