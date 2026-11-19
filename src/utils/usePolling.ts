import { useEffect, useRef } from 'react';

/** Каждые intervalMs вызывает callback, пока enabled. Пауза, когда вкладка скрыта. */
export function usePolling(callback: () => void, intervalMs: number, enabled: boolean) {
  const latest = useRef(callback);

  useEffect(() => {
    latest.current = callback;
  });

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') latest.current();
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, enabled]);
}
