import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from '../api/client';

export type AsyncState<T> =
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: string };

/**
 * Загружает данные через функцию API. `load` должна быть стабильной
 * (функция модуля или useCallback) — при её смене данные загрузятся заново.
 * reload() перезапрашивает данные, не сбрасывая уже показанные.
 */
export function useAsync<T>(load: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    load().then(
      (data) => active && setState({ status: 'success', data }),
      (error: unknown) => active && setState({ status: 'error', error: errorMessage(error) }),
    );
    return () => {
      active = false;
    };
  }, [load, version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  return { ...state, reload };
}
