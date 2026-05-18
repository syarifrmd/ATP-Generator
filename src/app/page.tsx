'use client';

import { useState } from 'react';
import { exportToDocx, ATPItem } from '@/lib/docxHelper';

const SMA_MAPEL_OPTIONS = [
  'Antropologi',
  'Bahasa Arab',
  'Bahasa Bali',
  'Bahasa Daerah Lainnya',
  'Bahasa Indonesia',
  'Bahasa Indonesia Tingkat Lanjut',
  'Bahasa Inggris',
  'Bahasa Inggris Tingkat Lanjut',
  'Bahasa Jawa',
  'Bahasa Jepang',
  'Bahasa Jerman',
  'Bahasa Korea',
  'Bahasa Madura',
  'Bahasa Mandarin',
  'Bahasa Prancis',
  'Bahasa Sunda',
  'Biologi',
  'Ekonomi',
  'Fisika',
  'Geografi',
  'Ilmu Pengetahuan Alam (IPA)',
  'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
  'Ilmu Pengetahuan Sosial (IPS)',
  'Informatika',
  'Kimia',
  'Koding dan Kecerdasan Artifisial',
  'Matematika',
  'Matematika Tingkat Lanjut',
  'Muatan Lokal Lain-lain',
  'Pendidikan Agama Buddha dan Budi Pekerti',
  'Pendidikan Agama Hindu dan Budi Pekerti',
  'Pendidikan Agama Islam dan Budi Pekerti',
  'Pendidikan Agama Katolik dan Budi Pekerti',
  'Pendidikan Agama Kepercayaan terhadap Tuhan Yang Maha Esa dan Budi Pekerti',
  'Pendidikan Agama Khonghucu dan Budi Pekerti',
  'Pendidikan Agama Kristen dan Budi Pekerti',
  'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
  'Pendidikan Pancasila',
  'Prakarya Budi Daya',
  'Prakarya dan Kewirausahaan Budi Daya',
  'Prakarya dan Kewirausahaan Kerajinan',
  'Prakarya dan Kewirausahaan Pengolahan',
  'Prakarya dan Kewirausahaan Rekayasa',
  'Prakarya Kerajinan',
  'Prakarya Pengolahan',
  'Prakarya Rekayasa',
  'Sejarah',
  'Sejarah Tingkat Lanjut',
  'Seni Musik',
  'Seni Rupa',
  'Seni Tari',
  'Seni Teater',
  'Sosiologi',
  'Tematik',
];

