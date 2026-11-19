import { Badge } from '../../../components/Badge';
import type { ProcessingStage } from '../../../types';
import { STAGE_LABELS, STAGE_ORDER, STAGE_STATUS_LABELS } from '../../../utils/labels';
import { STAGE_STATUS_TONES } from '../stageTones';
import styles from './StageBadges.module.css';

/** Компактная сводка трёх этапов обработки: «Этап — статус». */
export function StageBadges({ stages }: { stages: ProcessingStage[] }) {
  const byType = new Map(stages.map((stage) => [stage.type, stage]));

  return (
    <ul className={styles.stages} aria-label="Этапы обработки">
      {STAGE_ORDER.map((type) => {
        const status = byType.get(type)?.status ?? 'not_requested';
        return (
          <li key={type} className={styles.stage}>
            <span className={styles.name}>{STAGE_LABELS[type]}</span>
            <Badge tone={STAGE_STATUS_TONES[status]}>{STAGE_STATUS_LABELS[status]}</Badge>
          </li>
        );
      })}
    </ul>
  );
}
