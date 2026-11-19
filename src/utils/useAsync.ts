import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from '../api/client';

export type AsyncState<T> =
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: string };

const LOADING = { status: 'loading' } as const;

/**
 * Загружает данные через функцию API. `load` должна быть стабильной
 * (функция модуля или useCallback): при её смене — например, при переходе
 * в другой проект — старые данные сразу скрываются и грузятся новые.
 * reload() перезапрашивает данные, не сбрасывая уже показанные.
 */
export function useAsync<T>(load: () => Promise<T>) {
  const [result, setResult] = useState<{ load: typeof load; state: AsyncState<T> }>({ load, state: LOADING });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    load().then(
      (data) => active && setResult({ load, state: { status: 'success', data } }),
      (error: unknown) => active && setResult({ load, state: { status: 'error', error: errorMessage(error) } }),
    );
    return () => {
      active = false;
    };
  }, [load, version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  // Результат относится к прежнему запросу — считаем, что идёт загрузка.
  const state: AsyncState<T> = result.load === load ? result.state : LOADING;
  return { ...state, reload };
}
