// web/src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function POST(request: Request) {
  const credentials = await request.json();

  const apiResponse = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const result = await apiResponse.json();

  if (!apiResponse.ok) {
    return NextResponse.json(result, { status: apiResponse.status });
  }

  const response = NextResponse.json({
    message: result.message,
    user: result.data,
  });

  response.cookies.set('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 2 * 60,
  });

  /*
   * See the API adjustment in the next section for refreshToken.
   */
  response.cookies.set('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
