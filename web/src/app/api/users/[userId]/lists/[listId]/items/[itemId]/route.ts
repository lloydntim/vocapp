import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';
import { forwardJson, requireAccessToken, withErrorHandling } from '@/lib/bff';

export const GET = withErrorHandling(
  async (
    _: Request,
    {
      params,
    }: RouteContext<'/api/users/[userId]/lists/[listId]/items/[itemId]'>,
  ) => {
    const { userId, listId, itemId } = await params;
    const accessToken = await requireAccessToken();

    const apiResponse = await apiRequest(
      `/users/${userId}/lists/${listId}/items/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
    }: RouteContext<'/api/users/[userId]/lists/[listId]/items/[itemId]'>,
  ) => {
    const { userId, listId, itemId } = await params;
    const accessToken = await requireAccessToken();
    const body = await request.json();

    // `body` must go in the fetch options, not inside `headers` — and the
    // header name is case-sensitively `Authorization`, not `AUTHORIZATION`.
    const apiResponse = await apiRequest(
      `/users/${userId}/lists/${listId}/items/${itemId}/status`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);

export const DELETE = withErrorHandling(
  async (
    _: Request,
    {
      params,
    }: RouteContext<'/api/users/[userId]/lists/[listId]/items/[itemId]'>,
  ) => {
    const { userId, listId, itemId } = await params;
    const accessToken = await requireAccessToken();

    const apiResponse = await apiRequest(
      `/users/${userId}/lists/${listId}/items/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'DELETE',
      },
    );

    if (!apiResponse.ok) await forwardJson(apiResponse);
    return new NextResponse(null, { status: apiResponse.status });
  },
);
