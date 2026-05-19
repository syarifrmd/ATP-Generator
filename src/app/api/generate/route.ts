export const maxDuration = 60; // Set max duration for vercel

import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jenjang, fase, kelas, mapel, cp, jp, elementsData, aiProvider = 'gemini' } = body;

    let elementsPrompt = '';
    if (elementsData && elementsData.length > 0) {
      elementsPrompt = `\nELEMEN YANG DIPILIH DAN KONTEN MATERINYA:\n` + elementsData.map((el: any) => {
        let text = `- Elemen: ${el.name}\n  Capaian Pembelajaran Elemen: ${el.description}`;
        if (el.isManual && el.manualContent) {
          text += `\n  KONTEN MATERI (WAJIB DIGUNAKAN): ${el.manualContent}`;
        } else {
          text += `\n  KONTEN MATERI: (Auto-generate oleh AI berdasarkan Capaian Pembelajaran)`;
        }
        return text;
      }).join('\n\n');
    }

    const prompt = `Anda adalah ahli kurikulum pendidikan Indonesia yang berpengalaman membuat ATP sesuai standar Kemendikbud.
Tolong buatkan Alur Tujuan Pembelajaran (ATP) untuk:
- Jenjang: ${jenjang}
- Fase: ${fase}
- Kelas: ${kelas}
- Mata Pelajaran: ${mapel}
- Capaian Pembelajaran Keseluruhan: ${cp}
- JP / Alokasi Waktu Total: ${jp}
${elementsPrompt}

ATURAN PENTING untuk format output:
1. HANYA return JSON tanpa MARKDOWN, backticks, atau blok code.
2. Analisis Capaian Pembelajaran (CP) dan HANYA buatkan ATP untuk elemen yang disebutkan di ELEMEN YANG DIPILIH (jika ada). Jangan generate untuk elemen yang tidak disebutkan.
3. Untuk setiap ELEMEN, pecah/buat urutan pembelajaran per KONTEN MATERI (baris/rows tersendiri). Jika KONTEN MATERI sudah disediakan secara manual, wajib gunakan itu sebagai acuan utama pembagian baris konten materi.
4. Pastikan setiap baris (row) memiliki: Capaian Pembelajaran yang relevan (potongan CP utama untuk elemen tersebut), Alur Tujuan Pembelajaran (berupa step/list dengan \n), Konten Materi (Topik spesifik), Profil Pelajar Pancasila yang sesuai, Kata Kunci, dan Perkiraan Jumlah Jam.
5. PENTING: Distribusikan total JP / Alokasi Waktu (${jp}) secara logis ke seluruh "perkiraanJumlahJam" di setiap baris, sehingga jika semua jam dijumlahkan dari seluruh elemen, hasilnya persis sama dengan nilai ${jp}.
6. Format JAWABAN berupa ARRAY OF OBJECTS (Daftar Elemen). Tiap objek Elemen memiliki properti "namaElemen" dan "rows". "rows" adalah array of object.

Format JSON harus EXACTLY seperti ini:
[
  {
    "namaElemen": "BERPIKIR KOMPUTASIONAL (BK)",
    "rows": [
      {
        "capaianPembelajaran": "Peserta didik mampu memahami alur proses pengembangan program...",
        "alurTujuanPembelajaran": "1. Memahami proses pengembangan program\\n2. Menuliskan algoritma efisien\\n3. Menganalisis persoalan",
        "kontenMateri": "Pengembangan Program dan Algoritma",
        "profilPelajarPancasila": "Bernalar Kritis, Kreatif",
        "kataKunci": "Program, Algoritma, Efisien",
        "perkiraanJumlahJam": "12 JP"
      }
    ]
  }
]
`;

    let textResult = '';

    if (aiProvider === 'openrouter' || aiProvider === 'groq') {
      let endpoint = '';
      let model = '';
      let authToken = '';

      if (aiProvider === 'groq') {
        endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        model = 'llama-3.3-70b-versatile';
        authToken = process.env.GROQ_API_KEY || '';
      } else {
        endpoint = 'https://openrouter.ai/api/v1/chat/completions';
        model = 'nvidia/nemotron-3-super-120b-a12b:free';
        authToken = process.env.OPENROUTER_API_KEY || '<OPENROUTER_API_KEY>';
      }

      if (!authToken || authToken === '<OPENROUTER_API_KEY>') {
        return NextResponse.json({ error: `API key untuk ${aiProvider} belum dikonfigurasi.` }, { status: 500 });
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://atp-generator.vercel.app', 
          'X-Title': 'ATP Generator',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "Anda adalah asisten AI ahli kurikulum pendidikan Indonesia." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Gagal mengambil respons dari ${aiProvider}.`);
      }

      const data = await res.json();
      textResult = data.choices[0]?.message?.content || '';

    } else {
      // Default to Gemini
      if (!apiKey) {
        return NextResponse.json(
          { error: 'API key Gemini belum dikonfigurasi di server.' },
          { status: 500 }
        );
      }
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      textResult = response.text || '';
    }
    
    textResult = textResult.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
    
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
