import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function POST(request: Request) {
  const body = await request.json();

  const apiResponse = await apiRequest('/auth/verify', {
    method: 'POST',
    body: JSON.stringify(body),
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
