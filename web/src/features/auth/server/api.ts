import 'server-only';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`;

  return fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
}
