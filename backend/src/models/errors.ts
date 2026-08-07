export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EXTRACTION_ERROR = 'EXTRACTION_ERROR',
  STRUCTURING_ERROR = 'STRUCTURING_ERROR',
  EMBEDDING_ERROR = 'EMBEDDING_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  SEARCH_ERROR = 'SEARCH_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(code: ErrorCode, message: string, status = 500, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

export function validationError(message: string, details?: Record<string, unknown>): AppError {
  return new AppError(ErrorCode.VALIDATION_ERROR, message, 400, details);
}
