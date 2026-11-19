import { useCallback, useSyncExternalStore } from 'react';

/** Совпадает ли медиа-запрос прямо сейчас; обновляется при изменении окна. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}

/** = --bp-nav из tokens.css */
export const WIDE_NAV_QUERY = '(min-width: 768px)';
