import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  BorderStyle,
  ShadingType,
  UnderlineType,
  HeadingLevel,
  convertMillimetersToTwip,
} from 'docx';
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

// Parse text that may contain numbered lists (1. item\n2. item) into Paragraph children
function textToParagraphs(text: string, alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.JUSTIFIED): Paragraph[] {
  if (!text) return [new Paragraph({ children: [new TextRun('')] })];

  const lines = text.split('\n').filter((l) => l.trim() !== '');
  if (lines.length === 0) return [new Paragraph({ children: [new TextRun('')] })];

  return lines.map((line) => {
    const trimmed = line.trim();
    // Detect numbered list lines like "1. something" or "2. something"
    const listMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (listMatch) {
      return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { left: convertMillimetersToTwip(5) },
        spacing: { line: 276, lineRule: 'auto' as const, before: 0, after: 40 },
        children: [
          new TextRun({ text: `${listMatch[1]}.\t${listMatch[2]}`, size: 20 }),
        ],
      });
    }
    return new Paragraph({
      alignment,
      spacing: { line: 276, lineRule: 'auto' as const, before: 0, after: 40 },
      children: [new TextRun({ text: trimmed, size: 20 })],
    });
  });
}

// Helper: solid shading for table cell
function cellShading(hexColor: string) {
  return {
    fill: hexColor,
    type: ShadingType.CLEAR,
    color: hexColor,
  };
}

// Standard border for all table cells
const solidBorder = { style: BorderStyle.SINGLE, size: 6, color: '000000' };
const tableBorders = {
  top: solidBorder,
  bottom: solidBorder,
  left: solidBorder,
  right: solidBorder,
  insideHorizontal: solidBorder,
  insideVertical: solidBorder,
};

