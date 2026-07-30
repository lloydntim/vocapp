import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export class UpstreamError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'UpstreamError';
  }
}

export async function requireAccessToken(): Promise<string> {
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    throw new UpstreamError('Unauthenticated', 401);
  }

  return accessToken;
}

export async function forwardJson<T = unknown>(
  apiResponse: Response,
): Promise<T> {
  const result = await apiResponse.json().catch(() => null);

  if (!apiResponse.ok) {
    throw new UpstreamError(
      result?.message ?? 'Upstream request failed',
      apiResponse.status,
      result?.code,
    );
  }

  return result as T;
}

export function withErrorHandling<Context>(
  handler: (request: Request, context: Context) => Promise<NextResponse>,
) {
  return async (request: Request, context: Context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof UpstreamError) {
        return NextResponse.json(
          { message: error.message, ...(error.code ? { code: error.code } : {}) },
          { status: error.status },
        );
      }

      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { message: 'Invalid request body' },
          { status: 400 },
        );
      }

      console.error('[bff] unhandled route error:', error);

      return NextResponse.json(
        { message: 'Something went wrong. Please try again.' },
        { status: 502 },
      );
    }
  };
}
