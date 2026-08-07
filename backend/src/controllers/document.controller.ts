import { Request, Response } from 'express';
import { validationError } from '../models/errors';
import { deleteDocument, downloadDocument, listDocuments } from '../services/document.service';

export async function listHandler(_req: Request, res: Response): Promise<void> {
  const documents = await listDocuments();
  res.json({ documents });
}

export async function downloadHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!id) {
    throw validationError('Document id is required.');
  }

  const { buffer, filename, contentType } = await downloadDocument(id);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
  res.send(buffer);
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!id) {
    throw validationError('Document id is required.');
  }

  await deleteDocument(id);
  res.json({ message: 'Document deleted successfully' });
}
