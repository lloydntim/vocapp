import { apiRequest } from '@/features/auth/server/api';
import { NextResponse } from 'next/server';
import { forwardJson, requireAccessToken, withErrorHandling } from '@/lib/bff';

export const PATCH = withErrorHandling(
  async (
    request: Request,
    {
      params,
    }: RouteContext<'/api/users/[userId]/lists/[listId]/items/[itemId]/status'>,
  ) => {
    const { userId, listId, itemId } = await params;
    const accessToken = await requireAccessToken();
    const body = await request.json();

    const apiResponse = await apiRequest(
      `/users/${userId}/lists/${listId}/items/${itemId}/status`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
        method: 'PATCH',
      },
    );

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);
