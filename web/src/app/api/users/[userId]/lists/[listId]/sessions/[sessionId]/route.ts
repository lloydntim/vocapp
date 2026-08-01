import { apiRequest } from '@/features/auth/server/api';
import { NextResponse } from 'next/server';
import { forwardJson, requireAccessToken, withErrorHandling } from '@/lib/bff';

export const GET = withErrorHandling(
  async (
    _: Request,
    {
      params,
    }: RouteContext<'/api/users/[userId]/lists/[listId]/sessions/[sessionId]'>,
  ) => {
    const { userId, listId, sessionId } = await params;
    const accessToken = await requireAccessToken();

    const apiResponse = await apiRequest(
      `/users/${userId}/lists/${listId}/sessions/${sessionId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);

export const PATCH = withErrorHandling(
  async (
    request: Request,
    {
      params,
    }: RouteContext<'/api/users/[userId]/lists/[listId]/sessions/[sessionId]'>,
  ) => {
    const { userId, listId, sessionId } = await params;
    const accessToken = await requireAccessToken();
    const body = await request.json();
    const idempotencyKey = request.headers.get('idempotency-key');

    const apiResponse = await apiRequest(
      `/users/${userId}/lists/${listId}/sessions/${sessionId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
        },
        body: JSON.stringify(body),
      },
    );

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);
