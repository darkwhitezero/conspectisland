import Markdown from 'react-markdown';
import styles from './MarkdownView.module.css';

/**
 * Markdown как форматированный текст. Встроенный HTML не выполняется:
 * react-markdown без rehype-raw выводит его как обычный текст, а опасные
 * адреса (javascript:) отбрасывает.
 */
export function MarkdownView({ source }: { source: string }) {
  return (
    <div className={styles.markdown}>
      <Markdown>{source}</Markdown>
    </div>
  );
}
