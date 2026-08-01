import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';
import { forwardJson, withErrorHandling } from '@/lib/bff';

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();

  const apiResponse = await apiRequest('/auth/resetpassword', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const result = await forwardJson(apiResponse);
  return NextResponse.json(result, { status: apiResponse.status });
});
