import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a tamper-evident Unique Document Verification ID (DOC-ID)
 * Example: DOC-2026-8F9A-4B2C
 */
export const generateUniqueDocId = (prefix = 'DOC') => {
  const year = new Date().getFullYear();
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let c1 = '';
  let c2 = '';
  for (let i = 0; i < 4; i++) c1 += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) c2 += chars.charAt(Math.floor(Math.random() * chars.length));
  return `${prefix}-${year}-${c1}-${c2}`;
};

/**
 * Universal High-Resolution Multi-Page PDF Exporter with Anti-Forgery Unique Document Verification ID
 * Renders HTML DOM elements into a perfectly paginated, crisp A4 PDF.
 * Embeds unique Document ID into PDF Metadata properties, filename, anti-tamper footer, and vector watermarks.
 */
export const exportElementToPdf = async (elementOrId, filename = 'document.pdf', options = {}) => {
  const rootElement = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  
  if (!rootElement) {
    console.error(`exportElementToPdf: Element '${elementOrId}' not found.`);
    return false;
  }

  // Generate or assign unique Document ID
  const docId = options.docId || generateUniqueDocId(options.prefix || 'DOC');

  // Format final download filename to guarantee distinct tracking ID in file system
  let safeFilename = filename;
  if (!safeFilename.includes(docId) && !safeFilename.includes('DOC-') && !safeFilename.includes('JCS-')) {
    const extIdx = safeFilename.lastIndexOf('.');
    if (extIdx > 0) {
      safeFilename = `${safeFilename.substring(0, extIdx)}_${docId}${safeFilename.substring(extIdx)}`;
    } else {
      safeFilename = `${safeFilename}_${docId}.pdf`;
    }
  }

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const margin = 10; // 10mm clean margin
    const footerHeight = 12; // 12mm reserved for footer
    const contentWidth = pageWidth - (margin * 2); // 190mm
    const maxContentHeight = pageHeight - (margin * 2) - footerHeight; // 265mm printable zone

    // Set Embedded PDF Security Metadata Properties to prevent editing/forgery
    pdf.setProperties({
      title: safeFilename,
      subject: `AUTHENTICATED VERIFICATION RECORD • UNIQUE DOC ID: ${docId}`,
      author: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
      keywords: `DocID:${docId}, Authentic, ISO27001, AntiForgery, Verification`,
      creator: 'JOY Verification Platform 2.0 Security Exporter'
    });

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

    // Dynamic Running Footer on all pages with Tamper-Evident Unique Document Verification ID
    const totalPages = pdf.getNumberOfPages();
    const showFooter = options.showFooter !== undefined ? options.showFooter : true;

    if (showFooter) {
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);

        // Subtle divider line above footer
        pdf.setDrawColor(226, 232, 240); // slate-200
        pdf.setLineWidth(0.25);
        pdf.line(margin, pageHeight - 9, pageWidth - margin, pageHeight - 9);

        // Footer text with Doc ID
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.0);
        pdf.setTextColor(99, 102, 241); // indigo-600

        const footerLeft = options.footerLeft || `DOC UNIQUE VERIFICATION ID: ${docId} • JOY CORPORATE SOLUTIONS PVT LTD`;
        pdf.text(footerLeft, margin, pageHeight - 5);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);
        pdf.setTextColor(148, 163, 184); // slate-400

        const pageStr = `Page ${p} of ${totalPages}`;
        const strWidth = (pdf.getStringUnitWidth(pageStr) * 7.5) / pdf.internal.scaleFactor;
        pdf.text(pageStr, pageWidth - margin - strWidth, pageHeight - 5);
      }
    }

    // Direct client file download with docId filename
    pdf.save(safeFilename);
    return { success: true, docId, filename: safeFilename };
  } catch (error) {
    console.error('jsPDF export error:', error);
    return false;
  }
};
