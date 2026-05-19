'use client';

import { useMemo, useState } from 'react';
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

export interface PhaseElement {
  elementName: string;
  elementDescription: string;
}

export interface PhaseDetail {
  phase: string;
  description: string;
  elements: PhaseElement[];
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

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
  const [phaseDetail, setPhaseDetail] = useState<PhaseDetail | null>(null);
  type ElementOption = {
    isSelected: boolean;
    isManual: boolean;
    manualContent: string;
  };
  const [elementOptions, setElementOptions] = useState<Record<string, ElementOption>>({});
  const [aiProvider, setAiProvider] = useState<'gemini' | 'groq' | 'openrouter' | 'deepseek' | 'zai'>('gemini');
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState('');

  const localMapelOptions = useMemo(
    () => ({
      SMA: SMA_MAPEL_OPTIONS,
      SMK: SMK_MAPEL_OPTIONS,
    }),
    []
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    const elementsData = phaseDetail?.elements
      .filter(el => elementOptions[el.elementName]?.isSelected)
      .map(el => ({
        name: el.elementName,
        description: el.elementDescription,
        isManual: elementOptions[el.elementName]?.isManual,
        manualContent: elementOptions[el.elementName]?.manualContent,
      })) || [];

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, elementsData, aiProvider }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan.');
      }

      setResults(data.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Terjadi kesalahan.'));
    } finally {
      setLoading(false);
    }
  };

  const handleExportWord = () => {
    exportToDocx(results, form.mapel, form.kelas, form.namaSekolah, form.fase, form.penyusun, form.nip, form.jp, form.cp);
  };

  const handleFetchCapaianPembelajaran = async () => {
    if (!form.mapel) {
      setCpError('Pilih mata pelajaran terlebih dahulu.');
      return;
    }
    if (!form.fase) {
      setCpError('Pilih fase terlebih dahulu untuk mengambil target Capaian Pembelajaran.');
      return;
    }

    setCpLoading(true);
    setCpError('');
    setPhaseDetail(null);
    setElementOptions({});

    try {
      const resPhase = await fetch(`/api/kemdikbud/phase-detail?subject=${encodeURIComponent(form.mapel)}&phase=${encodeURIComponent(form.fase)}`);

      if (!resPhase.ok) {
        throw new Error('Gagal mengambil detail target capaian (Fase/Elemen).');
      }

      const dataPhase = await resPhase.json();
      const phaseData = dataPhase?.data as PhaseDetail;
      setPhaseDetail(phaseData);

      // Default check all elements
      if (phaseData && phaseData.elements) {
        const initialOpts: Record<string, ElementOption> = {};
        phaseData.elements.forEach((el) => {
          initialOpts[el.elementName] = {
            isSelected: true,
            isManual: false,
            manualContent: '',
          };
        });
        setElementOptions(initialOpts);

        // Auto fill phase description to form.cp if empty
        setForm(prev => ({
          ...prev,
          cp: phaseData.description || prev.cp
        }));
      }
    } catch (err: unknown) {
      setCpError(getErrorMessage(err, 'Gagal mengambil Capaian Pembelajaran dari Kemdikbud.'));
    } finally {
      setCpLoading(false);
    }
  };

  const toggleElementSelection = (elementName: string) => {
    setElementOptions(prev => ({
      ...prev,
      [elementName]: {
        ...prev[elementName],
        isSelected: !prev[elementName].isSelected
      }
    }));
  };

  const toggleElementManual = (elementName: string, isManual: boolean) => {
    setElementOptions(prev => ({
      ...prev,
      [elementName]: {
        ...prev[elementName],
        isManual
      }
    }));
  };

  const setElementManualContent = (elementName: string, content: string) => {
    setElementOptions(prev => ({
      ...prev,
      [elementName]: {
        ...prev[elementName],
        manualContent: content
      }
    }));
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
            <div className="space-y-1">
              <input
                type="text"
                list="mapel-options"
                required
                value={form.mapel}
                onChange={(e) => setForm({ ...form, mapel: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                placeholder="Pilih atau ketik mapel (Cth: Informatika)"
              />
              <datalist id="mapel-options">
                {localMapelOptions.SMA.map((item) => (
                  <option key={`sma-${item}`} value={item} />
                ))}
                {localMapelOptions.SMK.map((item) => (
                  <option key={`smk-${item}`} value={item} />
                ))}
              </datalist>
              <p className="text-xs text-slate-500">
                Pilih dari daftar atau ketik manual mapel khusus (mis: &quot;Muatan Lokal&quot;).
              </p>
            </div>
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
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="block text-sm font-medium">Capaian Pembelajaran</label>
              <button
                type="button"
                onClick={handleFetchCapaianPembelajaran}
                disabled={cpLoading || !form.mapel || !form.fase}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cpLoading ? 'Mencari...' : 'Cari CP dari Kemdikbud API'}
              </button>
            </div>

            {cpError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                {cpError}
              </div>
            )}

            {phaseDetail && (
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-800">
                  Pilih Elemen CP (Fase {phaseDetail.phase})
                </h3>
                <div className="mb-4 flex flex-col gap-3">
                  {phaseDetail.elements.map((el) => {
                    const opt = elementOptions[el.elementName];
                    if (!opt) return null;
                    return (
                      <div key={el.elementName} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <label className="flex cursor-pointer items-start">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            checked={opt.isSelected}
                            onChange={() => toggleElementSelection(el.elementName)}
                          />
                          <div className="ml-3">
                            <h4 className="text-sm font-semibold text-slate-900">{el.elementName}</h4>
                            <p className="mt-0.5 text-xs text-slate-600 text-justify">{el.elementDescription}</p>
                          </div>
                        </label>

                        {opt.isSelected && (
                          <div className="mt-4 ml-7 border-l-2 border-slate-100 pl-4">
                            <div className="flex gap-4 mb-3">
                              <label className="flex items-center cursor-pointer text-xs">
                                <input
                                  type="radio"
                                  name={`manual-${el.elementName}`}
                                  className="mr-2 h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500"
                                  checked={!opt.isManual}
                                  onChange={() => toggleElementManual(el.elementName, false)}
                                />
                                Auto Generate Konten Materi
                              </label>
                              <label className="flex items-center cursor-pointer text-xs">
                                <input
                                  type="radio"
                                  name={`manual-${el.elementName}`}
                                  className="mr-2 h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500"
                                  checked={opt.isManual}
                                  onChange={() => toggleElementManual(el.elementName, true)}
                                />
                                Manual Konten Materi
                              </label>
                            </div>

                            {opt.isManual && (
                              <textarea
                                rows={3}
                                value={opt.manualContent}
                                onChange={(e) => setElementManualContent(el.elementName, e.target.value)}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-500"
                                placeholder="Masukkan topik / konten materi secara manual di sini (pisahkan dengan koma atau baris baru)..."
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
            <div className="mb-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
              <span className="text-sm font-semibold text-slate-800 sm:w-48">Pilih AI Provider:</span>
              <div className="flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center text-sm text-slate-700">
                  <input
                    type="radio"
                    value="gemini"
                    checked={aiProvider === 'gemini'}
                    onChange={() => setAiProvider('gemini')}
                    className="mr-2 text-emerald-600 focus:ring-emerald-500"
                  />
                  Google Gemini (Free Tier)
                </label>
                <label className="flex cursor-pointer items-center text-sm text-slate-700">
                  <input
                    type="radio"
                    value="groq"
                    checked={aiProvider === 'groq'}
                    onChange={() => setAiProvider('groq')}
                    className="mr-2 text-emerald-600 focus:ring-emerald-500"
                  />
                  GroqCloud (Llama 3.3)
                </label>
                <label className="flex cursor-pointer items-center text-sm text-slate-700">
                  <input
                    type="radio"
                    value="openrouter"
                    checked={aiProvider === 'openrouter'}
                    onChange={() => setAiProvider('openrouter')}
                    className="mr-2 text-emerald-600 focus:ring-emerald-500"
                  />
                  OpenRouter (OpenAI OSS)
                </label>

                <label className='flex cursor-pointer items-center text-sm text-slate-700'>
                  <input
                    type="radio"
                    value="zai"
                    checked={aiProvider === 'zai'}
                    onChange={() => setAiProvider('zai')}
                    className='mr-2 text-emerald-600 focus:ring-emerald-500'
                  />
                  OpenRouter (Zai)
                </label>
                <label className="flex cursor-pointer items-center text-sm text-slate-700">
                  <input
                    type="radio"
                    value="deepseek"
                    checked={aiProvider === 'deepseek'}
                    onChange={() => setAiProvider('deepseek')}
                    className="mr-2 text-emerald-600 focus:ring-emerald-500"
                  />
                  OpenRouter (DeepSeek Free)
                </label>
              </div>
            </div>
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
                <button
                  onClick={handleExportPdf}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Export PDF
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
              <div className="mx-auto w-full max-w-5xl bg-white p-2 sm:p-6">
                <h2 className="text-center text-xl font-bold uppercase leading-tight">
                  Alur Tujuan Pembelajaran Mata Pelajaran {form.mapel}
                </h2>

                <div className="mt-6 space-y-1 text-sm leading-relaxed">
                  <p className="inline-block border-b border-black text-sm font-semibold mb-2">Identitas</p>
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

                <div className="mt-8 space-y-8">
                  {results.map((elemen, index) => (
                    <div key={index}>
                      <h3 className="mb-4 text-center font-bold uppercase bg-yellow-200 px-4 py-1 inline-block mx-auto">
                        ELEMEN: {" "} {elemen.namaElemen}
                      </h3>
                      <div className="w-full overflow-hidden">
                        <table className="w-full table-fixed border-collapse border border-black text-sm">
                          <thead className="bg-[#bfe1ed]">
                            <tr>
                              <th className="border border-black px-3 py-3 text-center align-middle font-bold w-[25%]">Capaian Pembelajaran</th>
                              <th className="border border-black px-3 py-3 text-center align-middle font-bold w-[25%]">Alur Tujuan Pembelajaran</th>
                              <th className="border border-black px-3 py-3 text-center align-middle font-bold w-[15%]">Konten Materi</th>
                              <th className="border border-black px-3 py-3 text-center align-middle font-bold w-[15%]">Profil Pelajar Pancasila</th>
                              <th className="border border-black px-3 py-3 text-center align-middle font-bold w-[10%]">Kata Kunci</th>
                              <th className="border border-black px-3 py-3 text-center align-middle font-bold w-[10%]">Perkiraan Jumlah Jam</th>
                            </tr>
                          </thead>
                          <tbody>
                            {elemen.rows?.map((row, rIndex) => (
                              <tr key={rIndex}>
                                <td className="border border-black px-3 py-3 align-top whitespace-pre-wrap text-justify" style={{ lineHeight: '1.5', hyphens: 'auto' }}>{row.capaianPembelajaran}</td>
                                <td className="border border-black px-3 py-3 align-top whitespace-pre-wrap text-justify" style={{ lineHeight: '1.5', hyphens: 'auto' }}>{row.alurTujuanPembelajaran}</td>
                                <td className="border border-black px-3 py-3 align-top text-center" style={{ lineHeight: '1.5' }}>{row.kontenMateri}</td>
                                <td className="border border-black px-3 py-3 align-top text-center" style={{ lineHeight: '1.5' }}>{row.profilPelajarPancasila}</td>
                                <td className="border border-black px-3 py-3 align-top text-center" style={{ lineHeight: '1.5' }}>{row.kataKunci}</td>
                                <td className="border border-black px-3 py-3 align-top text-center font-semibold" style={{ lineHeight: '1.5' }}>{row.perkiraanJumlahJam}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>

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