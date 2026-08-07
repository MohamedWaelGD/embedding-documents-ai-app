import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { deleteHandler, downloadHandler, listHandler } from '../controllers/document.controller';

export const documentRouter = Router();

documentRouter.get('/', asyncHandler(listHandler));
documentRouter.get('/:id/download', asyncHandler(downloadHandler));
documentRouter.delete('/:id', asyncHandler(deleteHandler));
