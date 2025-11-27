export function createApiErrorResponse<T = unknown>(
  error: unknown
): {
  data: T | null
  errorCode: number
  errorMessage: string
} {
  const err = error as {
    errorCode?: number
    message?: string
    errorMessage?: string
  }

  return {
    data: null,
    errorCode: err.errorCode ?? 1,
    errorMessage: err.message || err.errorMessage || '',
  }
}
