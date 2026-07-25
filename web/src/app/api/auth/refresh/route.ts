import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiRequest } from '@/features/auth/server/api';

export async function POST(request: Request) {
  const refreshToken = (await cookies()).get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  const apiResponse = await apiRequest('/auth/refresh', {
    method: 'POST',
    headers: { Cookie: `refreshToken=${refreshToken}` },
  });

  const result = await apiResponse.json();

  if (!apiResponse.ok) {
    return NextResponse.json(result, { status: apiResponse.status });
  }

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
}
