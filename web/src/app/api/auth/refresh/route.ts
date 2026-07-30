import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiRequest } from '@/features/auth/server/api';
import { forwardJson, UpstreamError, withErrorHandling } from '@/lib/bff';

interface RefreshResult {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export const POST = withErrorHandling(async () => {
  const refreshToken = (await cookies()).get('refreshToken')?.value;

  if (!refreshToken) {
    throw new UpstreamError('No refresh token', 401);
  }

  const apiResponse = await apiRequest('/auth/refresh', {
    method: 'POST',
    headers: { Cookie: `refreshToken=${refreshToken}` },
  });

  const result = await forwardJson<RefreshResult>(apiResponse);

  const response = NextResponse.json({ message: result.message });

  response.cookies.set('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 2 * 60,
  });

  response.cookies.set('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
});
