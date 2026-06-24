const axios = require('axios');
const mammoth = require('mammoth');

const pdfParse = require('pdf-parse');

const downloadFileBuffer = async (url) => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    maxRedirects: 5,
    timeout: 15000,
  });
  return Buffer.from(response.data);
};

exports.extractTextFromResume = async (input, fileType) => {
  let buffer;

  if (Buffer.isBuffer(input)) {
    buffer = input;
  } else if (typeof input === 'string' && input.trim()) {
    const normalizedUrl = input.startsWith('http') ? input : `https://${input}`;
    buffer = await downloadFileBuffer(normalizedUrl);
  } else {
    throw new Error('Invalid input: expected Buffer or URL string.');
  }

  if (fileType === 'pdf') {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (err) {
      console.error('pdf-parse error:', err.message);
      throw new Error(`PDF parsing failed: ${err.message}`);
    }
  }

  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
};