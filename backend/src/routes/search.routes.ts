import { Router } from 'express';
import { searchHandler } from '../controllers/search.controller';
import { asyncHandler } from '../middleware/async-handler';

export const searchRouter = Router();

searchRouter.post('/', asyncHandler(searchHandler));
