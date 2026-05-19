export const runtime = 'nodejs';

import PDFDocument from 'pdfkit';

type ATPElementContent = {
  capaianPembelajaran: string;
  alurTujuanPembelajaran: string;
  kontenMateri: string;
  profilPelajarPancasila: string;
  kataKunci: string;
  perkiraanJumlahJam: string;
};

type ATPItem = {
  namaElemen: string;
  rows: ATPElementContent[];
};

const drawTable = (doc: PDFKit.PDFDocument, items: ATPItem[], startY: number) => {
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  // Make the page landscape or just adjust columns: a4 is usually 595.28 x 841.89 points
  // Wait, we defined the document as A4, which is portrait. Table with 6 columns might be cramped. 
  // We'll squeeze it as best as possible.
  const columns = [pageWidth * 0.24, pageWidth * 0.24, pageWidth * 0.15, pageWidth * 0.15, pageWidth * 0.12, pageWidth * 0.10];
  const labels = [
    'Capaian Pembelajaran', 
    'Alur Tujuan Pembelajaran', 
    'Konten Materi', 
    'Pelajar Pancasila', 
    'Kata Kunci', 
    'JP'
  ];
  
  const xPositions = [
    doc.page.margins.left, 
    doc.page.margins.left + columns[0], 
    doc.page.margins.left + columns[0] + columns[1],
    doc.page.margins.left + columns[0] + columns[1] + columns[2],
    doc.page.margins.left + columns[0] + columns[1] + columns[2] + columns[3],
    doc.page.margins.left + columns[0] + columns[1] + columns[2] + columns[3] + columns[4],
  ];

  const drawCell = (x: number, y: number, width: number, height: number, text: string, bold = false) => {
    doc.rect(x, y, width, height).stroke();
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8).text(text, x + 4, y + 5, {
      width: width - 8,
      align: 'justify',
      lineGap: 2,
    });
  };

  let currentY = startY;

  items.forEach((elemen) => {
    const headerHeight = 24;
    
    // Draw element header
    if (currentY + headerHeight + 30 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      currentY = doc.page.margins.top;
    }
    
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text(`ELEMEN: ${elemen.namaElemen}`, doc.page.margins.left, currentY + 10, {
      align: 'center', width: pageWidth
    });
    currentY += headerHeight + 10;
    
    // Check space for table headers
    if (currentY + 28 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      currentY = doc.page.margins.top;
    }

    labels.forEach((label, index) => drawCell(xPositions[index], currentY, columns[index], 28, label, true));
    currentY += 28;

    if (elemen.rows && Array.isArray(elemen.rows)) {
      elemen.rows.forEach((row) => {
        // PDFKit's heightOfString doesn't take size in TextOptions, so we need to set font size first
        doc.fontSize(8);
        const heights = [
          doc.heightOfString(row.capaianPembelajaran || '', { width: columns[0] - 8, align: 'left', lineGap: 2 }) + 10,
          doc.heightOfString(row.alurTujuanPembelajaran || '', { width: columns[1] - 8, align: 'left', lineGap: 2 }) + 10,
          doc.heightOfString(row.kontenMateri || '', { width: columns[2] - 8, align: 'left', lineGap: 2 }) + 10,
          doc.heightOfString(row.profilPelajarPancasila || '', { width: columns[3] - 8, align: 'left', lineGap: 2 }) + 10,
          doc.heightOfString(row.kataKunci || '', { width: columns[4] - 8, align: 'left', lineGap: 2 }) + 10,
          doc.heightOfString(row.perkiraanJumlahJam || '', { width: columns[5] - 8, align: 'left', lineGap: 2 }) + 10,
        ];
        const rowHeight = Math.max(...heights, 24);

        if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom - 40) {
          doc.addPage();
          currentY = doc.page.margins.top;
          labels.forEach((label, index) => drawCell(xPositions[index], currentY, columns[index], 28, label, true));
          currentY += 28;
        }

        drawCell(xPositions[0], currentY, columns[0], rowHeight, row.capaianPembelajaran || '');
        drawCell(xPositions[1], currentY, columns[1], rowHeight, row.alurTujuanPembelajaran || '');
        drawCell(xPositions[2], currentY, columns[2], rowHeight, row.kontenMateri || '');
        drawCell(xPositions[3], currentY, columns[3], rowHeight, row.profilPelajarPancasila || '');
        drawCell(xPositions[4], currentY, columns[4], rowHeight, row.kataKunci || '');
        drawCell(xPositions[5], currentY, columns[5], rowHeight, row.perkiraanJumlahJam || '');
        currentY += rowHeight;
      });
    }
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

    const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true, layout: 'landscape' });
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
    doc.font('Helvetica-Bold').text('Capaian Pembelajaran:');
    doc.font('Helvetica').fontSize(11).text(cp || '', { align: 'justify', lineGap: 3 });
    doc.moveDown(1);

    const bottomBeforeTable = drawTable(doc, results || [], doc.y + 4);
    doc.y = bottomBeforeTable + 24;

    const signatureX = doc.page.width - doc.page.margins.right - 190;
    doc.font('Helvetica').fontSize(11);
    
    if (doc.y + 80 > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
    }
    
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
