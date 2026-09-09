import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Universal High-Resolution Multi-Page PDF Exporter
 * Renders HTML DOM elements into a perfectly paginated, crisp A4 PDF.
 * If multiple .pdf-page-block elements exist, captures each as a dedicated standalone A4 page.
 * Includes intelligent auto-scaling for minor overflows and dynamic 'Page X of Y' vector running footers.
 */
export const exportElementToPdf = async (elementOrId, filename = 'document.pdf', options = {}) => {
  const rootElement = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  
  if (!rootElement) {
    console.error(`exportElementToPdf: Element '${elementOrId}' not found.`);
    return false;
  }

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const margin = 10; // 10mm clean margin
    const footerHeight = 12; // 12mm reserved for footer
    const contentWidth = pageWidth - (margin * 2); // 190mm
    const maxContentHeight = pageHeight - (margin * 2) - footerHeight; // 265mm printable zone

    // Find all discrete page blocks if present
    const pageBlocks = rootElement.querySelectorAll('.pdf-page-block');
    const elementsToCapture = pageBlocks.length > 0 ? Array.from(pageBlocks) : [rootElement];

    let isFirstPage = true;

    for (let i = 0; i < elementsToCapture.length; i++) {
      const pageEl = elementsToCapture[i];

      // Capture single page element with high resolution
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 1024
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const renderedHeight = (canvas.height * contentWidth) / canvas.width;

      // Case 1: Fits comfortably within 1 A4 page
      if (renderedHeight <= maxContentHeight) {
        if (!isFirstPage) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, renderedHeight);
        isFirstPage = false;
      } 
      // Case 2: Slightly taller than 1 page (overflow <= 22%)
      // Proportionally scale down slightly so it stays on 1 page and prevents severed text
      else if (renderedHeight <= maxContentHeight * 1.22) {
        if (!isFirstPage) {
          pdf.addPage();
        }
        const scaleFactor = maxContentHeight / renderedHeight;
        const scaledWidth = contentWidth * scaleFactor;
        const scaledHeight = renderedHeight * scaleFactor;
        const xOffset = margin + (contentWidth - scaledWidth) / 2;
        pdf.addImage(imgData, 'JPEG', xOffset, margin, scaledWidth, scaledHeight);
        isFirstPage = false;
      } 
      // Case 3: Substantially taller than 1 page - graceful multi-page slicing
      else {
        let heightLeft = renderedHeight;
        let position = margin;

        if (!isFirstPage) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, renderedHeight);
        heightLeft -= maxContentHeight;
        isFirstPage = false;

        while (heightLeft > 0) {
          position = heightLeft - renderedHeight + margin;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, renderedHeight);
          heightLeft -= maxContentHeight;
        }
      }
    }

    // Dynamic Running Footer on all pages
    const totalPages = pdf.getNumberOfPages();
    const showFooter = options.showFooter !== undefined ? options.showFooter : (totalPages > 1);

    if (showFooter) {
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);

        // Subtle divider line above footer
        pdf.setDrawColor(226, 232, 240); // slate-200
        pdf.setLineWidth(0.25);
        pdf.line(margin, pageHeight - 9, pageWidth - margin, pageHeight - 9);

        // Footer text
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);
        pdf.setTextColor(148, 163, 184); // slate-400

        const footerLeft = options.footerLeft || 'CONFIDENTIAL & STATUTORY RECORD • JOY CORPORATE SOLUTIONS';
        pdf.text(footerLeft, margin, pageHeight - 5);

        const pageStr = `Page ${p} of ${totalPages}`;
        const strWidth = (pdf.getStringUnitWidth(pageStr) * 7.5) / pdf.internal.scaleFactor;
        pdf.text(pageStr, pageWidth - margin - strWidth, pageHeight - 5);
      }
    }

    // Direct client file download
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('jsPDF export error:', error);
    return false;
  }
};

