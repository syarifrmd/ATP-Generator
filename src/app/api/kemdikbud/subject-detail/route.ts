import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.belajar.id/curriculums/v2/public';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const subject = url.searchParams.get('subject');

  if (!subject) {
    return NextResponse.json(
      { error: 'Query subject wajib diisi.' },
      { status: 400 }
    );
  }

  const upstreamUrl = `${BASE_URL}/subject-learning-achievements/subjects/${encodeURIComponent(subject)}`;

  try {
    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua": "\"Chromium\";v=\"148\", \"Brave\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://guru.kemendikdasmen.go.id/",
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
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
          error: 'Gagal mengambil detail mapel dari API Kemdikbud.',
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
