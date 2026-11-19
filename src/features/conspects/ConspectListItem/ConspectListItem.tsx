import { Link } from 'react-router-dom';
import type { Conspect } from '../../../types';
import { formatDateTime } from '../../../utils/format';
import { StageBadges } from '../StageBadges';
import styles from './ConspectListItem.module.css';

export function ConspectListItem({ conspect }: { conspect: Conspect }) {
  return (
    <li className={styles.item}>
      <div className={styles.main}>
        <h2 className={styles.name}>
          <Link className={styles.link} to={`/projects/${conspect.projectId}/conspects/${conspect.id}`}>
            {conspect.name}
          </Link>
        </h2>
        <span className={styles.date}>
          Создан <time dateTime={conspect.createdAt}>{formatDateTime(conspect.createdAt)}</time>
        </span>
      </div>
      <StageBadges stages={conspect.stages} />
    </li>
  );
}
