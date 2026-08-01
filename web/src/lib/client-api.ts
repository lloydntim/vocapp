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

export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : 'Something went wrong. Please try again.';
}

async function resolveBaseUrl(): Promise<string> {
  if (typeof window !== 'undefined') return '';
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forward-proto') ?? 'http';

  return `${protocol}://${host}`;
}

async function resolveCookieHeader(): Promise<string | undefined> {
  if (typeof window !== 'undefined') return '';
  const { headers } = await import('next/headers');
  const headersList = await headers();

  return headersList.get('cookie') ?? undefined;
}

export async function rawFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const baseUrl = await resolveBaseUrl();
  const cookieHeader = await resolveCookieHeader();

  return fetch(`${baseUrl}/api${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(options?.headers || {}),
    },
  });
}

let refreshPromise: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  refreshPromise ??= rawFetch('/auth/refresh', { method: 'POST' })
    .then((res) => res.ok)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export async function clientApi<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const response = await rawFetch(path, options);

  if (response.status === 401 && !isRetry && !path.startsWith('/auth/')) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return await clientApi<T>(path, options, true);
    }
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = result?.message || 'An error occurred';

    throw new ApiError(errorMessage, response.status, result?.code);
  }
  return result as T;
}