const SMK_MAPEL_OPTIONS = [
  'Agribisnis Ikan Hias',
  'Agribisnis Lanskap dan Pertamanan',
  'Agribisnis Pengolahan Hasil Perikanan',
  'Agribisnis Pengolahan Hasil Pertanian',
  'Agribisnis Perbenihan Tanaman',
  'Agribisnis Perikanan Air Tawar',
  'Agribisnis Perikanan Payau dan Laut',
  'Agribisnis Rumput Laut',
  'Agribisnis Tanaman Pangan dan Hortikultura',
  'Agribisnis Tanaman Perkebunan',
  'Agribisnis Ternak Ruminansia',
  'Agribisnis Ternak Unggas',
  'Airframe Powerplant',
  'Akuntansi',
  'Analisis Pengujian Laboratorium',
  'Animasi',
  'Asisten Dental',
  'Asisten Teknik Laboratorium Medik',
  'Bisnis Digital',
  'Bisnis Retail',
  'Dasar-dasar Agribisnis Perikanan',
  'Dasar-dasar Agribisnis Tanaman',
  'Dasar-dasar Agribisnis Ternak',
  'Dasar-dasar Agriteknologi Pengolahan Hasil Pertanian',
  'Dasar-dasar Akuntansi dan Keuangan Lembaga',
  'Dasar-dasar Animasi',
  'Dasar-dasar Broadcasting dan Perfilman',
  'Dasar-dasar Busana',
  'Dasar-dasar Desain dan Produksi Kriya',
  'Dasar-dasar Desain Komunikasi Visual',
  'Dasar-dasar Desain Pemodelan dan Informasi Bangunan',
  'Dasar-dasar Kecantikan dan Spa',
  'Dasar-dasar Kehutanan',
  'Dasar-dasar Kimia Analisis',
  'Dasar-dasar Konstruksi dan Perawatan Bangunan Sipil',
  'Dasar-dasar Kuliner',
  'Dasar-dasar Layanan Kesehatan',
  'Dasar-dasar Manajemen Perkantoran dan Layanan Bisnis',
  'Dasar-dasar Nautika Kapal Niaga',
  'Dasar-dasar Nautika Kapal Penangkap Ikan',
  'Dasar-dasar Pekerjaan Sosial',
  'Dasar-dasar Pemasaran',
  'Dasar-dasar Pengembangan Perangkat Lunak dan Gim',
  'Dasar-dasar Perhotelan',
  'Dasar-dasar Seni Pertunjukan',
  'Dasar-dasar Seni Rupa',
  'Dasar-dasar Teknik Elektronika',
  'Dasar-dasar Teknik Energi Terbarukan',
  'Dasar-dasar Teknik Furnitur',
  'Dasar-dasar Teknik Geologi Pertambangan',
  'Dasar-dasar Teknik Geospasial',
  'Dasar-dasar Teknik Jaringan Komputer dan Telekomunikasi',
  'Dasar-dasar Teknik Ketenagalistrikan',
  'Dasar-dasar Teknik Kimia Industri',
  'Dasar-dasar Teknik Konstruksi dan Perumahan',
  'Dasar-dasar Teknik Konstruksi Kapal',
  'Dasar-dasar Teknik Laboratorium Medik',
  'Dasar-dasar Teknik Logistik',
  'Dasar-dasar Teknik Mesin',
  'Dasar-dasar Teknik Otomotif',
  'Dasar-dasar Teknik Pengelasan dan Fabrikasi Logam',
  'Dasar-dasar Teknik Perawatan Gedung',
  'Dasar-dasar Teknik Perminyakan',
  'Dasar-dasar Teknik Pesawat Udara',
  'Dasar-dasar Teknik Tekstil',
  'Dasar-dasar Teknika Kapal Niaga',
  'Dasar-dasar Teknika Kapal Penangkap Ikan',
  'Dasar-dasar Teknologi Farmasi',
  'Dasar-dasar Usaha Layanan Pariwisata',
  'Dasar-dasar Usaha Pertanian Terpadu',
  'Desain dan Produksi Busana',
  'Desain dan Teknik Furnitur',
  'Desain Gambar Mesin',
  'Desain Interior dan Teknik Furnitur',
  'Desain Komunikasi Visual',
  'Desain Pemodelan dan Informasi Bangunan',
  'Desain Rancang Bangun Kapal',
  'Ekowisata',
  'Electrical Avionic',
  'Farmasi Industri',
  'Geologi Pertambangan',
  'Informasi Geospasial',
  'Instrumentasi dan Otomatisasi Proses',
  'Interior Kapal',
  'Kehutanan',
  'Kesehatan Hewan',
  'Kimia Analisis',
  'Kimia Tekstil',
  'Konstruksi Gedung dan Sanitasi',
  'Konstruksi Jalan, Irigasi, dan Jembatan',
  'Konstruksi Kapal Baja',
  'Konstruksi Kapal Non Baja',
  'Kriya Kreatif Batik dan Tekstil',
  'Kriya Kreatif Kayu dan Rotan',
  'Kriya Kreatif Keramik',
  'Kriya Kreatif Kulit dan Imitasi',
  'Kriya Kreatif Logam dan Perhiasan',
  'Kuliner',
  'Layanan Penunjang Dental Care',
  'Layanan Penunjang Kefarmasian Klinis dan Komunitas',
  'Layanan Penunjang Keperawatan dan Caregiving',
  'Layanan Penunjang Laboratorium Medik',
  'Layanan Perbankan',
  'Layanan Perbankan Syariah',
  'Manajemen Logistik',
  'Manajemen Perkantoran',
  'Mekanisasi Pertanian',
  'Nautika Kapal Niaga',
  'Nautika Kapal Penangkap Ikan',
  'Pekerjaan Sosial',
  'Pengawasan Mutu Hasil Pertanian',
  'Pengembangan Gim',
  'Perhotelan',
  'Praktik Kerja Lapangan',
  'Produksi dan Siaran Program Radio',
  'Produksi dan Siaran Program Televisi',
  'Produksi Film',
  'Projek Ilmu Pengetahuan Alam dan Sosial',
  'Projek Kreatif dan Kewirausahaan',
  'Rekayasa Perangkat Lunak',
  'Sejarah (SMK)',
  'Seni Karawitan',
  'Seni Lukis',
  'Seni Musik (Konsentrasi Keahlian)',
  'Seni Patung',
  'Seni Pedalangan',
  'Seni Tari (Konsentrasi Keahlian)',
  'Seni Teater (Konsentrasi Keahlian)',
  'Sistem Informasi, Jaringan, dan Aplikasi',
  'Spa dan Beauty Therapy',
  'Tata Artistik Teater',
  'Tata Kecantikan Kulit dan Rambut',
  'Teknik Alat Berat',
  'Teknik Audio Video',
  'Teknik Bodi Kendaraan Ringan',
  'Teknik Elektronika Industri',
  'Teknik Elektronika Komunikasi',
  'Teknik Elektronika Pesawat Udara (Aviation Electronics)',
  'Teknik Energi Biomassa',
  'Teknik Energi Surya, Hidro, dan Angin',
  'Teknik Fabrikasi Logam dan Manufaktur',
  'Teknik Geomatika',
  'Teknik Grafika',
  'Teknik Instalasi Tenaga Listrik',
  'Teknik Instrumentasi Medik',
  'Teknik Jaringan Akses Telekomunikasi',
  'Teknik Jaringan Tenaga Listrik',
  'Teknik Kelistrikan Kapal',
  'Teknik Kelistrikan Pesawat Udara (Aircraft Electricity)',
  'Teknik Kendaraan Ringan',
  'Teknik Kimia Industri',
  'Teknik Komputer dan Jaringan',
  'Teknik Konstruksi Badan Pesawat Udara (Aircraft Sheet Metal Forming)',
  'Teknik Konstruksi dan Perumahan',
  'Teknik Konstruksi Jalan dan Jembatan',
  'Teknik Konstruksi Rangka Pesawat Udara (Airframe Mechanic)',
  'Teknik Logistik',
  'Teknik Mekanik Industri',
  'Teknik Mekatronika',
  'Teknik Otomasi Industri',
  'Teknik Ototronik',
  'Teknik Pemanasan, Tata Udara, dan Pendinginan (Heating, Ventilation, and Air Conditioning)',
  'Teknik Pembangkit Tenaga Listrik',
  'Teknik Pemboran Minyak dan Gas',
  'Teknik Pembuatan Benang Stapel',
  'Teknik Pembuatan Kain',
  'Teknik Pembuatan Serat Filamen',
  'Teknik Pemesinan',
  'Teknik Pemesinan Kapal',
  'Teknik Pemesinan Pesawat Udara (Aircraft Machining)',
  'Teknik Pengecoran Logam',
  'Teknik Pengelasan',
  'Teknik Pengelasan Kapal',
  'Teknik Pengendalian Produksi',
  'Teknik Pengolahan Minyak, Gas, dan Petrokimia',
  'Teknik Penyempurnaan Tekstil',
  'Teknik Perawatan Gedung',
  'Teknik Produksi Minyak dan Gas',
  'Teknik Sepeda Motor',
  'Teknik Transmisi Telekomunikasi',
  'Teknika Kapal Niaga',
  'Teknika Kapal Penangkap Ikan',
  'Usaha Layanan Wisata',
  'Usaha Pertanian Terpadu',
];

