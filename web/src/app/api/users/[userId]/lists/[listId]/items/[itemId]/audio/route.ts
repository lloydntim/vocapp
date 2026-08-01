import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';
import { forwardJson, requireAccessToken, withErrorHandling } from '@/lib/bff';

export const GET = withErrorHandling(
  async (
    request: Request,
    {
      params,
    }: RouteContext<'/api/users/[userId]/lists/[listId]/items/[itemId]/audio'>,
  ) => {
    const { userId, listId, itemId } = await params;
    const accessToken = await requireAccessToken();
    const field = new URL(request.url).searchParams.get('field');

    const apiResponse = await apiRequest(
      `/users/${userId}/lists/${listId}/items/${itemId}/audio?field=${field}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const result = await forwardJson(apiResponse);
    return NextResponse.json(result, { status: apiResponse.status });
  },
);
