import { useId, useState } from 'react';
import { startStage } from '../../../api/conspects';
import { errorMessage } from '../../../api/client';
import type { Conspect, StageType } from '../../../types';
import { STAGE_ORDER } from '../../../utils/labels';
import { StageRow } from '../StageRow';
import styles from './StagesPanel.module.css';

interface StagesPanelProps {
  conspect: Conspect;
  canRun: boolean;
  onChanged: () => void;
  onError: (message: string) => void;
}

/** Блок «Этапы обработки»: три статуса и запуск для редактора и владельца. */
export function StagesPanel({ conspect, canRun, onChanged, onError }: StagesPanelProps) {
  const titleId = useId();
  const [starting, setStarting] = useState<StageType | null>(null);
  const stages = STAGE_ORDER.map((type) => conspect.stages.find((s) => s.type === type)).filter((s) => s !== undefined);

  const handleStart = async (type: StageType) => {
    setStarting(type);
    try {
      await startStage(conspect.id, type);
      onChanged();
    } catch (error) {
      onError(errorMessage(error));
    } finally {
      setStarting(null);
    }
  };

  return (
    <section className={styles.panel} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.title}>
        Этапы обработки
      </h2>
      <ul className={styles.list}>
        {stages.map((stage) => (
          <StageRow
            key={stage.type}
            stage={stage}
            canRun={canRun}
            starting={starting === stage.type}
            onStart={() => handleStart(stage.type)}
          />
        ))}
      </ul>
    </section>
  );
}
