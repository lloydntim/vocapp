import { apiRequest } from '@/features/auth/server/api';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: RouteContext<'/api/users/[userId]/lists/[listId]'>,
) {
  const { userId, listId } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const apiResponse = await apiRequest(`/users/${userId}/lists/${listId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const result = await apiResponse.json();
  return NextResponse.json(result, { status: apiResponse.status });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<'/api/users/[userId]/lists/[listId]'>,
) {
  const { userId, listId } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await request.json();

  const apiResponse = await apiRequest(`/users/${userId}/lists/${listId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  const result = await apiResponse.json();
  return NextResponse.json(result, { status: apiResponse.status });
}

export async function DELETE(
  _: Request,
  { params }: RouteContext<'/api/users/[userId]/lists/[listId]'>,
) {
  const { userId, listId } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const apiResponse = await apiRequest(`/users/${userId}/lists/${listId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    method: 'DELETE',
  });

  return new NextResponse(null, { status: apiResponse.status });
}
