// app/api/[...rest]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { rest: string[] } }
) {
  return NextResponse.json(
    {
      success: false,
      error: 'API route not found',
      message: `The API endpoint /api/${params.rest.join('/')} does not exist.`,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { rest: string[] } }
) {
  return NextResponse.json(
    {
      success: false,
      error: 'API route not found',
      message: `The API endpoint /api/${params.rest.join('/')} does not exist.`,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

// Add other HTTP methods as needed (PUT, DELETE, PATCH, etc.)