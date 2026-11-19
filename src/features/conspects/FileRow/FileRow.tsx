import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { Menu } from '../../../components/Menu';
import type { ConspectFile } from '../../../types';
import { formatFileSize } from '../../../utils/format';
import { FILE_TYPE_LABELS } from '../../../utils/labels';
import styles from './FileRow.module.css';

interface FileRowProps {
  file: ConspectFile;
  /** Изображение, из которого распознан этот текст */
  ocrSource?: ConspectFile;
  canEdit: boolean;
  onOpen: () => void;
  onDownload: () => void;
  onReplace: () => void;
  onDelete: () => void;
}

export function FileRow({ file, ocrSource, canEdit, onOpen, onDownload, onReplace, onDelete }: FileRowProps) {
  return (
    <li className={[styles.row, ocrSource && styles.recognized].filter(Boolean).join(' ')}>
      <div className={styles.info}>
        <span className={styles.name}>{file.fileName}</span>
        <span className={styles.meta}>
          {FILE_TYPE_LABELS[file.mimeType]} · {formatFileSize(file.sizeBytes)}
          {ocrSource && ` · распознан из ${ocrSource.fileName}`}
        </span>
      </div>
      <div className={styles.actions}>
        <Button variant="ghost" size="sm" onClick={onOpen} aria-label={`Открыть ${file.fileName}`}>
          Открыть
        </Button>
        <Button variant="ghost" size="sm" onClick={onDownload} aria-label={`Скачать ${file.fileName}`}>
          Скачать
        </Button>
        {canEdit && (
          <Menu
            trigger={<Icon name="more" />}
            triggerLabel={`Другие действия с файлом ${file.fileName}`}
            items={[
              { label: 'Заменить', onSelect: onReplace },
              { label: 'Удалить', onSelect: onDelete, tone: 'danger' },
            ]}
          />
        )}
      </div>
    </li>
  );
}
