import { describe, it, expect } from 'vitest';
import { extractPdfText } from '../../src/services/ocr.service';

describe('extractPdfText', () => {
  it('throws EXTRACTION_ERROR when buffer is not a valid PDF', async () => {
    await expect(extractPdfText(Buffer.from('this is not a pdf'))).rejects.toMatchObject({
      code: 'EXTRACTION_ERROR',
    });
  });
});
