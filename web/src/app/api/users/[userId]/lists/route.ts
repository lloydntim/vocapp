import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function GET(
  _: Request,
  { params }: RouteContext<'/api/users/[userId]/lists'>,
) {
  const { userId } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const apiResponse = await apiRequest(`/users/${userId}/lists`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!apiResponse.ok) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const result = await apiResponse.json();
  return NextResponse.json(result, { status: apiResponse.status });
}

export async function POST(
  request: Request,
  { params }: RouteContext<'/api/users/[userId]/lists'>,
) {
  const { userId } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await request.json();

  const apiResponse = await apiRequest(`/users/${userId}/lists`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });

  if (!apiResponse.ok) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const result = await apiResponse.json();
  return NextResponse.json(result, { status: apiResponse.status });
}
