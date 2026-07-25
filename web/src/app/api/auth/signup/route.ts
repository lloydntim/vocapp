import { NextResponse } from 'next/server';
import { apiRequest } from '@/features/auth/server/api';

export async function POST(request: Request) {
  const body = await request.json();

  const apiResponse = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}
