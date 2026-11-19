import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import type { ProcessingStage } from '../../../types';
import { STAGE_LABELS, STAGE_STATUS_LABELS } from '../../../utils/labels';
import { STAGE_STATUS_TONES } from '../stageTones';
import styles from './StageRow.module.css';

interface StageRowProps {
  stage: ProcessingStage;
  /** Редактор и владелец: кнопки запуска и текст ошибки */
  canRun: boolean;
  starting: boolean;
  onStart: () => void;
}

export function StageRow({ stage, canRun, starting, onStart }: StageRowProps) {
  const actionLabel =
    stage.status === 'not_requested' ? 'Запустить' : stage.status === 'failed' ? 'Запустить повторно' : null;

  return (
    <li className={styles.row}>
      <div className={styles.main}>
        <span className={styles.name}>{STAGE_LABELS[stage.type]}</span>
        <Badge tone={STAGE_STATUS_TONES[stage.status]}>{STAGE_STATUS_LABELS[stage.status]}</Badge>
      </div>
      {canRun && stage.status === 'failed' && stage.errorMessage && (
        <p className={styles.error}>{stage.errorMessage}</p>
      )}
      {canRun && actionLabel && (
        <Button variant="secondary" size="sm" className={styles.action} loading={starting} onClick={onStart}>
          {actionLabel}
        </Button>
      )}
    </li>
  );
}
