import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';
import { forwardJson, withErrorHandling } from '@/lib/bff';

interface VerifyResult {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();

  const apiResponse = await apiRequest('/auth/verify', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const result = await forwardJson<VerifyResult>(apiResponse);

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
