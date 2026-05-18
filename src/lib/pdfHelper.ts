import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ATPItem } from './docxHelper';

export const exportToPdf = (
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
  const doc = new jsPDF('p');
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const title = `Alur Tujuan Pembelajaran Mata Pelajaran ${mapel}`;
  doc.text(title, pageWidth / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const headerLines = [
    [`Nama Sekolah`, namaSekolah],
    [`Nama Mata Pelajaran`, mapel],
    [`Kelas`, kelas],
    [`Fase`, fase],
    [`Nama Penyusun`, penyusun],
    [`NIP`, nip],
    [`JP`, jp],
  ];

  let y = 24;
  headerLines.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label} :`, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value || '', 65, y);
    y += 7;
  });

  doc.setFont('helvetica', 'bold');
  doc.text('Capaian Pembelajaran', 14, y + 4);
  doc.setFont('helvetica', 'normal');
  const cpLines = doc.splitTextToSize(cp || '', pageWidth - 28);
  doc.text(cpLines, 14, y + 10);

  const cpHeight = cpLines.length * 5;
  const startY = y + 14 + cpHeight;

  (doc as any).autoTable({
    startY,
    head: [[
      'Capaian Pembelajaran Per Elemen',
      'Tujuan Pembelajaran',
      'Alur Tujuan Pembelajaran',
    ]],
    body: data.map((item) => [
      item.hasilTelaah || '',
      item.tujuanPembelajaran || '',
      item.alurTujuanPembelajaran || '',
    ]),
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
      valign: 'top',
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      halign: 'center',
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      fontStyle: 'bold',
    },
    bodyStyles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 65 },
      2: { cellWidth: 65 },
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || startY + 40;
  doc.setFont('helvetica', 'bold');
  doc.text('Mengetahui,', pageWidth - 70, finalY + 18);
  doc.text('Kepala Sekolah', pageWidth - 76, finalY + 25);
  doc.text('____________________', pageWidth - 88, finalY + 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${nip || '________________'}`, pageWidth - 76, finalY + 52);

  doc.save(`ATP_${mapel}_Kelas_${kelas}.pdf`);
};
