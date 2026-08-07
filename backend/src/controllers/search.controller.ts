import { Request, Response } from 'express';
import { SearchRequest, SearchResponse } from '../models';
import { validationError } from '../models/errors';
import { searchDocuments } from '../services/search.service';

export async function searchHandler(req: Request, res: Response): Promise<void> {
  const body = req.body as SearchRequest;
  if (!body || typeof body.query !== 'string' || body.query.trim().length === 0) {
    throw validationError('query is required and must be non-empty.');
  }

  const result: SearchResponse = await searchDocuments(body.query);
  res.json(result);
}
