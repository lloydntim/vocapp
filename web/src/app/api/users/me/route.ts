import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';
import { forwardJson, requireAccessToken, withErrorHandling } from '@/lib/bff';

export const GET = withErrorHandling(async () => {
  const accessToken = await requireAccessToken();

  const apiResponse = await apiRequest('/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await forwardJson(apiResponse);
  return NextResponse.json(result, { status: apiResponse.status });
});
