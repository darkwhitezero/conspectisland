import { useCallback } from 'react';
import { getHtml } from '../../../api/files';
import { Alert } from '../../../components/Alert';
import { Spinner } from '../../../components/Spinner';
import type { Conspect } from '../../../types';
import { useAsync } from '../../../utils/useAsync';
import styles from './HtmlView.module.css';

/**
 * HTML-представление в изолированном <iframe sandbox>: пустой sandbox
 * запрещает скрипты, формы и доступ к нашей странице, а MathML
 * браузер рисует сам. Только просмотр — редактировать нельзя.
 * Когда готово новое HTML, страница меняет key — компонент грузит его заново.
 */
export function HtmlView({ conspect }: { conspect: Conspect }) {
  const load = useCallback(() => getHtml(conspect.id), [conspect.id]);
  const { status, data: html, error } = useAsync(load);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    );
  }
  if (status === 'error') return <Alert>{error}</Alert>;

  return (
    <iframe
      className={styles.frame}
      title={`HTML-представление: ${conspect.name}`}
      sandbox=""
      referrerPolicy="no-referrer"
      srcDoc={html}
    />
  );
}
