import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'vocapp-web',
    timestamp: new Date().toISOString(),
  });
}
