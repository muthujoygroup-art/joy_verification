import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  try {
    // Attempt local worker URL or unpkg CDN worker fallback
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
  }
}

/**
 * Converts a base64 string, File, Blob, or URL of a PDF into an array of high-resolution JPEG data URLs.
 * @param {string|File|Blob|ArrayBuffer} pdfInput - The PDF source.
 * @param {Object} options - Configuration options (maxPages, scale, quality).
 * @returns {Promise<{pages: string[], firstPageImage: string, pageCount: number}>}
 */
export async function convertPdfToImages(pdfInput, options = {}) {
  const maxPages = options.maxPages || 5;
  const scale = options.scale || 2.0; // 2x scale for sharp text rendering
  const quality = options.quality || 0.95;

  if (!pdfInput) {
    return { pages: [], firstPageImage: '', pageCount: 0 };
  }

  try {
    let loadingTask;

    if (typeof pdfInput === 'string') {
      if (pdfInput.startsWith('data:application/pdf') || pdfInput.startsWith('data:;base64,') || pdfInput.startsWith('data:binary/octet-stream')) {
        const base64Data = pdfInput.split(',')[1] || pdfInput;
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        loadingTask = pdfjsLib.getDocument({ data: bytes });
      } else {
        loadingTask = pdfjsLib.getDocument({ url: pdfInput });
      }
    } else if (pdfInput instanceof File || pdfInput instanceof Blob) {
      const arrayBuffer = await pdfInput.arrayBuffer();
      loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    } else if (pdfInput instanceof ArrayBuffer || pdfInput instanceof Uint8Array) {
      loadingTask = pdfjsLib.getDocument({ data: pdfInput });
    } else {
      console.warn('convertPdfToImages: Unsupported PDF input format', pdfInput);
      return { pages: [], firstPageImage: '', pageCount: 0 };
    }

    const pdfDoc = await loadingTask.promise;
    const pageCount = pdfDoc.numPages;
    const pagesToRender = Math.min(pageCount, maxPages);
    const pages = [];

    for (let pageNum = 1; pageNum <= pagesToRender; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
      pages.push(imgDataUrl);
    }

    return {
      pages,
      firstPageImage: pages[0] || '',
      pageCount
    };
  } catch (err) {
    console.error('convertPdfToImages error:', err);
    return { pages: [], firstPageImage: '', pageCount: 0, error: err.message };
  }
}

/**
 * Helper to check if a file or dataUrl is a PDF
 */
export function isPdfSource(source, fileName = '', mimeType = '') {
  if (typeof source === 'string') {
    if (source.startsWith('data:application/pdf') || source.toLowerCase().includes('.pdf')) {
      return true;
    }
  }
  if (mimeType && mimeType.includes('pdf')) return true;
  if (fileName && fileName.toLowerCase().endsWith('.pdf')) return true;
  return false;
}
