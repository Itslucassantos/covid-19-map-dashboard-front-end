import type { ApiErrorCode } from './types';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

export class ApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly status: number,
    readonly requestId?: string,
  ) {
    super(code);
  }
}

export async function http<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError('NETWORK_ERROR', 0);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      body?.error?.code ?? 'INTERNAL_ERROR',
      response.status,
      body?.error?.requestId,
    );
  }
  return response.json() as Promise<T>;
}
