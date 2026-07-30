import { apiRequest } from '@/features/auth/server/api';
import { NextResponse } from 'next/server';
import { forwardJson, requireAccessToken, withErrorHandling } from '@/lib/bff';

export const POST = withErrorHandling(
  async (
    request: Request,
    {
      params,
    }: RouteContext<'/api/users/[userId]/lists/[listId]/sessions/[sessionId]/results/batch'>,
  ) => {
    const { userId, listId, sessionId } = await params;
    const accessToken = await requireAccessToken();
    const body = await request.json();

    const apiResponse = await apiRequest(
      `/users/${userId}/lists/${listId}/sessions/${sessionId}/results/batch`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      },
    );

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);
