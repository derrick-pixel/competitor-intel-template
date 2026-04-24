// pdf-generator.js — rasterise each .pdf-page into an A4 PDF (full-bleed).
// Depends on global html2canvas and jspdf.jsPDF loaded via <script> tags.

export async function generatePDF({ root, filename, onProgress }) {
  // eslint-disable-next-line no-undef
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pages = root.querySelectorAll('.pdf-page');
  const total = pages.length;
  for (let i = 0; i < total; i++) {
    const pg = pages[i];
    // eslint-disable-next-line no-undef
    const canvas = await html2canvas(pg, {
      scale: 2, useCORS: true, backgroundColor: null, logging: false,
      width: pg.offsetWidth, height: pg.offsetHeight
    });
    const imgData = canvas.toDataURL('image/png');
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    onProgress?.(i + 1, total);
  }
  pdf.save(filename);
}
