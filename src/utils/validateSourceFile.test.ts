import { describe, expect, it } from 'vitest';
import { mimeTypeOf, validateSourceFile } from './validation';

const file = (name: string, content: BlobPart | BlobPart[]) => new File(Array.isArray(content) ? content : [content], name);

describe('mimeTypeOf', () => {
  it.each([
    ['notes.txt', 'text/plain'],
    ['README.MD', 'text/markdown'],
    ['photo.JPEG', 'image/jpeg'],
    ['scheme.png', 'image/png'],
    ['report.pdf', null],
    ['txt', null],
  ])('%s → %s', (name, expected) => {
    expect(mimeTypeOf(name)).toBe(expected);
  });
});

describe('validateSourceFile', () => {
  it('принимает текст в UTF-8 и изображения', async () => {
    expect(await validateSourceFile(file('notes.md', '# Конспект'))).toBeNull();
    expect(await validateSourceFile(file('page.jpg', new Uint8Array([0xff, 0xd8, 0xff])))).toBeNull();
  });

  it('отклоняет неподдерживаемый формат', async () => {
    expect(await validateSourceFile(file('lecture.pdf', 'x'))).toMatch(/формат/);
  });

  it('отклоняет пустой файл', async () => {
    expect(await validateSourceFile(file('empty.txt', ''))).toMatch(/пустой/);
  });

  it('отклоняет файл больше 10 МБ', async () => {
    const big = file('big.png', new Uint8Array(10 * 1024 * 1024 + 1));
    expect(await validateSourceFile(big)).toMatch(/10 МБ/);
  });

  it('отклоняет текст не в UTF-8 (например, Windows-1251)', async () => {
    // «Привет» в кодировке Windows-1251
    const cp1251 = new Uint8Array([0xcf, 0xf0, 0xe8, 0xe2, 0xe5, 0xf2]);
    expect(await validateSourceFile(file('old.txt', cp1251))).toMatch(/UTF-8/);
  });
});
