import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiRequest } from '@/features/auth/server/api';

export async function GET(request: Request) {
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'No access token' }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get('q');
  const searchParams = new URLSearchParams();
  if (q) searchParams.set('q', q);

  const apiResponse = await apiRequest(
    `/languages${searchParams.size ? `?${searchParams}` : ''}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}

export async function POST(request: Request) {
  const payload = await request.json();

  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'No access token' }, { status: 401 });
  }

  const apiResponse = await apiRequest('/languages', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}
