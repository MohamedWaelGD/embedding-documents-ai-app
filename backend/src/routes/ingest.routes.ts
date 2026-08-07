import { Router } from 'express';
import { uploadPdf } from '../middleware/upload';
import { asyncHandler } from '../middleware/async-handler';
import {
  cancelHandler,
  confirmHandler,
  structureHandler,
  uploadHandler,
} from '../controllers/ingest.controller';

export const ingestRouter = Router();

ingestRouter.post('/upload', uploadPdf.single('file'), asyncHandler(uploadHandler));
ingestRouter.post('/structure', asyncHandler(structureHandler));
ingestRouter.post('/confirm', uploadPdf.single('file'), asyncHandler(confirmHandler));
ingestRouter.delete('/cancel/:document_id', asyncHandler(cancelHandler));
