import { Request } from 'express';
import multer from 'multer';
import { config } from '../config';
import { validationError } from '../models/errors';

const storage = multer.memoryStorage();

const limits: multer.Options['limits'] = {
  fileSize: config.upload.maxFileSizeMb * 1024 * 1024,
};

export const uploadPdf = multer({
  storage,
  limits,
  fileFilter: (_req: Request, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(validationError('Invalid file type. Only PDF files are accepted.'));
      return;
    }
    cb(null, true);
  },
});
