import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Universal High-Resolution Multi-Page PDF Exporter
 * Renders HTML DOM elements into a perfectly paginated, crisp A4 PDF.
 * If multiple .pdf-page-block elements exist, captures each as a dedicated standalone A4 page.
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
    const contentWidth = pageWidth - (margin * 2); // 190mm
    const maxContentHeight = pageHeight - (margin * 2); // 277mm

    // Find all discrete page blocks if present
    const pageBlocks = rootElement.querySelectorAll('.pdf-page-block');
    const elementsToCapture = pageBlocks.length > 0 ? Array.from(pageBlocks) : [rootElement];

    let isFirstPage = true;

    for (let i = 0; i < elementsToCapture.length; i++) {
      const pageEl = elementsToCapture[i];

      // Capture single page element
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 1000
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const renderedHeight = (canvas.height * contentWidth) / canvas.width;

      // If the rendered height fits within single page
      if (renderedHeight <= maxContentHeight) {
        if (!isFirstPage) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, renderedHeight);
        isFirstPage = false;
      } else {
        // If single block is taller than 1 page, chunk it with safe page transitions
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

    // Direct client file download
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('jsPDF export error:', error);
    return false;
  }
};
