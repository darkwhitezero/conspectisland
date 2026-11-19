import type { Conspect } from '../../../types';
import { ConspectListItem } from '../ConspectListItem';
import styles from './ConspectList.module.css';

export function ConspectList({ conspects }: { conspects: Conspect[] }) {
  return (
    <ul className={styles.list}>
      {conspects.map((conspect) => (
        <ConspectListItem key={conspect.id} conspect={conspect} />
      ))}
    </ul>
  );
}
