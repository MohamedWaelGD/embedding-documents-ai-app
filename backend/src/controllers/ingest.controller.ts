import { Request, Response } from 'express';
import {
  ExtractResponse,
  ConfirmRequest,
  StructureResponse,
  ConfirmResponse,
  StructuredRegulation,
} from '../models';
import { AppError, ErrorCode, validationError } from '../models/errors';
import { extractPdfText } from '../services/ocr.service';
import { cleanText } from '../services/text-cleaner.service';
import { chunkText } from '../services/chunking.service';
import { structureDocument } from '../services/structuring.service';
import { persistDocument } from '../services/document-persist.service';

export async function uploadHandler(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    throw validationError('No file provided. Expected a PDF file in field "file".');
  }
  if (req.file.mimetype !== 'application/pdf') {
    throw validationError('Invalid file type. Only PDF files are accepted.');
  }

  const result = await extractPdfText(req.file.buffer);
  const documentId = crypto.randomUUID();

  const response: ExtractResponse = {
    document_id: documentId,
    raw_text: cleanText(result.text),
    page_count: result.page_count,
    filename: req.file.originalname,
    extraction_method: result.method,
  };
  res.json(response);
}

export async function structureHandler(req: Request, res: Response): Promise<void> {
  const { document_id: documentId, raw_text } = req.body ?? {};
  if (typeof documentId !== 'string' || documentId.length === 0) {
    throw validationError('document_id is required.');
  }
  if (typeof raw_text !== 'string' || raw_text.trim().length === 0) {
    throw validationError('raw_text is required.');
  }

  const cleaned = cleanText(raw_text);
  const structured = await structureDocument(cleaned, documentId);
  const chunks = await chunkText(cleaned);

  const response: StructureResponse = {
    document_id: documentId,
    raw_text: cleaned,
    structured_data: structured,
    chunks,
  };
  res.json(response);
}

export async function confirmHandler(req: Request, res: Response): Promise<void> {
  const body = req.body as ConfirmRequest & { structured_data?: unknown };
  if (!body || typeof body.filename !== 'string' || typeof body.raw_text !== 'string') {
    throw validationError('filename and raw_text are required.');
  }

  let structured: StructuredRegulation;
  try {
    structured = JSON.parse(String(body.structured_data)) as StructuredRegulation;
  } catch {
    throw validationError('structured_data must be a valid JSON object.');
  }

  if (!req.file) {
    throw validationError('The original PDF file must be re-uploaded with the confirm request.');
  }

  const result = await persistDocument(req.file.buffer, body.filename, body.raw_text, structured);
  const response: ConfirmResponse = { ...result, filename: body.filename };
  res.json(response);
}

export async function cancelHandler(req: Request, res: Response): Promise<void> {
  const { document_id: documentId } = req.params;
  if (!documentId) {
    throw validationError('document_id is required.');
  }
  res.json({ message: 'Upload cancelled', document_id: documentId });
}
