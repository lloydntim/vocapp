import { apiRequest } from '@/features/auth/server/api';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  {
    params,
  }: RouteContext<'/api/users/[userId]/lists/[listId]/items/[itemId]/status'>,
) {
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { userId, listId, itemId } = await params;
  const body = await request.json();

  const apiResponse = await apiRequest(
    `/users/${userId}/lists/${listId}/items/${itemId}/status`,
    {
      headers: {
        AUTHORIZATION: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      method: 'PATCH',
    },
  );

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}
