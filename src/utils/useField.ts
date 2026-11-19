import { useRef, useState, type ChangeEvent } from 'react';

type Validator = (value: string) => string | null;

/**
 * Состояние одного текстового поля формы.
 * Ошибка появляется после ухода с поля или отправки формы, а пока
 * пользователь печатает, только исчезает — без «крика» на каждую букву.
 */
export function useField(validate: Validator, initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setValue(next);
    if (error && validate(next) === null) setError(null);
  };

  const onBlur = () => {
    if (value !== '') setError(validate(value));
  };

  /** Проверить при отправке; возвращает true, если поле корректно. */
  const check = () => {
    const result = validate(value);
    setError(result);
    return result === null;
  };

  return {
    value,
    setError,
    check,
    focus: () => ref.current?.focus(),
    inputProps: { value, onChange, onBlur, ref, error: error ?? undefined },
  };
}

export type Field = ReturnType<typeof useField>;

/** Проверяет все поля и ставит фокус на первое ошибочное. */
export function checkFields(fields: Field[]): boolean {
  const invalid = fields.filter((field) => !field.check());
  invalid[0]?.focus();
  return invalid.length === 0;
}
