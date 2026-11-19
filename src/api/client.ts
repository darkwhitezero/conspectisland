// Общая инфраструктура API. Сейчас функции работают с моками;
// при подключении REST сюда переедет обёртка над fetch.

export type ApiErrorCode =
  | 'invalid_credentials'
  | 'invalid_password'
  | 'login_taken'
  | 'unauthorized'
  | 'not_found'
  | 'forbidden';

export class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Текст для показа пользователю: сообщение API или общее. */
export function errorMessage(error: unknown, fallback = 'Что-то пошло не так. Попробуйте ещё раз'): string {
  return isApiError(error) ? error.message : fallback;
}

/** Имитация сетевой задержки, чтобы были видны состояния загрузки. */
export const MOCK_LATENCY_MS = 300;

export function delay(ms = MOCK_LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
