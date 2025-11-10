// app/api/[...rest]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Correct type for Next.js 15 route parameters
interface RouteParams {
  params: Promise<{ rest: string[] }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { rest } = await params;
  
  return NextResponse.json(
    {
      success: false,
      error: 'API route not found',
      message: `The API endpoint /api/${rest.join('/')} does not exist.`,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const { rest } = await params;
  
  return NextResponse.json(
    {
      success: false,
      error: 'API route not found',
      message: `The API endpoint /api/${rest.join('/')} does not exist.`,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const { rest } = await params;
  
  return NextResponse.json(
    {
      success: false,
      error: 'API route not found',
      message: `The API endpoint /api/${rest.join('/')} does not exist.`,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { rest } = await params;
  
  return NextResponse.json(
    {
      success: false,
      error: 'API route not found',
      message: `The API endpoint /api/${rest.join('/')} does not exist.`,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { rest } = await params;
  
  return NextResponse.json(
    {
      success: false,
      error: 'API route not found',
      message: `The API endpoint /api/${rest.join('/')} does not exist.`,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}