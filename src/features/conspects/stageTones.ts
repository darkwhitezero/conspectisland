import type { BadgeTone } from '../../components/Badge';
import type { StageStatus } from '../../types';

/** Цвет бейджа статуса этапа: «Готово» — зелёный, «Ошибка» — красный и т. д. */
export const STAGE_STATUS_TONES: Record<StageStatus, BadgeTone> = {
  not_requested: 'neutral',
  queued: 'info',
  running: 'info',
  done: 'success',
  failed: 'danger',
};
