const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const CAPTURE_SCALE = 2;
const JPEG_QUALITY = 0.92;

export const saveObjectionPdf = async (
  container: HTMLElement,
  fileName: string,
) => {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pages = Array.from(container.children);

  for (const [index, page] of pages.entries()) {
    if (!(page instanceof HTMLElement)) continue;
    const canvas = await html2canvas(page, {
      scale: CAPTURE_SCALE,
      backgroundColor: "#ffffff",
    });
    const mmPerPixel = Math.min(
      A4_WIDTH_MM / canvas.width,
      A4_HEIGHT_MM / canvas.height,
    );
    if (index > 0) pdf.addPage();
    pdf.addImage(
      canvas.toDataURL("image/jpeg", JPEG_QUALITY),
      "JPEG",
      0,
      0,
      canvas.width * mmPerPixel,
      canvas.height * mmPerPixel,
    );
  }

  pdf.save(fileName);
};
