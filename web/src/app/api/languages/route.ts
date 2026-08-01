import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';
import { forwardJson, requireAccessToken, withErrorHandling } from '@/lib/bff';

export const GET = withErrorHandling(async (request: Request) => {
  const accessToken = await requireAccessToken();

  const q = new URL(request.url).searchParams.get('q');
  const searchParams = new URLSearchParams();
  if (q) searchParams.set('q', q);

  const apiResponse = await apiRequest(
    `/languages${searchParams.size ? `?${searchParams}` : ''}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  const result = await forwardJson(apiResponse);
  return NextResponse.json(result, { status: apiResponse.status });
});

export const POST = withErrorHandling(async (request: Request) => {
  const accessToken = await requireAccessToken();
  const payload = await request.json();

  const apiResponse = await apiRequest('/languages/translation', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });

  const result = await forwardJson(apiResponse);
  return NextResponse.json(result, { status: apiResponse.status });
});
