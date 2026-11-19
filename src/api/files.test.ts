import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { QUEUED_MS, RUNNING_MS, stageStatusAt } from '../mocks/processing';
import { DEMO_PASSWORD } from '../mocks/seed/users';
import { login } from './auth';
import { getConspect, startStage } from './conspects';
import { deleteFile, getHtml, LAST_FILE_MESSAGE, listFiles, uploadFile } from './files';

const noProgress = () => {};
const statusOf = async (conspectId: string, type: 'ocr' | 'render' | 'index') =>
  (await getConspect(conspectId)).stages.find((s) => s.type === type)?.status;

describe('stageStatusAt', () => {
  it('очередь → выполнение → готово', () => {
    expect(stageStatusAt(0, 0)).toBe('queued');
    expect(stageStatusAt(0, QUEUED_MS)).toBe('running');
    expect(stageStatusAt(0, QUEUED_MS + RUNNING_MS)).toBe('done');
  });
});

describe('files и этапы (моки)', () => {
  beforeAll(async () => {
    await login('danis_a', DEMO_PASSWORD);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('новый файл встаёт в конец и перезапускает обработку; HTML помечается устаревшим', async () => {
    const before = await listFiles('c_nf');
    const added = await uploadFile('c_nf', new File(['# Дополнение'], 'extra.md'), noProgress);
    const after = await listFiles('c_nf');
    expect(added.position).toBe(before.length + 1);
    expect(after.at(-1)?.fileName).toBe('extra.md');
    const conspect = await getConspect('c_nf');
    expect(conspect.htmlOutdated).toBe(true);
    expect(conspect.stages.find((s) => s.type === 'render')?.status).toBe('queued');
  });

  it('удаление изображения убирает и его распознанный текст, позиции идут подряд', async () => {
    await deleteFile('f_join_p1');
    const files = await listFiles('c_join');
    expect(files.map((f) => f.fileName)).toEqual(['photo2.jpg', 'photo2.txt']);
    expect(files.map((f) => f.position)).toEqual([1, 2]);
  });

  it('последний файл удалить нельзя', async () => {
    await expect(deleteFile('f_idx_txt')).rejects.toMatchObject({ message: LAST_FILE_MESSAGE });
  });

  it('запущенный этап проходит очередь и выполнение, а HTML появляется', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    await startStage('c_idx', 'render');
    expect(await statusOf('c_idx', 'render')).toBe('queued');
    vi.advanceTimersByTime(QUEUED_MS);
    expect(await statusOf('c_idx', 'render')).toBe('running');
    vi.advanceTimersByTime(RUNNING_MS);
    expect(await statusOf('c_idx', 'render')).toBe('done');
    expect(await getHtml('c_idx')).toContain('Индексы');
  });

  it('распознавание добавляет текстовый файл сразу после изображения', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    await startStage('c_intu', 'ocr');
    vi.advanceTimersByTime(QUEUED_MS + RUNNING_MS);
    await getConspect('c_intu');
    const files = await listFiles('c_intu');
    expect(files.map((f) => f.fileName)).toEqual(['lecture-03.jpg', 'lecture-03.txt']);
    expect(files[1].ocrSourceFileId).toBe(files[0].id);
  });
});
