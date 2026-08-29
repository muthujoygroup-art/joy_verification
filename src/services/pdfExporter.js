import html2pdf from 'html2pdf.js';

/**
 * Universal High-Resolution Client-Side PDF Exporter
 * Converts any HTML DOM Element / Template into a clean, pixel-perfect A4 Multi-Page PDF.
 */
export const exportElementToPdf = async (elementOrId, filename = 'document.pdf', options = {}) => {
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  
  if (!element) {
    console.error(`exportElementToPdf: Element not found (${elementOrId})`);
    window.print();
    return false;
  }

  const defaultOptions = {
    margin: [8, 8, 8, 8], // 8mm margins
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, // 2x Retina resolution
      useCORS: true,
      logging: false,
      letterRendering: true,
      windowWidth: 1024
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    pagebreak: { 
      mode: ['css', 'legacy'],
      before: '.pdf-page-break-before',
      after: '.pdf-page-break-after',
      avoid: ['.pdf-avoid-break', 'tr', 'thead']
    },
    ...options
  };

  try {
    await html2pdf().set(defaultOptions).from(element).save();
    return true;
  } catch (error) {
    console.warn('html2pdf export encountered error, falling back to window.print:', error);
    window.print();
    return false;
  }
};
