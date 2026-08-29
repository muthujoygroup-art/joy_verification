import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Universal High-Resolution Client-Side PDF Exporter
 * Converts any HTML DOM Element into a crisp, multi-page vector A4 PDF using jsPDF + html2canvas.
 */
export const exportElementToPdf = async (elementOrId, filename = 'document.pdf', options = {}) => {
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  
  if (!element) {
    console.error(`exportElementToPdf: Element '${elementOrId}' not found.`);
    return false;
  }

  try {
    // 1. Capture element with 2x retina scaling and clean white background
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 1200
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8; // 8mm margin
    
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = (canvas.height * contentWidth) / canvas.width;
    
    let heightLeft = contentHeight;
    let position = margin;

    // First page
    pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
    heightLeft -= (pageHeight - (margin * 2));

    // Subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - contentHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pageHeight - (margin * 2));
    }

    // Direct client file download
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('jsPDF export error:', error);
    return false;
  }
};
