// pdf-generator.js — rasterise each .pdf-page into an A4 PDF (full-bleed).
// Depends on global html2canvas and jspdf.jsPDF loaded via <script> tags.
//
// Size tuning: scale 1.25 + JPEG 0.72 + compress:true + FAST image pipeline
// keeps a 15-page sample report well under 1 MB while staying legible at
// print resolution. PNG + scale 2 would produce ~110 MB for the same report.

export async function generatePDF({ root, filename, onProgress }) {
  // eslint-disable-next-line no-undef
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

  const pages = root.querySelectorAll('.pdf-page');
  const total = pages.length;
  for (let i = 0; i < total; i++) {
    const pg = pages[i];
    // eslint-disable-next-line no-undef
    const canvas = await html2canvas(pg, {
      scale: 1.25, useCORS: true, backgroundColor: '#ffffff', logging: false,
      width: pg.offsetWidth, height: pg.offsetHeight
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.72);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    onProgress?.(i + 1, total);
  }
  pdf.save(filename);
}
