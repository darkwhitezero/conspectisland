import { useId, useRef, useState } from 'react';
import { Button } from '../../../components/Button';
import styles from './InviteLinkField.module.css';

const COPIED_VISIBLE_MS = 2000;

/** Ссылка-приглашение только для чтения и кнопка «Скопировать». */
export function InviteLinkField({ link }: { link: string }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setMessage('Ссылка скопирована');
      setTimeout(() => setMessage(''), COPIED_VISIBLE_MS);
    } catch {
      // Буфер недоступен (нет разрешения) — выделяем ссылку для ручного копирования.
      inputRef.current?.select();
      setMessage('Не удалось скопировать автоматически — ссылка выделена, нажмите Ctrl+C');
    }
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        Ссылка-приглашение
      </label>
      <div className={styles.row}>
        <input
          ref={inputRef}
          id={id}
          className={styles.input}
          value={link}
          readOnly
          onFocus={(event) => event.target.select()}
        />
        <Button variant="secondary" onClick={copy}>
          Скопировать
        </Button>
      </div>
      {/* Сообщение озвучивается дикторами без переноса фокуса */}
      <p className={styles.status} role="status">
        {message}
      </p>
    </div>
  );
}
