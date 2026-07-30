import { apiRequest } from '@/features/auth/server/api';
import { NextResponse } from 'next/server';
import { forwardJson, requireAccessToken, withErrorHandling } from '@/lib/bff';

export const GET = withErrorHandling(
  async (
    _: Request,
    { params }: RouteContext<'/api/users/[userId]/lists/[listId]'>,
  ) => {
    const { userId, listId } = await params;
    const accessToken = await requireAccessToken();

    const apiResponse = await apiRequest(`/users/${userId}/lists/${listId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);

export const PATCH = withErrorHandling(
  async (
    request: Request,
    { params }: RouteContext<'/api/users/[userId]/lists/[listId]'>,
  ) => {
    const { userId, listId } = await params;
    const accessToken = await requireAccessToken();
    const body = await request.json();

    const apiResponse = await apiRequest(`/users/${userId}/lists/${listId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);

export const DELETE = withErrorHandling(
  async (
    _: Request,
    { params }: RouteContext<'/api/users/[userId]/lists/[listId]'>,
  ) => {
    const { userId, listId } = await params;
    const accessToken = await requireAccessToken();

    const apiResponse = await apiRequest(`/users/${userId}/lists/${listId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'DELETE',
    });

    // Success (204) has no body to parse. On failure, forwardJson throws
    // with the upstream's real status/message instead of losing it.
    if (!apiResponse.ok) await forwardJson(apiResponse);
    return new NextResponse(null, { status: apiResponse.status });
  },
);
