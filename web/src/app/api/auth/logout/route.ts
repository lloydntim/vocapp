import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function POST() {
  const refreshToken = (await cookies()).get('refreshToken')?.value;

  const apiResponse = await apiRequest('/auth/logout', {
    method: 'POST',
    headers: refreshToken ? { Cookie: `refreshToken=${refreshToken}` } : {},
  });

  const result = await apiResponse.json();

  const response = NextResponse.json(result, { status: apiResponse.status });

  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');

  return response;
}
