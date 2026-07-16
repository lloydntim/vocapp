import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function POST(request: Response) {
  const credentials = await request.json();

  const apiResponse = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const result = await apiResponse.json();

  if (!apiResponse.ok) {
    return NextResponse.json(result, { status: apiResponse.status });
  }

  const { message, data: user, accessToken, refreshToken } = result;
  const response = NextResponse.json({ message, user });

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 2 * 60, // 2 minutes
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 2 * 60, // 2 minutes
  });

  return response;
}
