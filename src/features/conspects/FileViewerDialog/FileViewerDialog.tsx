import { lazy, Suspense, useCallback } from 'react';
import { getFileContent } from '../../../api/files';
import { Alert } from '../../../components/Alert';
import { Dialog } from '../../../components/Dialog';
import { Spinner } from '../../../components/Spinner';
import type { ConspectFile } from '../../../types';
import { useAsync } from '../../../utils/useAsync';
import styles from './FileViewerDialog.module.css';

// Парсер Markdown нужен только при открытии MD-файла — грузим его отдельным чанком.
const MarkdownView = lazy(() => import('../MarkdownView').then((module) => ({ default: module.MarkdownView })));

function Loading() {
  return (
    <div className={styles.loading}>
      <Spinner />
    </div>
  );
}

interface FileViewerDialogProps {
  file: ConspectFile | null;
  onClose: () => void;
}

/** Просмотр исходного файла: TXT — текстом, MD — форматированно, изображение — картинкой. */
export function FileViewerDialog({ file, onClose }: FileViewerDialogProps) {
  return (
    <Dialog open={file !== null} onClose={onClose} title={file?.fileName ?? ''} size="wide">
      {file && <FileContentView file={file} />}
    </Dialog>
  );
}

function FileContentView({ file }: { file: ConspectFile }) {
  const load = useCallback(() => getFileContent(file.id), [file.id]);
  const { status, data: content, error } = useAsync(load);

  if (status === 'loading') return <Loading />;
  if (status === 'error') return <Alert>{error}</Alert>;
  if (content.kind === 'image') return <img className={styles.image} src={content.url} alt={file.fileName} />;
  if (content.mimeType === 'text/markdown') {
    return (
      <Suspense fallback={<Loading />}>
        <MarkdownView source={content.text} />
      </Suspense>
    );
  }
  return <pre className={styles.text}>{content.text}</pre>;
}
