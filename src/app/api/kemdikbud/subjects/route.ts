import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.belajar.id/curriculums/v2/public';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const upstreamUrl = query ? `${BASE_URL}/subjects?${query}` : `${BASE_URL}/subjects`;

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        accept: 'application/json',
      },
    });

    const text = await response.text();
    let data: unknown = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Gagal mengambil daftar mapel dari API Kemdikbud.',
          detail: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Gagal terhubung ke API Kemdikbud.',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
