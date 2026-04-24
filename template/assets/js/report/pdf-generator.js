// pdf-generator.js — rasterise each .pdf-page into an A4 PDF (full-bleed).
// Depends on global html2canvas and jspdf.jsPDF loaded via <script> tags.
//
// Size tuning: scale 1.5 + JPEG 0.85 + compress:true keeps a 15-page sample
// report under ~5 MB while staying crisp at print resolution. PNG + scale 2
// would produce ~110 MB for the same report.

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
      scale: 1.5, useCORS: true, backgroundColor: null, logging: false,
      width: pg.offsetWidth, height: pg.offsetHeight
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    onProgress?.(i + 1, total);
  }
  pdf.save(filename);
}
