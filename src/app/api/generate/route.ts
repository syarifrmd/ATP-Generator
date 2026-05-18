export const maxDuration = 60; // Set max duration for vercel

import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key Gemini belum dikonfigurasi di server.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { jenjang, fase, kelas, mapel, cp, jp } = body;

    const prompt = `Anda adalah ahli kurikulum pendidikan Indonesia yang berpengalaman membuat ATP sesuai standar Kemendikbud.
Tolong buatkan Alur Tujuan Pembelajaran (ATP) untuk:
- Jenjang: ${jenjang}
- Fase: ${fase}
- Kelas: ${kelas}
- Mata Pelajaran: ${mapel}
- Capaian Pembelajaran: ${cp}
- JP / Alokasi Waktu Total: ${jp}

ATURAN PENTING untuk format output:
1. HANYA return JSON array tanpa MARKDOWN, backticks, atau blok code.
2. "hasilTelaah" HARUS DIMULAI dengan "Peserta didik dapat" dan berisi deskripsi PARAGRAF PANJANG yang menjelaskan kompetensi dan elemen penting.
3. "hasilTelaah" HARUS dalam BULLET POINTS dengan simbol • (titik bulat) di awal setiap item, bukan paragraf utuh. Gunakan \n untuk pisah antar item.
4. "tujuanPembelajaran" HARUS dalam BULLET POINTS dengan simbol • (titik bulat) di awal setiap item, bukan - atau *. Gunakan \n untuk pisah antar item.
5. "alurTujuanPembelajaran" HARUS dalam NUMBERED LIST (1., 2., 3., dst). Gunakan \n untuk pisah antar item.
6. Pastikan setiap TP dan ATP rapi, ringkas, namun komprehensif sesuai standar ATP nasional.
7. JANGAN ada markdown symbols, HTML tags, atau backticks dalam response.

Format JSON harus EXACTLY seperti ini:
[
  {
    "hasilTelaah": "• Peserta didik dapat [poin 1]\n• Peserta didik dapat [poin 2]\n• Peserta didik dapat [poin 3]",
    "tujuanPembelajaran": "• [item 1]\\n• [item 2]\\n• [item 3]",
    "alurTujuanPembelajaran": "1. [urutan pembelajaran pertama]\\n2. [urutan pembelajaran kedua]\\n3. [urutan pembelajaran ketiga]"
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    let textResult = response.text || '';
    textResult = textResult.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    
    let parsedData = [];
    try {
        parsedData = JSON.parse(textResult);
    } catch(e) {
        return NextResponse.json({ error: 'Gagal memparsing respons dari AI. Coba lagi.' }, { status: 500 });
    }

    return NextResponse.json({ data: parsedData });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan saat generate ATP.' },
      { status: 500 }
    );
  }
}
