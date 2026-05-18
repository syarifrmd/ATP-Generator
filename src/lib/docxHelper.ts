import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { saveAs } from 'file-saver';

export interface ATPItem {
  hasilTelaah: string;
  tujuanPembelajaran: string;
  alurTujuanPembelajaran: string;
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
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })] }),
          new TableCell({ children: [new Paragraph(value || '')] }),
        ],
      })
  );

  const tableRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Capaian Pembelajaran Per Elemen', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tujuan Pembelajaran', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Alur Tujuan Pembelajaran', bold: true })] })] }),
      ],
    }),
  ];

  data.forEach((item) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, lineRule: 'auto', before: 0, after: 0 }, children: [new TextRun(item.hasilTelaah || '')] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, lineRule: 'auto', before: 0, after: 0 }, children: [new TextRun(item.tujuanPembelajaran || '')] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, lineRule: 'auto', before: 0, after: 0 }, children: [new TextRun(item.alurTujuanPembelajaran || '')] })] }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `Alur Tujuan Pembelajaran Mata Pelajaran ${mapel}`, bold: true, size: 28 })],
            spacing: { after: 200 },
          }),
          new Table({
            rows: headerRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: '', spacing: { after: 120 } }),
          new Paragraph({ children: [new TextRun({ text: 'Capaian Pembelajaran', underline: {} })], spacing: { after: 80 } }),
          new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, lineRule: 'auto', before: 0, after: 0 }, children: [new TextRun({ text: cp || '', size: 22 })] }),
          new Paragraph({ text: '', spacing: { after: 240 } }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: '', spacing: { after: 240 } }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Mengetahui,', bold: true })] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: penyusun, bold: true })], spacing: { after: 120 } }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '____________________', bold: true })], spacing: { after: 120 } }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `NIP. ${nip || '________________'}` })] }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `ATP_${mapel}_Kelas_${kelas}.docx`);
};
