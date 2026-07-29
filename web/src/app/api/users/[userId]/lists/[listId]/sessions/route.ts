import { apiRequest } from '@/features/auth/server/api';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: RouteContext<'/api/users/[userId]/lists/[listId]/sessions'>,
) {
  const { userId, listId } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const apiResponse = await apiRequest(
    `/users/${userId}/lists/${listId}/sessions`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  const result = await apiResponse.json();
  return NextResponse.json(result, { status: apiResponse.status });
}

export async function POST(
  request: Request,
  { params }: RouteContext<'/api/users/[userId]/lists/[listId]/sessions'>,
) {
  const { userId, listId } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await request.json();
  const idempotencyKey = request.headers.get('idempotency-key');

  const apiResponse = await apiRequest(
    `/users/${userId}/lists/${listId}/sessions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      body: JSON.stringify(body),
    },
  );

  const result = await apiResponse.json();
  return NextResponse.json(result, { status: apiResponse.status });
}
