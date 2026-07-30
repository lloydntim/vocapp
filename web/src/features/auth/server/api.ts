import { UpstreamError } from '@/lib/bff';
import 'server-only';

const DEFAULT_TIMEOUT_MS = 8000;
const API_URL = process.env.API_URL;

export async function apiRequest(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`;

  try {
    // await is required here: without it, a rejected fetch() promise would
    // be returned instead of thrown, and this catch block would never run.
    return await fetch(url, {
      ...options,
      cache: 'no-store',
      signal: options.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
  } catch {
    throw new UpstreamError('Unable to reach the API', 502);
  }
}
