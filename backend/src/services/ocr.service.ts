import pdf from 'pdf-parse';
import { createWorker } from 'tesseract.js';
import { AppError, ErrorCode } from '../models/errors';

export interface ExtractResult {
  text: string;
  page_count: number;
  method: 'direct' | 'ocr';
}

const MIN_TEXT_LENGTH = 20;

function isDirectTextSufficient(text: string, pageCount: number): boolean {
  if (text.trim().length < MIN_TEXT_LENGTH) {
    return false;
  }
  const perPage = text.trim().length / Math.max(1, pageCount);
  return perPage >= 10;
}

async function extractDirect(buffer: Buffer): Promise<{ text: string; page_count: number }> {
  const data = await pdf(buffer);
  return {
    text: data.text ?? '',
    page_count: data.numpages ?? 1,
  };
}

async function extractOcr(buffer: Buffer): Promise<string> {
  const worker = await createWorker('eng+ara', 1, {
    logger: () => undefined,
  });
  try {
    const { data } = await worker.recognize(buffer);
    return data.text ?? '';
  } finally {
    await worker.terminate();
  }
}

export async function extractPdfText(buffer: Buffer): Promise<ExtractResult> {
  let direct: { text: string; page_count: number };
  try {
    direct = await extractDirect(buffer);
  } catch (err) {
    throw new AppError(ErrorCode.EXTRACTION_ERROR, 'Failed to parse PDF file', 500, {
      cause: err instanceof Error ? err.message : String(err),
    });
  }

  if (isDirectTextSufficient(direct.text, direct.page_count)) {
    return { text: direct.text, page_count: direct.page_count, method: 'direct' };
  }

  try {
    const ocrText = await extractOcr(buffer);
    if (ocrText.trim().length < MIN_TEXT_LENGTH) {
      throw new AppError(
        ErrorCode.EXTRACTION_ERROR,
        'No extractable text found in the PDF. It may be empty or unreadable.',
        400,
      );
    }
    return { text: ocrText, page_count: direct.page_count, method: 'ocr' };
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError(ErrorCode.EXTRACTION_ERROR, 'OCR extraction failed', 500, {
      cause: err instanceof Error ? err.message : String(err),
    });
  }
}