export default function Home() {
  const [form, setForm] = useState({
    namaSekolah: '',
    fase: '',
    penyusun: '',
    nip: '',
    jp: '',
    jenjang: '',
    kelas: '',
    mapel: '',
    cp: '',
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ATPItem[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan.');
      }

      setResults(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportWord = () => {
    exportToDocx(results, form.mapel, form.kelas, form.namaSekolah, form.fase, form.penyusun, form.nip, form.jp, form.cp);
  };

  const handleExportPdf = async () => {
    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        results,
        mapel: form.mapel,
        kelas: form.kelas,
        namaSekolah: form.namaSekolah,
        fase: form.fase,
        penyusun: form.penyusun,
        nip: form.nip,
        jp: form.jp,
        cp: form.cp,
      }),
    });

    if (!response.ok) {
      throw new Error('Gagal membuat PDF.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ATP_${form.mapel}_Kelas_${form.kelas}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Generator Alur Tujuan Pembelajaran</h1>
          <p className="mt-2 text-sm text-slate-600">Isi data sekolah, generate dengan Gemini, lalu unduh hasilnya ke Word atau PDF.</p>
        </div>

        <form onSubmit={handleGenerate} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Nama Sekolah</label>
            <input
              type="text"
              required
              value={form.namaSekolah}
              onChange={(e) => setForm({ ...form, namaSekolah: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="SMAN 13 Semarang"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Mata Pelajaran</label>
            <select
              required
              value={form.mapel}
              onChange={(e) => setForm({ ...form, mapel: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Pilih mata pelajaran</option>
              <optgroup label="SMA">
                {SMA_MAPEL_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </optgroup>
              <optgroup label="SMK">
                {SMK_MAPEL_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Fase</label>
            <select
              required
              value={form.fase}
              onChange={(e) => setForm({ ...form, fase: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Pilih fase</option>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Kelas</label>
            <select
              required
              value={form.kelas}
              onChange={(e) => setForm({ ...form, kelas: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Pilih kelas</option>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((kelas) => (
                <option key={kelas} value={kelas}>
                  {kelas}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Nama Penyusun</label>
            <input
              type="text"
              required
              value={form.penyusun}
              onChange={(e) => setForm({ ...form, penyusun: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Khaerudin, S. Pd"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">NIP</label>
            <input
              type="text"
              value={form.nip}
              onChange={(e) => setForm({ ...form, nip: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="1968xxxxxxxxxxxxxx"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">JP / Alokasi Waktu Total</label>
            <input
              type="text"
              value={form.jp}
              onChange={(e) => setForm({ ...form, jp: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="4 x 45"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Capaian Pembelajaran</label>
            <textarea
              required
              rows={5}
              value={form.cp}
              onChange={(e) => setForm({ ...form, cp: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Tulis capaian pembelajaran lengkap..."
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Generating...' : 'Generate ATP'}
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-slate-700">
                <p><span className="font-semibold">Nama Sekolah:</span> {form.namaSekolah}</p>
                <p><span className="font-semibold">Mata Pelajaran:</span> {form.mapel}</p>
                <p><span className="font-semibold">Fase:</span> {form.fase}</p>
                <p><span className="font-semibold">JP:</span> {form.jp}</p>
                <p><span className="font-semibold">Nama Penyusun:</span> {form.penyusun}</p>
                <p><span className="font-semibold">NIP:</span> {form.nip || '-'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportWord}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Export Word
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
              <div className="mx-auto w-full max-w-5xl bg-white p-2 sm:p-6">
                <h2 className="text-center text-xl font-bold uppercase leading-tight">
                  Alur Tujuan Pembelajaran Mata Pelajaran {form.mapel}
                </h2>

                <div className="mt-6 space-y-1 text-sm leading-relaxed">
                  <div className="flex"><span className="font-semibold w-48">Nama Sekolah</span><span>: {form.namaSekolah}</span></div>
                  <div className="flex"><span className="font-semibold w-48">Nama Mata Pelajaran</span><span>: {form.mapel}</span></div>
                  <div className="flex"><span className="font-semibold w-48">Kelas</span><span>: {form.kelas}</span></div>
                  <div className="flex"><span className="font-semibold w-48">Fase</span><span>: {form.fase}</span></div>
                  {form.jp && <div className="flex"><span className="font-semibold w-48">JP</span><span>: {form.jp}</span></div>}
                  <div className="flex"><span className="font-semibold w-48">Nama Penyusun</span><span>: {form.penyusun}</span></div>
                  <div className="flex"><span className="font-semibold w-48">NIP</span><span>: {form.nip || '-'}</span></div>
                </div>

                <div className="mt-6">
                  <p className="inline-block border-b border-black text-sm font-semibold">Capaian Pembelajaran</p>
                  <p className="mt-2 text-justify text-sm whitespace-pre-wrap" style={{ lineHeight: '1.5', margin: 0, hyphens: 'auto' }}>{form.cp}</p>
                </div>

                <table className="mt-8 w-full border-collapse border border-black text-sm">
                  <thead>
                    <tr>
                      <th className="border border-black px-3 py-3 text-center align-middle">Capaian Pembelajaran Per Elemen</th>
                      <th className="border border-black px-3 py-3 text-center align-middle">Tujuan Pembelajaran</th>
                      <th className="border border-black px-3 py-3 text-center align-middle">Alur Tujuan Pembelajaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-black px-3 py-3 align-top whitespace-pre-wrap text-left" style={{ lineHeight: '1.5' }}>{item.hasilTelaah}</td>
                        <td className="border border-black px-3 py-3 align-top whitespace-pre-wrap text-justify" style={{ lineHeight: '1.5', hyphens: 'auto' }}>{item.tujuanPembelajaran}</td>
                        <td className="border border-black px-3 py-3 align-top whitespace-pre-wrap text-justify" style={{ lineHeight: '1.5', hyphens: 'auto' }}>{item.alurTujuanPembelajaran}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-16 flex justify-end text-sm leading-6">
                  <div className="w-64 text-center">
                    <p>Mengetahui,</p>
                    <p className="font-semibold">{form.penyusun}</p>
                    <div className="mt-18 mb-2 border-b border-black" />
                    <p className="font-semibold">NIP. {form.nip || '................................'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}