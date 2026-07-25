import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function GET(
  _: Request,
  { params }: RouteContext<'/api/users/[userId]/lists/[listId]/items/[itemId]'>,
) {
  const { userId, listId, itemId } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const apiResponse = await apiRequest(
    `/users/${userId}/lists/${listId}/items/${itemId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<'/api/users/[userId]/lists/[listId]/items/[itemId]'>,
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
        body: JSON.stringify(body),
      },
    },
  );

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}

export async function DELETE(
  _: Request,
  { params }: RouteContext<'/api/users/[userId]/lists/[listId]/items/[itemId]'>,
) {
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { userId, listId, itemId } = await params;

  const apiResponse = await apiRequest(
    `/users/${userId}/lists/${listId}/items/${itemId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'DELETE',
    },
  );

  return NextResponse.json(null, { status: apiResponse.status });
}
