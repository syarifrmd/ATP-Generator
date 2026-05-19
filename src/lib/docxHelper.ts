import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export interface ATPElementContent {
  capaianPembelajaran: string;
  alurTujuanPembelajaran: string;
  kontenMateri: string;
  profilPelajarPancasila: string;
  kataKunci: string;
  perkiraanJumlahJam: string;
}

export interface ATPItem {
  namaElemen: string;
  rows: ATPElementContent[];
}

export const exportToDocx = async (
  data: ATPItem[],
  mapel: string,
  kelas: string,
  namaSekolah: string,
  fase: string,
  penyusun: string,
  nip: string,
  jp: string,
  cp: string
) => {
  const headerData = [
    ['Nama Sekolah', namaSekolah],
    ['Nama Mata Pelajaran', mapel],
    ['Kelas', kelas],
    ['Fase', fase],
    ['Nama Penyusun', penyusun],
    ['NIP', nip],
  ];
  
  if (jp) {
    headerData.push(['JP', jp]);
  }
  
  const headerRows = headerData.map(
    ([label, value]) =>
      new TableRow({
        children: [
          new TableCell({ borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } }, children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })] }),
          new TableCell({ borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } }, children: [new Paragraph({ children: [new TextRun({ text: ': ' + (value || '') })] })] }),
        ],
      })
  );

  const docChildren: any[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `Alur Tujuan Pembelajaran Mata Pelajaran ${mapel}`, bold: true, size: 28 })],
      spacing: { after: 200 },
    }),
    new Table({
      rows: headerRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NIL },
        bottom: { style: BorderStyle.NIL },
        left: { style: BorderStyle.NIL },
        right: { style: BorderStyle.NIL },
        insideHorizontal: { style: BorderStyle.NIL },
        insideVertical: { style: BorderStyle.NIL },
      }
    }),
    new Paragraph({ text: '', spacing: { after: 240 } }),
    new Paragraph({ children: [new TextRun({ text: 'Capaian Pembelajaran:', bold: true })], spacing: { after: 80 } }),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, lineRule: 'auto', before: 0, after: 0 }, children: [new TextRun({ text: cp || '', size: 22 })] }),
    new Paragraph({ text: '', spacing: { after: 240 } }),
  ];

  data.forEach((elemen) => {
    docChildren.push(
      new Paragraph({ 
        alignment: AlignmentType.CENTER, 
        children: [new TextRun({ text: `ELEMEN : ${elemen.namaElemen}`, bold: true })],
        spacing: { before: 240, after: 120 } 
      })
    );

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Capaian Pembelajaran', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Alur Tujuan Pembelajaran', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Konten Materi', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Profil Pelajar Pancasila', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kata Kunci', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Perkiraan Jumlah Jam', bold: true })] })] }),
        ],
      }),
    ];

    if (elemen.rows && Array.isArray(elemen.rows)) {
      elemen.rows.forEach((row) => {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [new TextRun(row.capaianPembelajaran || '')] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [new TextRun(row.alurTujuanPembelajaran || '')] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(row.kontenMateri || '')] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(row.profilPelajarPancasila || '')] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(row.kataKunci || '')] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(row.perkiraanJumlahJam || '')] })] }),
            ],
          })
        );
      });
    }

    docChildren.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
  });

  docChildren.push(new Paragraph({ text: '', spacing: { after: 240 } }));
  docChildren.push(new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Mengetahui,', bold: true })] }));
  docChildren.push(new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: penyusun, bold: true })], spacing: { after: 120 } }));

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `ATP_${mapel}_Kelas_${kelas}.docx`);
};
