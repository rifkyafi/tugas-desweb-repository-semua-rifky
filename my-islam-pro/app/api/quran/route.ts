import { NextResponse } from 'next/server';

function buildQuranApiUrl(endpoint: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_QURAN_API_URL || 'https://equran.id/api/v2';
  const trimmedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const trimmedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${trimmedBase}${trimmedEndpoint}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || '/surat';
    const apiUrl = buildQuranApiUrl(endpoint);

    const res = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 }
    );
  }
}
