import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function POST() {
  const refreshToken = (await cookies()).get('refreshToken')?.value;

  // Logout must clear the browser's cookies even if the upstream call fails
  // (e.g. the API is unreachable) — the user should never be stuck "logged
  // in" locally just because the server-side session couldn't be revoked.
  // So this deliberately doesn't use withErrorHandling/forwardJson: those
  // would short-circuit before the cookies are cleared below.
  let apiResponse: Response | null = null;
  let result: unknown = { message: 'Logged out' };

  try {
    apiResponse = await apiRequest('/auth/logout', {
      method: 'POST',
      headers: refreshToken ? { Cookie: `refreshToken=${refreshToken}` } : {},
    });
    result = await apiResponse.json().catch(() => result);
  } catch (error) {
    console.error('[bff] logout: failed to reach upstream API:', error);
  }

  const response = NextResponse.json(result, {
    status: apiResponse?.status ?? 200,
  });

  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');

  return response;
}
