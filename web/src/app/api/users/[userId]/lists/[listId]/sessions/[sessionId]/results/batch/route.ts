import { apiRequest } from '@/features/auth/server/api';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  {
    params,
  }: RouteContext<'/api/users/[userId]/lists/[listId]/sessions/[sessionId]/results/batch'>,
) {
  const { userId, listId, sessionId } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await request.json();

  const apiResponse = await apiRequest(
    `/users/${userId}/lists/${listId}/sessions/${sessionId}/results/batch`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    },
  );

  const result = await apiResponse.json();
  return NextResponse.json(result, { status: apiResponse.status });
}
