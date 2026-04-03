/**
 * ConvertAPI PDF Compression Service
 * Endpoint: https://v2.convertapi.com/convert/pdf/to/compress
 */

const API_KEY = 'jMgWLdWmEAGMcHrLVBSbzgvcGuxFNSmm'; // Replace with your API key if different
const API_URL = 'https://v2.convertapi.com/convert/pdf/to/compress';

/**
 * Compresses a PDF file using ConvertAPI
 * @param {File} file - The PDF file object from input
 * @param {Object} options - Compression options (quality, resolution, etc.)
 * @returns {Promise<Object>} - The API response containing the compressed file data
 */
export const compressPdf = async (file, options = {}) => {
  const { quality = 50, resolution = 144 } = options;

  // Use FormData for efficient binary file upload
  const formData = new FormData();
  formData.append('File', file);
  formData.append('ImageQuality', quality);
  formData.append('ImageResolution', resolution);
  
  // Additional optimization flags
  formData.append('Linearize', 'true');
  formData.append('RemoveMetadata', 'true');
  formData.append('RemoveForms', 'true');
  formData.append('RemoveBookmarks', 'true');
  formData.append('RemoveAnnotations', 'true');
  formData.append('RemoveEmbeddedFiles', 'true');
  formData.append('CompressContents', 'true');

  try {
    const response = await fetch(`${API_URL}?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
      // ConvertAPI handles boundary automatically with FormData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('PDF Compression Error:', error);
    throw error;
  }
};

/**
 * Deletes specific pages from a PDF file using ConvertAPI
 * @param {File} file - The PDF file object from input
 * @param {String} pages - The page numbers/ranges to delete (e.g., "1,3,5-7")
 * @returns {Promise<Object>} - The API response containing the modified file data
 */
export const deletePdfPages = async (file, pages) => {
  if (!pages) throw new Error('Please specify the pages to delete.');

  const formData = new FormData();
  formData.append('File', file);
  formData.append('PageRange', pages);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/delete-pages?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('PDF Delete Pages Error:', error);
    throw error;
  }
};

/**
 * Converts a DJVU file to a PDF file using ConvertAPI
 * @param {File} file - The DJVU file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertDjvuToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/djvu/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('DJVU to PDF Conversion Error:', error);
    throw error;
  }
};

/**
 * Converts an EPS file to a PDF file using ConvertAPI
 * @param {File} file - The EPS file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertEpsToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/eps/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('EPS to PDF Conversion Error:', error);
    throw error;
  }
};

/**
 * Converts an EPUB file to a PDF file using ConvertAPI
 * @param {File} file - The EPUB file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertEpubToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/epub/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('EPUB to PDF Conversion Error:', error);
    throw error;
  }
};

/**
 * Converts a GIF file to a PDF file using ConvertAPI
 * @param {File} file - The GIF file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertGifToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/gif/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('GIF to PDF Conversion Error:', error);
    throw error;
  }
};

/**
 * Converts a HEIC file to a PDF file using ConvertAPI
 * @param {File} file - The HEIC file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertHeicToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/heic/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('HEIC to PDF Conversion Error:', error);
    throw error;
  }
};

/**
 * Converts an HTML file to a PDF file using ConvertAPI
 * @param {File} file - The HTML file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertHtmlToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/html/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('HTML to PDF Conversion Error:', error);
    throw error;
  }
};

/**
 * Converts an ICO file to a PDF file using ConvertAPI
 * @param {File} file - The ICO file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertIcoToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/ico/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('ICO to PDF Conversion Error:', error);
    throw error;
  }
};

/**
 * Converts a JPG or JPEG file to a PDF file using ConvertAPI
 * @param {File} file - The JPG/JPEG file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertJpgToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/jpg/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('JPG to PDF Conversion Error:', error);
    throw error;
  }
};
/**
 * Merges multiple PDF files into a single PDF using ConvertAPI
 * @param {Array<File>} files - Array of PDF file objects to merge
 * @returns {Promise<Object>} - The API response containing the merged PDF file data
 */
export const mergePdfs = async (files) => {
  if (!files || files.length < 2) {
    throw new Error('At least two PDF files are required for merging.');
  }

  const formData = new FormData();
  // ConvertAPI REST API expects Files[0], Files[1], etc. for multiple files
  files.forEach((file, index) => {
    formData.append(`Files[${index}]`, file);
  });

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/merge?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('PDF Merge Error:', error);
    throw error;
  }
};

/**
 * Converts a MOBI file to a PDF file using ConvertAPI
 * @param {File} file - The MOBI file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertMobiToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/mobi/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('MOBI to PDF Conversion Error:', error);
    throw error;
  }
};

/**
 * Converts an MSG file to a PDF file using ConvertAPI
 * @param {File} file - The MSG file object from input
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertMsgToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/msg/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('MSG to PDF Conversion Error:', error);
    throw error;
  }
};

/**
 * Converts an Office document (Word, Excel, PowerPoint) to a PDF file using ConvertAPI
 * @param {File} file - The Office file object from input (.doc, .docx, .xls, .xlsx, .ppt, .pptx)
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertOfficeToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/office/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('Office to PDF Conversion Error:', error);
    throw error;
  }
};
/**
 * Converts a scanned PDF to a searchable PDF using OCR (ConvertAPI)
 * @param {File} file - The scanned PDF file object from input
 * @returns {Promise<Object>} - The API response containing the searchable PDF file data
 */
export const convertPdfToOcr = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  // Ensure we get a searchable PDF back, not just raw text
  formData.append('ExtractMode', 'searchablepdf');
  formData.append('StoreFile', 'true');

  try {
    console.log('Starting PDF OCR conversion for:', file.name);
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/ocr?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ConvertAPI Error Response:', errorData);
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('ConvertAPI Success Response:', data);
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('PDF OCR Error Detailed:', error);
    throw error;
  }
};

/**
 * Converts a PDF to an HTML file using ConvertAPI
 * @param {File} file - The PDF file object from input
 * @returns {Promise<Object>} - The API response containing the converted HTML file data
 */
export const convertPdfToHtml = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('StoreFile', 'true');

  try {
    console.log('Starting PDF to HTML conversion for:', file.name);
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/html?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ConvertAPI Error Response (HTML):', errorData);
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('ConvertAPI Success Response (HTML):', data);
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('PDF to HTML Error Detailed:', error);
    throw error;
  }
};

/**
 * Converts a PDF to a Word document (.docx) using ConvertAPI
 * @param {File} file - The PDF file object
 * @returns {Promise<Object>} - The API response containing the .docx file data
 */
export const convertPdfToWord = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/docx?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.Files || data.Files.length === 0) throw new Error('No files returned from the API.');
    return data.Files[0];
  } catch (error) {
    console.error('PDF to Word Error:', error);
    throw error;
  }
};

/**
 * Converts a Word document (.doc, .docx) to a PDF using ConvertAPI
 * @param {File} file - The Word file object
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertWordToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/docx/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.Files || data.Files.length === 0) throw new Error('No files returned from the API.');
    return data.Files[0];
  } catch (error) {
    console.error('Word to PDF Error:', error);
    throw error;
  }
};

/**
 * Splits a PDF file into multiple files based on page ranges using ConvertAPI
 * @param {File} file - The PDF file object
 * @returns {Promise<Array<Object>>} - The API response containing the split files data
 */
export const splitPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  // Default to splitting every page if no range specified? 
  // ConvertAPI pdf/to/split usually splits every page if no range is provided.
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/split?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.Files || data.Files.length === 0) throw new Error('No files returned from the API.');
    return data.Files; // Split returns multiple files
  } catch (error) {
    console.error('PDF Split Error:', error);
    throw error;
  }
};

/**
 * Converts a PDF file to an Excel spreadsheet using ConvertAPI
 * @param {File} file - The PDF file object
 * @returns {Promise<Object>} - The API response containing the Excel file data
 */

/**
 * Converts a PDF file to a PowerPoint Presentation (.pptx) using ConvertAPI
 * @param {File} file - The PDF file object
 * @returns {Promise<Object>} - The API response containing the PPTX file data
 */
export const convertPdfToPptx = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/pptx?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Files[0];
  } catch (error) {
    console.error('PDF to PPTX Error:', error);
    throw error;
  }
};

/**
 * Converts a PDF file to a plain Text document (.txt) using ConvertAPI
 * @param {File} file - The PDF file object
 * @returns {Promise<Object>} - The API response containing the TXT file data
 */
export const convertPdfToTxt = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/txt?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Files[0];
  } catch (error) {
    console.error('PDF to TXT Error:', error);
    throw error;
  }
};

/**
 * Converts a PNG image to a PDF document using ConvertAPI
 * @param {File} file - The PNG file object
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertPngToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/png/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Files[0];
  } catch (error) {
    console.error('PNG to PDF Error:', error);
    throw error;
  }
};

/**
 * Protects a PDF file using a password via ConvertAPI
 * @param {File} file - The PDF file object
 * @param {string} password - The password to encrypt the PDF with
 * @returns {Promise<Object>} - The API response containing the protected PDF file data
 */
export const protectPdf = async (file, password) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('UserPassword', password);
  formData.append('OwnerPassword', password);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/protect?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Files[0];
  } catch (error) {
    console.error('Protect PDF Error:', error);
    throw error;
  }
};

/**
 * Rotates a PDF file using ConvertAPI
 * @param {File} file - The PDF file object
 * @param {number|string} angle - The rotation angle (90, 180, 270)
 * @returns {Promise<Object>} - The API response containing the rotated PDF file data
 */
export const rotatePdf = async (file, angle = 90) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('Rotate', angle.toString());
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/rotate?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Files[0];
  } catch (error) {
    console.error('Rotate PDF Error:', error);
    throw error;
  }
};

/**
 * Converts a plain text string into a PDF document using ConvertAPI
 * @param {string} text - The raw text to convert
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertTxtToPdf = async (text) => {
  const file = new File([text], 'document.txt', { type: 'text/plain' });
  const formData = new FormData();
  formData.append('File', file);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/txt/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Files[0];
  } catch (error) {
    console.error('TXT to PDF Error:', error);
    throw error;
  }
};

/**
 * Converts a TIFF image file into a PDF document using ConvertAPI
 * @param {File} file - The TIFF (.tif, .tiff) file to convert
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertTiffToPdf = async (file) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/tiff/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Files[0];
  } catch (error) {
    console.error('TIFF to PDF Error:', error);
    throw error;
  }
};

/**
 * Removes password protection from a PDF document using ConvertAPI
 * @param {File} file - The password-protected PDF file
 * @param {string} password - The password to unlock the document
 * @returns {Promise<Object>} - The API response containing the unlocked file data
 */
export const unprotectPdf = async (file, password) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('Password', password);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/unprotect?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || 'Failed to unlock PDF. Please check your password and try again.');
    }

    const data = await response.json();
    return data.Files[0];
  } catch (error) {
    console.error('Unlock PDF Error:', error);
    throw error;
  }
};

/**
 * Adds a text watermark to a PDF document using ConvertAPI
 * @param {File} file - The PDF file to be watermarked
 * @param {string} text - The watermark text to apply
 * @returns {Promise<Object>} - The API response containing the watermarked file data
 */
export const watermarkPdf = async (file, text) => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('Text', text);
  formData.append('StoreFile', 'true');

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/text-watermark?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || 'Failed to add watermark to PDF. Please try again.');
    }

    const data = await response.json();
    return data.Files[0];
  } catch (error) {
    console.error('Watermark PDF Error:', error);
    throw error;
  }
};

/**
 * Converts a Web URL to a PDF using ConvertAPI
 * @param {string} url - The URL to convert
 * @returns {Promise<Object>} - The API response containing the PDF file data
 */
export const convertWebToPdf = async (url) => {
  if (!url) throw new Error('Please enter a website URL.');

  const formData = new FormData();
  formData.append('Url', url);
  formData.append('StoreFile', 'true');
  formData.append('FileName', `web-capture-${Date.now()}.pdf`);

  try {
    const response = await fetch(`https://v2.convertapi.com/convert/web/to/pdf?Secret=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Files || data.Files.length === 0) {
      throw new Error('No files returned from the API.');
    }

    return data.Files[0];
  } catch (error) {
    console.error('Web to PDF Error:', error);
    throw error;
  }
};
