import { useId, useRef, useState, type ChangeEvent } from 'react';
import { errorMessage } from '../../../api/client';
import { deleteFile, getFileBlob, LAST_FILE_MESSAGE, replaceFile, uploadFile } from '../../../api/files';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Icon } from '../../../components/Icon';
import { ProgressBar } from '../../../components/ProgressBar';
import type { ConspectFile } from '../../../types';
import { saveBlob } from '../../../utils/download';
import { SOURCE_FILE_RULES, validateSourceFile } from '../../../utils/validation';
import { FileRow } from '../FileRow';
import { FileViewerDialog } from '../FileViewerDialog';
import styles from './FilesPanel.module.css';

interface FilesPanelProps {
  conspectId: string;
  files: ConspectFile[];
  canEdit: boolean;
  onChanged: () => void;
  /** Ошибка операции — показывается вверху экрана */
  onError: (message: string) => void;
}

/** «Исходные файлы»: список в порядке position, просмотр, скачивание и правка. */
export function FilesPanel({ conspectId, files, canEdit, onChanged, onError }: FilesPanelProps) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  // Для чего открыт выбор файла: добавить в конец или заменить существующий.
  const [pickTarget, setPickTarget] = useState<'add' | ConspectFile>('add');
  const [upload, setUpload] = useState<{ fileName: string; percent: number } | null>(null);
  const [rejected, setRejected] = useState<string | null>(null);
  const [viewing, setViewing] = useState<ConspectFile | null>(null);
  const [deleting, setDeleting] = useState<ConspectFile | null>(null);

  const byId = new Map(files.map((f) => [f.id, f]));
  const recognizedFrom = (image: ConspectFile) => files.find((f) => f.ocrSourceFileId === image.id);

  const pick = (target: 'add' | ConspectFile) => {
    setPickTarget(target);
    setRejected(null);
    inputRef.current?.click();
  };

  const handlePicked = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // тот же файл можно выбрать снова
    if (!file) return;
    const reason = await validateSourceFile(file);
    if (reason) {
      setRejected(`${file.name}: ${reason}`);
      return;
    }
    const onProgress = (percent: number) => setUpload({ fileName: file.name, percent });
    onProgress(0);
    try {
      if (pickTarget === 'add') await uploadFile(conspectId, file, onProgress);
      else await replaceFile(pickTarget.id, file, onProgress);
      onChanged();
    } catch (error) {
      onError(errorMessage(error));
    } finally {
      setUpload(null);
    }
  };

  const handleDownload = async (file: ConspectFile) => {
    try {
      saveBlob(await getFileBlob(file.id), file.fileName);
    } catch (error) {
      onError(errorMessage(error));
    }
  };

  const askDelete = (file: ConspectFile) => {
    // Вместе с изображением уходит его распознанный текст — не должно остаться пусто.
    const removed = 1 + (recognizedFrom(file) ? 1 : 0);
    if (files.length <= removed) onError(LAST_FILE_MESSAGE);
    else setDeleting(file);
  };

  return (
    <section className={styles.panel} aria-labelledby={titleId}>
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          Исходные файлы
        </h2>
        {canEdit && (
          <Button variant="secondary" size="sm" onClick={() => pick('add')} disabled={upload !== null}>
            <Icon name="upload" />
            Добавить файл
          </Button>
        )}
      </div>

      {rejected && <Alert>{rejected}</Alert>}
      {upload && <ProgressBar label={`Загрузка ${upload.fileName}`} value={upload.percent} />}

      <ul className={styles.list}>
        {files.map((file) => (
          <FileRow
            key={file.id}
            file={file}
            ocrSource={file.ocrSourceFileId ? byId.get(file.ocrSourceFileId) : undefined}
            canEdit={canEdit}
            onOpen={() => setViewing(file)}
            onDownload={() => handleDownload(file)}
            onReplace={() => pick(file)}
            onDelete={() => askDelete(file)}
          />
        ))}
      </ul>

      <input
        ref={inputRef}
        type="file"
        className="visually-hidden"
        accept={SOURCE_FILE_RULES.accept}
        tabIndex={-1}
        aria-hidden="true"
        onChange={handlePicked}
      />

      <FileViewerDialog file={viewing} onClose={() => setViewing(null)} />

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Удалить файл?"
        confirmLabel="Удалить файл"
        danger
        onConfirm={async () => {
          if (!deleting) return;
          await deleteFile(deleting.id);
          setDeleting(null);
          onChanged();
        }}
      >
        <p>Файл «{deleting?.fileName}» будет удалён из конспекта.</p>
        {deleting && recognizedFrom(deleting) && (
          <p>Вместе с ним удалится распознанный текст «{recognizedFrom(deleting)?.fileName}».</p>
        )}
      </ConfirmDialog>
    </section>
  );
}
