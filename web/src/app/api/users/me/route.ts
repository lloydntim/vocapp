import { cookies } from 'next/headers';

import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function GET() {
  const accessToken = (await cookies()).get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const apiResponse = await apiRequest('/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}