// Column widths in twips (total page width ~ 9638 twip for A4 with 2.54cm margins)
// Proportional: CP 25%, ATP 25%, KonMat 15%, PPP 15%, KK 10%, PJJ 10%
const COL_CP = 2410;    // 25%
const COL_ATP = 2410;   // 25%
const COL_KM = 1445;    // 15%
const COL_PPP = 1445;   // 15%
const COL_KK = 962;     // 10%
const COL_PJJ = 966;    // 10%

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
  // ── Header info rows: Nama Sekolah, Nama Mata Pelajaran, Kelas, Fase, JP, Nama Penyusun, NIP
  const headerData: [string, string][] = [
    ['Nama Sekolah', namaSekolah],
    ['Nama Mata Pelajaran', mapel],
    ['Kelas', kelas],
    ['Fase', fase],
  ];
  if (jp) headerData.push(['JP', jp]);
  headerData.push(['Nama Penyusun', penyusun]);
  headerData.push(['NIP', nip]);

  const noBorder = { style: BorderStyle.NIL };
  const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

  const headerRows = headerData.map(
    ([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: 2500, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 40 },
                children: [new TextRun({ text: label, bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: noBorders,
            width: { size: 7138, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 40 },
                children: [new TextRun({ text: ': ' + (value || ''), size: 20 })],
              }),
            ],
          }),
        ],
      })
  );

  const docChildren: (Paragraph | Table)[] = [
    // ── Title: uppercase, bold, centered (matching website h2 uppercase)
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `ALUR TUJUAN PEMBELAJARAN MATA PELAJARAN ${mapel.toUpperCase()}`,
          bold: true,
          size: 28,
          allCaps: true,
        }),
      ],
    }),

    // ── "Identitas" label
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: 'Identitas',
          bold: true,
          size: 20,
          underline: { type: UnderlineType.SINGLE },
        }),
      ],
    }),

    // ── Header info table (no borders)
    new Table({
      rows: headerRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: noBorder,
        insideHorizontal: noBorder,
        insideVertical: noBorder,
      },
    }),

    // ── Spacer
    new Paragraph({ text: '', spacing: { after: 160 } }),

    // ── "Capaian Pembelajaran" label with underline (matching website border-b style)
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: 'Capaian Pembelajaran',
          bold: true,
          size: 20,
          underline: { type: UnderlineType.SINGLE },
        }),
      ],
    }),

    // ── CP body text, justified
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 360, lineRule: 'auto' as const, before: 0, after: 200 },
      children: [new TextRun({ text: cp || '', size: 20 })],
    }),
  ];

  // ── Per-elemen sections
  data.forEach((elemen) => {
    // ELEMEN header with yellow background (outside table)
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 200, after: 120 },
        shading: {
          type: ShadingType.CLEAR,
          fill: 'FFFF00',
        },
        children: [
          new TextRun({
            text: `ELEMEN: ${elemen.namaElemen}`,
            bold: true,
            size: 20,
          }),
        ],
      })
    );

    // Column-width specification
    const columnWidths = [COL_CP, COL_ATP, COL_KM, COL_PPP, COL_KK, COL_PJJ];

    // ── Main data table
    const tableRows: TableRow[] = [
      // Header row with light-blue background (#bfe1ed)
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            shading: cellShading('BFE1ED'),
            width: { size: columnWidths[0], type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: 'Capaian Pembelajaran', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            shading: cellShading('BFE1ED'),
            width: { size: columnWidths[1], type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: 'Alur Tujuan Pembelajaran', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            shading: cellShading('BFE1ED'),
            width: { size: columnWidths[2], type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: 'Konten Materi', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            shading: cellShading('BFE1ED'),
            width: { size: columnWidths[3], type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: 'Profil Pelajar Pancasila', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            shading: cellShading('BFE1ED'),
            width: { size: columnWidths[4], type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: 'Kata Kunci', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            shading: cellShading('BFE1ED'),
            width: { size: columnWidths[5], type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: 'Perkiraan Jumlah Jam', bold: true, size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ];

    // ── Data rows
    if (elemen.rows && Array.isArray(elemen.rows)) {
      elemen.rows.forEach((row) => {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: columnWidths[0], type: WidthType.DXA },
                verticalAlign: 'top',
                children: textToParagraphs(row.capaianPembelajaran, AlignmentType.JUSTIFIED),
              }),
              new TableCell({
                width: { size: columnWidths[1], type: WidthType.DXA },
                verticalAlign: 'top',
                children: textToParagraphs(row.alurTujuanPembelajaran, AlignmentType.JUSTIFIED),
              }),
              new TableCell({
                width: { size: columnWidths[2], type: WidthType.DXA },
                verticalAlign: 'top',
                children: textToParagraphs(row.kontenMateri, AlignmentType.CENTER),
              }),
              new TableCell({
                width: { size: columnWidths[3], type: WidthType.DXA },
                verticalAlign: 'top',
                children: textToParagraphs(row.profilPelajarPancasila, AlignmentType.CENTER),
              }),
              new TableCell({
                width: { size: columnWidths[4], type: WidthType.DXA },
                verticalAlign: 'top',
                children: textToParagraphs(row.kataKunci, AlignmentType.CENTER),
              }),
              new TableCell({
                width: { size: columnWidths[5], type: WidthType.DXA },
                verticalAlign: 'top',
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 40, after: 40 },
                    children: [new TextRun({ text: row.perkiraanJumlahJam || '', bold: true, size: 20 })],
                  }),
                ],
              }),
            ],
          })
        );
      });
    }

    docChildren.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorders,
      })
    );

    // Spacer between elements
    docChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }));
  });

  // ── Signature block (right-aligned, matching website)
  docChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }));
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 60 },
      children: [new TextRun({ text: 'Mengetahui,', bold: true, size: 20 })],
    })
  );
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 60 },
      children: [new TextRun({ text: penyusun, bold: true, size: 20 })],
    })
  );
  // Blank lines for signature space
  for (let i = 0; i < 4; i++) {
    docChildren.push(new Paragraph({ text: '', spacing: { after: 60 } }));
  }
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: `NIP. ${nip || '................................'}`, bold: true, size: 20 })],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertMillimetersToTwip(25),
              right: convertMillimetersToTwip(20),
              bottom: convertMillimetersToTwip(25),
              left: convertMillimetersToTwip(25),
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `ATP_${mapel}_Kelas_${kelas}.docx`);
};
