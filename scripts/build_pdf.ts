import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { PAPER_METADATA, PAPER_BIBLIOGRAPHY } from '../src/data/researchPaperData';
import { FULL_PAPER_SECTIONS } from '../src/data/fullPaperText';

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'letter'
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 40;
const contentWidth = pageWidth - margin * 2;
let y = margin;

const checkPageBreak = (neededHeight: number) => {
  if (y + neededHeight > pageHeight - margin) {
    doc.addPage();
    y = margin;
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('IEEE TRANSACTIONS ON ROBOTICS, REFERENCE MONOGRAPH, OCTOBER 2026', margin, 25);
    doc.text(String(doc.getNumberOfPages()), pageWidth - margin, 25, { align: 'right' });
    doc.line(margin, 28, pageWidth - margin, 28);
    y = 45;
  }
};

// Header
doc.setFont('times', 'italic');
doc.setFontSize(9);
doc.setTextColor(80, 80, 80);
doc.text('IEEE TRANSACTIONS ON ROBOTICS, VOL. 42, NO. 4, OCTOBER 2026', margin, y);
y += 18;

// Title
doc.setFont('times', 'bold');
doc.setFontSize(16);
doc.setTextColor(15, 23, 42);
const titleLines = doc.splitTextToSize(PAPER_METADATA.title, contentWidth);
doc.text(titleLines, margin, y);
y += titleLines.length * 20 + 8;

// Authors
doc.setFont('times', 'normal');
doc.setFontSize(10);
doc.setTextColor(50, 50, 50);
const authorsText = PAPER_METADATA.authors.map(a => `${a.name} (${a.affiliation})`).join('; ');
const authorLines = doc.splitTextToSize(authorsText, contentWidth);
doc.text(authorLines, margin, y);
y += authorLines.length * 13 + 6;

// Metadata / DOI
doc.setFont('courier', 'normal');
doc.setFontSize(8);
doc.setTextColor(70, 70, 70);
doc.text(`DOI: ${PAPER_METADATA.doi}  |  ${PAPER_METADATA.arxiv}  |  Date: ${PAPER_METADATA.date}`, margin, y);
y += 14;

// Divider
doc.setDrawColor(200, 200, 200);
doc.line(margin, y, pageWidth - margin, y);
y += 14;

// Abstract Box
checkPageBreak(120);
doc.setFillColor(245, 247, 250);
doc.rect(margin, y, contentWidth, 110, 'F');
doc.setDrawColor(220, 226, 235);
doc.rect(margin, y, contentWidth, 110, 'S');

doc.setFont('times', 'bold');
doc.setFontSize(10);
doc.setTextColor(15, 23, 42);
doc.text('Abstract—', margin + 10, y + 16);

doc.setFont('times', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(40, 40, 40);
const abstractText = PAPER_METADATA.abstract.replace(/\n+/g, ' ');
const abstractLines = doc.splitTextToSize(abstractText, contentWidth - 20);
doc.text(abstractLines.slice(0, 7), margin + 10, y + 28);

// Keywords
doc.setFont('times', 'bold');
doc.setFontSize(8.5);
doc.text('Index Terms—', margin + 10, y + 100);
doc.setFont('times', 'normal');
doc.text(PAPER_METADATA.keywords.join(', '), margin + 70, y + 100);

y += 125;

// Sections
FULL_PAPER_SECTIONS.forEach((sec) => {
  checkPageBreak(50);
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  const secHeading = `${sec.number}. ${sec.title.toUpperCase()}`;
  const headingLines = doc.splitTextToSize(secHeading, contentWidth);
  doc.text(headingLines, margin, y);
  y += headingLines.length * 15 + 4;

  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  const leadLines = doc.splitTextToSize(sec.leadParagraph, contentWidth);
  doc.text(leadLines, margin, y);
  y += leadLines.length * 12 + 8;

  sec.subsections.forEach((sub) => {
    checkPageBreak(40);
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`${sub.number} ${sub.title}`, margin, y);
    y += 14;

    const rawText = sub.contentHtml
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/&rarr;/g, '->')
      .replace(/&mdash;/g, '--')
      .replace(/&middot;/g, '.')
      .replace(/&le;/g, '<=')
      .replace(/&ge;/g, '>=')
      .replace(/&plusmn;/g, '+/-')
      .replace(/\\\\/g, '\\')
      .replace(/\s+/g, ' ')
      .trim();

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const textLines = doc.splitTextToSize(rawText, contentWidth);

    for (let i = 0; i < textLines.length; i++) {
      checkPageBreak(12);
      doc.text(textLines[i], margin, y);
      y += 11.5;
    }
    y += 6;
  });
  y += 10;
});

// References
checkPageBreak(60);
doc.setFont('times', 'bold');
doc.setFontSize(12);
doc.setTextColor(15, 23, 42);
doc.text('REFERENCES', margin, y);
y += 16;

doc.setFont('times', 'normal');
doc.setFontSize(8);
doc.setTextColor(60, 60, 60);

PAPER_BIBLIOGRAPHY.forEach((b, idx) => {
  checkPageBreak(25);
  const citText = `[${idx + 1}] ${b.authors}, "${b.title}," in ${b.venue}, ${b.year}. doi: ${b.doi || 'N/A'}`;
  const citLines = doc.splitTextToSize(citText, contentWidth);
  doc.text(citLines, margin, y);
  y += citLines.length * 11 + 4;
});

const pdfBuffer = doc.output('arraybuffer');
const outputPath = path.resolve(process.cwd(), 'public', 'Autonomous_Sensorimotor_Synthesis_Paper.pdf');
fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
console.log(`PDF successfully built at: ${outputPath} (${pdfBuffer.byteLength} bytes)`);
