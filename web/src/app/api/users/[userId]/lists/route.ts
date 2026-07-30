import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';
import { forwardJson, requireAccessToken, withErrorHandling } from '@/lib/bff';

export const GET = withErrorHandling(
  async (
    _: Request,
    { params }: RouteContext<'/api/users/[userId]/lists'>,
  ) => {
    const { userId } = await params;
    const accessToken = await requireAccessToken();

    const apiResponse = await apiRequest(`/users/${userId}/lists`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);

export const POST = withErrorHandling(
  async (
    request: Request,
    { params }: RouteContext<'/api/users/[userId]/lists'>,
  ) => {
    const { userId } = await params;
    const accessToken = await requireAccessToken();
    const body = await request.json();

    const apiResponse = await apiRequest(`/users/${userId}/lists`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    });

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);
