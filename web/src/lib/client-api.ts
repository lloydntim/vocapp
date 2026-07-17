export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function clientApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = result?.message || 'An error occurred';

    throw new ApiError(errorMessage, response.status, result?.code);
  }
  return result as T;
}
