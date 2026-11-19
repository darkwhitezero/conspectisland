import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownView.module.css';

// Таблицы, зачёркивание, списки задач и автоссылки (GitHub Flavored Markdown).
const PLUGINS = [remarkGfm];

/**
 * Markdown как форматированный текст. Встроенный HTML не выполняется:
 * react-markdown без rehype-raw выводит его как обычный текст, а опасные
 * адреса (javascript:) отбрасывает.
 */
export function MarkdownView({ source }: { source: string }) {
  return (
    <div className={styles.markdown}>
      <Markdown remarkPlugins={PLUGINS}>{source}</Markdown>
    </div>
  );
}
