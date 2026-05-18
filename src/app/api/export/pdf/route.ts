export const runtime = 'nodejs';

import PDFDocument from 'pdfkit';

type ATPItem = {
  hasilTelaah: string;
  tujuanPembelajaran: string;
  alurTujuanPembelajaran: string;
};

const drawTable = (doc: PDFKit.PDFDocument, rows: ATPItem[], startY: number) => {
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const columns = [pageWidth * 0.34, pageWidth * 0.33, pageWidth * 0.33];
  const labels = ['Capaian Pembelajaran Per Elemen', 'Tujuan Pembelajaran', 'Alur Tujuan Pembelajaran'];
  const xPositions = [doc.page.margins.left, doc.page.margins.left + columns[0], doc.page.margins.left + columns[0] + columns[1]];

  const drawCell = (x: number, y: number, width: number, height: number, text: string, bold = false) => {
    doc.rect(x, y, width, height).stroke();
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9).text(text, x + 6, y + 5, {
      width: width - 12,
      align: 'justify',
      lineGap: 3,
    });
  };

  let currentY = startY;
  const headerHeight = 28;
  labels.forEach((label, index) => drawCell(xPositions[index], currentY, columns[index], headerHeight, label, true));
  currentY += headerHeight;

  rows.forEach((row) => {
    const heights = [
      doc.heightOfString(row.hasilTelaah || '', { width: columns[0] - 12, align: 'left' }) + 10,
      doc.heightOfString(row.tujuanPembelajaran || '', { width: columns[1] - 12, align: 'left' }) + 10,
      doc.heightOfString(row.alurTujuanPembelajaran || '', { width: columns[2] - 12, align: 'left' }) + 10,
    ];
    const rowHeight = Math.max(...heights, 24);

    if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom - 80) {
      doc.addPage();
      currentY = doc.page.margins.top;
      labels.forEach((label, index) => drawCell(xPositions[index], currentY, columns[index], headerHeight, label, true));
      currentY += headerHeight;
    }

    drawCell(xPositions[0], currentY, columns[0], rowHeight, row.hasilTelaah || '');
    drawCell(xPositions[1], currentY, columns[1], rowHeight, row.tujuanPembelajaran || '');
    drawCell(xPositions[2], currentY, columns[2], rowHeight, row.alurTujuanPembelajaran || '');
    currentY += rowHeight;
  });

  return currentY;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { results, mapel, kelas, namaSekolah, fase, penyusun, nip, jp, cp } = body as {
      results: ATPItem[];
      mapel: string;
      kelas: string;
      namaSekolah: string;
      fase: string;
      penyusun: string;
      nip: string;
      jp: string;
      cp: string;
    };

    const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));

    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    doc.font('Helvetica-Bold').fontSize(14).text(`Alur Tujuan Pembelajaran Mata Pelajaran ${mapel}`, {
      align: 'center',
    });

    doc.moveDown(1.2);
    doc.font('Helvetica').fontSize(11);
    const infoData = [
      ['Nama Sekolah', namaSekolah],
      ['Nama Mata Pelajaran', mapel],
      ['Kelas', kelas],
      ['Fase', fase],
      ['Nama Penyusun', penyusun],
      ['NIP', nip],
    ];
    
    if (jp) {
      infoData.push(['JP', jp]);
    }

    infoData.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(`${label} :`, { continued: true });
      doc.font('Helvetica').text(` ${value || ''}`);
    });

    doc.moveDown(0.8);
    doc.font('Helvetica-Bold').text('Capaian Pembelajaran');
    doc.font('Helvetica').fontSize(11).text(cp || '', { align: 'justify', lineGap: 3 });
    doc.moveDown(1);

    const bottomBeforeTable = drawTable(doc, results || [], doc.y + 4);
    doc.y = bottomBeforeTable + 24;

    const signatureX = doc.page.width - doc.page.margins.right - 190;
    doc.font('Helvetica').fontSize(11);
    doc.text('Mengetahui,', signatureX, doc.y + 10, { width: 180, align: 'center' });
    doc.font('Helvetica-Bold').text(penyusun, signatureX, doc.y + 26, { width: 180, align: 'center' });
    doc.moveDown(4);
    doc.font('Helvetica-Bold').text('____________________', signatureX, doc.y + 24, { width: 180, align: 'center' });
    doc.font('Helvetica').text(`NIP. ${nip || '________________'}`, signatureX, doc.y + 10, { width: 180, align: 'center' });

    doc.end();
    const buffer = await pdfPromise;

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ATP_${mapel}_Kelas_${kelas}.pdf"`,
      },
    });
  } catch (error: any) {
    return Response.json({ error: error?.message || 'Gagal membuat PDF.' }, { status: 500 });
  }
}