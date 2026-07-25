import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function PATCH(
  request: Request,
  { params }: RouteContext<'/api/users/[userId]'>,
) {
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { userId } = await params;
  const body = await request.json();

  const apiResponse = await apiRequest(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}

export async function DELETE(
  _: Request,
  { params }: RouteContext<'/api/users/[userId]'>,
) {
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { userId } = await params;

  const apiResponse = await apiRequest(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'DELETE',
  });

  return new NextResponse(null, { status: apiResponse.status });
}
